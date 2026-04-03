import Link from 'next/link'

export function DexMetalHeader() {
  return (
    <header className="container relative z-20 border-b" style={{ borderColor: '#3a3a38' }}>
      <div className="py-4 flex items-center justify-between">
        <Link href="/" style={{ fontFamily: 'var(--font-play)', fontWeight: 700, fontSize: '1.5rem', color: '#1D9E75' }}>
          DexMetal
        </Link>
        <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>
          <Link href="/knowledge-hub" style={{ color: '#ffffffcc' }}>Knowledge Hub</Link>
          <Link href="/tools" style={{ color: '#ffffffcc' }}>Tools</Link>
          <Link href="/basel-ca-api" style={{ color: '#ffffffcc' }}>Basel CA API</Link>
          <Link href="/blog" style={{ color: '#ffffffcc' }}>Blog</Link>
        </nav>
      </div>
    </header>
  )
}
