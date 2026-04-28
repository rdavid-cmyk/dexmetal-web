const { Client } = require('pg');
const fs = require('fs');

function extractTextFromContent(content) {
  if (!content || !content.root || !content.root.children) return '';
  
  const texts = [];
  const traverse = (node) => {
    if (node.type === 'text' && node.text) {
      texts.push(node.text);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  content.root.children.forEach(traverse);
  return texts.join(' ').slice(0, 8000);
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
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
      } catch (e) {
        console.error('Parse error for row', row.id, e.message);
      }
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        section: row.section,
        page_type: row.page_type,
        content: contentText
      };
    });

    const withContent = pages.filter(p => p.content.length > 0);
    console.log(`Pages with content: ${withContent.length}`);
    console.log('Sample:', pages[0]?.title, pages[0]?.content?.slice(0, 200));

    fs.writeFileSync('/var/www/dexmetal-web/data/pages_raw.json', JSON.stringify(pages, null, 2));
    console.log('Saved to /var/www/dexmetal-web/data/pages_raw.json');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();