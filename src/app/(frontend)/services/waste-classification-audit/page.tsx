import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Waste Classification Audit | DexMetal',
  description: 'Know exactly where your material sits before you move it. We review your waste stream against Basel Annex I, III, VIII, and IX and deliver a written classification memo in 48 hours.',
  alternates: { canonical: 'https://dexmetal.com/services/waste-classification-audit' },
  openGraph: {
    title: 'Basel Waste Classification Audit — DexMetal',
    description: 'Written Basel waste classification memo covering Annex I/III/VIII/IX, Y-codes, H-codes, and A/B-list status. Delivered in 48 hours.',
    url: 'https://dexmetal.com/services/waste-classification-audit',
    siteName: 'DexMetal',
  },
}

export default function WasteClassificationAuditPage() {
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
            Service 01
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Waste Classification Audit
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$350</span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>48-hour turnaround</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            You need to know exactly where your material sits before you move it. Misclassification is the single most common cause of shipment seizure under the Basel Convention — and it is entirely avoidable with a proper pre-movement audit.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What you get</h2>
          <ul className="space-y-3">
            {[
              'Written classification memo you can attach directly to your notification file',
              'Annex I, III, VIII, and IX determination for your specific waste stream',
              'Y-code, H-code, and A/B-list analysis',
              'Notes on any ambiguous or dual-listed classifications',
              'Recommended Basel code for use on movement documents',
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
            Exporters and recyclers preparing to move e-waste, ULABs, or mixed metal fractions across borders for the first time — or operators who have been using a classification they are no longer confident in. Also used by compliance teams preparing for CA inspections or internal audits.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">Why classification matters</h2>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            Basel Annex VIII lists hazardous wastes subject to full notification and PIC requirements. Annex IX lists wastes that are presumed non-hazardous unless they exhibit Annex III hazard characteristics. The line between them determines whether your shipment requires Prior Informed Consent, full notification documents, or neither.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Getting this wrong at the start means your entire notification package is built on the wrong foundation — and competent authorities will reject the file.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Ready to get started?</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Describe your waste stream — material type, form, origin process — and we will confirm scope and turnaround within 24 hours.
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
          <Link href="/services/shipment-compliance-review" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
            Next: Shipment Compliance Review →
          </Link>
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
