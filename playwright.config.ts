import { defineConfig, devices } from "@playwright/test"
import "dotenv/config"
import { createChecklyReporter } from "@checkly/playwright-reporter"

const checklyEnabled = Boolean(process.env.CHECKLY_API_KEY && process.env.CHECKLY_ACCOUNT_ID)

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: checklyEnabled ? [["html"], createChecklyReporter()] : "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
  ],
  webServer: {
    command: "pnpm dev",
    reuseExistingServer: true,
    url: "http://localhost:3000",
  },
})
