import Link from 'next/link'

export const metadata = {
  title: 'Legal | DexMetal',
  description:
    'Legal notices, informational-use disclaimer, and terms for using DexMetal content and tools.',
}

export default function LegalPage() {
  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
          Legal
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Legal Notice and Terms of Use</h1>
        <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
          Last updated: May 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-base leading-8" style={{ color: '#d8d4cc' }}>
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Information Only</h2>
            <p>
              DexMetal content, tools, checklists, examples, and API outputs are provided for
              general information and workflow support. They are not legal advice, customs advice,
              environmental permitting advice, or a substitute for instructions from the competent
              authorities involved in a shipment.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">No Professional Relationship</h2>
            <p>
              Use of dexmetal.com does not create an attorney-client, consultant-client, broker,
              agency, fiduciary, or other professional relationship with DexMetal LLC. Any paid or
              formal engagement must be agreed separately in writing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">User Responsibility</h2>
            <p>
              You are responsible for verifying waste classifications, national controls,
              notification requirements, consent conditions, permits, contracts, insurance,
              packaging, transport, and documentation with qualified professionals and the relevant
              authorities before moving any material.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Tool Outputs</h2>
            <p>
              Tool results may be incomplete, outdated, jurisdiction-specific, or dependent on the
              facts you provide. They should be treated as screening support, not a final legal or
              regulatory determination.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">External Links</h2>
            <p>
              DexMetal may link to external websites, regulatory sources, APIs, payment processors,
              or third-party services. We are not responsible for their content, security, privacy
              practices, or availability.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Intellectual Property</h2>
            <p>
              Unless otherwise stated, DexMetal content, page design, tool logic, and written
              materials are owned by DexMetal LLC or used with permission. You may link to public
              pages, but you may not copy, resell, or repackage substantial portions without written
              permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">Contact</h2>
            <p>
              For questions about these terms, contact DexMetal through the{' '}
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
