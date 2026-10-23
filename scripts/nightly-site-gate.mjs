#!/usr/bin/env node

import { gunzipSync, inflateSync } from 'node:zlib'
import { chromium } from 'playwright'

const HOME_URL = process.env.DEXMETAL_HOME_URL || 'https://dexmetal.com/'
const SITEMAP_URL = process.env.DEXMETAL_SITEMAP_URL || 'https://dexmetal.com/sitemap.xml'
const POSTHOG_PROBE_URL =
  process.env.DEXMETAL_POSTHOG_PROBE_URL ||
  'https://dexmetal.com/services/shipment-route-check?internal_test=1'
const MIN_SITEMAP_URLS = Number(process.env.DEXMETAL_MIN_SITEMAP_URLS || 60)
const FORBIDDEN_HOME_TEXT = ['$99', 'third-party AI service']

function fail(message) {
  throw new Error(message)
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DexMetal-Nightly-Site-Gate/1.0' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) fail(`${url} returned HTTP ${response.status}`)
  return response.text()
}

async function checkHomepage() {
  const html = await fetchText(HOME_URL)
  const found = FORBIDDEN_HOME_TEXT.filter((text) => html.includes(text))
  if (found.length > 0) fail(`homepage contains forbidden text: ${found.join(', ')}`)
  console.log(`PASS homepage forbidden-text gate: ${FORBIDDEN_HOME_TEXT.join(', ')}`)
}

async function checkSitemap() {
  const xml = await fetchText(SITEMAP_URL)
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const uniqueUrls = new Set(urls)
  if (uniqueUrls.size !== urls.length) {
    fail(`sitemap contains ${urls.length - uniqueUrls.size} duplicate URLs`)
  }
  if (uniqueUrls.size < MIN_SITEMAP_URLS) {
    fail(`sitemap has ${uniqueUrls.size} unique URLs; minimum is ${MIN_SITEMAP_URLS}`)
  }

  const redirectedPosts = [...uniqueUrls].filter((url) => new URL(url).pathname.startsWith('/posts'))
  if (redirectedPosts.length > 0) {
    fail(`sitemap contains redirected /posts URLs: ${redirectedPosts.join(', ')}`)
  }

  console.log(`PASS sitemap gate: ${uniqueUrls.size} unique URLs, zero /posts URLs`)
}

function readPostHogEvent(request) {
  const body = request.postDataBuffer() || Buffer.alloc(0)
  const candidates = [body]
  const params = new URLSearchParams(body.toString('utf8'))
  const encodedData = params.get('data')
  if (encodedData) candidates.push(Buffer.from(encodedData, 'base64'), Buffer.from(encodedData, 'utf8'))

  for (const candidate of [...candidates]) {
    try {
      candidates.push(gunzipSync(candidate))
    } catch {}
    try {
      candidates.push(inflateSync(candidate))
    } catch {}
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate.toString('utf8'))
      const events = Array.isArray(parsed) ? parsed : parsed.batch || [parsed]
      const match = events.find(
        (event) => event?.event === 'route_check_page_view' && event.properties?.internal_test === true,
      )
      if (match) return match.event
    } catch {}
  }

  return null
}

async function checkPostHogEventDelivery() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    const eventReceipt = page.waitForResponse(
      (response) => {
        const url = new URL(response.url())
        const request = response.request()
        const isPostHogHost = url.hostname === 'posthog.com' || url.hostname.endsWith('.posthog.com')
        return (
          request.method() === 'POST' &&
          isPostHogHost &&
          url.pathname === '/e/' &&
          response.status() >= 200 &&
          response.status() < 300 &&
          readPostHogEvent(request) === 'route_check_page_view'
        )
      },
      { timeout: 30000 },
    )

    await page.goto(POSTHOG_PROBE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
    const receipt = await eventReceipt
    console.log(
      `PASS PostHog event delivery: route_check_page_view (internal_test=true) POST ${new URL(receipt.url()).origin}/e/ -> ${receipt.status()}`,
    )
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log(`DexMetal nightly site gate started at ${new Date().toISOString()}`)
  await checkHomepage()
  await checkSitemap()
  await checkPostHogEventDelivery()
  console.log(`PASS DexMetal nightly site gate completed at ${new Date().toISOString()}`)
}

main().catch((error) => {
  console.error(`FAIL DexMetal nightly site gate: ${error.message}`)
  process.exit(1)
})
