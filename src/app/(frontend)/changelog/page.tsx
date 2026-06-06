import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog | DexMetal',
  description: 'What we have shipped — new tools, platform updates, and improvements to dexmetal.com.',
  alternates: { canonical: 'https://dexmetal.com/changelog' },
  openGraph: {
    title: 'DexMetal Changelog',
    description: 'New tools, platform updates, and improvements shipped to dexmetal.com.',
    url: 'https://dexmetal.com/changelog',
    siteName: 'DexMetal',
  },
}

type ChangeType = 'new' | 'improved' | 'fixed' | 'infrastructure'

type Entry = {
  date: string
  type: ChangeType
  title: string
  description: string
  link?: { label: string; href: string }
}

const ENTRIES: Entry[] = [
  {
    date: 'Jun 2026',
    type: 'new',
    title: 'Basel Regulatory Radar',
    description: 'New page tracking COP decisions, Ban Amendment updates, and Basel listing changes — filtered by impact level and type. Updated as events occur.',
    link: { label: 'View Regulatory Radar', href: '/regulatory-radar' },
  },
  {
    date: 'Jun 2026',
    type: 'new',
    title: 'Individual service pages',
    description: 'Each DexMetal service now has its own dedicated page with full detail on scope, deliverables, turnaround, and pricing.',
    link: { label: 'View services', href: '/services' },
  },
  {
    date: 'Jun 2026',
    type: 'improved',
    title: 'Homepage tool showcase',
    description: 'Free compliance tools are now prominently displayed on the homepage — each anchored to the specific operator problem it solves.',
    link: { label: 'View tools', href: '/tools' },
  },
  {
    date: 'Jun 2026',
    type: 'improved',
    title: 'Knowledge Hub service cross-links',
    description: 'Every Knowledge Hub article now surfaces a contextual service CTA matched to the article section — PIC articles link to PIC Navigation, classification articles to Waste Classification Audit, and so on.',
    link: { label: 'Browse Knowledge Hub', href: '/knowledge-hub' },
  },
  {
    date: 'Jun 2026',
    type: 'improved',
    title: 'Welcome emails now send from richard@dexmetal.com',
    description: 'Operator welcome emails sent on tool access and playbook download now come from a verified DexMetal domain address.',
  },
  {
    date: 'Jun 2026',
    type: 'new',
    title: 'Contact form with Resend backend',
    description: 'Contact form submissions now route to info@dexmetal.com with an auto-confirm sent to the person who submitted.',
    link: { label: 'Contact us', href: '/contact' },
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Daily SEO health monitor',
    description: 'Automated daily scan across 34 checks — sitemap validity, canonical URLs, OG tags, redirects — with Telegram alerts on failures.',
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'DexMetal Media Studio',
    description: 'Internal tool for generating on-brand social images and article thumbnails from the DexMetal design system.',
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Vera — Basel Compliance Copilot',
    description: 'Voice-enabled AI compliance assistant embedded across the platform. Answers Basel classification, PIC, and notification questions in plain language.',
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Basel intelligence news feed',
    description: 'Automated daily ingestion of Basel-relevant news from global sources, scored for relevance and published to /news. Filtered to 90-day rolling window.',
    link: { label: 'View news', href: '/news' },
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'LME metals price ticker',
    description: 'Live London Metal Exchange price ticker on the homepage — copper, lead, aluminium, and zinc.',
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Basel MCP server',
    description: 'Model Context Protocol server exposing DexMetal\'s Basel CA database and compliance tools to AI agents and developer integrations.',
    link: { label: 'Developers', href: '/developers' },
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Developers hub',
    description: 'New /developers section with API documentation, waste classifier demo, and MCP server integration guide.',
    link: { label: 'View Developers', href: '/developers' },
  },
  {
    date: 'May 2026',
    type: 'new',
    title: 'Resources hub',
    description: 'Centralised /resources page linking all free DexMetal tools, guides, and references in one place.',
    link: { label: 'View Resources', href: '/resources' },
  },
  {
    date: 'May 2026',
    type: 'improved',
    title: 'Visitor onboarding — guided tours and Load Example buttons',
    description: 'Step-by-step guided tours added to Basel Navigator and compliance tools. Load Example buttons populate forms with real sample data so operators can see the tool working immediately.',
    link: { label: 'Try Basel Navigator', href: '/tools/basel-navigator' },
  },
  {
    date: 'May 2026',
    type: 'improved',
    title: 'Knowledge Hub content enhancer',
    description: 'Rich content rendering pipeline for Knowledge Hub articles — Quick Reference cards, warning boxes, expert tips, numbered steps, wrong/correct comparisons, and FAQ accordions rendered from plain text content.',
    link: { label: 'Browse Knowledge Hub', href: '/knowledge-hub' },
  },
]

const TYPE_CONFIG: Record<ChangeType, { label: string; color: string; bg: string }> = {
  new:            { label: 'New',            color: '#1D9E75', bg: '#1D9E7522' },
  improved:       { label: 'Improved',       color: '#FF5C00', bg: '#FF5C0022' },
  fixed:          { label: 'Fixed',          color: '#a0a09a', bg: '#3a3a38' },
  infrastructure: { label: 'Infrastructure', color: '#8f8d86', bg: '#2c2c2a' },
}

// Group entries by date
function groupByDate(entries: Entry[]): Record<string, Entry[]> {
  return entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date]!.push(entry)
    return acc
  }, {} as Record<string, Entry[]>)
}

export default function ChangelogPage() {
  const grouped = groupByDate(ENTRIES)
  const dates = Object.keys(grouped)

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-12">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#1D9E75' }}>
            Platform Updates
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.75rem' }}>
            Changelog
          </h1>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            New tools, platform improvements, and fixes shipped to dexmetal.com.
          </p>
        </div>

        <div className="space-y-12">
          {dates.map((date) => (
            <section key={date}>
              <h2
                className="font-display font-bold text-white text-xl mb-6 pb-3 border-b"
                style={{ borderColor: '#3a3a37' }}
              >
                {date}
              </h2>
              <div className="space-y-4">
                {grouped[date]!.map((entry, i) => {
                  const config = TYPE_CONFIG[entry.type]
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-6"
                      style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span
                          className="font-body text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded shrink-0 mt-0.5"
                          style={{ backgroundColor: config.bg, color: config.color }}
                        >
                          {config.label}
                        </span>
                        <h3 className="font-display font-bold text-white text-base leading-snug">
                          {entry.title}
                        </h3>
                      </div>
                      <p className="font-body text-sm leading-relaxed mb-3 ml-[4.5rem]" style={{ color: '#a0a09a' }}>
                        {entry.description}
                      </p>
                      {entry.link && (
                        <div className="ml-[4.5rem]">
                          <Link
                            href={entry.link.href}
                            className="font-body text-sm font-medium transition-opacity hover:opacity-80"
                            style={{ color: '#1D9E75' }}
                          >
                            {entry.link.label} →
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a37' }}>
          <p className="font-body text-sm" style={{ color: '#6b6b66' }}>
            Building in public.{' '}
            <Link href="/contact" className="transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
              Have a feature request? →
            </Link>
          </p>
        </div>

      </div>
    </article>
  )
}
