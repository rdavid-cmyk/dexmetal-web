import Link from 'next/link'

type Props = {
  slug: string
}

// Single, uniform free-tools CTA for knowledge-hub pages. Paid offer promotion
// stays on the dedicated service surfaces.
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
          Start with the free tools
        </p>
        <h3 className="font-display font-bold text-white text-lg mb-2 leading-snug">
          Need a first pass on a cross-border route?
        </h3>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#a8c4bb' }}>
          Use the free DexMetal tools to check eligibility, PIC status, classification, and route risk before deciding on next steps.
        </p>
      </div>
      <div className="shrink-0 flex flex-col gap-2">
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
