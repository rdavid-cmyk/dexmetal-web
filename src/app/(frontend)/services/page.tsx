import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | DexMetal',
  description: 'Free Basel Convention compliance tools, a paid document checklist, and B2B API access for cross-border e-waste and metal exporters.',
  alternates: { canonical: 'https://dexmetal.com/services' },
  openGraph: {
    title: 'Services -- DexMetal',
    description: 'Free compliance tools, Basel Shipment Triage, and API access for freight forwarders and institutional partners.',
    url: 'https://dexmetal.com/services',
    siteName: 'DexMetal',
  },
}

export default function ServicesPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-16">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#1D9E75' }}>
            Services
          </p>
          <h1 className="font-display font-bold text-white mb-6" style={{ fontSize: '2.75rem', lineHeight: 1.15 }}>
            Tools, a checklist,<br />and API access
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-2xl" style={{ color: '#a0a09a' }}>
            DexMetal is a resource platform, not a consultancy. Everything here equips you to run
            your own compliant workflow -- we don't take on your shipment or your liability.
          </p>
        </div>

        {/* Free Tools */}
        <section className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <span className="font-body text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#1D9E75' }}>01</span>
          <h2 className="font-display font-bold text-white text-2xl mb-3">Free Compliance Tools</h2>
          <p className="font-body leading-relaxed mb-6" style={{ color: '#a0a09a' }}>
            Seven free tools covering shipment eligibility, PIC status, waste classification, ULAB
            calculations, and competent authority lookups across 182 countries. No account required.
          </p>
          <Link href="/tools" className="inline-block font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>
            Explore free tools →
          </Link>
        </section>

        {/* Basel Shipment Triage */}
        <section className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <span className="font-body text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#1D9E75' }}>02</span>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <h2 className="font-display font-bold text-white text-2xl">Basel Shipment Triage</h2>
            <div className="text-right shrink-0">
              <div className="font-display font-bold text-white text-2xl">$149</div>
              <div className="font-body text-sm" style={{ color: '#a0a09a' }}>48-hour turnaround</div>
            </div>
          </div>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            Send your shipment file. We check it against every required Basel element and send back
            a written checklist of what's missing or incomplete -- a document-completeness check,
            not a certification or professional opinion on approval.
          </p>
          <Link href="/services/shipment-compliance-review" className="inline-block font-body text-sm px-5 py-2.5 rounded-lg border transition-colors hover:opacity-80" style={{ borderColor: '#3a3a37', color: '#a0a09a' }}>
            Full details →
          </Link>
        </section>

        {/* B2B / API */}
        <section className="rounded-xl p-8 mb-16" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <span className="font-body text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#1D9E75' }}>03</span>
          <h2 className="font-display font-bold text-white text-2xl mb-3">B2B API Access</h2>
          <p className="font-body leading-relaxed mb-6" style={{ color: '#a8c4bb' }}>
            Freight platforms, institutional partners, and compliance software teams can integrate
            verified competent authority data and waste classification directly via the Basel CA API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/basel-ca-api" className="inline-block font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>
              View API docs →
            </Link>
            <Link href="/contact" className="inline-block font-body text-sm px-5 py-2.5 rounded-lg border transition-colors hover:opacity-80" style={{ borderColor: '#1D9E75', color: '#a8c4bb' }}>
              Enquire about integration
            </Link>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-t pt-10" style={{ borderColor: '#3a3a37' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: '20+ years', label: 'Basel operator experience' },
              { stat: '7 free tools', label: 'No account required' },
              { stat: '182 countries', label: 'Competent authority coverage' },
            ].map((item) => (
              <div key={item.stat}>
                <div className="font-display font-bold text-white text-2xl mb-1">{item.stat}</div>
                <div className="font-body text-sm" style={{ color: '#a0a09a' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </article>
  )
}
