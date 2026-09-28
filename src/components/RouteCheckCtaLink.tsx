'use client'

import Link from 'next/link'
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
      onClick={() => captureRouteCheckBrowserEvent('route_check_cta_click', { source })}
    >
      {children}
    </Link>
  )
}
