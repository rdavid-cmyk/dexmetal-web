const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
  });

  try {
    await client.connect();
    
    // Check raw content from DB
    const result = await client.query(`
      SELECT id, title, slug, content::text as content_raw 
      FROM knowledge_hub_pages 
      WHERE id = 1
    `);
    
    console.log('Content raw type:', typeof result.rows[0].content_raw);
    console.log('Content raw sample:', result.rows[0].content_raw?.slice(0, 500));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();