import type { Metadata } from 'next'
import Link from 'next/link'
import ShipmentRouteCheckForm from './ShipmentRouteCheckForm'

export const metadata: Metadata = {
  title: '$99 Shipment Route Check | DexMetal',
  description: 'A human-verified one-page Basel route check using DexMetal’s existing classification, shipment eligibility, PIC and route-risk engines, then checked against current primary sources.',
  alternates: { canonical: 'https://dexmetal.com/services/shipment-route-check' },
}

export default function ShipmentRouteCheckPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-4">
          <Link href="/services" className="font-body text-sm hover:opacity-80" style={{ color: '#1D9E75' }}>← All Services</Link>
        </div>

        <div className="mb-10">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Shipment Route Check</p>
          <h1 className="mb-4 font-display font-bold text-white" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>$99 Shipment Route Check</h1>
          <p className="mb-5 font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Give us the route and material facts. DexMetal runs the shipment through the existing classification, eligibility, PIC and route-risk engines, then a human verifies the result against current primary sources before a one-page report is issued.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Classification', 'Route eligibility', 'PIC status', 'Transit flags', 'Primary-source verification'].map((x) => (
              <span key={x} className="rounded-full px-3 py-1 font-body text-xs" style={{ backgroundColor: '#2c2c2a', color: '#c0c0ba' }}>{x}</span>
            ))}
          </div>
        </div>
        <section className="mb-8 rounded-xl p-7" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="mb-4 font-display text-xl font-bold text-white">What you receive</h2>
          <ul className="space-y-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
            <li>✓ Shipment snapshot: waste/material, origin, destination, intended operation and transit route.</li>
            <li>✓ Likely Basel classification and whether the route is controlled, restricted or requires further verification.</li>
            <li>✓ Prior Informed Consent (PIC) pathway and transit-country flags.</li>
            <li>✓ Competent-authority / national-rule checks that materially affect the route.</li>
            <li>✓ Current primary sources and a short next-action list.</li>
          </ul>
          <p className="mt-5 font-body text-xs leading-relaxed" style={{ color: '#77736b' }}>
            This is a route-screening product, not legal advice, a permit, or a guarantee that a shipment will be approved. Competent authorities and applicable national law control the final decision.
          </p>
        </section>

        <section className="mb-8 rounded-xl p-6" style={{ backgroundColor: '#111310', borderLeft: '3px solid #1D9E75' }}>
          <h2 className="mb-2 font-display font-bold text-white">Verification rule</h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
            Engine output is never delivered by itself. A human must check current Basel Convention sources and the relevant export, import and transit authority sources first. Where current law or official guidance is unclear, the report says so instead of guessing.
          </p>
        </section>

        <ShipmentRouteCheckForm />
      </div>
    </article>
  )
}
