import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { KhContentEnhancer } from '@/components/KhContentEnhancer'
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
          className="kh-content max-w-[860px] mx-auto px-8"
        >
          <RichText data={page.content as any} />
        </div>
        <KhContentEnhancer />

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
