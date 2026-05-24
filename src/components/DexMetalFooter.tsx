import Link from 'next/link'

const legalLinks = [
  { href: '/legal', label: 'Legal' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/security', label: 'Security' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/contact', label: 'Contact' },
] as const

export function DexMetalFooter() {
  return (
    <footer className="mt-auto border-t bg-[#151512]" style={{ borderColor: '#3a3a38' }}>
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <Link
              href="/"
              className="font-display text-xl font-bold"
              style={{ color: '#1D9E75' }}
            >
              DexMetal
            </Link>
            <p className="mt-3 max-w-lg font-body text-sm leading-6" style={{ color: '#a0a09a' }}>
              Basel Convention compliance tools and field guidance for circular trade in e-waste,
              metals, and reusable components.
            </p>
            <p className="mt-4 font-body text-xs leading-5" style={{ color: '#77736b' }}>
              DexMetal content and tools are for general information and workflow support only.
              They are not legal advice and do not replace review by a qualified professional or
              the competent authority responsible for a shipment.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-3 font-body text-sm"
          >
            <Link href="/about" className="text-dex-muted hover:text-dex-primary transition-colors">
              About
            </Link>
            <Link href="/knowledge-hub" className="text-dex-muted hover:text-dex-primary transition-colors">
              Knowledge Hub
            </Link>
            <Link href="/tools" className="text-dex-muted hover:text-dex-primary transition-colors">
              Tools
            </Link>
            <a
              href="https://smithery.ai/servers/rdavid/basel-ca-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dex-muted hover:text-dex-primary transition-colors"
            >
              Basel CA MCP
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t pt-6 md:flex-row md:items-center md:justify-between" style={{ borderColor: '#2c2c2a' }}>
          <p className="font-body text-xs" style={{ color: '#77736b' }}>
            &copy; {new Date().getFullYear()} DexMetal LLC. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-6 gap-y-3 font-body text-sm font-medium"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b transition-colors"
                style={{ borderColor: '#a0a09a', color: '#d8d4cc' }}
              >
                {link.label}
              </Link>
            ))}
        </nav>
        </div>
      </div>
    </footer>
  )
}
