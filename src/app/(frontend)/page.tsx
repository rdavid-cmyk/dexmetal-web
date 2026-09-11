import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Media } from '@/components/Media'
import AssetGate from '@/components/AssetGate'
import { LMETicker } from '@/components/LMETicker'
import BaselIntro from '@/components/BaselIntro'
import { DexMetalAgent } from '@/components/DexMetalAgent'
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

      {/* ── HERO + AGENT START ── */}
      <section
        data-homepage-hero
        className="relative border-b border-[#35312c] bg-[#12130f]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 24%, rgba(255,255,255,0.035), transparent 54%), linear-gradient(180deg, #171812 0%, #10110f 70%, #191713 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(to bottom, black, transparent 82%)',
          }}
        />
        <svg
          data-route-map
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-8 h-[430px] w-full md:top-0 md:h-[560px]"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
        >
          <g
            data-world-map
            fill="rgba(154,168,159,0.055)"
            stroke="rgba(185,196,189,0.11)"
            strokeLinejoin="round"
            strokeWidth="1.1"
          >
            <path d="M105 205 C145 165 195 145 260 150 L320 178 345 205 315 233 276 235 250 270 210 282 176 250 145 248 118 225 Z" />
            <path d="M292 300 C325 298 354 318 370 350 L363 390 340 438 318 482 296 446 288 402 272 356 Z" />
            <path d="M565 178 C600 158 643 158 675 176 L703 194 692 219 657 225 626 211 592 216 568 198 Z" />
            <path d="M630 236 C670 224 714 233 743 262 L760 306 742 360 705 407 672 392 650 352 624 305 612 266 Z" />
            <path d="M700 175 C760 146 840 136 920 151 L1005 176 1082 214 1118 246 1074 267 1018 253 965 272 910 303 847 278 798 247 751 238 720 210 Z" />
            <path d="M1025 348 C1060 332 1105 338 1135 365 L1146 395 1116 426 1068 430 1032 404 1012 374 Z" />
            <path d="M432 112 C455 92 486 89 505 105 L500 134 474 150 444 140 425 124 Z" />
            <path d="M1180 280 C1195 270 1210 275 1217 288 L1205 301 1188 299 Z" />
          </g>
          <path
            d="M-50 370 C 160 190, 300 450, 505 260 S 840 110, 1035 285 S 1260 430, 1490 190"
            fill="none"
            stroke="rgba(194,116,69,0.28)"
            strokeDasharray="4 12"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <path
            d="M70 160 C 280 340, 425 80, 650 225 S 1015 410, 1375 145"
            fill="none"
            stroke="rgba(79,145,119,0.2)"
            strokeDasharray="2 16"
            strokeLinecap="round"
            strokeWidth="1.25"
          />
          {[
            [118, 308, '#C27445'],
            [503, 261, '#1D9E75'],
            [1035, 285, '#C27445'],
            [1326, 181, '#1D9E75'],
          ].map(([cx, cy, fill]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} fill={String(fill)} opacity="0.18" r="12" />
              <circle cx={cx} cy={cy} fill={String(fill)} r="3.5" />
            </g>
          ))}
        </svg>

        <div className="container relative pb-0 pt-12 md:pt-20">
          <div className="mx-auto max-w-[1060px] text-center">
            <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#4fd1a3] md:text-xs">
              Global compliance intelligence
            </p>
            <h1 className="font-display text-[2.625rem] font-bold leading-[1.04] tracking-[-0.035em] text-white md:text-[3.75rem]">
              Basel compliance for cross-border
              <span className="block whitespace-nowrap">e-Waste trade</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[800px] text-base leading-7 text-[#c8c4bc] md:text-lg md:leading-8">
              Navigate classification, Prior Informed Consent, competent authorities, and
              cross-border shipment requirements with operator-focused guidance.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-[#d9d5cc] md:gap-3 md:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c27445]/35 bg-[#211b17]/75 px-3.5 py-2 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c27445]" />
                <strong className="font-semibold text-white">182 jurisdictions</strong>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1d9e75]/35 bg-[#14201b]/75 px-3.5 py-2 backdrop-blur-sm">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#4fd1a3]/60 text-[0.6rem] text-[#4fd1a3]">✓</span>
                <strong className="font-semibold text-white">Official Basel sources</strong>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8d3c8]" />
                Operator-built guidance
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-9 translate-y-8 md:mt-12 md:translate-y-10">
            <DexMetalAgent embedded />
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS SHOWCASE ── */}
      <section className="border-b border-[#2f2f2b]" style={{ background: '#1C1B18' }}>
        <div className="container pb-14 pt-24 md:pb-16 md:pt-28">
          <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Explore DexMetal Tools
              </p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Basel guidance and resources
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
            How DexMetal Works
          </p>
          <h2 className="font-display text-3xl font-bold text-white mb-10 md:text-4xl">
            Built for cross-border operators
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
                Follow the Basel workflow
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
                View the workflow guide →
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
