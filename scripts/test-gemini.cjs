const fs = require('fs');

const pagesRaw = JSON.parse(fs.readFileSync('/Users/rdavid.tt/dexmetal-web/data/pages_raw.json', 'utf8'));

console.log(`Loaded ${pagesRaw.length} pages`);

const faqs = [];

for (let i = 0; i < Math.min(10, pagesRaw.length); i++) {
  const page = pagesRaw[i];
  if (!page.content || page.content.length < 100) continue;

  const prompt = `Generate 3-5 Basel compliance FAQ pairs from this content. Questions specific and technical. Answers from content only. JSON array output.

Page: ${page.title}

Content: ${page.content.slice(0, 5000)}`;

  console.log(`Processing page ${i+1}/10: ${page.title}`);
  
  try {
    const { execSync } = require('child_process');
    const result = execSync(`/opt/homebrew/bin/gemini -p "${prompt.replace(/"/g, '\\"')}" --model gemini-2.0-flash --json`, {
      encoding: 'utf8',
      timeout: 30000
    });
    
    console.log('Result:', result.substring(0, 500));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

console.log('\nDone');