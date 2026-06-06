import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Prior Informed Consent Navigation | DexMetal',
  description: 'PIC is where most Basel shipments stall. We identify the correct competent authorities, confirm Ban Amendment status, and tell you exactly what consents are required.',
  alternates: { canonical: 'https://dexmetal.com/services/pic-navigation' },
  openGraph: {
    title: 'Basel PIC Navigation — DexMetal',
    description: 'CA identification, Ban Amendment applicability, and written PIC requirements summary for your specific waste and destination. 3–5 business day turnaround.',
    url: 'https://dexmetal.com/services/pic-navigation',
    siteName: 'DexMetal',
  },
}

export default function PicNavigationPage() {
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
            Service 03
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Prior Informed Consent Navigation
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$750</span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>3–5 business days</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            PIC is where most Basel shipments stall. We identify the correct competent authorities on both sides, confirm Ban Amendment status for your specific waste and destination, and tell you exactly what consents are required before legal movement can begin.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What you get</h2>
          <ul className="space-y-3">
            {[
              'Competent authority identification — export country and import country',
              'Ban Amendment applicability determination for your waste and destination pair',
              'Written PIC requirements summary — what is required, from whom, and in what form',
              'Transit country CA identification if your route crosses additional jurisdictions',
              'Estimated timeline for the full consent cycle',
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
            Operators moving hazardous waste to a new destination country, or to any country where the Ban Amendment applies — which prohibits exports of hazardous waste from OECD to non-OECD nations for disposal or recovery. If you are unsure whether your shipment triggers PIC or Ban Amendment restrictions, this is where to start.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">The PIC problem in practice</h2>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            Competent authority contact details change. Countries update their Basel ratification status. Some destinations require written consent from multiple authorities. Others have blanket objections to certain waste codes on file with the Basel Secretariat that are never publicly announced.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Operators who skip the PIC mapping step and move directly to notification frequently discover — after submitting — that they sent the notification to the wrong authority, or that consent is structurally unavailable for their specific route.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Ready to get started?</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Tell us your export country, destination country, waste type, and Basel code if known. We will confirm scope within 24 hours.
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
          <Link href="/services/trade-lane-setup" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
            Next: Trade Lane Setup →
          </Link>
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
