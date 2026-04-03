import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-dex-bg px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-display font-bold text-white mb-6 leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
          >
            Bridging Circular Economy and Basel Convention Compliance
          </h1>
          <p
            className="font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: '#a0a09a', lineHeight: '1.7' }}
          >
            The compliance intelligence platform for hazardous waste exporters. Built on 20 years of operational experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/knowledge-hub"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-body font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#1D9E75' }}
            >
              Explore Knowledge Hub
            </Link>
            <Link
              href="/basel-ca-api"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-body font-medium transition-all duration-200 hover:opacity-80"
              style={{ border: '2px solid #1D9E75', color: '#1D9E75' }}
            >
              Access Basel CA API
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" style={{ backgroundColor: '#2c2c2a' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: '#1C1B18' }}
          >
            <div className="text-3xl mb-4" style={{ color: '#1D9E75' }}>
              &#9776;
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-3">
              Basel Knowledge Hub
            </h2>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
              106 compliance guides covering notification documents, movement documents, PIC workflows, country requirements, and e-waste classifications. Free access.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: '#1C1B18' }}
          >
            <div className="text-3xl mb-4" style={{ color: '#1D9E75' }}>
              &#127760;
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-3">
              Basel CA API
            </h2>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
              Competent Authority contact data for 182 countries. Automate your lookups and integrate compliance data directly into your workflow.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: '#1C1B18' }}
          >
            <div className="text-3xl mb-4" style={{ color: '#1D9E75' }}>
              &#128736;
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-3">
              Compliance Tools
            </h2>
            <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
              Templates, checklists, and workflow guides. Quick-view document checklists, waste code lookup tables, and shipment scheduling tools.
            </p>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="py-12 px-4 bg-dex-bg">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-body text-sm" style={{ color: '#a0a09a' }}>
          <span>20+ Years Experience</span>
          <span style={{ color: '#1D9E75' }}>&middot;</span>
          <span>106 Compliance Guides</span>
          <span style={{ color: '#1D9E75' }}>&middot;</span>
          <span>182 Countries Covered</span>
          <span style={{ color: '#1D9E75' }}>&middot;</span>
          <span>Built by practitioners</span>
        </div>
      </section>
    </>
  )
}
