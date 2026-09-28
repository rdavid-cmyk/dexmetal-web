# Route Check Single Offer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the $99 Shipment Route Check the only publicly promoted paid offer and measure its homepage-to-intake funnel with the existing PostHog install.

**Architecture:** Keep the existing Route Check page, intake fields, API, and BST-149 page. Add one small client-side analytics helper, use it from the homepage/services/mapper CTAs and Route Check form, and use Next metadata plus sitemap exclusion to pause BST-149 without deleting it.

**Tech Stack:** Next.js 16, React 19, TypeScript, PostHog JS, Vitest, Playwright.

**Spec:** `DEXMETAL-ROUTE-CHECK-SINGLE-OFFER-SITE-PACKAGE-2026-09-28`

## Global Constraints

- No payment or checkout activation; Route Check remains intake-only at $99.
- Do not change Route Check intake fields, offer scope, or compliance/liability language.
- Do not delete BST-149 or any file; pause means unlisted plus noindex.
- Test submissions use `?internal_test=1` and `INTERNAL TEST — DO NOT COUNT`.
- Standard production path only: build, PM2 restart of `dexmetal-web`; no Nginx, cron, database schema, or credential changes.

## Review Focus

- Homepage links must resolve directly to all four audited tool routes.
- `/services` must expose exactly one paid service and no BST-149 link.
- BST-149 must remain HTTP 200, emit noindex, and stay out of sitemap output.
- Mapper free-gate language must not promise a full report and its paid CTA must state the human-verification distinction.
- PostHog must emit exactly the four required funnel events with `internal_test=true` only for the internal-test URL.

### Task 1: Analytics property helper

**Files:**
- Create: `src/lib/analytics/route-check.ts`
- Test: `src/lib/analytics/route-check.test.ts`

- [ ] Write and run the failing test for `?internal_test=1` versus other query strings.
- [ ] Implement the helper and event capture wrapper.
- [ ] Re-run the focused test, then the full test suite.

### Task 2: Public offer and CTA surfaces

**Files:**
- Modify: `src/app/(frontend)/page.tsx`
- Modify: `src/app/(frontend)/services/page.tsx`
- Modify: `src/components/KhServiceCta.tsx`
- Modify: `src/app/(frontend)/templates/page.tsx`
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/components/tools/EWasteRouteMapper.tsx`

- [ ] Replace the four homepage targets and add one Route Check CTA.
- [ ] Remove BST-149 public links/copy from active promotional surfaces.
- [ ] Replace mapper “Full Report” wording, preserve the free email gate, and add the distinct $99 Route Check CTA.

### Task 3: Paused BST-149 and funnel wiring

**Files:**
- Modify: `src/app/(frontend)/services/shipment-compliance-review/page.tsx`
- Modify: `next-sitemap.config.cjs`
- Modify: `src/app/(frontend)/services/shipment-route-check/page.tsx`
- Modify: `src/app/(frontend)/services/shipment-route-check/ShipmentRouteCheckForm.tsx`
- Create: `src/components/RouteCheckPageAnalytics.tsx`

- [ ] Add noindex metadata and explicit sitemap exclusion for BST-149.
- [ ] Emit CTA click, Route Check page view, intake start, and successful intake submit events with the internal-test property.
- [ ] Preserve all existing intake fields and server behavior.

### Task 4: Verification and evidence

- [ ] Record rollback commit before deploy.
- [ ] Run focused tests, lint/type checks, and build.
- [ ] Deploy through the standard path and capture live curl/Playwright evidence.
- [ ] Submit one internal test only, verify server acceptance and the configured alert destination, and write the canonical result plus commerce-state update.
