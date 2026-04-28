import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixPost(postId) {
  console.log(`\n=== Fixing Post ${postId} ===`);
  
  const client = await pool.connect();
  
  try {
    // Get current content
    const res = await client.query(
      'SELECT id, title, jsonb_array_length(content->\'root\'->\'children\') as child_count FROM posts WHERE id = $1',
      [postId]
    );
    const { title, child_count } = res.rows[0];
    console.log(`Post: ${title}, children: ${child_count}`);
    
    // Find indices to remove (text < 60 chars AND appears before first text >= 100 chars)
    const findRes = await client.query(`
      WITH indexed AS (
        SELECT 
          arr.idx as item_idx,
          arr.elem->'children'->0->>'text' as text,
          char_length(arr.elem->'children'->0->>'text') as len
        FROM posts,
          jsonb_array_elements(content->'root'->'children') with ordinality as arr(elem, idx)
        WHERE posts.id = $1
      ),
      first_long AS (
        SELECT MIN(item_idx) as first_long_idx
        FROM indexed
        WHERE len >= 100
      )
      SELECT item_idx, len, text
      FROM indexed, first_long
      WHERE item_idx < first_long_idx AND len < 60
      ORDER BY item_idx;
    `, [postId]);
    
    if (findRes.rows.length === 0) {
      console.log('No short paragraphs to remove');
      return;
    }
    
    console.log(`Found ${findRes.rows.length} leading short paragraphs to remove:`);
    findRes.rows.forEach(r => console.log(`  idx ${r.item_idx}: "${r.text.slice(0,40)}..." (${r.len} chars)`));
    
    // Get the first index to keep
    const firstLongIdx = findRes.rows[0]?.item_idx || 0;
    const indicesToRemove = findRes.rows.map(r => r.item_idx);
    
    // Update content - keep only paragraphs from first_long_idx onwards
    await client.query(`
      UPDATE posts
      SET content = jsonb_set(
        content,
        '{root,children}',
        (
          SELECT jsonb_agg(elem ORDER BY idx)
          FROM jsonb_array_elements(content->'root'->'children') with ordinality as arr(elem, idx)
          WHERE arr.idx >= $2
        )
      ),
      updated_at = NOW()
      WHERE id = $1
    `, [postId, firstLongIdx]);
    
    console.log(`✓ Removed leading paragraphs, kept from index ${firstLongIdx} onwards`);
    
  } finally {
    client.release();
  }
}

await fixPost(12);
await fixPost(13);
console.log('\n=== Done! ===');
await pool.end();
process.exit(0);