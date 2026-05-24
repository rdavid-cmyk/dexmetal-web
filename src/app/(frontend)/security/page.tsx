import Link from 'next/link'

export const metadata = {
  title: 'Security | DexMetal',
  description: 'DexMetal security practices and responsible reporting contact path.',
}

export default function SecurityPage() {
  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
          Security
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Security</h1>
        <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
          Last updated: May 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-base leading-8" style={{ color: '#d8d4cc' }}>
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Security Practices</h2>
            <p>
              DexMetal uses reasonable safeguards to protect the website, data submitted through
              forms, and operational systems. These safeguards may include encrypted transport,
              access controls, limited administrative access, logging, backups, and monitoring.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Sensitive Information</h2>
            <p>
              Please do not submit passwords, payment card numbers, confidential trade secrets, or
              highly sensitive shipment documents through open website forms. If a request requires
              sensitive information, contact DexMetal first so an appropriate handling method can be
              agreed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Responsible Reporting</h2>
            <p>
              If you believe you have found a security issue, please report it through the{' '}
              <Link href="/contact" className="font-medium" style={{ color: '#1D9E75' }}>
                contact page
              </Link>
              . Include enough detail to reproduce the issue, and do not access, modify, delete, or
              disclose data that is not yours.
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
