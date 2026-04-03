import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { KnowledgeHubPage } from '@/payload-types'

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

  return pages.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function KnowledgeHubSlugPage({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  const page = await queryPageBySlug({ slug: decodedSlug })

  if (!page) {
    return notFound()
  }

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-6 text-sm font-body" style={{ color: '#a0a09a' }}>
          <a href="/knowledge-hub" className="hover:text-dex-primary transition-colors">
            Knowledge Hub
          </a>
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

        <div
          className="max-w-none"
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            lineHeight: '1.8',
          }}
        >
          <style>{`
            .kh-content h2, .kh-content h3 {
              font-family: var(--font-play), sans-serif;
              color: #1D9E75;
              margin-bottom: 0.75rem;
              margin-top: 2rem;
            }
            .kh-content h2 { font-size: 1.5rem; }
            .kh-content h3 { font-size: 1.25rem; }
            .kh-content p {
              font-family: var(--font-dm-sans), sans-serif;
              color: rgba(255,255,255,0.9);
              line-height: 1.8;
              margin-bottom: 1rem;
            }
            .kh-content ul, .kh-content ol {
              font-family: var(--font-dm-sans), sans-serif;
              color: rgba(255,255,255,0.9);
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .kh-content li { margin-bottom: 0.25rem; }
            .kh-content a {
              color: #1D9E75;
              text-decoration: none;
            }
            .kh-content a:hover {
              text-decoration: underline;
            }
            .kh-content strong { color: #fff; }
            .kh-content blockquote {
              border-left: 3px solid #1D9E75;
              padding-left: 1rem;
              margin: 1rem 0;
              color: rgba(255,255,255,0.7);
            }
            .kh-content code {
              background: #2c2c2a;
              padding: 0.125rem 0.375rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
            }
            .kh-content pre {
              background: #2c2c2a;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }
            .kh-content pre code {
              background: none;
              padding: 0;
            }
            .kh-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }
            .kh-content th, .kh-content td {
              border: 1px solid #3a3a38;
              padding: 0.5rem 0.75rem;
              text-align: left;
            }
            .kh-content th {
              background: #2c2c2a;
              color: #1D9E75;
            }
          `}</style>
          <div className="kh-content">
            <RichText data={page.content as any} />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t text-sm font-body" style={{ borderColor: '#3a3a38', color: '#a0a09a' }}>
          Section: {page.section} &middot; Type: {page.pageType}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
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
