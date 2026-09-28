'use client'

import { useEffect } from 'react'

import { captureRouteCheckBrowserEvent } from '@/lib/analytics/route-check'

export default function RouteCheckPageAnalytics() {
  useEffect(() => {
    captureRouteCheckBrowserEvent('route_check_page_view')
  }, [])

  return null
}
