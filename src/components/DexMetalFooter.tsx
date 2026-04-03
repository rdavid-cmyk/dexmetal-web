import Link from 'next/link'

export function DexMetalFooter() {
  return (
    <footer className="mt-auto border-t border-dex-border bg-dex-bg">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display font-bold text-lg text-dex-primary"
        >
          DexMetal
        </Link>
        <nav className="flex items-center gap-6 text-sm font-body text-dex-muted">
          <Link href="/about" className="text-dex-muted hover:text-dex-primary transition-colors">About</Link>
          <Link href="/contact" className="text-dex-muted hover:text-dex-primary transition-colors">Contact</Link>
          <Link href="/privacy-policy" className="text-dex-muted hover:text-dex-primary transition-colors">Privacy Policy</Link>
        </nav>
        <p className="text-xs font-body text-dex-muted/40">
          &copy; {new Date().getFullYear()} DexMetal LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
