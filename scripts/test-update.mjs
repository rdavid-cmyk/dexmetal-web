import { getPayload } from "payload"
import config from "../src/payload.config.js"
const payload = await getPayload({ config })

function normalizeContent(content) {
  if (!content?.root?.children) return content
  const children = content.root.children.map(node => {
    if (node.type === "block" && node.fields?.blockType === "mediaBlock") {
      const mediaId = typeof node.fields.media === "object" ? node.fields.media.id : node.fields.media
      return { ...node, fields: { ...node.fields, media: mediaId } }
    }
    return node
  })
  return { ...content, root: { ...content.root, children } }
}

const r = await payload.find({ collection: "posts", where: { slug: { equals: "urban-mine-the-hunt" } }, limit: 1 })
const post = r.docs[0]
const normalized = normalizeContent(post.content)
console.log("Media IDs after normalize:", normalized.root.children.filter(n => n.type === "block").map(n => n.fields.media))
try {
  await payload.update({ collection: "posts", id: post.id, data: { content: normalized } })
  console.log("Normalized update: OK")
} catch(e) {
  console.error("Normalized update FAILED:", e.message)
}
process.exit(0)
