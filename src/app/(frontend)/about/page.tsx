import Link from 'next/link'

export const metadata = {
  title: { absolute: 'About DexMetal | Basel Convention Compliance Experts' },
  description:
    'DexMetal is the only Basel Convention compliance platform built by operators with 20+ years of Caribbean hazardous waste management experience.',
}

const PILLARS = [
  {
    title: 'Basel Compliance',
    description: 'Real-world application guidance',
  },
  {
    title: 'Circular Economy',
    description: 'Profit-focused reuse strategies',
  },
  {
    title: 'Trade Intelligence',
    description: 'Cross-border market insights',
  },
  {
    title: 'Risk Management',
    description: 'Avoiding costly mistakes',
  },
] as const

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em]" style={{ color: '#1D9E75' }}>
            Navigate Compliance
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Navigate compliance with confidence using our field-tested insights and practical
            guidance.
          </h1>
          <blockquote
            className="mt-10 max-w-4xl rounded-[2rem] border px-6 py-8 text-lg leading-8 md:px-8"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38', color: '#d4d0c7' }}
          >
            &ldquo;At DexMetal we strive to approach compliance with practical wisdom, that supports
            real businesses, and respect the complexity of international regulations. We believe in
            sharing knowledge that makes a positive difference in how companies handle their
            responsibilities.
            <br />
            <br />
            Every compliance challenge, from the straightforward applications to the unexpected
            complications, teaches us something new about the process and the industry. We are
            constantly learning and refining our understanding through hands-on experience.&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
              Core Pillars
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Four pillars behind every DexMetal guide, tool, and workflow
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.title}
                className="rounded-3xl border p-6"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ backgroundColor: index % 2 === 0 ? '#1D9E75' : '#FF5C00' }}
                >
                  {index + 1}
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{pillar.title}</h3>
                <p className="text-sm leading-7" style={{ color: '#cbc7be' }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Trade Smarter
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Trade intelligence for the circular economy
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8" style={{ color: '#cbc7be' }}>
              <p>
                Through practical insights spanning Basel Convention requirements, right-to-repair
                principles, and profitable reuse strategies, we help operators turn waste streams
                into revenue streams while staying compliant across borders.
              </p>
              <p>
                Whether you&rsquo;re handling your first Basel notification, working with complex
                waste classifications, or navigating multi-country requirements, DexMetal provides
                the insider knowledge needed for stronger submissions and cleaner execution.
              </p>
              <p>
                We share decades of hands-on experience in e-waste trading, repair economics, and
                sustainable export strategy so good operations can scale with fewer expensive
                surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16 md:py-20">
          <div
            className="rounded-[2rem] border px-6 py-10 md:px-10"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          >
            <h2 className="max-w-3xl font-display text-3xl font-bold text-white md:text-4xl">
              Build your next Basel workflow with practical guidance instead of guesswork
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: '#cbc7be' }}>
              Explore the Knowledge Hub, get the checklist, or contact DexMetal if you need help
              navigating a specific export path, country requirement, or documentation risk.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/knowledge-hub"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: '#1D9E75' }}
              >
                Explore Knowledge Hub
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                Contact DexMetal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
