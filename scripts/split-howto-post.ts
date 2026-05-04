import { getPayload } from "payload"
import config from "../src/payload.config.js"

const SPLIT_INDEX = 89
const ORIGINAL_SLUG = "how-to-prepare-a-basel-notification-step-by-step-2026-update"

function normalizeContent(content: any): any {
  if (!content?.root?.children) return content
  const children = content.root.children.map((node: any) => {
    if (node.type === "block" && node.fields?.blockType === "mediaBlock") {
      const mediaId = typeof node.fields.media === "object" ? node.fields.media.id : node.fields.media
      return { ...node, fields: { ...node.fields, media: mediaId } }
    }
    return node
  })
  return { ...content, root: { ...content.root, children } }
}

function makeBanner(style: string, text: string): any {
  return {
    type: "block", format: "", version: 2,
    fields: {
      blockType: "banner", blockName: "cta-banner", style,
      content: { root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children: [{ type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0, children: [{ type: "text", text, style: "", detail: 0, format: 0, mode: "normal", version: 1 }] }] } }
    }
  }
}

async function main() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "posts",
    where: { slug: { equals: ORIGINAL_SLUG } },
    limit: 1, overrideAccess: true, draft: false,
  })

  const post = result.docs[0] as any
  if (!post) throw new Error("Post not found: " + ORIGINAL_SLUG)

  const allBlocks: any[] = post.content.root.children
  console.log("Total blocks:", allBlocks.length)
  console.log("Split at block", SPLIT_INDEX + ":", JSON.stringify(allBlocks[SPLIT_INDEX]).substring(0, 80))

  const part1Raw = allBlocks.slice(0, SPLIT_INDEX)
  const part2Raw = allBlocks.slice(SPLIT_INDEX)

  const continueBlock = makeBanner("info",
    "Continue Reading — Part 2 covers Coordinating with Competent Authorities, Technology for Compliance Management, Movement Documents, Post-Shipment Reporting, and FAQ. Read Part 2: dexmetal.com/blog/how-to-prepare-a-basel-notification-part-2"
  )
  const part1IntroPara: any = {
    type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0,
    children: [{ type: "text", text: "This is Part 2 of a two-part guide. Part 1 covers Eligibility Assessment, Notification Form Requirements, Contractual Obligations with Recyclers, and Financial Guarantees — read it first at dexmetal.com/blog/how-to-prepare-a-basel-notification-part-1", style: "", detail: 0, format: 2, mode: "normal", version: 1 }]
  }

  const part1Content = normalizeContent({ ...post.content, root: { ...post.content.root, children: [...part1Raw, continueBlock] } })
  const part2Content = normalizeContent({ ...post.content, root: { ...post.content.root, children: [part1IntroPara, ...part2Raw] } })

  console.log("Updating Part 1 (" + part1Raw.length + " blocks + banner)...")
  await payload.update({
    collection: "posts", id: post.id,
    data: { title: "How to Prepare a Basel Notification: Documents and Structure (2026)", slug: "how-to-prepare-a-basel-notification-part-1", content: part1Content, read_time: 9, _status: "published" } as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log("Part 1 updated.")

  const heroId = typeof post.heroImage === "object" ? post.heroImage.id : post.heroImage
  const catIds = (post.categories || []).map((c: any) => typeof c === "object" ? c.id : c)

  console.log("Creating Part 2 (" + part2Raw.length + " blocks)...")
  await payload.create({
    collection: "posts",
    data: { title: "How to Prepare a Basel Notification: Submission and Country Rules (2026)", slug: "how-to-prepare-a-basel-notification-part-2", content: part2Content, heroImage: heroId, categories: catIds, publishedAt: post.publishedAt, read_time: 9, difficulty: post.difficulty, toc_enabled: true, _status: "published" } as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log("Part 2 created and published.")
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
