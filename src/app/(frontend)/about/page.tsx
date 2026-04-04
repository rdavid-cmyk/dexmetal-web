import Link from 'next/link'

export const metadata = {
  title: 'About | DexMetal',
  description: 'DexMetal — built on 20+ years of Basel Convention compliance expertise, converting operational knowledge into scalable digital infrastructure for global e-waste trade.',
}

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.75rem' }}>
            About DexMetal
          </h1>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Movement infrastructure for the Circular Economy and Right to Repair.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12 p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">
            The Mission
          </h2>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            DexMetal is not just a compliance tool — it is movement infrastructure for the Circular Economy and Right to Repair.
          </p>
          <p className="font-body leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            Basel compliance enables legal, documented flow of recoverable materials across borders. DexMetal makes circular trade legally defensible globally — so devices move to repair shops and responsible recyclers, not landfills.
          </p>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            <span style={{ color: '#1D9E75' }}>Canonical tagline:</span> DexMetal — Navigating Circularity, Compliance, and Global Trade in e-Waste Metals and Components.
          </p>
        </section>

        {/* Founder */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-white text-xl mb-6">
            Who Built This
          </h2>
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#1D9E75' }}>
            <h3 className="font-display font-bold text-white text-lg mb-1">Richard David</h3>
            <p className="font-body text-sm mb-4" style={{ color: '#1D9E75' }}>
              Founder &amp; CEO, DexMetal LLC | Diego Martin, Trinidad &amp; Tobago
            </p>
            <p className="font-body text-sm leading-relaxed mb-3" style={{ color: '#a0a09a' }}>
              20+ years of Basel Convention compliance. Filed 100+ transboundary notifications across 41 countries. Every guide, tool, and workflow in this platform is grounded in real operational experience — not theory.
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
              Also founder of GreenVoltt Ltd., a physical node in the circular economy operating in the Caribbean.
            </p>
          </div>
        </section>

        {/* What We Build */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-white text-xl mb-6">
            What DexMetal Provides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
              <div className="text-2xl mb-3" style={{ color: '#1D9E75' }}>&#9776;</div>
              <h3 className="font-body font-semibold text-white text-sm mb-2">Knowledge Hub</h3>
              <p className="font-body text-xs leading-relaxed" style={{ color: '#a0a09a' }}>
                108 compliance guides covering notification documents, movement documents, PIC workflows, country requirements, and e-waste classifications.
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
              <div className="text-2xl mb-3" style={{ color: '#1D9E75' }}>&#127760;</div>
              <h3 className="font-body font-semibold text-white text-sm mb-2">Basel CA API</h3>
              <p className="font-body text-xs leading-relaxed" style={{ color: '#a0a09a' }}>
                Competent Authority contact data for 182 countries. Automate lookups and integrate compliance data directly into your workflow.
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
              <div className="text-2xl mb-3" style={{ color: '#FF5C00' }}>&#128736;</div>
              <h3 className="font-body font-semibold text-white text-sm mb-2">Compliance Tools</h3>
              <p className="font-body text-xs leading-relaxed" style={{ color: '#a0a09a' }}>
                Templates, checklists, waste code lookup tables, and shipment scheduling tools — built for practitioners.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/knowledge-hub"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-body font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#1D9E75' }}
          >
            Explore Knowledge Hub
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-body font-medium transition-all duration-200 hover:opacity-80"
            style={{ border: '2px solid #1D9E75', color: '#1D9E75' }}
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </article>
  )
}
