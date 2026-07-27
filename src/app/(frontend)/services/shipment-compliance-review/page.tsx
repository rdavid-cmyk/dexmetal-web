import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Shipment Triage | DexMetal',
  description: 'Your shipment file checked against every required Basel element -- notification form, movement document, annexes, and consent letters -- with a written checklist of gaps before customs sees it.',
  alternates: { canonical: 'https://dexmetal.com/services/shipment-compliance-review' },
  openGraph: {
    title: 'Basel Shipment Triage -- DexMetal',
    description: 'Item-by-item gap checklist for Basel shipment files. Notification form, movement document, annexes. 48-hour turnaround.',
    url: 'https://dexmetal.com/services/shipment-compliance-review',
    siteName: 'DexMetal',
  },
}

export default function ShipmentTriagePage() {
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
            Basel Shipment Triage
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Basel Shipment Triage
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$149</span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>48-hour turnaround</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Send your shipment file. We check it against every required Basel element -- notification form, movement document, annexes, consent letters -- and send back a written checklist of what's missing or incomplete, before customs or the competent authority sees it.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What you get</h2>
          <ul className="space-y-3">
            {[
              'Item-by-item gap checklist -- every missing or incomplete element flagged against Basel requirements',
              'Notification form checked block-by-block (vCOP8 format)',
              'Movement document completeness check',
              'Annex package checklist -- required attachments verified present',
              'Plain-language note on what each flagged gap requires to close',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
                <span style={{ color: '#1D9E75', marginTop: '2px', flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-body text-xs mt-5 leading-relaxed" style={{ color: '#77736b' }}>
            This is a document-completeness checklist against Basel Convention requirements, not legal advice or a certification that your shipment will be approved. The competent authority responsible for your shipment makes that determination.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">Who this is for</h2>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Operators who have assembled a notification file themselves and want it checked against the full requirement list before submission. Also useful before repeat shipments to a new destination, or after a prior rejection by a competent authority.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What a gap costs you</h2>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            A single missing annex can freeze a shipment at the border for weeks. A wrong block on the notification form triggers a formal rejection from the competent authority -- requiring a full re-submission and a new consent cycle. Storage fees, demurrage, and re-routing costs accumulate fast.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            A $149 checklist pass is a fraction of what one rejection costs in practice.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Ready to get started?</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Send us your shipment file or describe what you have assembled so far. We will confirm scope and turnaround within 24 hours.
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
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
