import Link from 'next/link'

type ServiceCta = {
  label: string
  heading: string
  body: string
  href: string
  accent: '#1D9E75' | '#FF5C00'
}

// Map section prefix → most relevant service CTA
const SECTION_CTA: Record<string, ServiceCta> = {
  'pic': {
    label: 'PIC Navigation Service',
    heading: 'Not sure what PIC approvals your shipment needs?',
    body: 'We identify the correct competent authorities, confirm Ban Amendment status, and tell you exactly what consents are required before legal movement can begin.',
    href: '/services/pic-navigation',
    accent: '#1D9E75',
  },
  'notification-app': {
    label: 'Full Notification Package',
    heading: 'Need someone to build your notification file for you?',
    body: 'We assemble the complete Basel notification package — every block, every annex, every cover letter — ready to submit to the competent authority.',
    href: '/services/full-notification-package',
    accent: '#1D9E75',
  },
  'movement-doc': {
    label: 'Shipment Compliance Review',
    heading: 'Want a practitioner to review your shipment file before it goes out?',
    body: 'We go through every document — notification form, movement document, annexes, consent letters — and produce a written gap report before customs sees it.',
    href: '/services/shipment-compliance-review',
    accent: '#1D9E75',
  },
  'ewaste': {
    label: 'Waste Classification Audit',
    heading: 'Not confident your material is classified correctly?',
    body: 'We review your waste stream against Basel Annex I, III, VIII, and IX and deliver a written classification memo you can attach directly to your notification file.',
    href: '/services/waste-classification-audit',
    accent: '#FF5C00',
  },
  'country': {
    label: 'Trade Lane Setup',
    heading: 'Opening a new trade lane to this country?',
    body: 'We map the full compliance pathway for your specific export–import country pair — CA contacts, required documents, notification timeline, and country-specific requirements.',
    href: '/services/trade-lane-setup',
    accent: '#FF5C00',
  },
  'supporting-docs': {
    label: 'Shipment Compliance Review',
    heading: 'Unsure if your supporting documents are complete?',
    body: 'We audit every document in your shipment file and produce a written gap report — with specific remediation notes — before you submit to the competent authority.',
    href: '/services/shipment-compliance-review',
    accent: '#1D9E75',
  },
  'reference': {
    label: 'Operator Retainer',
    heading: 'Managing active Basel shipments regularly?',
    body: 'Unlimited async compliance questions, quarterly lane reviews, and notification file checks — one monthly retainer, 24-hour response window.',
    href: '/services/operator-retainer',
    accent: '#FF5C00',
  },
}

// Fallback CTA for pages not in a known section
const DEFAULT_CTA: ServiceCta = {
  label: 'DexMetal Services',
  heading: 'Need hands-on help with your Basel shipment?',
  body: 'Our practitioners handle classification audits, notification packages, PIC navigation, and trade lane setup — delivered async, in writing, with a 24-hour response window.',
  href: '/services',
  accent: '#1D9E75',
}

type Props = {
  slug: string
}

export function KhServiceCta({ slug }: Props) {
  // Find matching section prefix
  const sectionPrefix = Object.keys(SECTION_CTA).find((p) => slug.startsWith(p + '/'))
  const cta = sectionPrefix ? SECTION_CTA[sectionPrefix]! : DEFAULT_CTA

  return (
    <div
      className="mt-16 rounded-xl p-7 flex flex-col sm:flex-row sm:items-center gap-6"
      style={{ backgroundColor: '#1a2e27', border: `1px solid ${cta.accent}` }}
    >
      <div className="flex-1">
        <p
          className="font-body text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: cta.accent }}
        >
          {cta.label}
        </p>
        <h3 className="font-display font-bold text-white text-lg mb-2 leading-snug">
          {cta.heading}
        </h3>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#a8c4bb' }}>
          {cta.body}
        </p>
      </div>
      <Link
        href={cta.href}
        className="shrink-0 inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-center"
        style={{ backgroundColor: cta.accent, color: '#ffffff' }}
      >
        Learn more →
      </Link>
    </div>
  )
}
