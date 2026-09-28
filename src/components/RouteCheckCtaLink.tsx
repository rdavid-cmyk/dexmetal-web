'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useEffect, useState } from 'react'

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
  const [href, setHref] = useState('/services/shipment-route-check')

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('internal_test') === '1') {
      setHref('/services/shipment-route-check?internal_test=1')
    }
  }, [])

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        captureRouteCheckBrowserEvent('route_check_cta_click', { source })

        // The effect above normally updates the href, but a fast click can
        // arrive before it runs. Keep internal verification traffic on the
        // Route Check page even in that first render window.
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
