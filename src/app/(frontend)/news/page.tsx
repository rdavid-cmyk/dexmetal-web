import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const TAG_LABELS: Record<string, string> = {
  basel: 'Basel',
  ewaste: 'E-Waste',
  'hazardous-waste': 'Hazardous Waste',
  compliance: 'Compliance',
  trade: 'Trade',
  recycling: 'Recycling',
  regulation: 'Regulation',
}

const TAG_COLORS: Record<string, string> = {
  basel: '#1D9E75',
  ewaste: '#FF5C00',
  'hazardous-waste': '#e53e3e',
  compliance: '#3182ce',
  trade: '#805ad5',
  recycling: '#1D9E75',
  regulation: '#d69e2e',
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return null
  const color = score >= 90 ? '#1D9E75' : score >= 80 ? '#FF5C00' : '#d69e2e'
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
      title="Relevance score"
    >
      {score}
    </span>
  )
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const limit = 20

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'news-articles',
    where: { relevance_score: { greater_than_equal: 45 } },
    sort: '-created_at',
    limit,
    page: currentPage,
    overrideAccess: false,
  })

  const { docs: articles, totalPages, hasPrevPage, hasNextPage } = result

  return (
    <article className="bg-dex-bg text-white min-h-screen">
      <section className="border-b border-[#2f2f2b] bg-[#0f0f0d]">
        <div className="container py-14 md:py-20">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em]" style={{ color: '#1D9E75' }}>
            Daily Intelligence
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Basel &amp; Hazardous Waste Trade Intelligence
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: '#cbc7be' }}>
            Curated daily from global sources. Scored for Basel compliance operators, freight
            forwarders, and hazardous waste traders.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {articles.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border px-6 py-20 text-center"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          >
            <p className="font-display text-2xl font-bold text-white">No articles yet</p>
            <p className="mt-3 text-sm" style={{ color: '#8f8d86' }}>
              Articles ingested daily. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {articles.map((article) => {
              const tags = (article.tags || []) as { tag: string }[]
              const date = formatDate(article.published_at as string | null)
              return (
                <div
                  key={article.id}
                  className="flex flex-col rounded-3xl border p-6 transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <a
                      href={article.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-xl font-bold text-white hover:text-[#1D9E75] transition-colors leading-snug"
                    >
                      {article.title as string}
                    </a>
                    <ScoreBadge score={article.relevance_score as number | null} />
                  </div>

                  <div className="mb-3 flex items-center gap-3 text-xs" style={{ color: '#8f8d86' }}>
                    {article.source && (
                      <span className="font-medium" style={{ color: '#FF5C00' }}>
                        {article.source as string}
                      </span>
                    )}
                    {date && <span>{date}</span>}
                  </div>

                  {article.summary && (
                    <p className="mb-4 line-clamp-3 text-sm leading-7" style={{ color: '#c8c4bc' }}>
                      {article.summary as string}
                    </p>
                  )}

                  {tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {tags.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${TAG_COLORS[t.tag] || '#3a3a38'}22`,
                            color: TAG_COLORS[t.tag] || '#8f8d86',
                            border: `1px solid ${TAG_COLORS[t.tag] || '#3a3a38'}44`,
                          }}
                        >
                          {TAG_LABELS[t.tag] || t.tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={article.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: '#1D9E75' }}
                  >
                    Read full article →
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            {hasPrevPage && (
              <Link
                href={`/news?page=${currentPage - 1}`}
                className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:text-white"
                style={{ borderColor: '#3a3a38', color: '#cbc7be' }}
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm" style={{ color: '#8f8d86' }}>
              Page {currentPage} of {totalPages}
            </span>
            {hasNextPage && (
              <Link
                href={`/news?page=${currentPage + 1}`}
                className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:text-white"
                style={{ borderColor: '#3a3a38', color: '#cbc7be' }}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>
    </article>
  )
}
