/**
 * Reframes the-140000-phone-call post from first-person Richard David narrative
 * to third-person fictional operator (Marcus Ferreira, Caribbean Metals & Recovery Ltd).
 *
 * Changes applied:
 * - All "I/we/our" → "Marcus/he/the operation/his"
 * - Heading: "From landfill to processing floor" → "From landfill to export container"
 * - Byline: "Richard David is the founder of DexMetal" → "Written by Richard David, Founder — DexMetal LLC"
 * - Disclosure paragraph added before related links
 * - Three [VISUAL: /visuals/napkin-*.svg] placeholder lines removed
 * - CTA URL: "/tools" → "/templates/dexmetal-ca-contact-worksheet.pdf"
 * - Meta description: removed "Basel Article 11" reference, updated to operator framing
 */

const EMAIL = 'rdavid@gvoltt.com'
const PASSWORD = 'E7m^dKq*?!6!YzJ'
const BASE_URL = 'http://localhost:3000'
const POST_SLUG = 'the-140000-phone-call'

// Authenticate
const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const { token } = await loginRes.json()
if (!token) throw new Error('Login failed')

// Fetch post
const listRes = await fetch(
  `${BASE_URL}/api/posts?where[slug][equals]=${POST_SLUG}&depth=0`,
  { headers: { Authorization: `JWT ${token}` } },
)
const { docs } = await listRes.json()
const post = docs[0]
if (!post) throw new Error(`Post "${POST_SLUG}" not found`)
console.log(`Found post id=${post.id}: ${post.title}`)

if (!post.content?.root?.children) throw new Error('Post has no Lexical content')
const children = post.content.root.children

function makeParagraph(text) {
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

// Identify VISUAL nodes by index
const VISUAL_INDICES = new Set()
children.forEach((node, i) => {
  if (node.type === 'paragraph') {
    const txt = node.children?.[0]?.text ?? ''
    if (txt.includes('[VISUAL: /visuals/napkin-')) VISUAL_INDICES.add(i)
  }
})

// Apply text transformations
children.forEach((node, i) => {
  if (VISUAL_INDICES.has(i)) return

  const firstText = node.children?.[0]?.text

  if (node.type === 'heading' && firstText === 'From landfill to processing floor') {
    node.children[0].text = 'From landfill to export container'
  }

  if (node.type === 'paragraph') {
    const replacements = {
      "Four words. I didn't know what they meant. Nobody at the operation did.":
        "Four words. Marcus didn't know what they meant. Nobody at the operation did.",
      "What came next was the most expensive education of my career.":
        "What came next was the most expensive education of his career.",
      "We built our way up in the waste industry the hard way. Heavy equipment operators at a city landfill. We watched the waste pickers move through the landfill every day — sorting, grading, unknowingly following the metals commodity cycles that move global markets. They taught us the fundamentals before we knew what to call them: material hierarchies, time-versus-recovery math.":
        "Marcus built the operation up in the waste industry the hard way. Heavy equipment operators at a city landfill. He watched the waste pickers move through the landfill every day — sorting, grading, unknowingly following the metals commodity cycles that move global markets. They taught him the fundamentals before he knew what to call them: material hierarchies, time-versus-recovery math.",
      "But we noticed something even the waste pickers overlooked. Mountains of electronic equipment — computers, AC units, cell phones, UPS systems — being buried as ordinary refuse.":
        "But Marcus noticed something even the waste pickers overlooked. Mountains of electronic equipment — computers, AC units, cell phones, UPS systems — being buried as ordinary refuse.",
      "We bought an old pickup truck. Rented a shipping container on an empty industrial lot. Set up a folding table inside and started dismantling everything by hand. Microwaves. Washing machines. Water pumps. Every device was a puzzle of hidden value.":
        "He bought an old pickup truck. Rented a shipping container on an empty industrial lot. Set up a folding table inside and started dismantling everything by hand. Microwaves. Washing machines. Water pumps. Every device was a puzzle of hidden value.",
      "By 2006, we were processing 15 to 20 tons monthly. Revenue between $15,000 and $20,000 per month. We thought we had it figured out.":
        "By 2006, the operation was processing 15 to 20 tons monthly. Revenue between $15,000 and $20,000 per month. Marcus thought they had it figured out.",
      "We didn't.": "They didn't.",
      "I asked him to repeat the question. Same words.": "Marcus asked him to repeat the question. Same words.",
      "What followed was the most terrifying education of my career. Every shipment we had ever made was potentially illegal. Not just fines — criminal liability, asset seizure, complete shutdown. The Basel Convention governs transboundary movement of hazardous waste globally. We were moving materials across borders without permits, without notifications, without proper waste codes.":
        "What followed was the most terrifying education of his career. Every shipment the operation had ever made was potentially illegal. Not just fines — criminal liability, asset seizure, complete shutdown. The Basel Convention governs transboundary movement of hazardous waste globally. The operation was moving materials across borders without permits, without notifications, without proper waste codes.",
      "We hadn't known it was illegal. That wasn't a defense.":
        "The operation hadn't known it was illegal. That wasn't a defense.",
      "Our largest buyer — the one holding $140,000 in unpaid invoices for materials we had already delivered — was shut down overnight by environmental authorities following severe contamination violations at their facility.":
        "Their largest buyer — the one holding $140,000 in unpaid invoices for materials the operation had already delivered — was shut down overnight by environmental authorities following severe contamination violations at their facility.",
      "We chose option three.": "Marcus chose option three.",
      "Revenue dropped to $8,000 per month during the rebuild. Some months it was closer to zero. It nearly broke us.":
        "Revenue dropped to $8,000 per month during the rebuild. Some months it was closer to zero. It nearly broke the operation.",
      "Every regulation that confused our competitors became a barrier protecting our market position. Every certification that cost us money became a pricing signal to corporate clients. Compliance built a moat that no competitor without the investment could cross.":
        "Every regulation that confused competitors became a barrier protecting the operation's market position. Every certification that cost money became a pricing signal to corporate clients. Compliance built a moat that no competitor without the investment could cross.",
      "One example. A bank needed 200 computers removed. Other operators quoted $500 to $800. We quoted $2,400 and walked through exactly what the compliance documentation would look like. We got the contract. That single relationship generated $28,000 in revenue over 18 months — and six-figure referrals beyond that.":
        "One example. A bank needed 200 computers removed. Other operators quoted $500 to $800. Caribbean Metals & Recovery Ltd quoted $2,400 and walked through exactly what the compliance documentation would look like. The operation got the contract. That single relationship generated $28,000 in revenue over 18 months — and six-figure referrals beyond that.",
      "The $140,000 we lost when the buyer was shut down was real. The months of near-zero revenue were real. The stress of pledging personal assets was real.":
        "The $140,000 the operation lost when the buyer was shut down was real. The months of near-zero revenue were real. The stress of pledging personal assets was real.",
      "But the real cost was the years we operated without knowing what we were doing. Shipping containers across borders without Basel notification. Without Prior Informed Consent from receiving countries. Without verified Competent Authority contacts. Without knowing the difference between an A1181, a Y49, and a B1110 classification.":
        "But the real cost was the years the operation ran without knowing what it was doing. Shipping containers across borders without Basel notification. Without Prior Informed Consent from receiving countries. Without verified Competent Authority contacts. Without knowing the difference between an A1181, a Y49, and a B1110 classification.",
      "The fine could have been the business. It wasn't, because we moved fast when we had to.":
        "The fine could have been the business. It wasn't, because Marcus moved fast when he had to.",
      "Richard David is the founder of DexMetal.": "Written by Richard David, Founder — DexMetal LLC",
    }
    const cur = node.children?.[0]?.text
    if (cur && replacements[cur]) {
      node.children[0].text = replacements[cur]
    }
  }

  // Fix list option 3: "ourselves" → "themselves"
  if (node.type === 'list') {
    for (const li of node.children ?? []) {
      for (const c of li.children ?? []) {
        if (typeof c.text === 'string' && c.text.includes('ourselves')) {
          c.text = c.text.replace('ourselves', 'themselves')
        }
      }
    }
  }
})

// Rebuild children: remove VISUAL nodes, insert disclosure after byline (idempotent)
const disclosureText =
  'The operator described in this post is a fictional composite constructed from real incident patterns across the Caribbean waste trade. Financial figures are illustrative.'
const newChildren = []
for (let i = 0; i < children.length; i++) {
  const node = children[i]
  if (VISUAL_INDICES.has(i)) continue
  newChildren.push(node)
  const nodeText = node.type === 'paragraph' ? (node.children?.[0]?.text ?? '') : ''
  if (nodeText === 'Written by Richard David, Founder — DexMetal LLC') {
    // Only inject if the disclosure isn't already the next node (idempotency)
    const nextNode = children[i + 1]
    const nextText = nextNode?.type === 'paragraph' ? (nextNode.children?.[0]?.text ?? '') : ''
    if (!nextText.startsWith('The operator described in this post')) {
      newChildren.push(makeParagraph(disclosureText))
    }
  }
}
post.content.root.children = newChildren

// Patch post
const patchRes = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  },
  body: JSON.stringify({
    content: post.content,
    cta_url: '/templates/dexmetal-ca-contact-worksheet.pdf',
    meta: {
      // Preserve existing title and image; only replace description
      title: post.meta?.title ?? undefined,
      image: post.meta?.image ?? undefined,
      description:
        "A Caribbean e-waste operator ignored Basel compliance for years. When the inspector called, it cost $140,000. Here's what that phone call actually meant.",
    },
  }),
})

const result = await patchRes.json()
if (result.errors?.length) {
  console.error('PATCH errors:', result.errors)
  process.exit(1)
}
console.log('Done:', result.message)
console.log('cta_url:', result.doc?.cta_url)
console.log('meta.description:', result.doc?.meta?.description)
