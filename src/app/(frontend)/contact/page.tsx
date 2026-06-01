import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact | DexMetal',
  description: 'Get Basel compliance help from DexMetal. Ask a question, request async consulting, or reach out directly.',
  alternates: { canonical: 'https://dexmetal.com/contact' },
  openGraph: {
    title: 'Contact DexMetal — Basel Compliance Consulting',
    description: 'Submit a Basel compliance question. Practitioner-drafted response within 24 hours.',
    url: 'https://dexmetal.com/contact',
    siteName: 'DexMetal',
  },
}

export default function ContactPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.75rem' }}>
            Contact DexMetal
          </h1>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Basel compliance question? Need guidance on a specific notification, country, or waste code? We can help.
          </p>
        </div>

        <section className="mb-10 p-6 rounded-xl border-l-4" style={{ backgroundColor: '#2c2c2a', borderLeftColor: '#FF5C00' }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#FF5C00', fontSize: '1.25rem' }}>&#9889;</span>
            <h2 className="font-display font-bold text-white text-lg">
              Async Consulting — Free to Start
            </h2>
          </div>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: '#a0a09a' }}>
            Submit your question. A practitioner-drafted response — grounded in 20+ years of operational Basel compliance experience — delivered to your inbox within 24 hours. No commitment, no billing until demand is proven.
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
            This covers notification questions, movement document issues, PIC workflow guidance, country-specific requirements, waste code classification, and more.
          </p>
        </section>

        <ContactForm />

        <section className="p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h2 className="font-display font-bold text-white text-lg mb-4">Direct Contact</h2>
          <div className="space-y-3 font-body text-sm" style={{ color: '#a0a09a' }}>
            <p>
              <span className="text-white font-medium">Email:</span>{' '}
              <a href="mailto:info@dexmetal.com" className="transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
                info@dexmetal.com
              </a>
            </p>
            <p>
              <span className="text-white font-medium">Company:</span> DexMetal LLC
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
