import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Trade Lane Setup | DexMetal',
  description: 'Build a new Basel-compliant trade lane from scratch. Full compliance map for your export–import country pair: CA contacts, documentation, notification timeline, and country-specific requirements.',
  alternates: { canonical: 'https://dexmetal.com/services/trade-lane-setup' },
  openGraph: {
    title: 'Basel Trade Lane Setup — DexMetal',
    description: 'Reusable compliance lane file for a specific export–import country pair. CA contacts, required documents, notification timeline, and Ban Amendment status. 5–7 business days.',
    url: 'https://dexmetal.com/services/trade-lane-setup',
    siteName: 'DexMetal',
  },
}

export default function TradeLaneSetupPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-4">
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
            ← All Services
          </Link>
        </div>

        <div className="mb-10">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#1D9E75' }}>
            Service 04
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Trade Lane Setup
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$1,500</span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>5–7 business days</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Opening a new trade lane for hazardous waste requires mapping every compliance requirement before the first shipment moves. We build that map for you — delivered as a reusable lane file your team can work from on every subsequent shipment.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What you get</h2>
          <ul className="space-y-3">
            {[
              'Full lane compliance map for your specific export–import country pair',
              'Competent authority contact details for both countries',
              'Required document checklist for this lane',
              'Estimated notification timeline — consent cycle through movement',
              'Ban Amendment status and any transit country requirements',
              'Country-specific procedural notes not in the Basel Secretariat database',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
                <span style={{ color: '#1D9E75', marginTop: '2px', flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">Who this is for</h2>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Operators and traders opening a new export destination for the first time, or scaling an existing lane to higher volumes and needing a documented compliance baseline. Also used by compliance teams standardising multi-country operations across a shared waste type.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">Why a lane file matters</h2>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            The first shipment on a new lane is always the most expensive to get wrong. Country-specific procedural requirements — additional annexes, local-language cover letters, specific CA submission formats — are not documented in any central Basel Secretariat resource.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            A lane file built from practitioner experience means your second shipment is faster and cheaper than the first — and every subsequent shipment faster still.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Ready to get started?</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Tell us your export and destination countries and the waste type. We will confirm scope and whether any transit complexities apply within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
          >
            Enquire about this service →
          </Link>
        </section>

        <div className="border-t pt-8 flex flex-wrap gap-4" style={{ borderColor: '#3a3a37' }}>
          <Link href="/services/full-notification-package" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
            Next: Full Notification Package →
          </Link>
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
