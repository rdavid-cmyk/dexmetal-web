import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const metadata = {
  title: 'Blog | DexMetal',
  description: 'Basel Convention compliance insights, e-waste trade analysis, and circular economy perspectives from DexMetal.',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 24,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
    sort: '-publishedAt',
  })

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: '2.75rem' }}>
            DexMetal Blog
          </h1>
          <p className="font-body text-lg" style={{ color: '#a0a09a' }}>
            Basel compliance insights, e-waste trade analysis, and circular economy perspectives.
          </p>
        </div>

        {posts.docs.length === 0 ? (
          <p className="font-body text-center py-20" style={{ color: '#a0a09a' }}>
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.docs.map((post) => {
              const desc = typeof post.meta === 'object' && post.meta?.description
                ? post.meta.description
                : null
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : null

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
                  style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
                >
                  {date && (
                    <p className="font-body text-xs mb-2 uppercase tracking-wider" style={{ color: '#1D9E75' }}>
                      {date}
                    </p>
                  )}
                  <h2 className="font-display font-bold text-white text-xl mb-3 leading-snug">
                    {post.title}
                  </h2>
                  {desc && (
                    <p className="font-body text-sm leading-relaxed line-clamp-3" style={{ color: '#a0a09a' }}>
                      {desc}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-sm font-body font-medium" style={{ color: '#1D9E75' }}>
                    Read more →
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
