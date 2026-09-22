const status = {
  posthog: {
    browserAnalytics: Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN),
    hostConfigured: Boolean(process.env.NEXT_PUBLIC_POSTHOG_HOST),
    geo1Reporting: Boolean(process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_PROJECT_ID),
  },
  checkly: {
    connected: Boolean(process.env.CHECKLY_API_KEY && process.env.CHECKLY_ACCOUNT_ID),
  },
}
console.log(JSON.stringify(status))
