import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { KhContentEnhancer } from '@/components/KhContentEnhancer'
import type { KnowledgeHubPage } from '@/payload-types'

const SECTION_TITLES: Record<string, string> = {
  'notification-app': 'Notification Application Form Guide',
  'movement-doc':     'Movement Document Guide',
  'pic':              'PIC Procedure Workflows',
  'country':          'Country-Specific Requirements',
  'supporting-docs':  'Supporting Documents',
  'ewaste':           'E-Waste Classifications',
  'reference':        'Additional Reference',
}

function extractBlockNumber(title: string | null | undefined): number {
  if (!title) return Infinity
  const m = title.match(/\bBlock\s+(\d+)/i)
  return m ? parseInt(m[1]!, 10) : Infinity
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'knowledge-hub-pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const pageParams = pages.docs
    .filter(({ slug }) => slug && slug !== 'knowledge-hub' && slug.split('/').filter(Boolean).length > 0)
    .map(({ slug }) => ({ slug: slug!.split('/').filter(Boolean) }))

  const sectionParams = Object.keys(SECTION_TITLES).map((prefix) => ({ slug: [prefix] }))

  return [...sectionParams, ...pageParams]
}

type Args = {
  params: Promise<{ slug: string[] }>
}

export default async function KnowledgeHubSlugPage({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug.join('/'))

  // Section index
  if (SECTION_TITLES[decodedSlug]) {
    const sectionPages = await querySectionPages({ prefix: decodedSlug })
    const title = SECTION_TITLES[decodedSlug]!

    return (
      <article className="min-h-screen bg-dex-bg">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <nav className="mb-6 text-sm font-body" style={{ color: '#a0a09a' }}>
            <a href="/knowledge-hub" className="hover:text-dex-primary transition-colors">
              Knowledge Hub
            </a>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>

          <h1
            className="font-display font-bold text-white mb-10"
            style={{ fontSize: '2.5rem' }}
          >
            {title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectionPages.map((page) => (
              <a
                key={page.id}
                href={`/knowledge-hub/${page.slug}`}
                className="block p-4 rounded-lg border-l-4 transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
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
        </div>
      </article>
    )
  }

  // Leaf page
  const page = await queryPageBySlug({ slug: decodedSlug })

  if (!page) {
    return notFound()
  }

  // Prev / next within section
  const sectionPrefix = Object.keys(SECTION_TITLES).find((p) => decodedSlug.startsWith(p + '/')) ?? null
  let prevPage: KnowledgeHubPage | null = null
  let nextPage: KnowledgeHubPage | null = null

  if (sectionPrefix) {
    const siblings = await querySectionPages({ prefix: sectionPrefix })
    const idx = siblings.findIndex((s) => s.slug === decodedSlug)
    if (idx > 0) prevPage = siblings[idx - 1]!
    if (idx !== -1 && idx < siblings.length - 1) nextPage = siblings[idx + 1]!
  }

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-6 text-sm font-body" style={{ color: '#a0a09a' }}>
          <a href="/knowledge-hub" className="hover:text-dex-primary transition-colors">
            Knowledge Hub
          </a>
          {sectionPrefix && (
            <>
              <span className="mx-2">/</span>
              <a
                href={`/knowledge-hub/${sectionPrefix}`}
                className="hover:text-dex-primary transition-colors"
              >
                {SECTION_TITLES[sectionPrefix]}
              </a>
            </>
          )}
          <span className="mx-2">/</span>
          <span>{page.title}</span>
        </nav>

        <h1
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: '2.5rem' }}
        >
          {page.title}
        </h1>

        {page.metaDescription && (
          <p className="font-body text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {page.metaDescription}
          </p>
        )}

        <div className="kh-content max-w-[860px] mx-auto px-8">
          <RichText data={page.content as any} />
        </div>
        <KhContentEnhancer />

        <div className="mt-16 pt-8 border-t text-sm font-body" style={{ borderColor: '#3a3a38', color: '#a0a09a' }}>
          Section: {page.section} &middot; Type: {page.pageType}
        </div>

        {(prevPage || nextPage) && (
          <nav
            className="mt-10 pt-8 border-t flex justify-between gap-4 font-body text-sm"
            style={{ borderColor: '#3a3a38' }}
          >
            <div className="flex-1">
              {prevPage && (
                <a
                  href={`/knowledge-hub/${prevPage.slug}`}
                  className="flex flex-col gap-1 group"
                >
                  <span style={{ color: '#a0a09a' }}>← Previous</span>
                  <span
                    className="group-hover:underline"
                    style={{ color: '#1D9E75' }}
                  >
                    {prevPage.title}
                  </span>
                </a>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextPage && (
                <a
                  href={`/knowledge-hub/${nextPage.slug}`}
                  className="flex flex-col gap-1 items-end group"
                >
                  <span style={{ color: '#a0a09a' }}>Next →</span>
                  <span
                    className="group-hover:underline"
                    style={{ color: '#1D9E75' }}
                  >
                    {nextPage.title}
                  </span>
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
            {page.jsonLd && page.jsonLd.trim() && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: page.jsonLd }}
              />
            )}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug.join('/'))

  if (SECTION_TITLES[decodedSlug]) {
    return { title: SECTION_TITLES[decodedSlug] }
  }

  const page = await queryPageBySlug({ slug: decodedSlug })

  if (!page) {
    return {}
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }): Promise<KnowledgeHubPage | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'knowledge-hub-pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const querySectionPages = cache(async ({ prefix }: { prefix: string }): Promise<KnowledgeHubPage[]> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'knowledge-hub-pages',
    draft,
    limit: 200,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        like: `${prefix}/`,
      },
    },
  })

  return result.docs.sort((a, b) => extractBlockNumber(a.title) - extractBlockNumber(b.title))
})
