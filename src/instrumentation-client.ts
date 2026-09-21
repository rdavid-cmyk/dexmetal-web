import posthog from 'posthog-js'

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
