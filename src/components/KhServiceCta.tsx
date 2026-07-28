import Link from 'next/link'

type Props = {
  slug: string
}

// Single, uniform CTA -- previously had seven section-specific "we do this for
// you" pitches, all pointing at retired consulting pages. Simplified 2026-07-27
// to the one live paid offer plus the free tools, no personalized service claims.
export function KhServiceCta({ slug }: Props) {
  return (
    <div
      className="mt-16 rounded-xl p-7 flex flex-col sm:flex-row sm:items-center gap-6"
      style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}
    >
      <div className="flex-1">
        <p
          className="font-body text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#1D9E75' }}
        >
          Basel Shipment Triage
        </p>
        <h3 className="font-display font-bold text-white text-lg mb-2 leading-snug">
          Want your shipment file checked against every required element?
        </h3>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#a8c4bb' }}>
          $149, 48-hour turnaround. A document-completeness checklist -- notification form,
          movement document, annexes -- not a certification. Or start with the free tools.
        </p>
      </div>
      <div className="shrink-0 flex flex-col gap-2">
        <Link
          href="/services/shipment-compliance-review"
          className="inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-center"
          style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
        >
          Learn more →
        </Link>
        <Link
          href="/tools"
          className="inline-block font-body text-sm px-6 py-2 rounded-lg text-center transition-opacity hover:opacity-80"
          style={{ color: '#a8c4bb' }}
        >
          Or use a free tool
        </Link>
      </div>
    </div>
  )
}
