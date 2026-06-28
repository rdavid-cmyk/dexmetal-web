/**
 * Replaces the "Containers of electronics shipping internationally." sentence
 * in post the-140000-phone-call (id=20) with expanded e-waste supply-chain copy.
 *
 * Idempotent: exits cleanly if the target text is no longer present.
 */

const EMAIL    = 'rdavid@gvoltt.com'
const PASSWORD = 'E7m^dKq*?!6!YzJ'
const BASE_URL = 'http://localhost:3000'
const POST_ID  = 20

const FIND    = 'Containers of electronics shipping internationally.'
const REPLACE = 'Containers of electrical and electronic waste — harvested and purchased from waste pickers, then sorted, tested, repaired, or dismantled, categorized and  packaged  for —  international shipping.'

// Authenticate
const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
if (!loginRes.ok) throw new Error(`Login HTTP ${loginRes.status}`)
const loginData = await loginRes.json()
const token = loginData.token
if (!token) throw new Error(`Login failed: ${JSON.stringify(loginData.errors ?? loginData)}`)

// Fetch post
const fetchRes = await fetch(`${BASE_URL}/api/posts/${POST_ID}?depth=0`, {
  headers: { Authorization: `JWT ${token}` },
})
if (!fetchRes.ok) throw new Error(`Fetch HTTP ${fetchRes.status}`)
const post = await fetchRes.json()
if (!post.content?.root?.children) throw new Error('Post has no Lexical content')

// Locate and replace target text — single text-child paragraph only
const children = post.content.root.children
let matched = 0

for (const node of children) {
  if (node.type !== 'paragraph') continue
  for (const c of node.children ?? []) {
    if (c.type === 'text' && c.text?.includes(FIND)) {
      c.text = c.text.replace(FIND, REPLACE)
      matched++
    }
  }
}

if (matched === 0) {
  console.log('Target text not found — already patched or content changed. Nothing to do.')
  process.exit(0)
}
if (matched > 1) throw new Error(`Ambiguous: found ${matched} occurrences of target text`)

// PATCH
const patchRes = await fetch(`${BASE_URL}/api/posts/${POST_ID}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  },
  body: JSON.stringify({ content: post.content }),
})
if (!patchRes.ok) throw new Error(`PATCH HTTP ${patchRes.status}: ${await patchRes.text()}`)

const result = await patchRes.json()
if (result.errors?.length) throw new Error(`PATCH errors: ${JSON.stringify(result.errors)}`)

console.log('Done:', result.message)
console.log('updatedAt:', result.doc?.updatedAt)
