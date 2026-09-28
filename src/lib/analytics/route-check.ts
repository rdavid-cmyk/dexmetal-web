import posthog from 'posthog-js'

export type RouteCheckCtaSource = 'homepage' | 'services' | 'route_mapper'

export function getRouteCheckEventProperties(
  search: string,
  extra: Record<string, unknown> = {},
) {
  const params = new URLSearchParams(search)

  return {
    internal_test: params.get('internal_test') === '1',
    ...extra,
  }
}

export function captureRouteCheckEvent(
  event: string,
  search: string,
  properties: Record<string, unknown> = {},
) {
  posthog.capture(event, getRouteCheckEventProperties(search, properties))
  const posthogWithFlush = posthog as typeof posthog & { flush?: () => void }
  posthogWithFlush.flush?.()
}

export function captureRouteCheckBrowserEvent(
  event: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return
  captureRouteCheckEvent(event, window.location.search, properties)
}
