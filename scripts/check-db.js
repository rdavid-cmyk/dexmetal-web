const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check columns
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'knowledge_hub_pages' 
      ORDER BY ordinal_position
    `);
    console.log('Columns:', cols.rows.map(c => c.column_name).join(', '));

    // Get sample pages with all fields
    const result = await client.query(`
      SELECT * FROM knowledge_hub_pages LIMIT 2
    `);
    console.log(JSON.stringify(result.rows[0], null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();