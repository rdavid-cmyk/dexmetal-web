import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Media } from '@/components/Media'
import type { Category, Media as MediaType } from '@/payload-types'

export const metadata = {
  title: 'Blog | DexMetal',
  description:
    'Basel Convention compliance insights, e-waste trade analysis, and circular economy perspectives from DexMetal.',
}

function getCategoryTitle(category: number | Category | null | undefined) {
  return typeof category === 'object' && category?.title ? category.title : 'Industry Insights'
}

function getPreviewImage(post: {
  heroImage?: number | MediaType | null
  meta?: { image?: number | MediaType | null } | null
}) {
  if (post.heroImage && typeof post.heroImage === 'object') return post.heroImage
  if (post.meta?.image && typeof post.meta.image === 'object') return post.meta.image
  return null
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 24,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      heroImage: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
  })

  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em]" style={{ color: '#1D9E75' }}>
            DexMetal Blog
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">Latest Posts</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: '#cbc7be' }}>
            Basel compliance insight, e-waste trade analysis, and practical operating lessons from
            the circular economy.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-16 md:py-20">
          {posts.docs.length === 0 ? (
            <p className="rounded-3xl border px-6 py-10 text-center text-sm" style={{ borderColor: '#3a3a38', color: '#cbc7be' }}>
              No posts published yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.docs.map((post) => {
                const image = getPreviewImage(post)
                const category = getCategoryTitle(post.categories?.[0])
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : null

                return (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-[2rem] border"
                    style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative h-56 overflow-hidden bg-[#171613]">
                        {image ? (
                          <Media
                            resource={image}
                            imgClassName="h-full w-full object-cover"
                            pictureClassName="block h-full w-full"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm" style={{ color: '#8f8d86' }}>
                            DexMetal
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                        {category}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="block">
                        <h2 className="font-display text-2xl font-bold text-white">{post.title}</h2>
                      </Link>
                      {date && (
                        <p className="mt-3 text-sm" style={{ color: '#8f8d86' }}>
                          {date}
                        </p>
                      )}
                      <p className="mt-4 line-clamp-3 text-sm leading-7" style={{ color: '#cbc7be' }}>
                        {post.meta?.description || 'Read the full article for DexMetal guidance and practical trade insight.'}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-5 inline-flex text-sm font-medium"
                        style={{ color: '#FF5C00' }}
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
