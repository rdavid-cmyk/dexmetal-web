import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Media } from '@/components/Media'
import AssetGate from '@/components/AssetGate'
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
    title: 'Basel Navigator',
    href: '/tools/basel-navigator',
    accent: '#1D9E75',
    description:
      'Generate Basel Convention notification and movement documents.',
  },
  {
    title: 'Basel Checklist',
    href: '/checklist',
    accent: '#FF5C00',
    description:
      'A practical export-prep checklist for e-waste shipments, notification forms, and movement document readiness.',
  },
  {
    title: 'Basel CA API',
    href: '/basel-ca-api',
    accent: '#FF5C00',
    description:
      'Search competent authority contact data for 182 countries and embed verified records into your workflow.',
  },
  {
    title: 'Knowledge Hub',
    href: '/knowledge-hub',
    accent: '#1D9E75',
    description:
      'Field-tested guidance covering notification documents, movement docs, PIC procedure, and country requirements.',
  },
] as const

const TRUST_STATS = [
  { value: '182', label: 'Countries Covered' },
  { value: '20+', label: 'Years Experience' },
  { value: '67+', label: 'Pages of Guidance' },
  { value: 'Free', label: 'Core Resources' },
] as const

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

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
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
  })

  return (
    <article className="bg-dex-bg text-white">
      <section className="relative overflow-hidden border-b border-[#2f2f2b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,158,117,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,92,0,0.08),_transparent_40%)]" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-4xl">
            <p
              className="mb-5 text-sm font-medium uppercase tracking-[0.22em]"
              style={{ color: '#1D9E75' }}
            >
              Navigating Circularity, Compliance, and Global Trade
            </p>
            <h1
              className="max-w-3xl font-display font-bold leading-[1.05] text-white"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 5.75rem)' }}
            >
              Transforming e-Waste Into Opportunity
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: '#cbc7be' }}>
              DexMetal turns Basel Convention complexity into practical systems for recyclers,
              exporters, and circular economy operators. We combine field-tested compliance
              guidance, verified authority data, and free tools that help good materials move
              legally across borders.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/knowledge-hub"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1D9E75' }}
              >
                Explore the Knowledge Hub
              </Link>
              <Link
                href="/checklist"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium transition-colors hover:text-white"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                Get the Basel Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Free Tools
              </p>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Start with the resources practitioners actually use
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-medium" style={{ color: '#FF5C00' }}>
              Read the latest guidance →
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {FREE_TOOLS.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="rounded-3xl border p-6 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ backgroundColor: tool.accent }}
                >
                  {tool.title.charAt(0)}
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{tool.title}</h3>
                <p className="text-sm leading-7" style={{ color: '#c8c4bc' }}>
                  {tool.description}
                </p>
                <span className="mt-5 inline-flex text-sm font-medium" style={{ color: tool.accent }}>
                  Open resource →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                      {post.meta?.description || 'Read the full article for DexMetal guidance and field-tested insight.'}
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
