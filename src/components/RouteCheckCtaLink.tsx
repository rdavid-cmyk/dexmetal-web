'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import type { RouteCheckCtaSource } from '@/lib/analytics/route-check'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  source: RouteCheckCtaSource
  children: ReactNode
  internalTest?: boolean
}

export default function RouteCheckCtaLink({ source, children, internalTest = false, ...props }: Props) {
  const router = useRouter()
  const href = internalTest
    ? '/services/shipment-route-check?internal_test=1'
    : '/services/shipment-route-check'

  return (
    <Link
      href={href}
      data-route-check-source={source}
      {...props}
      onClick={(event) => {
        // Keep internal verification traffic on the Route Check page without
        // changing the server-rendered link during hydration.
        if (
          typeof window !== 'undefined' &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          (internalTest || new URLSearchParams(window.location.search).get('internal_test') === '1')
        ) {
          event.preventDefault()
          router.push('/services/shipment-route-check?internal_test=1')
        }
      }}
    >
      {children}
    </Link>
  )
}
