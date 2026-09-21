import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'How DexMetal Works',
  description:
    'A real, step-by-step walkthrough of the Basel Classification QuickScan tool -- see exactly what you get before you start.',
}

const steps = [
  {
    n: 1,
    img: '/images/guides/quickscan/step-1.png',
    title: 'Start with what you\'re shipping',
    body: "Open the free QuickScan tool. First question: what kind of material is it? (Batteries, mixed e-waste, plastics from e-waste, etc.)",
  },
  {
    n: 2,
    img: '/images/guides/quickscan/step-2.png',
    title: 'Tell it the condition',
    body: 'Functional, damaged, mixed, or scrap/end-of-life. This is what actually decides the waste code -- not the material name alone.',
  },
  {
    n: 3,
    img: '/images/guides/quickscan/step-3.png',
    title: 'Say what happens to it next',
    body: 'Recycling/recovery, or disposal. Three questions total -- no account, no email required to get this far.',
  },
  {
    n: 4,
    img: '/images/guides/quickscan/step-4.png',
    title: 'Get the real answer',
    body: 'The tool returns the actual Basel classification -- Annex, waste code, hazard status, and whether Prior Informed Consent is required for this exact combination.',
  },
]

export default function HowItWorksPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-14">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#1D9E75' }}>
            How it works
          </p>
          <h1 className="font-display font-bold text-white mb-6" style={{ fontSize: '2.75rem', lineHeight: 1.15 }}>
            See it before you use it
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-2xl" style={{ color: '#a0a09a' }}>
            These are real screenshots of the actual tool, not a mockup. This is what happens when you run the Basel Classification QuickScan -- the same tool a freight forwarder or compliance officer uses to check a shipment before it moves.
          </p>
        </div>

        {steps.map((s) => (
          <section
            key={s.n}
            className="rounded-xl p-6 mb-8"
            style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex items-center justify-center font-display font-bold text-sm rounded-full"
                style={{ width: 28, height: 28, backgroundColor: '#1D9E75', color: '#ffffff' }}
              >
                {s.n}
              </span>
              <h2 className="font-display font-bold text-white text-xl">{s.title}</h2>
            </div>
            <p className="font-body leading-relaxed mb-5" style={{ color: '#a0a09a' }}>
              {s.body}
            </p>
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#3a3a37' }}>
              <Image src={s.img} alt={s.title} width={1280} height={900} className="w-full h-auto" />
            </div>
          </section>
        ))}

        <section
          className="rounded-xl p-8 mt-10"
          style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}
        >
          <h2 className="font-display font-bold text-white text-xl mb-3">Try it on your own shipment</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Free, no account, three questions.
          </p>
          <Link
            href="/tools/basel-classification-quickscan"
            className="inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
          >
            Open QuickScan →
          </Link>
        </section>

        <div className="border-t pt-8 mt-10 flex flex-wrap gap-4" style={{ borderColor: '#3a3a37' }}>
          <Link href="/tools" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            See all free tools
          </Link>
        </div>
      </div>
    </article>
  )
}
