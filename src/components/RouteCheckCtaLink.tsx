'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import {
  captureRouteCheckBrowserEvent,
  type RouteCheckCtaSource,
} from '@/lib/analytics/route-check'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  source: RouteCheckCtaSource
  children: ReactNode
}

export default function RouteCheckCtaLink({ source, children, ...props }: Props) {
  const router = useRouter()

  return (
    <Link
      href="/services/shipment-route-check"
      {...props}
      onClick={(event) => {
        captureRouteCheckBrowserEvent('route_check_cta_click', { source })

        // Keep internal verification traffic on the Route Check page without
        // changing the server-rendered link during hydration.
        if (
          typeof window !== 'undefined' &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          new URLSearchParams(window.location.search).get('internal_test') === '1'
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
