import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Full Notification Package | DexMetal',
  description: 'We build the complete Basel notification file — every annex, every block, every cover letter — ready to submit to the competent authority. Done-for-you in 7–10 business days.',
  alternates: { canonical: 'https://dexmetal.com/services/full-notification-package' },
  openGraph: {
    title: 'Basel Full Notification Package — DexMetal',
    description: 'Complete Basel notification file built for submission. Notification form, all annexes, CA cover letters, and movement document template. 7–10 business days.',
    url: 'https://dexmetal.com/services/full-notification-package',
    siteName: 'DexMetal',
  },
}

export default function FullNotificationPackagePage() {
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
            Service 05
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Full Notification Package
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$2,500</span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>7–10 business days</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            We build the complete notification file — every annex, every block, every cover letter — ready to submit to the competent authority. This is the done-for-you option for operators who need a compliant package without the internal overhead.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What you get</h2>
          <ul className="space-y-3">
            {[
              'Complete Basel notification form with all 21 blocks correctly populated',
              'All required annexes assembled and formatted for submission',
              'Competent authority cover letters — export and import country',
              'Movement document template configured for your specific shipment',
              'Financial guarantee guidance — what form is required and how to obtain it',
              'Final submission-ready package review before delivery',
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
            Operators moving hazardous waste across borders who need the full file built correctly without allocating internal staff time to a process that requires specialist knowledge. Also used for high-value or high-risk shipments where the cost of a rejection or seizure outweighs the cost of professional preparation.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What we need from you</h2>
          <p className="font-body leading-relaxed mb-3" style={{ color: '#a0a09a' }}>
            To build your notification package we need: waste description and volume, export and destination countries, intended facility details, and any prior correspondence with competent authorities. We will request exactly what is needed after confirming scope.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            You do not need to have any prior Basel documentation prepared. This service starts from scratch.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Ready to get started?</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Describe your shipment — waste type, origin, destination, volume — and we will confirm scope and timeline within 24 hours.
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
          <Link href="/services/operator-retainer" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
            Next: Operator Retainer →
          </Link>
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
