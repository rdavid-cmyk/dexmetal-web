import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const payload = await getPayload({ config })

const posts = await payload.find({
  collection: 'posts',
  where: { slug: { equals: 'the-140000-phone-call' } },
  limit: 1
})

const post = posts.docs[0]
let children = post.content.root.children

// FIX 1 — Remove DeX byline (first node)
if (JSON.stringify(children[0]).includes('DeX')) {
  children = children.slice(1)
}

// FIX 2 — Remove leading short label/value paragraph nodes
// (prior session fix for posts 12/13 — apply same pattern here)
let firstRealIndex = 0
for (let i = 0; i < children.length; i++) {
  const text = children[i]?.children?.[0]?.text || ''
  if (text.length > 100) { firstRealIndex = i; break; }
}
if (firstRealIndex > 0) {
  children = children.slice(firstRealIndex)
}

// FIX 3 — Replace horizontalrule nodes (Lexical error #17)
children = children.map(node => {
  if (node.type === 'horizontalrule') {
    return {
      type: 'paragraph',
      children: [{ type: 'text', text: '', version: 1 }],
      direction: 'ltr', format: '', indent: 0, version: 1
    }
  }
  return node
})

post.content.root.children = children

await payload.update({
  collection: 'posts',
  id: post.id,
  data: { content: post.content }
})

console.log('Done. Post fixed via Payload local API.')
process.exit(0)
