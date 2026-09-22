#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// @sentry/nextjs publishes its Node runtime as CommonJS. createRequire avoids
// the ESM namespace interop trap where captureException appears undefined.
const require = createRequire(import.meta.url)
const Sentry = require('@sentry/nextjs')

const DSN = process.env.SENTRY_DSN
const READ_TOKEN = process.env.SENTRY_GEO1_AUTH_TOKEN
const ORG = process.env.SENTRY_ORG || 'dexmetal'
const PROJECT = process.env.SENTRY_PROJECT || 'dexmetal-web'
const mode = process.argv[2] || '--server'
const suppliedMarker = process.argv[3]

if (!DSN || !READ_TOKEN) {
  console.error('SENTRY_VERIFY_CONFIG_MISSING')
  process.exit(2)
}

function stripRequest(event) {
  delete event.user
  if (event.request) {
    delete event.request.cookies
    delete event.request.data
    delete event.request.headers
    delete event.request.query_string
    if (event.request.url) event.request.url = event.request.url.split(/[?#]/, 1)[0]
  }
  return event
}

function countClientDsnChunks(directory, host) {
  let count = 0
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) count += countClientDsnChunks(file, host)
    else if (/\.(js|map)$/.test(entry.name) && readFileSync(file, 'utf8').includes(host)) count++
  }
  return count
}

async function findIssue(marker) {
  const endpoint = new URL(`https://sentry.io/api/0/projects/${ORG}/${PROJECT}/issues/`)
  endpoint.searchParams.set('query', `"${marker}"`)
  endpoint.searchParams.set('limit', '10')
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${READ_TOKEN}` },
    })
    if (!response.ok) throw new Error(`Sentry readback failed with HTTP ${response.status}`)
    const issues = await response.json()
    if (issues.some((issue) => String(issue.title || '').includes(marker))) return true
  }
  return false
}

async function main() {
  const dsnHost = new URL(DSN).host
  const clientChunks = countClientDsnChunks('.next/static', dsnHost)
  if (clientChunks === 0) throw new Error('Client build does not contain the configured Sentry DSN host')

  if (mode === '--browser-marker') {
    if (!suppliedMarker) throw new Error('Browser marker is required')
    if (!(await findIssue(suppliedMarker))) throw new Error('Browser Sentry event was not found')
    console.log('SENTRY_BROWSER_EVENT_VERIFIED')
    return
  }

  const marker = `DexMetal Sentry server verification ${Date.now()}`
  Sentry.init({
    dsn: DSN,
    environment: 'production',
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend: stripRequest,
  })
  Sentry.captureException(new Error(marker))
  if (!(await Sentry.flush(10000))) throw new Error('Sentry server flush timed out')
  if (!(await findIssue(marker))) throw new Error('Server Sentry event was not found')
  console.log('SENTRY_SERVER_EVENT_VERIFIED')
  console.log('SENTRY_CLIENT_BUILD_VERIFIED')
}

main().catch((error) => {
  console.error(`SENTRY_VERIFY_FAILED: ${error.message}`)
  process.exit(1)
})
