import { getPayload } from "payload"
import config from "../src/payload.config.js"

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

async function main() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: 50, overrideAccess: true, draft: false,
  })

  let fixed = 0
  for (const post of result.docs as any[]) {
    const heroId = typeof post.heroImage === "object" ? post.heroImage?.id : post.heroImage
    if (!heroId || !post.content?.root?.children) continue

    const children: any[] = post.content.root.children
    const toRemove: number[] = []

    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (node.type === "block" && node.fields?.blockType === "mediaBlock") {
        const mediaId = typeof node.fields.media === "object" ? node.fields.media.id : node.fields.media
        if (mediaId === heroId) {
          toRemove.push(i)
        }
      }
    }

    if (toRemove.length === 0) continue

    console.log(post.slug)
    console.log("  hero_image_id:", heroId)
    console.log("  removing duplicate mediaBlock(s) at indices:", toRemove)

    const cleaned = children.filter((_, i) => !toRemove.includes(i))
    const updatedContent = normalizeContent({ ...post.content, root: { ...post.content.root, children: cleaned } })

    await payload.update({
      collection: "posts", id: post.id,
      data: { content: updatedContent },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log("  FIXED — removed", toRemove.length, "duplicate(s)")
    fixed++
  }

  if (fixed === 0) console.log("No duplicate hero images found.")
  else console.log("\n" + fixed + " post(s) fixed.")
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
