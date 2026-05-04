import Link from 'next/link'

const menuClassName =
  'rounded-2xl border px-3 py-3 shadow-2xl shadow-black/20'

export function DexMetalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-dex-border bg-dex-bg/90 backdrop-blur">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-dex-primary">
            DexMetal
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-body font-medium md:flex">
            <Link href="/tools" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Tools
            </Link>
            <Link href="/knowledge-hub" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Knowledge Hub
            </Link>
            <Link href="/blog" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Blog
            </Link>
            <Link href="/basel-ca-api" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              API
            </Link>
          </nav>

          <Link
            href="/playbook"
            className="hidden rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 md:inline-flex"
            style={{ backgroundColor: '#FF5C00' }}
          >
            Get the Free Playbook
          </Link>
        </div>

        <nav className="mt-4 flex flex-wrap gap-3 text-xs font-body font-medium md:hidden">
          <Link href="/tools" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Tools
          </Link>
          <Link href="/knowledge-hub" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Knowledge Hub
          </Link>
          <Link href="/blog" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Blog
          </Link>
          <Link href="/basel-ca-api" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            API
          </Link>
          <Link
            href="/playbook"
            className="rounded-full px-3 py-2 text-xs font-medium text-white"
            style={{ backgroundColor: '#FF5C00' }}
          >
            Get the Free Playbook
          </Link>
        </nav>
      </div>
    </header>
  )
}
