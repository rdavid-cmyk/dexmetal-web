import * as Sentry from '@sentry/nextjs'

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
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production' && Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NODE_ENV,
  sendDefaultPii: false,
  sampleRate: 1,
  tracesSampleRate: 0.05,
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
})
