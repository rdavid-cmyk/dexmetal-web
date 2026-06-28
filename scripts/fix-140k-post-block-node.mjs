/**
 * Removes the banner block node from post the-140000-phone-call (id=20),
 * replacing it with plain paragraphs preserving its text content.
 *
 * The block node is technically registered (BlocksFeature / Banner), but its
 * nested Lexical editor instance causes a client-side rendering conflict in
 * Payload 3.81.0 / Lexical 0.41.0, surfacing as Lexical error #17 in the
 * admin UI edit view.
 *
 * Idempotent: exits cleanly if no block nodes are present.
 */

const EMAIL    = 'rdavid@gvoltt.com'
const PASSWORD = 'E7m^dKq*?!6!YzJ'
const BASE_URL = 'http://localhost:3000'
const POST_ID  = 20

function makePara(text) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
    direction: 'ltr',
    textFormat: 0,
  }
}

// Authenticate
const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
if (!loginRes.ok) throw new Error(`Login HTTP ${loginRes.status}`)
const { token } = await loginRes.json()
if (!token) throw new Error('Login failed')

// Fetch post
const fetchRes = await fetch(`${BASE_URL}/api/posts/${POST_ID}?depth=1`, {
  headers: { Authorization: `JWT ${token}` },
})
if (!fetchRes.ok) throw new Error(`Fetch HTTP ${fetchRes.status}`)
const post = await fetchRes.json()
if (!post.content?.root?.children) throw new Error('Post has no Lexical content')

let replaced = 0
post.content.root.children = post.content.root.children.flatMap((node, i) => {
  if (node.type !== 'block') return [node]
  const blockChildren = node.fields?.content?.root?.children ?? []
  const texts = blockChildren
    .filter(bn => bn.type === 'paragraph')
    .map(bn => (bn.children ?? []).map(c => c.text ?? '').join(''))
    .filter(Boolean)
  console.log(`Node ${i}: block (${node.fields?.blockType}/${node.fields?.style}) → ${texts.length} paragraph(s)`)
  replaced++
  return texts.length > 0 ? texts.map(makePara) : [makePara('')]
})

if (replaced === 0) {
  console.log('No block nodes found — already clean.')
  process.exit(0)
}

// PATCH
const patchRes = await fetch(`${BASE_URL}/api/posts/${POST_ID}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  body: JSON.stringify({ content: post.content }),
})
if (!patchRes.ok) throw new Error(`PATCH HTTP ${patchRes.status}: ${await patchRes.text()}`)
const result = await patchRes.json()
if (result.errors?.length) throw new Error(`PATCH errors: ${JSON.stringify(result.errors)}`)
console.log('Done:', result.message)
console.log(`Replaced ${replaced} block node(s)`)
console.log('updatedAt:', result.doc?.updatedAt)
