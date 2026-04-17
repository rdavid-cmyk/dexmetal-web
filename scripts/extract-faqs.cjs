const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
});

function getBlockText(block) {
  if (!block?.children || !Array.isArray(block.children)) return '';
  return block.children.map(c => c.text || '').join('');
}

function extractHeadingsAndContent(content) {
  if (!content || typeof content !== 'object') return null;
  
  const blocks = content.root?.children || content.blocks || [];
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  
  const faqs = [];
  let currentHeading = null;
  let currentAnswer = [];
  
  for (const block of blocks) {
    const blockType = block?.type || '';
    const tag = block?.tag || '';
    
    if (blockType === 'heading') {
      if (currentHeading) {
        const answerText = getBlockText({ children: currentAnswer }).trim();
        if (answerText) {
          faqs.push({ question: currentHeading, answer: answerText });
        }
      }
      currentHeading = getBlockText(block);
      currentAnswer = [];
    } else if (currentHeading) {
      if (blockType === 'paragraph') {
        currentAnswer.push(...(block.children || []));
      }
    }
  }
  
  if (currentHeading) {
    const answerText = getBlockText({ children: currentAnswer }).trim();
    if (answerText) {
      faqs.push({ question: currentHeading, answer: answerText });
    }
  }
  
  return faqs.length > 0 ? faqs : null;
}

function extractFirstParagraph(content) {
  if (!content || typeof content !== 'object') return null;
  
  const blocks = content.root?.children || content.blocks || [];
  for (const block of blocks) {
    const blockType = block?.type || '';
    if (blockType === 'paragraph') {
      const text = getBlockText(block);
      if (text) return text;
    }
  }
  return null;
}

function makeQuestion(title) {
  let q = title.trim();
  if (!q.endsWith('?') && !q.endsWith('.') && !q.endsWith('!')) {
    q = q + '?';
  }
  return q;
}

async function main() {
  await client.connect();
  console.log('Connected to database');
  
  const result = await client.query(
    'SELECT id, title, slug, content FROM knowledge_hub_pages ORDER BY id'
  );
  
  console.log('Found ' + result.rows.length + ' knowledge hub pages');
  
  const faqs = [];
  let processed = 0;
  let withHeadings = 0;
  let fallbackUsed = 0;
  
  for (const row of result.rows) {
    processed++;
    console.log('Processing page ' + processed + '/108: ' + row.slug);
    
    if (!row.content) {
      console.log('  WARNING: Empty content for page ' + row.slug);
      continue;
    }
    
    const extracted = extractHeadingsAndContent(row.content);
    
    if (extracted && extracted.length > 0) {
      withHeadings++;
      for (const faq of extracted) {
        faqs.push({
          question: makeQuestion(faq.question),
          answer: faq.answer,
          source_slug: row.slug,
        });
      }
    } else {
      const firstPara = extractFirstParagraph(row.content);
      if (firstPara && row.title) {
        fallbackUsed++;
        faqs.push({
          question: makeQuestion(row.title),
          answer: firstPara,
          source_slug: row.slug,
        });
      } else {
        console.log('  WARNING: Could not extract content for page ' + row.slug);
      }
    }
  }
  
  await client.end();
  
  console.log('');
  console.log('Results:');
  console.log('  Pages with headings: ' + withHeadings);
  console.log('  Pages with fallback: ' + fallbackUsed);
  console.log('  Total FAQs extracted: ' + faqs.length);
  
  const fs = require('fs');
  const outputPath = '/var/www/dexmetal-web/data/dexmetal_faqs.json';
  fs.writeFileSync(outputPath, JSON.stringify(faqs, null, 2));
  console.log('Output written to ' + outputPath);
}

main().catch(async (err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
