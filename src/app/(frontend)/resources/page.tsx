import Link from 'next/link'

export const metadata = {
  title: 'Free Resources — DexMetal',
  description:
    'Everything you need to navigate Basel compliance — free, field-tested, and ready to use.',
}

const resources = [
  {
    title: "Operator's Playbook",
    description:
      '45-card field guide covering notification documents, waste codes, PIC procedure, and country requirements.',
    href: '/playbook',
    badge: 'Free Download',
    accent: '#FF5C00',
  },
  {
    title: 'Basel Navigator',
    description:
      'Generate Basel Convention notification and movement documents step by step.',
    href: '/tools/basel-navigator',
    badge: 'Free Tool',
    accent: '#1D9E75',
  },
  {
    title: 'Compliance Checklist',
    description:
      'Export-prep checklist for e-waste shipments, notification forms, and movement document readiness.',
    href: '/checklist',
    badge: 'Free Checklist',
    accent: '#1D9E75',
  },
  {
    title: 'Knowledge Hub',
    description:
      '67+ pages of field-tested guidance covering every stage of Basel compliance.',
    href: '/knowledge-hub',
    badge: 'Free Reference',
    accent: '#1D9E75',
  },
  {
    title: 'Compliance Tools',
    description:
      'Seven free tools — shipment eligibility, PIC status, waste classification, ULAB calculator, and more.',
    href: '/tools',
    badge: 'Free Tools',
    accent: '#1D9E75',
  },
  {
    title: 'Basel CA API',
    description:
      'Verified competent authority contacts for 182 countries. Free API key in 30 seconds.',
    href: '/basel-ca-api',
    badge: 'Free API',
    accent: '#FF5C00',
  },
  {
    title: 'Regulatory Radar',
    description:
      'Track COP decisions, Ban Amendment updates, and Basel listing changes affecting cross-border hazardous waste operations.',
    href: '/regulatory-radar',
    badge: 'Free Intelligence',
    accent: '#1D9E75',
  },
  {
    title: 'Changelog',
    description:
      'New tools, platform improvements, and fixes shipped to dexmetal.com — updated with every release.',
    href: '/changelog',
    badge: 'Platform Updates',
    accent: '#1D9E75',
  },
]

export default function ResourcesPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: '2.75rem' }}>
            Free Resources
          </h1>
          <p className="font-body text-lg" style={{ color: '#a0a09a' }}>
            Everything you need to navigate Basel compliance — free, field-tested, and ready to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: '#2c2c2a', borderLeftColor: resource.accent }}
            >
              <span
                className="inline-block mb-3 text-xs font-body font-semibold uppercase tracking-widest px-2 py-1 rounded"
                style={{ backgroundColor: resource.accent + '22', color: resource.accent }}
              >
                {resource.badge}
              </span>
              <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
                {resource.title}
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
                {resource.description}
              </p>
              <span
                className="inline-block mt-3 text-xs font-body font-medium uppercase tracking-wide"
                style={{ color: resource.accent }}
              >
                View resource →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a38' }}>
          <p className="font-body text-sm" style={{ color: '#a0a09a' }}>
            All resources are free to use.{' '}
            <Link href="/playbook" className="transition-colors hover:opacity-80" style={{ color: '#FF5C00' }}>
              Get the Operator&apos;s Playbook →
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
