const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '/var/www/dexmetal-web/.env.local' });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function extractTextFromContent(content) {
  if (!content || !content.root || !content.root.children) return '';
  const texts = [];
  const traverse = (node) => {
    if (node.type === 'text' && node.text) texts.push(node.text);
    if (node.children) node.children.forEach(traverse);
  };
  content.root.children.forEach(traverse);
  return texts.join(' ').slice(0, 6000);
}

async function callGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${err}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  console.log('Connecting to database...');
  const client = new Client({
    connectionString: 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const result = await client.query(`
      SELECT id, title, slug, content::text as content_raw, section, page_type 
      FROM knowledge_hub_pages
      ORDER BY id
    `);

    console.log(`Found ${result.rows.length} pages`);

    const pages = result.rows.map(row => {
      let contentText = '';
      try {
        const parsed = JSON.parse(row.content_raw);
        contentText = extractTextFromContent(parsed);
      } catch (e) {}
      return { id: row.id, title: row.title, slug: row.slug, content: contentText };
    });

    const faqs = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (!page.content || page.content.length < 100) {
        console.log(`Skipping ${page.id}: ${page.title} - no content`);
        continue;
      }

      console.log(`Processing ${i+1}/108: ${page.title.slice(0, 50)}...`);
      
      const prompt = `You are a Basel Convention compliance expert. Generate exactly 3-5 FAQ pairs (question + answer) based ONLY on the content below.

Requirements:
- Questions must be specific and technical that a compliance professional would actually ask
- Answers must be drawn STRICTLY from the content provided - no invented information
- Each answer should be 1-3 sentences, citing specific details from the content
- Output ONLY a valid JSON array with no other text: [{"question": "...", "answer": "...", "source_slug": "..."}]

Page Title: ${page.title}
Page Slug: ${page.slug}

Content:
${page.content}`;

      try {
        const response = await callGroq(prompt);
        
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            parsed.forEach(faq => {
              if (faq.question && faq.answer) {
                faqs.push({
                  question: faq.question.substring(0, 500),
                  answer: faq.answer.substring(0, 500),
                  source_slug: page.slug
                });
              }
            });
            console.log(`  -> Generated ${parsed.length} FAQs`);
            successCount++;
          }
        } else {
          console.log(`  -> No JSON found in response`);
          failCount++;
        }
      } catch (err) {
        console.log(`  -> Error: ${err.message}`);
        failCount++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total FAQs: ${faqs.length}`);
    console.log(`Pages processed: ${successCount}, Failed: ${failCount}`);

    fs.writeFileSync('/var/www/dexmetal-web/data/dexmetal_faqs.json', JSON.stringify(faqs, null, 2));
    console.log('Saved to /var/www/dexmetal-web/data/dexmetal_faqs.json');

  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();