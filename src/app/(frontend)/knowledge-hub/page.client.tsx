'use client'

import { useEffect, useState, useMemo } from 'react'

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

export default function KnowledgeHubPage({ pages }: { pages: KnowledgeHubPage[] }) {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(pages)

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(pages)
      return
    }
    const q = query.toLowerCase()
    setFiltered(
      pages.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.section?.toLowerCase().includes(q) ||
          (p.metaDescription?.toLowerCase().includes(q))
      )
    )
  }, [query, pages])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, KnowledgeHubPage[]>>((acc, page) => {
      const section = page.section || 'Other'
      if (!acc[section]) acc[section] = []
      acc[section].push(page)
      return acc
    }, {})
  }, [filtered])

  const orderedSections = SECTION_ORDER.filter((s) => grouped[s])
  const remainingSections = Object.keys(grouped)
    .filter((s) => !SECTION_ORDER.includes(s))
    .sort()
  const allSections = [...orderedSections, ...remainingSections]

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: '2.75rem' }}>
            Basel Convention Knowledge Hub
          </h1>
          <p className="font-body text-lg" style={{ color: '#a0a09a' }}>
            {pages.length} guides, references, and tools for transboundary compliance.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 106 guides..."
            className="w-full px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200 focus:ring-2"
            style={{
              backgroundColor: '#2c2c2a',
              border: '1px solid #3a3a38',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#1D9E75')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a38')}
          />
        </div>

        {allSections.length === 0 && (
          <p className="text-center py-12 font-body" style={{ color: '#a0a09a' }}>
            No results for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Section groups */}
        {allSections.map((section) => (
          <section key={section} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display font-bold" style={{ color: '#1D9E75', fontSize: '1.25rem' }}>
                {section}
              </h2>
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-body"
                style={{ backgroundColor: '#1D9E7522', color: '#1D9E75' }}
              >
                {grouped[section].length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grouped[section]
                .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                .map((page) => (
                  <a
                    key={page.id}
                    href={`/knowledge-hub/${page.slug}`}
                    className="block p-4 rounded-lg border-l-4 transition-all duration-200 hover:brightness-110"
                    style={{
                      backgroundColor: '#2c2c2a',
                      borderLeftColor: '#1D9E75',
                    }}
                  >
                    <h3 className="font-body font-medium text-white text-sm leading-snug">
                      {page.title}
                    </h3>
                    {page.metaDescription && (
                      <p className="mt-1 text-xs line-clamp-2" style={{ color: '#a0a09a' }}>
                        {page.metaDescription}
                      </p>
                    )}
                  </a>
                ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
