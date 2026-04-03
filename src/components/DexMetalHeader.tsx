import Link from 'next/link'

export function DexMetalHeader() {
  return (
    <header className="container relative z-20 border-b border-dex-border">
      <div className="py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-2xl text-dex-primary"
        >
          DexMetal
        </Link>
        <nav className="flex items-center gap-6 text-sm font-body font-medium">
          <Link href="/knowledge-hub" className="text-dex-text/80 hover:text-dex-primary transition-colors">Knowledge Hub</Link>
          <Link href="/tools" className="text-dex-text/80 hover:text-dex-primary transition-colors">Tools</Link>
          <Link href="/basel-ca-api" className="text-dex-text/80 hover:text-dex-primary transition-colors">Basel CA API</Link>
          <Link href="/blog" className="text-dex-text/80 hover:text-dex-primary transition-colors">Blog</Link>
        </nav>
      </div>
    </header>
  )
}
