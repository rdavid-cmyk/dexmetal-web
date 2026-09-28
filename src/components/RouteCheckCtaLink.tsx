'use client'

import Link from 'next/link'
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
  return (
    <Link
      href="/services/shipment-route-check"
      {...props}
      onClick={() => captureRouteCheckBrowserEvent('route_check_cta_click', { source })}
    >
      {children}
    </Link>
  )
}
