import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | DexMetal',
  description:
    'How DexMetal LLC collects, uses, protects, and shares information submitted through dexmetal.com.',
}

export default function PrivacyPolicyPage() {
  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
          Privacy Policy
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
          Last updated: May 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-base leading-8" style={{ color: '#d8d4cc' }}>
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Who We Are</h2>
            <p>
              DexMetal LLC operates dexmetal.com and provides Basel Convention compliance
              information, tools, and workflow support for e-waste, metals, reusable components,
              and related circular trade activity.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Information We Collect</h2>
            <p>
              We may collect information you submit through forms, email links, downloadable
              resources, tool inputs, newsletter or checklist requests, and direct communication.
              This may include your name, email address, company, country, shipment context, waste
              or product descriptions, and the question or request you send to us.
            </p>
            <p className="mt-4">
              We may also collect basic technical information such as browser type, device data,
              pages viewed, referral source, IP address, and approximate location for security,
              analytics, troubleshooting, and site improvement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">How We Use Information</h2>
            <p>
              We use information to respond to questions, provide requested resources, improve our
              tools and content, protect the site, measure audience interest, maintain records of
              user requests, and develop DexMetal services. We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Cookies and Third Parties</h2>
            <p>
              DexMetal may use cookies or similar technologies for site functionality, analytics,
              security, and performance. Third-party services such as hosting providers, email
              services, payment or donation processors, analytics tools, embedded media, and API
              providers may process information under their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Compliance and Shipment Information</h2>
            <p>
              If you submit shipment, waste classification, competent authority, or notification
              details, do not include confidential business information unless necessary for your
              request. DexMetal tools are for information and workflow support only. They do not
              replace legal advice, regulator instructions, or competent authority determinations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Retention and Security</h2>
            <p>
              We keep information only as long as reasonably needed for the purposes described in
              this policy, business records, security, legal compliance, or dispute prevention. We
              use reasonable technical and organizational safeguards, but no website or internet
              transmission is guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Your Choices</h2>
            <p>
              You may request access, correction, deletion, or limitation of personal information
              you have provided, subject to legal and operational limits. You may also unsubscribe
              from marketing communications where an unsubscribe option is provided.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Contact</h2>
            <p>
              Questions about this policy can be sent through the{' '}
              <Link href="/contact" className="font-medium" style={{ color: '#1D9E75' }}>
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
