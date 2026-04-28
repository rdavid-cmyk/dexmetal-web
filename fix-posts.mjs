import pg from 'pg';
const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

for (const id of [12, 13]) {
  const res = await client.query('SELECT content FROM posts WHERE id = ', [id]);
  const content = res.rows[0].content;
  const children = content.root.children;
  
  // Find first paragraph with text longer than 100 chars
  let firstRealIndex = 0;
  for (let i = 0; i < children.length; i++) {
    const text = children[i].children?.[0]?.text || '';
    if (text.length > 100) { firstRealIndex = i; break; }
  }
  
  content.root.children = children.slice(firstRealIndex);
  await client.query('UPDATE posts SET content =  WHERE id = ', [JSON.stringify(content), id]);
  console.log('Fixed post', id, '- removed', firstRealIndex, 'leading nodes');
}

await client.end();
console.log('Done');
