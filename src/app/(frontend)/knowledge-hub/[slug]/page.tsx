import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import RichText from '@/components/RichText'

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
    <article className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-8 text-sm" style={{ color: 'var(--color-primary)' }}>
          <a href="/knowledge-hub" className="hover:underline">
            Knowledge Hub
          </a>
          <span className="mx-2">/</span>
          <span style={{ color: 'var(--color-muted)' }}>{page.title}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl mb-6 leading-tight">
          {page.title}
        </h1>

        {page.metaDescription && (
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {page.metaDescription}
          </p>
        )}

        <div className="prose prose-lg max-w-none" style={{ color: 'var(--color-text)' }}>
          <RichText data={page.content as any} enableGutter={false} enableProse={false} />
        </div>

        <div className="mt-16 pt-8 border-t text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
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
