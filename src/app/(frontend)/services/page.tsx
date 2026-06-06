import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | DexMetal',
  description: 'Basel Convention compliance consulting for cross-border e-waste and ULAB operators. Practical, practitioner-drafted guidance — not legal theory.',
  alternates: { canonical: 'https://dexmetal.com/services' },
  openGraph: {
    title: 'Basel Compliance Services — DexMetal',
    description: 'Shipment file reviews, PIC navigation, waste classification, and full notification packages. Built by operators, for operators.',
    url: 'https://dexmetal.com/services',
    siteName: 'DexMetal',
  },
}

const services = [
  {
    id: '01',
    name: 'Waste Classification Audit',
    href: '/services/waste-classification-audit',
    price: '$350',
    turnaround: '48 hours',
    description:
      'You need to know exactly where your material sits before you move it. We review your waste stream against Basel Annex I, III, VIII, and IX — plus OECD and Y/H/A/B codes — and deliver a written classification memo you can attach to your notification file.',
    includes: [
      'Written classification memo',
      'Annex I/III/VIII/IX determination',
      'Y-code, H-code, and A/B-list analysis',
      'Notes on any ambiguous classifications',
    ],
  },
  {
    id: '02',
    name: 'Shipment Compliance Review',
    href: '/services/shipment-compliance-review',
    price: '$500',
    turnaround: '48–72 hours',
    description:
      'One shipment file, reviewed end to end. We go through every document — notification form, movement document, annexes, consent letters — and produce a written gap report before customs or the competent authority sees it.',
    includes: [
      'Full document gap report',
      'Notification form review (all blocks)',
      'Movement document check',
      'Annex completeness check',
      'Remediation notes per gap found',
    ],
  },
  {
    id: '03',
    name: 'Prior Informed Consent Navigation',
    href: '/services/pic-navigation',
    price: '$750',
    turnaround: '3–5 business days',
    description:
      'PIC is where most shipments stall. We identify the correct competent authorities on both sides, confirm Ban Amendment status for your specific waste and destination, and tell you exactly what consents are required before legal movement can begin.',
    includes: [
      'CA identification — export and import country',
      'Ban Amendment applicability determination',
      'Written PIC requirements summary',
      'Transit country CA identification (if applicable)',
      'Timeline estimate for consent cycle',
    ],
  },
  {
    id: '04',
    name: 'Trade Lane Setup',
    href: '/services/trade-lane-setup',
    price: '$1,500',
    turnaround: '5–7 business days',
    description:
      'Building a new trade lane from scratch. We map the full compliance pathway for a specific export–import country pair: CA contacts, Ban Amendment status, required documentation, notification timeline, and any country-specific requirements. Delivered as a reusable lane file your team can work from.',
    includes: [
      'Full lane compliance map',
      'CA contact details (both countries)',
      'Required document checklist',
      'Estimated notification timeline',
      'Ban Amendment and transit status',
      'Country-specific procedural notes',
    ],
  },
  {
    id: '05',
    name: 'Full Notification Package',
    href: '/services/full-notification-package',
    price: '$2,500',
    turnaround: '7–10 business days',
    description:
      'We build the complete notification file — every annex, every block, every cover letter — ready to submit to the competent authority. This is the done-for-you option for operators who need a compliant package without the internal overhead.',
    includes: [
      'Complete Basel notification form (all blocks)',
      'All required annexes',
      'CA cover letters (export + import)',
      'Movement document template',
      'Financial guarantee guidance',
      'Submission-ready package review',
    ],
  },
  {
    id: '06',
    name: 'Operator Retainer',
    href: '/services/operator-retainer',
    price: '$1,200/month',
    turnaround: '24-hour response',
    description:
      'Ongoing async support for active operators. Unlimited compliance questions, quarterly lane reviews, notification file checks, and first access to new DexMetal tools and research. Built for teams moving regular volumes who need a practitioner on call without the overhead of a full-time hire.',
    includes: [
      'Unlimited async compliance questions',
      'Quarterly trade lane review',
      'Notification file reviews (up to 2/month)',
      'Priority 24-hour response window',
      'Early access to new DexMetal tools',
      'Monthly Basel regulatory update summary',
    ],
  },
]

export default function ServicesPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-16">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#1D9E75' }}>
            Consulting Services
          </p>
          <h1 className="font-display font-bold text-white mb-6" style={{ fontSize: '2.75rem', lineHeight: 1.15 }}>
            Basel Compliance,<br />Done by Operators
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-2xl" style={{ color: '#a0a09a' }}>
            Every service is delivered async, in writing, by a practitioner with direct experience
            managing transboundary hazardous waste shipments across multiple jurisdictions.
            No theory. No generic checklists. Real operational knowledge applied to your specific situation.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16 p-6 rounded-xl border-l-4" style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}>
          <h2 className="font-display font-bold text-white text-lg mb-3">How it works</h2>
          <ol className="space-y-2 font-body" style={{ color: '#a0a09a' }}>
            <li><span className="text-white font-semibold">1. Submit your question</span> — use the contact form below, describe your situation and which service fits.</li>
            <li><span className="text-white font-semibold">2. We confirm scope</span> — within 24 hours we confirm the engagement, timeline, and payment.</li>
            <li><span className="text-white font-semibold">3. You receive a written deliverable</span> — every engagement ends with a document you own and can act on.</li>
          </ol>
        </section>

        {/* Services */}
        <section className="space-y-6 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl p-8"
              style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <span className="font-body text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#1D9E75' }}>
                    {service.id}
                  </span>
                  <h2 className="font-display font-bold text-white text-2xl">
                    {service.name}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-white text-2xl">{service.price}</div>
                  <div className="font-body text-sm" style={{ color: '#a0a09a' }}>{service.turnaround}</div>
                </div>
              </div>

              <p className="font-body leading-relaxed mb-6" style={{ color: '#a0a09a' }}>
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
                    <span style={{ color: '#1D9E75', marginTop: '2px', flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-block font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
                  style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
                >
                  Enquire about this service →
                </Link>
                <Link
                  href={service.href}
                  className="inline-block font-body text-sm px-5 py-2.5 rounded-lg border transition-colors hover:opacity-80"
                  style={{ borderColor: '#3a3a37', color: '#a0a09a' }}
                >
                  Full details →
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Not sure section */}
        <section
          className="rounded-xl p-8 mb-16 text-center"
          style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}
        >
          <h2 className="font-display font-bold text-white text-xl mb-3">Not sure which service you need?</h2>
          <p className="font-body mb-6 max-w-xl mx-auto" style={{ color: '#a0a09a' }}>
            Describe your situation — where you are, what you are moving, where it is going — and we will tell you
            exactly what is required and which service applies.
          </p>
          <Link
            href="/contact"
            className="inline-block font-display font-bold px-8 py-4 rounded-lg transition-colors"
            style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}
          >
            Ask a question
          </Link>
        </section>

        {/* Trust bar */}
        <section className="border-t pt-10" style={{ borderColor: '#3a3a37' }}>
          <p className="font-body text-sm text-center mb-6" style={{ color: '#6b6b66' }}>
            All engagements are async and delivered in writing. No calls required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: '20+ years', label: 'Transboundary shipment experience' },
              { stat: 'Async only', label: 'Written deliverables, no calls' },
              { stat: '182 countries', label: 'Basel CA database coverage' },
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
