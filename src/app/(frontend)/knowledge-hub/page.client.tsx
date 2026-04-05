import Link from 'next/link'

const SECTION_CARDS = [
  {
    icon: '📝',
    step: 'Step 1: Permission',
    title: 'Basel Export Application Form Guide (Notification Document)',
    description:
      'Block-by-block guidance for completing the Basel export application (Notification document), with tips to avoid common rejection reasons.',
    links: [
      { href: '/knowledge-hub/notification-app', label: 'Open Comprehensive Guide' },
      { href: '/tools/checklist', label: '⚡ View Quick Checklist' },
    ],
  },
  {
    icon: '🚚',
    step: 'Step 2: Logistics',
    title: 'Movement Document',
    description:
      'The “Passport” (Annex V-B). Mandatory chain-of-custody tracking for the physical shipment.',
    links: [
      { href: '/knowledge-hub/movement-doc', label: 'Open Compliance Guide' },
      { href: '/tools/movement-quick-view', label: '⚡Chain Of Custody' },
    ],
  },
  {
    icon: '📂',
    step: 'Tools',
    title: 'Supporting Docs',
    description:
      'Index of required documents including Insurance, Lab Analysis, Declarations, and Contracts.',
    links: [
      { href: '/knowledge-hub/supporting-docs', label: 'Supporting Documents' },
      { href: '/knowledge-hub/supporting-docs/document-checklist', label: '⚡Required Documents Checklist' },
    ],
  },
  {
    icon: '♻️',
    step: 'Classification',
    title: 'e-Waste Codes',
    description:
      'Understanding Y49, A1181, and B3011. Navigate the 2025 changes to Basel e-waste listings.',
    links: [
      { href: '/knowledge-hub/ewaste', label: 'View Codes & Definitions' },
      { href: '/tools/quick-code-lookup', label: '⚡ Quick Code Lookup Table' },
    ],
  },
  {
    icon: '🔄',
    step: 'Workflow',
    title: 'PIC Procedure',
    description:
      'Step-by-step timeline for the “Prior Informed Consent” mechanism and coordination.',
    links: [
      { href: '/knowledge-hub/pic', label: 'View Full Workflow' },
      { href: '/knowledge-hub/pic/regional-timelines', label: '⚡ Timeline Summary' },
    ],
  },
  {
    icon: '🌍',
    step: 'Global Rules',
    title: 'Country Requirements',
    description:
      'National variations in Basel implementation, bans, and specific waste codes.',
    links: [
      { href: '/knowledge-hub/country', label: 'View Country Profiles' },
      {
        href: 'https://www.basel.int/Countries/NationalDefinitions/ImportExportofHazardousWastes/tabid/1480/Default.aspx',
        label: '⚡ Import Ban List',
        external: true,
      },
    ],
  },
  {
    icon: '📚',
    step: 'Library',
    title: 'Additional Reference',
    description:
      'ESM criteria, transport regulations (IMDG), OECD procedures, and supplementary guidance.',
    links: [
      { href: '/knowledge-hub/reference', label: 'View Resources' },
      { href: '/knowledge-hub/reference/glossary', label: '⚡ Glossary of Terms' },
    ],
  },
] as const

function CardLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className =
    'inline-flex items-center text-sm font-medium transition-colors hover:text-white'
  const style = { color: '#1D9E75' }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style}>
      {label}
    </Link>
  )
}

export default function KnowledgeHubPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <header className="mb-10">
          <h1
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}
          >
            Basel Knowledge Hub
          </h1>
        </header>

        <div className="mb-10 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            type="search"
            aria-label="Search Basel Library"
            placeholder="Search Basel Library"
            className="w-full rounded-lg border px-4 py-3 text-white outline-none"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          />
          <button
            type="button"
            className="rounded-lg px-6 py-3 font-body font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1D9E75' }}
          >
            Search
          </button>
        </div>

        <section className="mb-10">
          <p
            className="mb-3 text-sm font-body font-medium uppercase tracking-[0.16em]"
            style={{ color: '#1D9E75' }}
          >
            What is the DexMetal Data Library?
          </p>
          <p className="max-w-4xl font-body text-base leading-8" style={{ color: '#d3d0c7' }}>
            The DexMetal Data Library is an open-source compliance engine for hazardous waste
            exporters. It provides the mandatory Basel Convention Notification forms (vCOP8), the
            Movement Document (“Passport”), and templates for required supporting documents
            (insurance, lab analysis, contracts) needed to secure international consent and avoid
            illegal traffic penalties.
          </p>
        </section>

        <section className="space-y-5">
          {SECTION_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border p-6 md:p-8"
              style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p
                    className="mb-2 text-xs font-body font-medium uppercase tracking-[0.18em]"
                    style={{ color: '#1D9E75' }}
                  >
                    {card.step}
                  </p>
                  <h2 className="mb-3 font-display text-2xl font-bold text-white">{card.title}</h2>
                  <p className="max-w-3xl font-body text-base leading-7" style={{ color: '#c3c0b8' }}>
                    {card.description}
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                    {card.links.map((link) => (
                      <CardLink key={link.label} {...link} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section
          className="mt-14 rounded-2xl border p-6 md:p-8"
          style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
        >
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            Disclaimer - Information Only, Not Legal Advice
          </h2>
          <p className="mb-4 font-body text-sm leading-7" style={{ color: '#c3c0b8' }}>
            The information on this site and in DexMetal resources is provided for general guidance
            on Basel Convention compliance and related hazardous waste rules. It does not constitute
            legal advice, does not replace official guidance from competent authorities, and may not
            reflect the most current legal or policy developments in your country.
          </p>
          <p className="font-body text-sm leading-7" style={{ color: '#c3c0b8' }}>
            Exporters, recyclers, and other users remain fully responsible for verifying
            classification, permits, contractual arrangements, and notification documents with
            their own legal counsel and the relevant competent authorities before acting on any
            information provided here. DexMetal makes no warranties, express or implied, and
            assumes no liability for actions taken or not taken based on this content.
          </p>
        </section>
      </div>
    </article>
  )
}
