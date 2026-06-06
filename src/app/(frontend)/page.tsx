import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Media } from '@/components/Media'
import AssetGate from '@/components/AssetGate'
import { LMETicker } from '@/components/LMETicker'
import BaselIntro from '@/components/BaselIntro'
import type { Category, Media as MediaType } from '@/payload-types'

const CIRCULAR_STAGES = [
  {
    step: 'Stage 1',
    title: 'Recover',
    description:
      'Capture electronics, batteries, and metal-bearing fractions before value is lost to disposal.',
  },
  {
    step: 'Stage 2',
    title: 'Classify',
    description:
      'Map materials to the correct Basel codes, control status, and documentation requirements.',
  },
  {
    step: 'Stage 3',
    title: 'Move',
    description:
      'Coordinate notification forms, movement documents, and PIC approvals across borders.',
  },
  {
    step: 'Stage 4',
    title: 'Monetize',
    description:
      'Convert compliant circular trade into reliable revenue, stronger partnerships, and repeatable workflows.',
  },
] as const

const FREE_TOOLS = [
  {
    title: 'Shipment Eligibility Check',
    problem: 'Is my shipment restricted under Basel?',
    href: '/tools',
    accent: '#1D9E75',
    emoji: '🔍',
  },
  {
    title: 'Basel Navigator',
    problem: 'What documents do I need for this export?',
    href: '/tools/basel-navigator',
    accent: '#1D9E75',
    emoji: '🧭',
  },
  {
    title: 'PIC Status Checker',
    problem: 'Does my destination country require Prior Informed Consent?',
    href: '/tools',
    accent: '#FF5C00',
    emoji: '✅',
  },
  {
    title: 'Waste Classification Tool',
    problem: 'Which Basel Annex does my material fall under?',
    href: '/tools',
    accent: '#FF5C00',
    emoji: '🏷️',
  },
  {
    title: 'ULAB Calculator',
    problem: 'How do I calculate ULAB batch weights for notification?',
    href: '/tools',
    accent: '#1D9E75',
    emoji: '🔋',
  },
  {
    title: 'Basel CA API',
    problem: 'Who is the competent authority for my destination country?',
    href: '/basel-ca-api',
    accent: '#FF5C00',
    emoji: '🌐',
  },
] as const

const TRUST_STATS = [
  { value: '182', label: 'Countries Covered' },
  { value: '20+', label: 'Years Experience' },
  { value: '67+', label: 'Pages of Guidance' },
  { value: 'Free', label: 'Core Resources' },
] as const

const BLOG_EXCERPTS: Record<string, string> = {
  'the-140000-phone-call':
    'A single misdirected Basel shipment cost one operator $140,000 — before legal fees. Here\'s exactly what went wrong and how you prevent it.',
  'the-20-annex-package':
    'Most operators know about the Notification Document. Almost none know about the other 19 documents that must accompany it. One missing annex freezes your shipment.',
  'how-to-prepare-a-basel-notification':
    'The vCOP8 form has 21 blocks. Each one is a potential rejection point. The step-by-step walkthrough updated for 2025 amendments.',
}

function getCategoryTitle(category: number | Category | null | undefined) {
  return typeof category === 'object' && category?.title ? category.title : 'Industry Insights'
}

function getPreviewImage(post: {
  heroImage?: number | MediaType | null
  meta?: { image?: number | MediaType | null } | null
}) {
  if (post.heroImage && typeof post.heroImage === 'object') return post.heroImage
  if (post.meta?.image && typeof post.meta.image === 'object') return post.meta.image
  return null
}

function formatNewsDate(dateStr: string | null | undefined) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, newsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: 3,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        heroImage: true,
        categories: true,
        meta: true,
        publishedAt: true,
      },
    }),
    payload.find({
      collection: 'news-articles',
      where: { relevance_score: { greater_than_equal: 70 } },
      sort: '-published_at',
      limit: 3,
      overrideAccess: false,
    }),
  ])

  const posts = postsResult
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsArticles = newsResult.docs as any[]

  return (
    <article className="bg-dex-bg text-white">
      <LMETicker />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#2f2f2b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,158,117,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,92,0,0.08),_transparent_40%)]" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-4xl">
            <p
              className="mb-5 text-sm font-medium uppercase tracking-[0.22em]"
              style={{ color: '#1D9E75' }}
            >
              Navigating Circularity, Basel Convention, and Global eWaste Trade
            </p>
            <h1
              className="max-w-3xl font-display font-bold leading-[1.05] text-white"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 5.75rem)' }}
            >
              Automated Basel Compliance for Cross-Border e-Waste Trade
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: '#cbc7be' }}>
              Streamline notification forms, PIC approvals, and circular workflows across 182
              countries. Built by operators, free to start.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/playbook"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#FF5C00' }}
              >
                Get the Free Operator&apos;s Playbook
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium transition-colors hover:text-white"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                Explore Free Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS SHOWCASE ── */}
      <section className="border-b border-[#2f2f2b]" style={{ background: '#1C1B18' }}>
        <div className="container py-14 md:py-16">
          <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Free Compliance Tools
              </p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                What problem are you trying to solve?
              </h2>
            </div>
            <Link href="/tools" className="mt-2 text-sm font-medium md:mt-0" style={{ color: '#FF5C00' }}>
              See all 7 tools →
            </Link>
          </div>
          <p className="mb-8 text-sm leading-6 max-w-2xl" style={{ color: '#8f8d86' }}>
            Every tool is free. No account required. Built from 20 years of Basel operator experience.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {FREE_TOOLS.map((tool) => (
              <Link
                key={tool.href + tool.title}
                href={tool.href}
                className="group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200 hover:border-opacity-60 hover:-translate-y-0.5"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <span className="text-2xl shrink-0">{tool.emoji}</span>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-medium italic leading-snug" style={{ color: '#8f8d86' }}>
                    &ldquo;{tool.problem}&rdquo;
                  </p>
                  <h3 className="font-display text-base font-bold text-white leading-snug">
                    {tool.title}
                  </h3>
                  <span
                    className="mt-2 inline-block text-xs font-medium uppercase tracking-wide transition-opacity group-hover:opacity-80"
                    style={{ color: tool.accent }}
                  >
                    Use free →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BaselIntro />

      {/* ── NEW TO DEXMETAL ── */}
      <section style={{ background: '#1C1B18' }} className="border-t border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]"
             style={{ color: '#1D9E75' }}>
            New to DexMetal?
          </p>
          <h2 className="font-display text-3xl font-bold text-white mb-10 md:text-4xl">
            Everything you need to know to get started
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#2f2f2b] p-7"
                 style={{ background: '#252420' }}>
              <div className="mb-4 text-2xl">🌍</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                What is DexMetal?
              </h3>
              <p className="text-sm leading-7" style={{ color: '#c8c4bc' }}>
                A compliance platform built by Basel operators with 20+ years
                of real notification experience — giving you the tools, data,
                and guidance to move hazardous waste legally across borders.
              </p>
            </div>
            <div className="rounded-2xl border border-[#2f2f2b] p-7"
                 style={{ background: '#252420' }}>
              <div className="mb-4 text-2xl">🏭</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Who is it for?
              </h3>
              <p className="text-sm leading-7" style={{ color: '#c8c4bc' }}>
                Exporters, recyclers, brokers, and compliance teams managing
                cross-border e-waste and battery shipments under the Basel
                Convention across 182 countries.
              </p>
            </div>
            <div className="rounded-2xl border border-[#2f2f2b] p-7"
                 style={{ background: '#252420' }}>
              <div className="mb-4 text-2xl">🚀</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                How do I get started?
              </h3>
              <p className="text-sm leading-7 mb-5" style={{ color: '#c8c4bc' }}>
                Follow the operator walkthrough — from first notification
                document to competent authority approval. Step by step,
                in plain language.
              </p>
              <Link
                href="/getting-started"
                className="inline-block text-sm font-bold px-5 py-2.5 rounded-lg text-white"
                style={{ background: '#1D9E75' }}
              >
                View Getting Started Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CIRCULAR STAGES ── */}
      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
              Circular Economy Workflow
            </p>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Four stages that turn compliance into a competitive advantage
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CIRCULAR_STAGES.map((stage) => (
              <div
                key={stage.title}
                className="rounded-3xl border p-6"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                  {stage.step}
                </p>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{stage.title}</h3>
                <p className="text-sm leading-7" style={{ color: '#c8c4bc' }}>
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      {newsArticles.length > 0 && (
        <section className="border-b border-[#2f2f2b] bg-[#171613]">
          <div className="container py-16 md:py-20">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                  Basel Industry Intelligence
                </p>
                <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                  What operators are reading today
                </h2>
              </div>
              <Link href="/news" className="text-sm font-medium" style={{ color: '#1D9E75' }}>
                View all intelligence →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {newsArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border p-5 transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
                >
                  <p className="mb-1 text-xs font-medium" style={{ color: '#FF5C00' }}>
                    {article.source}
                  </p>
                  <h3 className="font-display text-lg font-bold leading-snug text-white line-clamp-3">
                    {article.title}
                  </h3>
                  {article.published_at && (
                    <p className="mt-2 text-xs" style={{ color: '#8f8d86' }}>
                      {formatNewsDate(article.published_at)}
                    </p>
                  )}
                </a>
              ))}
            </div>
            <div className="mt-6 text-right">
              <Link href="/news" className="text-sm font-medium" style={{ color: '#1D9E75' }}>
                Full Basel intelligence feed →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST STATS ── */}
      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-12">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border px-5 py-6 text-center"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <div className="font-display text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAYBOOK BANNER ── */}
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-14 md:py-16">
          <div
            className="flex flex-col items-center gap-5 rounded-[2rem] border px-6 py-10 text-center md:flex-row md:justify-between md:px-10 md:text-left"
            style={{ backgroundColor: '#1a2e27', borderColor: '#1D9E75' }}
          >
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Free Resource
              </p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                The e-Waste Operator&apos;s Compliance Playbook
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: '#a8c4bb' }}>
                Field-tested guidance covering notification documents, movement docs, waste codes,
                PIC procedure, and country-by-country requirements — distilled from 20+ years of
                Basel compliance practice.
              </p>
            </div>
            <Link
              href="/playbook"
              className="inline-flex shrink-0 items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1D9E75' }}
            >
              Get the Free Operator&apos;s Playbook →
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
                Latest Posts
              </p>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Practical insight from the front lines of Basel trade
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-medium" style={{ color: '#1D9E75' }}>
              Browse all posts →
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.docs.map((post) => {
              const image = getPreviewImage(post)
              const category = getCategoryTitle(post.categories?.[0])
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null
              const excerpt =
                BLOG_EXCERPTS[post.slug] ||
                post.meta?.description ||
                'Read the full article for DexMetal guidance and field-tested insight.'

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="overflow-hidden rounded-3xl border transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
                >
                  <div className="relative h-56 overflow-hidden bg-[#151411]">
                    {image ? (
                      <Media
                        resource={image}
                        imgClassName="h-full w-full object-cover"
                        pictureClassName="block h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm" style={{ color: '#8f8d86' }}>
                        DexMetal
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                      {category}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-white">{post.title}</h3>
                    {date && (
                      <p className="mt-3 text-sm" style={{ color: '#8f8d86' }}>
                        {date}
                      </p>
                    )}
                    <p className="mt-4 line-clamp-3 text-sm leading-7" style={{ color: '#c8c4bc' }}>
                      {excerpt}
                    </p>
                    <span className="mt-5 inline-flex text-sm font-medium" style={{ color: '#FF5C00' }}>
                      Read more →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CLOSING QUOTE ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,92,0,0.14),_transparent_38%)]" />
        <div className="container relative py-16 md:py-20">
          <div
            className="rounded-[2rem] border px-6 py-10 md:px-10 md:py-12"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          >
            <p className="max-w-4xl font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              &ldquo;With the right guidance and tools, compliance becomes your competitive
              advantage. We&apos;ll show you how to turn regulatory complexity into clear workflows
              that actually help grow your business.&rdquo;
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: '#1D9E75' }}
              >
                More About Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                Talk to DexMetal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
