import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

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

export const validatePostTemplate: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  // Draft saves bypass all rules unconditionally.
  if (data._status !== 'published') return data

  const errors: string[] = []
  // When only some fields are updated, data.legacy_post may be absent — fall back to stored value.
  const isLegacy = data.legacy_post === true || (originalDoc as any)?.legacy_post === true
  const children: any[] = (data.content?.root?.children ?? (originalDoc as any)?.content?.root?.children ?? []) as any[]

  // RULE 1 — Hero image required (all posts)
  if (!data.heroImage) {
    errors.push('Hero image is required.')
  }

  // Find first H2 index for Rule 2
  const firstH2Index = children.findIndex(
    (n) => n.type === 'heading' && n.tag === 'h2',
  )

  if (!isLegacy) {
    // RULE 2 — No inline media before first H2 (new posts only)
    if (firstH2Index > 0) {
      const hasMediaBeforeH2 = children.slice(0, firstH2Index).some(isMediaNode)
      if (hasMediaBeforeH2) {
        errors.push('Inline media must appear after the first H2, not before it.')
      }
    }

    // RULE 3 — H3 count must not exceed H2 count (new posts only)
    const h2Count = children.filter((n) => n.type === 'heading' && n.tag === 'h2').length
    const h3Count = children.filter((n) => n.type === 'heading' && n.tag === 'h3').length
    if (h3Count > h2Count) {
      errors.push('Top-level sections must use H2 headings. Found more H3s than H2s.')
    }

    // RULE 4 — Body must have 2–4 H2 sections (new posts only)
    if (h2Count < 2 || h2Count > 4) {
      errors.push(`Post must have 2–4 H2 sections. Found ${h2Count}.`)
    }

    // RULE 5 — Maximum 1 inline image, hero excluded (new posts only)
    const inlineImageCount = children.filter(isMediaNode).length
    if (inlineImageCount > 1) {
      errors.push(
        `Maximum 1 inline image allowed (hero image is separate). Found ${inlineImageCount}.`,
      )
    }

    // RULE 6 — Word count 1,200–2,000 (new posts only)
    const allText = extractText(data.content?.root ?? {})
    const wordCount = allText.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 1200) {
      errors.push(`Post is too short (${wordCount} words). Minimum is 1,200 words.`)
    } else if (wordCount > 2000) {
      errors.push(
        `Post is too long (${wordCount} words). Posts over 2,000 words must be split into two posts.`,
      )
    }
  }

  // RULE 7 — FAQ required, minimum 4 questions (all posts)
  const faqCount = Array.isArray(data.faq) ? data.faq.length : 0
  if (faqCount < 4) {
    errors.push(`FAQ section required. Minimum 4 questions. Found ${faqCount}.`)
  }

  // RULE 8 — Difficulty and read_time required before publish (all posts)
  if (!data.difficulty || !data.read_time || data.read_time <= 0) {
    errors.push('Difficulty and Read Time are required before publishing.')
  }

  if (errors.length > 0) {
    throw new APIError(
      `Cannot publish — template validation failed:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`,
      400,
    )
  }

  return data
}
