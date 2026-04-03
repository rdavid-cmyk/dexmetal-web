import Link from 'next/link'

export function DexMetalFooter() {
  return (
    <footer className="mt-auto border-t" style={{ borderColor: '#3a3a38', backgroundColor: '#1C1B18' }}>
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-play)', fontWeight: 700, fontSize: '1.125rem', color: '#1D9E75' }}
        >
          DexMetal
        </Link>
        <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)', color: '#a0a09a' }}>
          <Link href="/about" style={{ color: '#a0a09a' }}>About</Link>
          <Link href="/contact" style={{ color: '#a0a09a' }}>Contact</Link>
          <Link href="/privacy-policy" style={{ color: '#a0a09a' }}>Privacy Policy</Link>
        </nav>
        <p className="text-xs" style={{ color: '#a0a09a66', fontFamily: 'var(--font-dm-sans)' }}>
          &copy; {new Date().getFullYear()} DexMetal LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
