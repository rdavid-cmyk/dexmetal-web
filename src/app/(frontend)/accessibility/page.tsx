import Link from 'next/link'

export const metadata = {
  title: 'Accessibility | DexMetal',
  description: 'DexMetal accessibility statement and contact path for website accessibility issues.',
}

export default function AccessibilityPage() {
  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
          Accessibility
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Accessibility Statement</h1>
        <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
          Last updated: May 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-base leading-8" style={{ color: '#d8d4cc' }}>
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Our Commitment</h2>
            <p>
              DexMetal aims to make dexmetal.com usable by as many people as possible, including
              users who rely on keyboard navigation, screen readers, zoom, high-contrast settings,
              or assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Current Practices</h2>
            <p>
              We work to use semantic page structure, descriptive links, readable contrast,
              responsive layouts, and accessible form labels where practical. As the site evolves,
              we expect to keep improving the experience.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Feedback</h2>
            <p>
              If you encounter an accessibility barrier, please contact us through the{' '}
              <Link href="/contact" className="font-medium" style={{ color: '#1D9E75' }}>
                contact page
              </Link>{' '}
              and include the page URL, the issue, and the assistive technology or browser you are
              using if relevant.
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
