import * as Sentry from '@sentry/nextjs'
import posthog from "posthog-js"

import './sentry.client.config'

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

// Optional and fail-open by design: no key means no analytics runtime at all.
if (key) {
  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
