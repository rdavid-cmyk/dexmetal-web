import AssetGate from '@/components/AssetGate'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eWaste Trade Compliance: Operator’s Playbook | DexMetal',
  description: 'Free 45-card practitioner\'s guide to Basel Convention compliance, eWaste trade, and the circular economy. Download now.',
  openGraph: {
    title: 'eWaste Trade Compliance: Operator\'s Playbook',
    description: 'Free 45-card practitioner\'s guide to Basel Convention compliance, eWaste trade, and the circular economy.',
    type: 'website',
  },
}

export default function PlaybookPage() {
  return (
    <article className="bg-[#0a0a0a] text-white min-h-screen w-full">
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-12 md:py-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
            Free Download
          </p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
            eWaste Trade Compliance: Operator&apos;s Playbook
          </h1>
          <p className="mt-4 text-lg md:text-xl" style={{ color: '#cbc7be' }}>
            A 45-card practitioner&apos;s guide to Basel Convention compliance, eWaste trade, and the circular economy.
          </p>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-8 md:py-12">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border" style={{ borderColor: '#3a3a38', backgroundColor: '#1C1B18' }}>
            <iframe src='https://gamma.app/embed/7vf94ssfm3gi8um' style={{ width: '100%', height: '700px', border: 'none', borderRadius: '8px' }} allow='fullscreen' title="eWaste Trade Compliance : Operator's Playbook" />
          </div>
        </div>
      </section>

      <AssetGate
        source="asset01"
        assetTitle="eWaste Trade Compliance: Operator's Playbook"
        assetDescription="Free — 45-card practitioner's guide to Basel Convention compliance, eWaste trade, and the circular economy."
        ctaButtonText="Download Free Playbook"
      />
    </article>
  )
}
