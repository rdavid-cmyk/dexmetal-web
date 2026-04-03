import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { KnowledgeHubPage } from '@/payload-types'

const SECTION_ORDER = [
  'Knowledge Hub',
  'Notification Doc',
  'Movement Doc',
  'PIC Workflows',
  'Country',
  'Supporting Docs',
  'E-Waste',
  'Additional Ref',
  'Tools',
  'API',
  'Shell',
]

export default async function KnowledgeHubPage() {
  let pages: KnowledgeHubPage[] = []
  let error: string | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'knowledge-hub-pages',
      limit: 200,
      sort: 'title',
      overrideAccess: false,
      pagination: false,
    })
    pages = result.docs || []
  } catch (e: any) {
    error = e?.message || 'Failed to load knowledge hub pages'
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1B18', color: '#ffffff' }}>
        <p className="text-red-400 text-lg">Error loading Knowledge Hub: {error}</p>
      </div>
    )
  }

  const grouped = pages.reduce<Record<string, KnowledgeHubPage[]>>((acc, page) => {
    const section = page.section || 'Other'
    if (!acc[section]) acc[section] = []
    acc[section].push(page)
    return acc
  }, {})

  const orderedSections = SECTION_ORDER.filter((s) => grouped[s])
  const remainingSections = Object.keys(grouped)
    .filter((s) => !SECTION_ORDER.includes(s))
    .sort()
  const allSections = [...orderedSections, ...remainingSections]

  return (
    <article className="min-h-screen" style={{ backgroundColor: '#1C1B18', color: '#ffffff' }}>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-play-bold, inherit)', color: '#1D9E75' }}
        >
          Knowledge Hub
        </h1>
        <p
          className="text-lg mb-12"
          style={{ fontFamily: 'var(--font-dm-sans, inherit)', color: '#ffffffb3' }}
        >
          {pages.length} guides, references, and tools for Basel Convention compliance.
        </p>

        {allSections.map((section) => (
          <section key={section} className="mb-12">
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b"
              style={{
                fontFamily: 'var(--font-play-bold, inherit)',
                color: '#1D9E75',
                borderColor: '#1D9E7533',
              }}
            >
              {section}
              <span
                className="ml-3 text-base font-normal"
                style={{ color: '#ffffff66' }}
              >
                {grouped[section].length}
              </span>
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {grouped[section]
                .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                .map((page) => (
                  <li key={page.id} className="py-1">
                    <a
                      href={`/knowledge-hub/${page.slug}`}
                      className="inline-block py-1 transition-colors duration-150 hover:text-[#1D9E75]"
                      style={{
                        fontFamily: 'var(--font-dm-sans, inherit)',
                        color: '#ffffffcc',
                      }}
                    >
                      {page.title}
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  )
}
