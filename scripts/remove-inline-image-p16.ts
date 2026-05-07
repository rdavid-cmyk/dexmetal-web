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
    where: { id: { equals: 16 } },
    limit: 1,
    overrideAccess: true,
  })
  const post = result.docs[0] as any
  if (!post) throw new Error('Post 16 not found')
  console.log('Found post:', post.slug)

  const REMOVE_MEDIA_ID = 18
  const children: any[] = post.content?.root?.children ?? []
  const filtered = children.filter((node: any) => {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
      const mediaId = typeof node.fields.media === 'object' ? node.fields.media.id : node.fields.media
      if (mediaId === REMOVE_MEDIA_ID) { console.log('Removing mediaBlock media:', mediaId); return false }
    }
    return true
  })
  console.log('Nodes:', children.length, '→', filtered.length)

  const updatedContent = normalizeContent({ ...post.content, root: { ...post.content.root, children: filtered } })
  await payload.update({
    collection: 'posts', id: 16, data: { content: updatedContent },
    overrideAccess: true, context: { disableRevalidate: true },
  })
  console.log('Done')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
