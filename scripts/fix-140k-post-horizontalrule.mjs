/**
 * Fixes Lexical error #17 in post the-140000-phone-call (id=20).
 *
 * HorizontalRuleNode is not registered in the Payload Lexical editor config,
 * causing error #17 ("Type is not registered") when the admin UI tries to
 * render the document. Replaces all horizontalrule nodes with empty paragraphs.
 *
 * Idempotent: exits cleanly if no horizontalrule nodes are present.
 */

const EMAIL    = 'rdavid@gvoltt.com'
const PASSWORD = 'E7m^dKq*?!6!YzJ'
const BASE_URL = 'http://localhost:3000'
const POST_ID  = 20

const EMPTY_PARA = {
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  children: [{ type: 'text', text: '', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }],
  direction: 'ltr',
  textFormat: 0,
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

const fixedIndices = []
post.content.root.children = post.content.root.children.map((node, i) => {
  if (node.type === 'horizontalrule') {
    fixedIndices.push(i)
    return JSON.parse(JSON.stringify(EMPTY_PARA))
  }
  return node
})

if (fixedIndices.length === 0) {
  console.log('No horizontalrule nodes found — already clean.')
  process.exit(0)
}
console.log('Replacing horizontalrule nodes at indices:', fixedIndices.join(', '))

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
console.log(`Fixed ${fixedIndices.length} horizontalrule node(s)`)
console.log('updatedAt:', result.doc?.updatedAt)
