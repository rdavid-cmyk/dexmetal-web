import type { Metadata } from 'next'
import { regulatoryEvents } from '@/data/regulatory-radar'
import Link from 'next/link'
import { RegulatoryFilterBar } from './filter-client'

export const metadata: Metadata = {
  title: 'Basel Regulatory Radar | DexMetal',
  description:
    'Track COP decisions, Ban Amendment updates, and Basel listing changes affecting cross-border e-waste and hazardous waste operations.',
  alternates: { canonical: 'https://dexmetal.com/regulatory-radar' },
  openGraph: {
    title: 'Basel Regulatory Radar — DexMetal',
    description:
      'COP decisions, Ban Amendment enforcement, and listing changes — filtered for operators managing transboundary hazardous waste.',
    url: 'https://dexmetal.com/regulatory-radar',
    siteName: 'DexMetal',
  },
}

export default function RegulatoryRadarPage() {
  return (
    <article className="bg-dex-bg text-white min-h-screen">
      {/* Hero */}
      <section className="border-b border-[#2f2f2b] bg-[#0f0f0d]">
        <div className="container py-14 md:py-20">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.22em]"
            style={{ color: '#1D9E75' }}
          >
            Regulatory Intelligence
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Basel Regulatory Radar
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: '#cbc7be' }}>
            Track COP decisions, Ban Amendment updates, and listing changes that affect
            cross-border hazardous waste operations. Updated as events occur.
          </p>
        </div>
      </section>

      {/* Filter bar + event cards */}
      <section className="container py-12 md:py-16">
        <RegulatoryFilterBar events={regulatoryEvents} />
      </section>

      {/* CTA banner */}
      <section className="border-t border-[#2f2f2b]">
        <div className="container py-14 md:py-16">
          <div
            className="flex flex-col items-center gap-5 rounded-[2rem] border px-6 py-10 text-center md:flex-row md:justify-between md:px-10 md:text-left"
            style={{ backgroundColor: '#1a2e27', borderColor: '#1D9E75' }}
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Need help navigating a specific regulatory change?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: '#a8c4bb' }}>
                Our compliance practitioners track Basel developments and can tell you exactly
                what any update means for your shipments.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1D9E75' }}
            >
              Ask a question →
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
