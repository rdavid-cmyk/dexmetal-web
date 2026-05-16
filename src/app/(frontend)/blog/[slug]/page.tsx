import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import Link from 'next/link'
import { BaselNotificationCTA } from '@/components/BaselNotificationCTA'
import { BlogContentEnhancer } from '@/components/BlogContentEnhancer'

import type { Post, Media as MediaType, Category } from '@/payload-types'

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

function extractHeadingsFromContent(content: any): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = []

  function traverse(node: any) {
    if (!node) return

    if (node.type === 'heading') {
      const level = node.tag ? parseInt(node.tag.replace('h', '')) : 2
      const text = extractTextFromLexical(node)
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      headings.push({ level, text, id })
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  traverse(content)
  return headings
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'Beginner'
    case 'intermediate': return 'Intermediate'
    case 'advanced': return 'Advanced'
    default: return 'Intermediate'
  }
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return '#22c55e'
    case 'intermediate': return '#f59e0b'
    case 'advanced': return '#ef4444'
    default: return '#f59e0b'
  }
}

function getCategoryTitle(category: number | Category | null | undefined): string {
  return typeof category === 'object' && category?.title ? category.title : ''
}

function getFirstParagraph(content: any): string {
  if (!content) return ''
  const text = extractTextFromLexical(content)
  const sentences = text.split(/\.\s+/)
  const firstFew = sentences.slice(0, 2).join('. ')
  return firstFew.length > 200 ? firstFew.substring(0, 200) + '...' : firstFew
}

function filterHeroFromContent(content: any, heroId: string | number | null | undefined): any {
  if (!content || heroId == null) return content

  function filterNode(node: any): any | null {
    if (!node) return node
    if (node.type === 'upload') {
      const mediaId = typeof node.value === 'object' ? node.value?.id : node.value
      if (String(mediaId) === String(heroId)) return null
    }
    if (node.type === 'block') {
      const mediaId = typeof node.fields?.media === 'object' ? node.fields.media?.id : node.fields?.media
      if (node.fields?.blockType === 'mediaBlock' && String(mediaId) === String(heroId)) return null
    }
    if (Array.isArray(node.children)) {
      return { ...node, children: node.children.map(filterNode).filter(Boolean) }
    }
    return node
  }

  return filterNode(content)
}

export default async function BlogSlugPage({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const post = await queryPost({ slug: decodedSlug })
  if (!post) return <PayloadRedirects url={url} />

  const publishedDate = post.publishedAt
    ? (() => {
        const d = new Date(post.publishedAt)
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear()
      })()
    : null
  const headings = post.toc_enabled && post.content ? extractHeadingsFromContent(post.content) : []
  const categoryTitle = getCategoryTitle(post.categories?.[0])
  const heroId = typeof post.heroImage === 'object' ? (post.heroImage as MediaType).id : post.heroImage
  const filteredContent = filterHeroFromContent(post.content, heroId)

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />

      {post.faq && post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": post.faq.map((item: any) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
                }
              }))
            })
          }}
        />
      )}

      <style>{`
        .blog-content .payload-richtext p {
          font-size: 1.125rem;
          line-height: 1.8;
          font-family: 'DM Sans', sans-serif;
          color: #c8c8c2;
          margin-bottom: 1rem;
        }
        .blog-content .payload-richtext h2 {
          font-family: 'Play', sans-serif;
          font-weight: 700;
          color: #ffffff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-content .payload-richtext h3 {
          font-family: 'Play', sans-serif;
          font-weight: 700;
          color: #ffffff;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content .payload-richtext figcaption {
          text-align: center;
          display: block;
          width: 100%;
        }
        .blog-content .payload-richtext img {
          max-width: 100%;
          height: auto;
        }
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: '#1C1B18' }}>
        {/* Hero Section */}
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="relative w-full h-[400px] overflow-hidden">
            <Media
              resource={post.heroImage as MediaType}
              imgClassName="w-full h-full object-cover"
              pictureClassName="block w-full h-full"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 30%, #1C1B18 100%)' }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sticky TOC Sidebar - Desktop */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8 p-4 rounded-lg" style={{ backgroundColor: '#2c2c2a' }}>
                  <h3 className="font-display font-bold text-white text-sm mb-4 uppercase tracking-wider">Contents</h3>
                  <nav>
                    <ul className="space-y-2">
                      {headings.map((heading, index) => (
                        <li key={index} style={{ marginLeft: `${(heading.level - 2) * 0.75}rem` }}>
                          <a
                            href={`#${heading.id}`}
                            className="font-body text-sm hover:text-white transition-colors block py-1"
                            style={{ color: '#a0a09a' }}
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile TOC Drawer Trigger */}
              {headings.length > 0 && (
                <details className="lg:hidden mb-6">
                  <summary
                    className="cursor-pointer p-4 rounded-lg font-display font-bold text-white"
                    style={{ backgroundColor: '#2c2c2a' }}
                  >
                    📑 Table of Contents
                  </summary>
                  <nav className="mt-2 p-4 rounded-lg" style={{ backgroundColor: '#2c2c2a' }}>
                    <ul className="space-y-2">
                      {headings.map((heading, index) => (
                        <li key={index} style={{ marginLeft: `${(heading.level - 2) * 0.75}rem` }}>
                          <a
                            href={`#${heading.id}`}
                            className="font-body text-sm"
                            style={{ color: '#a0a09a' }}
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
              )}

              {/* Category Badge & Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {categoryTitle && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                    style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
                  >
                    {categoryTitle}
                  </span>
                )}
                {post.difficulty && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                    style={{
                      backgroundColor: `${getDifficultyColor(post.difficulty)}20`,
                      color: getDifficultyColor(post.difficulty),
                      border: `1px solid ${getDifficultyColor(post.difficulty)}`
                    }}
                  >
                    {getDifficultyLabel(post.difficulty)}
                  </span>
                )}
                {post.read_time && (
                  <span className="font-body text-sm" style={{ color: '#a0a09a' }}>
                    {post.read_time} min read
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-white mb-4 leading-tight" style={{ fontSize: '2.5rem' }}>
                {post.title}
              </h1>

              {publishedDate && (
                <p className="font-body text-sm mb-8" style={{ color: '#1D9E75' }}>
                  {publishedDate}
                </p>
              )}

              {/* Series Info Box */}
              {post.read_time && (
                <div className="mb-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}>
                  <p className="font-display font-bold text-white text-lg">
                    {post.read_time ? `Reading Time: ${post.read_time} minutes` : ''}
                  </p>
                </div>
              )}

              {/* At-a-Glance Box */}
              {post.at_a_glance && (
                <div className="mb-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}>
                  <h3 className="font-display font-bold text-white text-sm mb-3 uppercase tracking-wider">At a Glance</h3>
                  <p className="font-body text-base leading-relaxed" style={{ color: '#c8c8c2' }}>
                    {post.at_a_glance}
                  </p>
                </div>
              )}

              <hr className="mb-8" style={{ borderColor: '#3a3a38' }} />

              {/* Main Content Body */}
              <div className="blog-content">
                {filteredContent && <RichText data={filteredContent as any} enableGutter={false} enableProse={false} />}
                <BlogContentEnhancer />
              </div>

              {/* Playbook CTA — Basel notification guide only */}
              {post.slug === 'how-to-prepare-a-basel-notification-step-by-step-2026-update' && (
                <BaselNotificationCTA />
              )}

              {/* Risk Table */}
              {post.risk_table && post.risk_table.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display font-bold text-white text-2xl mb-6" style={{ color: '#1D9E75' }}>
                    Risk Assessment Table
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg overflow-hidden" style={{ borderColor: '#3a3a38' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#2c2c2a' }}>
                          <th className="p-4 text-left font-display font-bold text-white border" style={{ borderColor: '#3a3a38' }}>Risk Level</th>
                          <th className="p-4 text-left font-display font-bold text-white border" style={{ borderColor: '#3a3a38' }}>Description</th>
                          <th className="p-4 text-left font-display font-bold text-white border" style={{ borderColor: '#3a3a38' }}>Scope</th>
                        </tr>
                      </thead>
                      <tbody>
                        {post.risk_table.map((risk: any, index: number) => {
                          const levelColor = risk.level?.toLowerCase() === 'high' ? '#ef4444'
                            : risk.level?.toLowerCase() === 'medium' ? '#f59e0b'
                            : '#22c55e'
                          return (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#2c2c2a' : '#1a1a18' }}>
                              <td className="p-4 font-body text-sm border" style={{ borderColor: '#3a3a38' }}>
                                <span
                                  className="inline-block px-2 py-1 rounded text-xs font-medium uppercase"
                                  style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
                                >
                                  {risk.level}
                                </span>
                              </td>
                              <td className="p-4 font-body text-sm border" style={{ borderColor: '#3a3a38', color: '#c8c8c2' }}>
                                {risk.description}
                              </td>
                              <td className="p-4 font-body text-sm border" style={{ borderColor: '#3a3a38', color: '#c8c8c2' }}>
                                {risk.country || 'All contexts'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {post.faq && post.faq.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display font-bold text-white text-2xl mb-6" style={{ color: '#1D9E75' }}>
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {post.faq.map((item: any, index: number) => (
                      <details
                        key={index}
                        className="p-6 rounded-lg cursor-pointer group"
                        style={{ backgroundColor: '#2c2c2a' }}
                      >
                        <summary className="font-display font-bold text-white text-lg mb-0 list-none flex justify-between items-center">
                          {item.question}
                          <span className="text-xl transition-transform group-open:rotate-180" style={{ color: '#FF5C00' }}>▼</span>
                        </summary>
                        <div className="mt-4 font-body text-base leading-relaxed" style={{ color: '#c8c8c2' }}>
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Block */}
              {post.cta_label && post.cta_url && (
                <div className="mt-12 p-8 rounded-lg text-center" style={{ backgroundColor: '#1D9E75' }}>
                  <h3 className="font-display font-bold text-white text-xl mb-4">
                    Ready to Get Started?
                  </h3>
                  <Link
                    href={post.cta_url}
                    className="inline-block px-8 py-4 rounded-lg font-display font-bold text-white text-lg transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: '#1C1B18' }}
                  >
                    {post.cta_label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
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
    select: {
      title: true,
      slug: true,
      content: true,
      heroImage: true,
      categories: true,
      meta: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      at_a_glance: true,
      toc_enabled: true,
      difficulty: true,
      read_time: true,
      risk_table: true,
      faq: true,
      cta_label: true,
      cta_url: true,
    },
  })
  const post = result.docs?.[0]
  if (post && !post.cta_label) post.cta_label = 'Check Your Compliance Status'
  if (post && !post.cta_url) post.cta_url = '/checklist'
  return post
})
