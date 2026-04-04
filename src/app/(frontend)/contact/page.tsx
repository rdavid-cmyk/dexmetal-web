export const metadata = {
  title: 'Contact | DexMetal',
  description: 'Get Basel compliance help from DexMetal. Ask a question, request async consulting, or reach out directly.',
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

        {/* Async Consulting */}
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

        {/* Contact form placeholder */}
        <section className="mb-10 p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h2 className="font-display font-bold text-white text-lg mb-6">
            Submit a Question
          </h2>
          <form
            action="mailto:rdavid@gvoltt.com"
            method="get"
            className="space-y-4"
          >
            <div>
              <label className="block font-body text-sm font-medium text-white mb-1" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="body"
                type="text"
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200 focus:ring-2"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-white mb-1" htmlFor="company">
                Company / Organisation
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-white mb-1" htmlFor="question">
                Your Basel Compliance Question
              </label>
              <textarea
                id="question"
                name="subject"
                rows={5}
                placeholder="Describe your situation, the countries involved, waste type, and what you need guidance on."
                className="w-full px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200 resize-none"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-body font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#1D9E75' }}
            >
              Send Question
            </button>
          </form>
          <p className="mt-4 font-body text-xs text-center" style={{ color: '#a0a09a' }}>
            This opens your email client pre-filled. Response within 24 hours.
          </p>
        </section>

        {/* Direct contact */}
        <section className="p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h2 className="font-display font-bold text-white text-lg mb-4">
            Direct Contact
          </h2>
          <div className="space-y-3 font-body text-sm" style={{ color: '#a0a09a' }}>
            <p>
              <span className="text-white font-medium">Email:</span>{' '}
              <a href="mailto:rdavid@gvoltt.com" className="transition-colors hover:opacity-80" style={{ color: '#1D9E75' }}>
                rdavid@gvoltt.com
              </a>
            </p>
            <p>
              <span className="text-white font-medium">Location:</span> Diego Martin, Trinidad &amp; Tobago
            </p>
            <p>
              <span className="text-white font-medium">Company:</span> DexMetal LLC | GreenVoltt Ltd.
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
