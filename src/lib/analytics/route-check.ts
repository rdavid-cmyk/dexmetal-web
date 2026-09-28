import posthog from 'posthog-js'

export type RouteCheckCtaSource = 'homepage' | 'services' | 'route_mapper'

type PostHogRuntime = typeof posthog & { __loaded?: boolean }

function ensureRouteCheckAnalyticsReady() {
  if (typeof window === 'undefined') return

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!projectToken) return

  const runtime = posthog as PostHogRuntime
  if (runtime.__loaded) return

  runtime.init(projectToken, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    respect_dnt: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '*',
    },
  })
}

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
  ensureRouteCheckAnalyticsReady()
  posthog.capture(
    event,
    getRouteCheckEventProperties(search, properties),
    { send_instantly: true },
  )
}

export function captureRouteCheckBrowserEvent(
  event: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return
  captureRouteCheckEvent(event, window.location.search, properties)
}
