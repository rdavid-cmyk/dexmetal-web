import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'
import Link from 'next/link'

import type { Post } from '@/payload-types'

// Basel terminology → KH slug mapping for contextual links
const TERM_MAP: Record<string, { slug: string; label: string }> = {
  notification: { slug: 'notification-number-shipment-type', label: 'Notification Document Guide' },
  'competent authority': { slug: 'notification-competent-authority-acknowledgement', label: 'Competent Authority Acknowledgement' },
  'waste code': { slug: 'basel-waste-code-lookup', label: 'Basel Waste Code Lookup' },
  'movement document': { slug: 'movement-document-checklist', label: 'Movement Document Checklist' },
  'prior informed consent': { slug: 'pic-prior-informed-consent-workflows', label: 'PIC Workflow Guide' },
  pic: { slug: 'pic-prior-informed-consent-workflows', label: 'PIC Workflow Guide' },
  exporter: { slug: 'notification-exporter-notifier-registration', label: 'Exporter-Notifier Registration' },
  importer: { slug: 'notification-importer-consignee-information', label: 'Importer/Consignee Information' },
  'e-waste': { slug: 'ewaste-basel-classifications', label: 'E-Waste Basel Classifications' },
  'hazardous waste': { slug: 'hazardous-characteristics-assessment-ewaste', label: 'Hazardous Characteristics Assessment' },
  annex: { slug: 'notification-annexes-attached', label: 'Notification Annexes Guide' },
  ulab: { slug: 'ulab-value-estimator', label: 'ULAB Value Estimator' },
  'transit country': { slug: 'notification-countries-border-crossings', label: 'Transit Countries & Border Crossings' },
  'financially guarantee': { slug: 'financial-guarantee-insurance-basel', label: 'Financial Guarantee & Insurance' },
  checklist: { slug: 'basel-complete-document-checklist', label: 'Basel Complete Document Checklist' },
  'circular economy': { slug: 'ewaste-basel-classifications', label: 'E-Waste Basel Classifications' },
  recycl: { slug: 'environmentally-sound-management-criteria', label: 'Environmentally Sound Management Criteria' },
}

// Cornerstone KH pages shown when no keyword matches
const CORNERSTONE_PAGES = [
  { slug: 'movement-document-checklist', label: 'Movement Document Checklist' },
  { slug: 'notification-document-guide', label: 'Notification Document Guide' },
  { slug: 'basel-waste-code-lookup', label: 'Waste Code Lookup Table' },
  { slug: 'pic-prior-informed-consent-workflows', label: 'PIC Workflows' },
]

function extractTextFromLexical(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (content.text) return content.text
  if (Array.isArray(content.children)) {
    return content.children.map(extractTextFromLexical).join(' ')
  }
  if (content.root) return extractTextFromLexical(content.root)
  return ''
}

function getRelatedKhPages(post: Post): { slug: string; label: string }[] {
  const text = (
    (post.title || '') + ' ' +
    extractTextFromLexical(post.content) + ' ' +
    (post.meta?.description || '')
  ).toLowerCase()

  const matched = new Map<string, { slug: string; label: string }>()
  for (const [term, page] of Object.entries(TERM_MAP)) {
    if (text.includes(term) && !matched.has(page.slug)) {
      matched.set(page.slug, page)
      if (matched.size >= 4) break
    }
  }

  return matched.size > 0
    ? Array.from(matched.values())
    : CORNERSTONE_PAGES
}

type Args = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

export default async function BlogSlugPage({ params }: Args) {
  const { slug } = await params
  const post = await queryPost({ slug: decodeURIComponent(slug) })
  if (!post) return notFound()

  const related = getRelatedKhPages(post)
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm font-body" style={{ color: '#a0a09a' }}>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Header */}
        {publishedDate && (
          <p className="font-body text-xs mb-3 uppercase tracking-wider" style={{ color: '#1D9E75' }}>
            {publishedDate}
          </p>
        )}
        <h1 className="font-display font-bold text-white mb-6 leading-tight" style={{ fontSize: '2.25rem' }}>
          {post.title}
        </h1>
        {post.meta?.description && (
          <p className="font-body text-lg mb-10 leading-relaxed" style={{ color: '#a0a09a' }}>
            {post.meta.description}
          </p>
        )}

        <hr style={{ borderColor: '#3a3a38', marginBottom: '2.5rem' }} />

        {/* Post content */}
        <div
          className="font-body leading-relaxed prose-invert"
          style={{ color: '#c8c8c2' }}
        >
          {post.content && <RichText data={post.content as any} enableGutter={false} enableProse={false} />}
        </div>

        {/* Related Knowledge Hub Resources */}
        <aside className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a38' }}>
          <h2 className="font-display font-bold text-white text-lg mb-4">
            Related Knowledge Hub Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map(({ slug: khSlug, label }) => (
              <Link
                key={khSlug}
                href={`/knowledge-hub/${khSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border-l-4 transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
              >
                <span className="text-lg" style={{ color: '#1D9E75' }}>&#9776;</span>
                <span className="font-body text-sm font-medium text-white leading-snug">{label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
            <Link href="/knowledge-hub" className="transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
              Browse all 108 compliance guides →
            </Link>
          </p>
        </aside>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPost({ slug: decodeURIComponent(slug) })
  if (!post) return {}
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || undefined,
  }
}

const queryPost = cache(async ({ slug }: { slug: string }): Promise<Post | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
