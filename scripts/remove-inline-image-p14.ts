import { getPayload } from 'payload'
import config from '../src/payload.config.js'

function normalizeContent(content: any): any {
  if (!content?.root?.children) return content
  const children = content.root.children.map((node: any) => {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
      const mediaId = typeof node.fields.media === 'object' ? node.fields.media.id : node.fields.media
      return { ...node, fields: { ...node.fields, media: mediaId } }
    }
    return node
  })
  return { ...content, root: { ...content.root, children } }
}

async function main() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { id: { equals: 14 } },
    limit: 1,
    overrideAccess: true,
  })

  const post = result.docs[0] as any
  if (!post) throw new Error('Post 14 not found')
  console.log('Found post:', post.slug)

  const children: any[] = post.content?.root?.children ?? []
  console.log('Top-level nodes:', children.length)

  const REMOVE_MEDIA_ID = 12
  const filtered = children.filter((node: any) => {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
      const mediaId = typeof node.fields.media === 'object' ? node.fields.media.id : node.fields.media
      if (mediaId === REMOVE_MEDIA_ID) {
        console.log('Removing mediaBlock node with media:', mediaId)
        return false
      }
    }
    return true
  })

  console.log('Nodes after filter:', filtered.length)

  const updatedContent = normalizeContent({
    ...post.content,
    root: { ...post.content.root, children: filtered },
  })

  await payload.update({
    collection: 'posts',
    id: 14,
    data: { content: updatedContent },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  console.log('Done — mediaBlock media:12 removed from post 14')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
