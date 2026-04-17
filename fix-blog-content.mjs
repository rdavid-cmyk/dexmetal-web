import { getPayload } from 'payload';
import configPromise from './src/payload.config.ts';
import { readFileSync } from 'fs';

const envFile = readFileSync('/var/www/dexmetal-web/.env', 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=#]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET);
console.log('Getting payload...');

const payload = await getPayload({ config: configPromise });
console.log('Got payload');

async function fixPost(postId) {
  const post = await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 3,
  });
  
  console.log(`\n=== Post ${postId}: ${post.title} ===`);
  console.log('Content root children count:', post.content?.root?.children?.length);
  
  const children = post.content?.root?.children || [];
  
  const indicesToRemove = [];
  let foundLongPara = false;
  
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node?.children?.[0]?.text) {
      const text = node.children[0].text;
      const len = text.length;
      
      if (!foundLongPara) {
        if (len >= 100) {
          foundLongPara = true;
          console.log(`First long paragraph at index ${i}, len=${len}`);
        } else if (len < 60) {
          indicesToRemove.push(i);
          console.log(`Marking short para at index ${i} for removal, len=${len}: "${text.slice(0,40)}..."`);
        }
      }
    }
  }
  
  if (indicesToRemove.length === 0) {
    console.log('No short paragraphs to remove');
    return;
  }
  
  const newChildren = children.filter((_, idx) => !indicesToRemove.includes(idx));
  console.log(`Removed ${indicesToRemove.length} leading paragraphs, new count: ${newChildren.length}`);
  
  await payload.update({
    collection: 'posts',
    id: postId,
    data: {
      content: {
        root: {
          children: newChildren,
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 0,
        },
      },
    },
  });
  
  console.log(`Updated post ${postId}`);
}

await fixPost(12);
await fixPost(13);
console.log('\nDone!');
process.exit(0);