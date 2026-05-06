// Fix post id=17: convert all top-level H3 headings to H2.
// The post has 9 H3s and 0 H2s — all are major section openers.
import configPromise from '@payload-config'
import { getPayload } from 'payload'

function normalizeMediaNodes(children: any[]): any[] {
  return children.map((node) => {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
      const media = node.fields?.media
      if (media && typeof media === 'object' && media.id) {
        return { ...node, fields: { ...node.fields, media: media.id } }
      }
    }
    return node
  })
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const post = await payload.findByID({
    collection: 'posts',
    id: 17,
    overrideAccess: true,
    depth: 2,
  })

  if (!post) { console.error('Post 17 not found'); process.exit(1) }

  const children: any[] = post.content?.root?.children ?? []

  let converted = 0
  const updated = children.map((node) => {
    if (node.type === 'heading' && node.tag === 'h3') {
      converted++
      return { ...node, tag: 'h2' }
    }
    return node
  })

  const normalizedChildren = normalizeMediaNodes(updated)

  const newContent = {
    ...post.content,
    root: { ...post.content.root, children: normalizedChildren },
  }

  await payload.update({
    collection: 'posts',
    id: 17,
    data: { content: newContent } as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  console.log(`Post 17: converted ${converted} H3 headings to H2.`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
