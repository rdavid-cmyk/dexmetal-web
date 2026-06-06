import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Play, DM_Sans } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { DexMetalHeader } from '@/components/DexMetalHeader'
import { DexMetalFooter } from '@/components/DexMetalFooter'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'

import './globals.css'
import { DexMetalAgent } from '@/components/DexMetalAgent'
import { getServerSideURL } from '@/utilities/getURL'

const play = Play({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-play',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(play.variable, dmSans.variable)}
      lang="en"
      suppressHydrationWarning
      style={{ backgroundColor: '#1C1B18' }}
    >
      <head>
        <InitTheme />
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <meta name="msvalidate.01" content="6C94CC49C504B97B9A76D8EA8B7A78BB" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <DexMetalHeader />
          <main className="flex-1">{children}</main>
          <DexMetalFooter />
        </Providers>
        <DexMetalAgent />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  verification: {
    other: {
      "msvalidate.01": "6C94CC49C504B97B9A76D8EA8B7A78BB",
    },
  },
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'DexMetal — Navigating Circularity, Compliance, and Global Trade',
    template: '%s | DexMetal',
  },
  description:
    'Basel Convention compliance tools, knowledge hub, and competent authority lookup for transboundary e-waste and metal shipments.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DexMetal',
    title: 'DexMetal — Navigating Circularity, Compliance, and Global Trade',
    description:
      'Basel Convention compliance tools, knowledge hub, and competent authority lookup for transboundary e-waste and metal shipments.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DexMetal',
    description:
      'Basel Convention compliance tools, knowledge hub, and competent authority lookup.',
  },
}
