import configPromise from '@payload-config'
import { getPayload } from 'payload'

// ─── helpers ────────────────────────────────────────────────────────────────

function extractText(node: any): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(extractText).join(' ')
  return ''
}

function isMediaNode(node: any): boolean {
  return (
    node.type === 'upload' ||
    (node.type === 'block' && node.fields?.blockType === 'mediaBlock')
  )
}

function auditPost(post: any): string[] {
  const violations: string[] = []
  const children: any[] = post.content?.root?.children ?? []
  const isLegacy = post.legacy_post === true

  // Rule 1 — hero image (all posts)
  if (!post.heroImage) violations.push('Rule 1: No hero image')

  const firstH2Index = children.findIndex((n) => n.type === 'heading' && n.tag === 'h2')
  const h2Count = children.filter((n) => n.type === 'heading' && n.tag === 'h2').length
  const h3Count = children.filter((n) => n.type === 'heading' && n.tag === 'h3').length

  if (!isLegacy) {
    // Rule 2 — no media before first H2
    if (firstH2Index > 0) {
      const hasMediaBefore = children.slice(0, firstH2Index).some(isMediaNode)
      if (hasMediaBefore) violations.push('Rule 2: Media appears before first H2')
    }

    // Rule 3 — H2 count 2–4
    if (h2Count < 2 || h2Count > 4) violations.push(`Rule 3: ${h2Count} H2s (need 2–4)`)

    // Rule 4 — H3 count ≤ H2 count
    if (h3Count > h2Count) violations.push(`Rule 4: ${h3Count} H3s > ${h2Count} H2s`)

    // Rule 5 — inline images ≤ 1
    const imgCount = children.filter(isMediaNode).length
    if (imgCount > 1) violations.push(`Rule 5: ${imgCount} inline images (max 1)`)

    // Rule 6 — word count 1,200–2,000
    const words = extractText(post.content?.root ?? {}).trim().split(/\s+/).filter(Boolean).length
    if (words < 1200) violations.push(`Rule 6: ${words} words (min 1,200)`)
    else if (words > 2000) violations.push(`Rule 6: ${words} words (max 2,000)`)
  }

  // Rule 7 — FAQ ≥ 4 items (all posts)
  const faqCount = Array.isArray(post.faq) ? post.faq.length : 0
  if (faqCount < 4) violations.push(`Rule 7: ${faqCount} FAQ items (min 4)`)

  // Rule 8 — difficulty + read_time (all posts)
  if (!post.difficulty || !post.read_time || post.read_time <= 0)
    violations.push('Rule 8: difficulty or read_time missing')

  return violations
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 200,
    overrideAccess: true,
    select: {
      id: true,
      slug: true,
      title: true,
      heroImage: true,
      content: true,
      faq: true,
      difficulty: true,
      read_time: true,
      legacy_post: true,
    },
  })

  const posts = result.docs
  console.log(`\nAuditing ${posts.length} published posts...\n`)

  const rows: Array<{ id: any; slug: string; title: string; legacy: boolean; violations: string[] }> = []

  for (const post of posts) {
    const violations = auditPost(post)
    rows.push({ id: post.id, slug: post.slug ?? '', title: post.title ?? '', legacy: post.legacy_post === true, violations })
  }

  // ── table output ─────────────────────────────────────────────────────────
  const colW = { id: 4, slug: 54, legacy: 7, violations: 52 }
  const hr = `+${'-'.repeat(colW.id + 2)}+${'-'.repeat(colW.slug + 2)}+${'-'.repeat(colW.legacy + 2)}+${'-'.repeat(colW.violations + 2)}+`

  const pad = (s: string, w: number) => s.slice(0, w).padEnd(w)

  console.log(hr)
  console.log(`| ${pad('id', colW.id)} | ${pad('slug', colW.slug)} | ${pad('legacy', colW.legacy)} | ${pad('violations', colW.violations)} |`)
  console.log(hr)

  let totalViolatingPosts = 0
  let totalViolationCount = 0

  for (const row of rows) {
    const legacyStr = row.legacy ? 'yes' : 'no'
    if (row.violations.length === 0) {
      console.log(`| ${pad(String(row.id), colW.id)} | ${pad(row.slug, colW.slug)} | ${pad(legacyStr, colW.legacy)} | ${pad('PASS', colW.violations)} |`)
    } else {
      totalViolatingPosts++
      totalViolationCount += row.violations.length
      console.log(`| ${pad(String(row.id), colW.id)} | ${pad(row.slug, colW.slug)} | ${pad(legacyStr, colW.legacy)} | ${pad(row.violations[0], colW.violations)} |`)
      for (let i = 1; i < row.violations.length; i++) {
        console.log(`| ${pad('', colW.id)} | ${pad('', colW.slug)} | ${pad('', colW.legacy)} | ${pad(row.violations[i], colW.violations)} |`)
      }
    }
    console.log(hr)
  }

  console.log(`\nSummary`)
  console.log(`  Posts audited:   ${posts.length}`)
  console.log(`  Posts with violations: ${totalViolatingPosts}`)
  console.log(`  Posts PASS (all applicable rules): ${posts.length - totalViolatingPosts}`)
  console.log(`  Total violations: ${totalViolationCount}`)

  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
