import type { CollectionBeforeChangeHook } from 'payload'

export const stripHeroDuplicate: CollectionBeforeChangeHook = ({ data }) => {
  const heroImage = data.heroImage
  if (!heroImage || !data.content?.root?.children) return data

  const heroId = typeof heroImage === 'object' ? heroImage.id : heroImage
  if (!heroId) return data

  const before = data.content.root.children.length
  const children = data.content.root.children.filter((node: any) => {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
      const mediaId =
        typeof node.fields.media === 'object' ? node.fields.media?.id : node.fields.media
      return String(mediaId) !== String(heroId)
    }
    if (node.type === 'upload') {
      const mediaId = typeof node.value === 'object' ? node.value?.id : node.value
      return String(mediaId) !== String(heroId)
    }
    return true
  })

  if (children.length < before) {
    console.log(
      `[stripHeroDuplicate] Post "${data.slug}" — removed ${before - children.length} hero duplicate(s) from content body`,
    )
  }

  return {
    ...data,
    content: {
      ...data.content,
      root: { ...data.content.root, children },
    },
  }
}
