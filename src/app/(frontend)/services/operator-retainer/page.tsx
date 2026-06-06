import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basel Operator Retainer | DexMetal',
  description: 'Ongoing async Basel compliance support for active operators. Unlimited questions, quarterly lane reviews, notification file checks, and 24-hour response. $1,200/month.',
  alternates: { canonical: 'https://dexmetal.com/services/operator-retainer' },
  openGraph: {
    title: 'Basel Operator Retainer — DexMetal',
    description: 'Monthly Basel compliance support: unlimited async questions, quarterly lane reviews, 2 notification file checks per month, and 24-hour response window.',
    url: 'https://dexmetal.com/services/operator-retainer',
    siteName: 'DexMetal',
  },
}

export default function OperatorRetainerPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-4">
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
            ← All Services
          </Link>
        </div>

        <div className="mb-10">
          <p className="font-body text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF5C00' }}>
            Service 06 — Most Popular
          </p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
            Operator Retainer
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-display font-bold text-white text-3xl">$1,200<span className="text-xl font-body font-normal" style={{ color: '#a0a09a' }}>/month</span></span>
            <span className="font-body text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}>24-hour response window</span>
          </div>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Ongoing async support for active operators. Unlimited compliance questions, quarterly lane reviews, notification file checks, and first access to new DexMetal tools and research. Built for teams moving regular volumes who need a practitioner on call without the overhead of a full-time hire.
          </p>
        </div>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">What is included every month</h2>
          <ul className="space-y-3">
            {[
              'Unlimited async Basel compliance questions — no per-question billing',
              'Quarterly trade lane review for your active routes',
              'Notification file reviews — up to 2 per month',
              'Priority 24-hour response window on all submissions',
              'Early access to new DexMetal tools and compliance resources',
              'Monthly Basel regulatory update summary — COP decisions, listing changes, and enforcement notices',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
                <span style={{ color: '#1D9E75', marginTop: '2px', flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">Who this is for</h2>
          <p className="font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Operators managing regular cross-border hazardous waste shipments who encounter recurring compliance questions — classification edge cases, new destination requirements, CA changes, or regulatory updates that affect active lanes. The retainer replaces the cost of multiple one-off engagements and gives you a practitioner available throughout the month.
          </p>
        </section>

        <section className="rounded-xl p-7 mb-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
          <h2 className="font-display font-bold text-white text-xl mb-4">How the retainer works</h2>
          <ol className="space-y-4">
            {[
              { step: '1.', text: 'You submit questions, file reviews, or lane checks via a dedicated async channel.' },
              { step: '2.', text: 'We respond in writing within 24 hours — every response is a document you own and can act on.' },
              { step: '3.', text: 'At the end of each quarter we review your active lanes and flag any regulatory changes that affect them.' },
              { step: '4.', text: 'Month-to-month — no annual commitment required.' },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-3 font-body text-sm" style={{ color: '#c0c0ba' }}>
                <span className="font-bold shrink-0" style={{ color: '#FF5C00' }}>{item.step}</span>
                {item.text}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl p-7 mb-10" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
          <h2 className="font-display font-bold text-white text-xl mb-3">Start the retainer</h2>
          <p className="font-body mb-5" style={{ color: '#a8c4bb' }}>
            Tell us about your current operations — what you move, where, and what compliance questions come up most often. We will confirm fit and onboarding steps within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
          >
            Enquire about the retainer →
          </Link>
        </section>

        <div className="border-t pt-8 flex flex-wrap gap-4" style={{ borderColor: '#3a3a37' }}>
          <Link href="/services/waste-classification-audit" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
            ← Back to Service 01
          </Link>
          <Link href="/services" className="font-body text-sm transition-colors hover:opacity-80" style={{ color: '#8f8d86' }}>
            View all services
          </Link>
        </div>

      </div>
    </article>
  )
}
