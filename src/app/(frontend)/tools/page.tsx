import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const metadata = {
  title: 'Compliance Tools | DexMetal',
  description: 'Basel compliance tools — checklists, templates, waste code lookup, movement document guides, and more.',
}

export default async function ToolsPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'knowledge-hub-pages',
    limit: 100,
    overrideAccess: false,
    pagination: false,
    where: {
      section: { equals: 'Tools' },
    },
    select: {
      title: true,
      slug: true,
      metaDescription: true,
    },
    sort: 'title',
  })

  const tools = result.docs

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: '2.75rem' }}>
            Compliance Tools
          </h1>
          <p className="font-body text-lg" style={{ color: '#a0a09a' }}>
            Templates, checklists, lookup tables, and workflow guides for Basel compliance practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/tools/basel-navigator"
            className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
          >
            <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
              Basel Navigator
            </h2>
            <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
              Generate Basel Convention notification and movement documents.
            </p>
            <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#1D9E75' }}>
              Open tool →
            </span>
          </Link>
          <Link
            href="/tools/shipment-eligibility-checker"
            className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
          >
            <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
              Shipment Eligibility Checker
            </h2>
            <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
              Check if your waste shipment is permitted under the Basel Convention — Ban Amendment, OECD controls, plastic waste rules.
            </p>
            <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#1D9E75' }}>
              Open tool →
            </span>
          </Link>
          <Link
            href="/tools/pic-status-checker"
            className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
          >
            <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
              PIC Status Checker
            </h2>
            <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
              Determine whether your shipment requires Prior Informed Consent — and what type of consent applies. Includes 2025 Y49 amendment.
            </p>
            <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#1D9E75' }}>
              Open tool →
            </span>
          </Link>
          <Link
            href="/tools/basel-classification-quickscan"
            className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}
          >
            <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
              Basel Classification QuickScan
            </h2>
            <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
              Identify the correct Basel waste code for your e-waste or battery shipment in three questions. Covers 2025 A1181 and Y49 updates.
            </p>
            <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#1D9E75' }}>
              Open tool →
            </span>
          </Link>
          <Link
            href="/tools/ulab-export-calculator"
            className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#FF5C00' }}
          >
            <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
              ULAB Export Calculator
            </h2>
            <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
              Estimate lead recovery value, logistics cost, and net margin for your used lead-acid battery shipment at current LME prices.
            </p>
            <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#FF5C00' }}>
              Open tool →
            </span>
          </Link>
        </div>

        {tools.length === 0 ? (
          <p className="font-body text-center py-20" style={{ color: '#a0a09a' }}>
            Tools coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/knowledge-hub/${tool.slug}`}
                className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#FF5C00' }}
              >
                <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
                  {tool.title}
                </h2>
                {tool.metaDescription && (
                  <p className="font-body text-sm leading-relaxed line-clamp-2" style={{ color: '#a0a09a' }}>
                    {tool.metaDescription}
                  </p>
                )}
                <span className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide" style={{ color: '#FF5C00' }}>
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a38' }}>
          <p className="font-body text-sm" style={{ color: '#a0a09a' }}>
            All tools are free to use.{' '}
            <Link href="/knowledge-hub" className="transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
              Browse the full Knowledge Hub →
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
