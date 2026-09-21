import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

function withoutQuery(value?: string) {
  if (!value) return value
  try {
    const url = new URL(value, 'https://dexmetal.com')
    return `${url.origin}${url.pathname}`
  } catch {
    return value.split(/[?#]/, 1)[0]
  }
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NODE_ENV,
  sendDefaultPii: false,
  sampleRate: 1,
  tracesSampleRate: 0.05,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  beforeSend(event) {
    delete event.user
    if (event.request) {
      delete event.request.cookies
      delete event.request.data
      delete event.request.headers
      delete event.request.query_string
      event.request.url = withoutQuery(event.request.url)
    }
    return event
  },
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'console' || breadcrumb.category === 'ui.input') return null
    if (breadcrumb.data?.url && typeof breadcrumb.data.url === 'string') {
      breadcrumb.data.url = withoutQuery(breadcrumb.data.url)
    }
    return breadcrumb
  },
})

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

if (projectToken && !window.location.pathname.startsWith('/admin')) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    respect_dnt: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '*',
    },
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
