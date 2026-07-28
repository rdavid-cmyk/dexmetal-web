import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid #3a3a38', paddingTop: '16px', marginTop: '0' }}>
        <p style={{ fontSize: '14px', color: '#a0a09a', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
          DexMetal tools are free.
        </p>
        <Link
          href="/services"
          style={{
            padding: '8px 16px',
            backgroundColor: '#1D9E75',
            color: '#ffffff',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
            textDecoration: 'none',
            fontWeight: 500,
            display: 'inline-block',
          }}
        >
          View Services
        </Link>
      </div>
    </footer>
  )
}
