const fs = require('fs');
const path = require('path');

const pagesRaw = JSON.parse(fs.readFileSync('/Users/rdavid.tt/dexmetal-web/data/pages_raw.json', 'utf8'));

console.log(`Loaded ${pagesRaw.length} pages`);

const faqs = [];
let pageNum = 0;

for (const page of pagesRaw) {
  pageNum++;
  if (!page.content || page.content.length < 100) {
    console.log(`Skipping ${page.id}: ${page.title} - insufficient content`);
    continue;
  }

  const prompt = `You are a Basel Convention compliance expert. Generate 3-5 technical FAQ pairs (question + answer) based ONLY on the content below.

Requirements:
- Questions must be specific and technical that a compliance professional would actually ask
- Answers must be drawn STRICTLY from the content provided - no invented information
- Each answer should be 1-3 sentences, citing specific details from the content
- Output ONLY valid JSON array with objects: [{"question": "...", "answer": "...", "source_slug": "..."}]

Page Title: ${page.title}
Page Section: ${page.section}
Page Type: ${page.page_type}

Content:
${page.content.slice(0, 6000)}`;

  console.log(`Processing page ${pageNum}/108: ${page.title}`);
  
  // We'll write the prompt to a temp file and call gemini
  const promptFile = `/tmp/faq_prompt_${page.id}.txt`;
  fs.writeFileSync(promptFile, prompt);
  
  try {
    const { execSync } = require('child_process');
    const result = execSync(`/opt/homebrew/bin/gemini -p "$(cat ${promptFile})" --model gemini-2.0-flash --json 2>/dev/null`, {
      encoding: 'utf8',
      timeout: 60000
    });
    
    let parsed;
    try {
      parsed = JSON.parse(result);
      if (Array.isArray(parsed)) {
        parsed.forEach(faq => {
          if (faq.question && faq.answer) {
            faqs.push({
              question: faq.question,
              answer: faq.answer.substring(0, 500),
              source_slug: page.slug
            });
          }
        });
        console.log(`  -> Generated ${parsed.length} FAQs`);
      }
    } catch (e) {
      console.log(`  -> Parse error: ${e.message}`);
    }
  } catch (e) {
    console.log(`  -> Gemini error: ${e.message}`);
  }
}

console.log(`\nTotal FAQs generated: ${faqs.length}`);

fs.writeFileSync('/Users/rdavid.tt/dexmetal-web/data/dexmetal_faqs.json', JSON.stringify(faqs, null, 2));
console.log('Saved to /Users/rdavid.tt/dexmetal-web/data/dexmetal_faqs.json');