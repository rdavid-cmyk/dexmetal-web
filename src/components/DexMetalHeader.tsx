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
            <Link href="/" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Home
            </Link>
            <Link href="/blog" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Blog
            </Link>

            <div className="group relative">
              <button className="text-dex-text/80 transition-colors group-hover:text-dex-primary">
                Services
              </button>
              <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className={menuClassName} style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}>
                  <Link
                    href="/basel-ca-api"
                    className="block whitespace-nowrap rounded-xl px-3 py-2 text-dex-text/80 transition-colors hover:bg-black/10 hover:text-dex-primary"
                  >
                    Basel CA API
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative">
              <button className="text-dex-text/80 transition-colors group-hover:text-dex-primary">
                Resources
              </button>
              <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className={menuClassName} style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}>
                  <Link
                    href="/checklist"
                    className="block whitespace-nowrap rounded-xl px-3 py-2 text-dex-text/80 transition-colors hover:bg-black/10 hover:text-dex-primary"
                  >
                    Basel Checklist
                  </Link>
                  <Link
                    href="/knowledge-hub"
                    className="block whitespace-nowrap rounded-xl px-3 py-2 text-dex-text/80 transition-colors hover:bg-black/10 hover:text-dex-primary"
                  >
                    Knowledge Hub
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/tools" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Tools
            </Link>
            <Link href="/playbook" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Playbook
            </Link>
            <Link href="/about" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              About
            </Link>
            <Link href="/contact" className="text-dex-text/80 transition-colors hover:text-dex-primary">
              Contact
            </Link>
          </nav>

          <Link
            href="/checklist"
            className="hidden rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 md:inline-flex"
            style={{ backgroundColor: '#1D9E75' }}
          >
            Get the Checklist
          </Link>
        </div>

        <nav className="mt-4 flex flex-wrap gap-3 text-xs font-body font-medium md:hidden">
          <Link href="/" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Home
          </Link>
          <Link href="/blog" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Blog
          </Link>
          <Link href="/basel-ca-api" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Basel CA API
          </Link>
          <Link href="/checklist" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Basel Checklist
          </Link>
          <Link href="/knowledge-hub" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Knowledge Hub
          </Link>
          <Link href="/tools" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Tools
          </Link>
          <Link href="/playbook" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Playbook
          </Link>
          <Link href="/about" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            About
          </Link>
          <Link href="/contact" className="rounded-full border px-3 py-2 text-dex-text/80" style={{ borderColor: '#3a3a38' }}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
