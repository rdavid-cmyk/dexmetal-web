/**
 * Applies six content fixes to post the-140000-phone-call (id=20).
 *
 * Fix 1 — Node 0: Remove "DeX |" from byline tag
 * Fix 2 — Node 21: "Same words." → "Same four words."
 * Fix 3 — Node 31: Already a proper ol list — verified, no change needed
 * Fix 4 — Node 10: Introduce company name ("Caribbean Metals & Recovery Ltd")
 * Fix 5 — N/A (consistent after Fix 4)
 * Fix 6 — Node 57: Update related-links text and URLs to relative paths
 *
 * Idempotent: each fix checks current state before mutating.
 */

const EMAIL    = 'rdavid@gvoltt.com'
const PASSWORD = 'E7m^dKq*?!6!YzJ'
const BASE_URL = 'http://localhost:3000'
const POST_ID  = 20

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
const fetchRes = await fetch(`${BASE_URL}/api/posts/${POST_ID}?depth=0`, {
  headers: { Authorization: `JWT ${token}` },
})
if (!fetchRes.ok) throw new Error(`Fetch HTTP ${fetchRes.status}`)
const post = await fetchRes.json()
if (!post.content?.root?.children) throw new Error('Post has no Lexical content')
const children = post.content.root.children

let changed = 0

// Fix 1 — byline tag (node 0)
{
  const c = children[0]?.children?.[0]
  const FIND    = 'Published by DeX | DexMetal | Pillar 01'
  const REPLACE = 'Published by DexMetal | Pillar 01'
  if (c?.type === 'text' && c.text === FIND) { c.text = REPLACE; changed++; console.log('Fix 1 applied') }
  else if (c?.text === REPLACE) console.log('Fix 1 already done')
  else console.warn('Fix 1 WARN: unexpected text:', c?.text)
}

// Fix 2 — "Same words." → "Same four words." (node 21)
{
  const c = children[21]?.children?.[0]
  const FIND    = 'Marcus asked him to repeat the question. Same words.'
  const REPLACE = 'Marcus asked him to repeat the question. Same four words.'
  if (c?.type === 'text' && c.text === FIND) { c.text = REPLACE; changed++; console.log('Fix 2 applied') }
  else if (c?.text === REPLACE) console.log('Fix 2 already done')
  else console.warn('Fix 2 WARN: unexpected text:', c?.text)
}

// Fix 3 — node 31 is already a proper ol list (no change)
{
  const n = children[31]
  const ok = n?.type === 'list' && n?.tag === 'ol' && n?.children?.length === 3
  console.log(ok ? 'Fix 3 already correct' : 'Fix 3 WARN: unexpected structure')
}

// Fix 4 — introduce company name in node 10
{
  const c = children[10]?.children?.[0]
  const FIND    = 'Marcus built the operation up in the waste industry the hard way.'
  const REPLACE = 'Marcus built Caribbean Metals & Recovery Ltd the hard way.'
  if (c?.type === 'text' && c.text.includes(FIND)) {
    c.text = c.text.replace(FIND, REPLACE); changed++; console.log('Fix 4 applied')
  } else if (c?.text?.includes(REPLACE)) console.log('Fix 4 already done')
  else console.warn('Fix 4 WARN: unexpected text:', c?.text?.slice(0, 80))
}

// Fix 6 — related links: text labels and relative URLs (node 57)
{
  const n = children[57]
  const links = n?.children?.filter(c => c.type === 'link') ?? []
  const L1_NEW = "The Certificate That Doesn't Stop a Crime"
  const L2_NEW = 'The Billion-Dollar E-Waste Industry Opportunity'
  if (links.length !== 2) throw new Error(`Fix 6: expected 2 link children in node 57, got ${links.length}`)
  if (!links[0].children?.length || !links[1].children?.length) throw new Error('Fix 6: link node has no children')
  let anyChange = false
  if (links[0].children[0].text !== L1_NEW) {
    links[0].children[0].text = L1_NEW
    links[0].fields.url = '/blog/the-certificate-that-doesnt-stop-a-crime'
    links[0].fields.linkType = 'custom'
    anyChange = true
  }
  if (links[1].children[0].text !== L2_NEW) {
    links[1].children[0].text = L2_NEW
    links[1].fields.url = '/blog/billion-dollar-ewaste-industry-opportunity'
    links[1].fields.linkType = 'custom'
    anyChange = true
  }
  if (anyChange) { changed++; console.log('Fix 6 applied') }
  else console.log('Fix 6 already done')
}

if (changed === 0) {
  console.log('All fixes already applied — nothing to patch.')
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
console.log('updatedAt:', result.doc?.updatedAt)
