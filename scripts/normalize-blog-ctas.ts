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

const MID_CTA_BANNER: any = {
  type: "block", format: "", version: 2,
  fields: {
    blockType: "banner", blockName: "mid-post-cta", style: "success",
    content: { root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children: [{ type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0, children: [{ type: "text", text: "Get the free Operator's Playbook — field-tested Basel compliance guidance distilled from 20+ years of real notifications across 40+ countries. Free download: dexmetal.com/playbook", style: "", detail: 0, format: 0, mode: "normal", version: 1 }] }] } }
  }
}

function insertMidCta(children: any[]): { children: any[], inserted: boolean } {
  for (const n of children) {
    if (n.type === "block" && n.fields?.blockName === "mid-post-cta") {
      return { children, inserted: false }
    }
  }
  let h2Count = 0, insertAfter = -1
  for (let i = 0; i < children.length; i++) {
    if (children[i].type === "heading" && children[i].tag === "h2") {
      if (++h2Count === 2) { insertAfter = i; break }
    }
  }
  if (insertAfter === -1) {
    let paraCount = 0
    for (let i = 0; i < children.length; i++) {
      if (children[i].type === "paragraph") {
        if (++paraCount === 3) { insertAfter = i; break }
      }
    }
  }
  if (insertAfter === -1) insertAfter = Math.floor(children.length / 3)
  const result = [...children]
  result.splice(insertAfter + 1, 0, MID_CTA_BANNER)
  return { children: result, inserted: true }
}

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: 50, overrideAccess: true, draft: false,
  })
  console.log("Found " + result.docs.length + " published posts\n")

  for (const post of result.docs as any[]) {
    console.log(post.slug)
    if (!post.content?.root?.children) { console.log("  SKIP: no content"); continue }

    const { children: newChildren, inserted } = insertMidCta(post.content.root.children)
    console.log("  mid-post CTA:", inserted ? "INSERTED" : "already present")

    const updatedContent = normalizeContent({ ...post.content, root: { ...post.content.root, children: newChildren } })
    const updates: any = { content: updatedContent }
    if (!post.cta_url || post.cta_url === "/checklist") {
      updates.cta_label = "Explore Free Tools"
      updates.cta_url = "/tools"
      console.log("  end CTA: → /tools")
    } else {
      console.log("  end CTA: keeping", post.cta_url)
    }

    await payload.update({
      collection: "posts", id: post.id, data: updates,
      overrideAccess: true, context: { disableRevalidate: true },
    })
    console.log("  OK")
  }
  console.log("\nAll done.")
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
