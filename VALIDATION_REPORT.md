# VALIDATION REPORT — 2026-05-09

## RUN SUMMARY
- Timestamp: 2026-05-09T14:30:00Z
- Spec: dexmetal-validation.spec.ts
- Result: FAILED (7 passed, 6 failed, 13 total)

## EXISTING SPEC RESULTS

Running 13 tests using 1 worker

TEST 1:
  PASS | "Not sure where to start?" section visible
  PASS | 3 entry point cards present (found 10 tool links)

TEST 2 — ShipmentEligibilityChecker:
  FAIL | Load Example — fields populate | locator.click timeout 30s — <div> intercepts pointer events
  FAIL | Take a tour — Shepherd tour launches | Target page closed

TEST 3 — BaselClassificationQuickscan:
  FAIL | Load Example — fields populate | locator.click timeout 30s — header intercepts
  FAIL | Submit — result appears | Target page closed

TEST 4 — BaselNavigator:
  PASS | Email gate — not shown (pre-unlocked)
  PASS | Gate unlocked — navigator content visible
  FAIL | Load Sample | Timeout 8000ms — button text "Load Sample" NOT FOUND
  FAIL | Navigate 21 blocks | Failed at all 20 blocks (no Next button found)
  FAIL | Take a tour — button visible | Tour button not found
  FAIL | Submission Package / PDF | locator.click timeout 30s — header intercepts

TEST 5 — EWasteMaterialRecovery:
  FAIL | Load Example | locator.click timeout 30s — header intercepts
  FAIL | Submit | Target page closed
  PASS | Email gate — not shown

TEST 5 — EWasteRouteMapper:
  FAIL | Load Example | locator.click timeout 30s — header intercepts
  FAIL | Submit | Target page closed
  PASS | Email gate — not shown

TEST 5 — ULABExportCalculator:
  FAIL | Load Example | Timeout 10s — button not found
  FAIL | Submit | Timeout 5s — button not found
  PASS | Email gate — not shown
  PASS | Gate unlocked — content visible
  PASS | CTA visible

TEST 5 — PICStatusChecker:
  FAIL | Load Example | locator.click timeout 30s — <div> intercepts
  FAIL | Submit | Target page closed
  PASS | Email gate — not shown

TEST 6 — Basel Copilot:
  PASS | Copilot widget — found via text filter and clicked
  FAIL | Message sent — response appears | No response element found within 10s

TEST 7 — Resend API:
  PASS | Resend check — deferred to shell

TEST 8 — Mobile Tools index:
  PASS | Viewport 375px — page loads at correct width
  PASS | "Not sure where to start?" section visible

TEST 8 — Mobile SEC:
  PASS | Mobile — Load Example button tappable (height >= 30px)
  PASS | Mobile — page not broken (content present)

TEST 9 — Footer links:
  FAIL | Ko-fi link | ko-fi.com/dexmetal not found in page
  FAIL | PayPal link | paypal link not found in page

6 failed, 7 passed (3.9m)

---

## CHECK A — Shepherd auto-launch (7 tools, load + 3s wait)

| Tool | Shepherd DOM nodes | Visible on load |
|------|-------------------|-----------------|
| shipment-eligibility-checker | 0 | PASS |
| pic-status-checker | 0 | PASS |
| basel-classification-quickscan | 0 | PASS |
| ulab-export-calculator | 0 | PASS |
| ewaste-export-route-risk-mapper | 0 | PASS |
| ewaste-material-recovery-estimator | 0 | PASS |
| basel-navigator | 0 | PASS |

Result: ALL 7 tools PASS. No Shepherd tour auto-launches detected.

---

## CHECK B — Basel Navigator Load Sample button

- Load Sample button: NOT FOUND
- Searched all button text for /load sample|load example/i — no match
- Existing spec TEST 4 also failed: timeout 8s waiting for button

Result: FAIL — "Load Sample" button is not present on the Basel Navigator tool.

---

## CHECK C — Ko-fi + PayPal links on /tools pages

| Tool | ko-fi.com/dexmetal | PayPal + dexmetal |
|------|-------------------|------------------|
| shipment-eligibility-checker | PRESENT | PRESENT |
| pic-status-checker | MISSING | MISSING |
| basel-classification-quickscan | MISSING | MISSING |
| ulab-export-calculator | PRESENT | PRESENT |
| ewaste-export-route-risk-mapper | MISSING | MISSING |
| ewaste-material-recovery-estimator | MISSING | MISSING |
| basel-navigator | MISSING | MISSING |

Result: 5/7 tools MISSING Ko-fi. 5/7 tools MISSING PayPal.
Only 2 tools (shipment-eligibility-checker, ulab-export-calculator) have both links.

---

## CHECK D — Copilot CSS selector (homepage)

Selectors tested on https://dexmetal.com after 5s load:
  #basel-copilot: 0 matches
  .copilot-widget: 0 matches
  [data-testid="copilot"]: 0 matches
  iframe[title*="copilot" i]: 0 matches
  text "Basel Copilot" / "Ask Basel": 1 match

Result: Matching selector = text "Basel Copilot" / "Ask Basel"
Widget has no semantic CSS class or data-testid attribute.

---

## FAILURES REQUIRING ACTION

1. CRITICAL: Pointer event interception — Multiple tools fail with <div> intercepts
   pointer events. Sticky header (z-30) overlays Load Example and Submission Package
   buttons, blocking Playwright clicks. Fix: add z-index to interactive elements above
   header, or use force:true in tests.

2. CRITICAL: Shepherd tour auto-launch — SPEC TEST 2 failed because Shepherd tour
   blocks Load Example button on page load. Check A confirmed no visible tour at 3s —
   but tour may be triggered at ~5-8s. Fix: disable Shepherd auto-trigger, make
   user-initiated only.

3. Basel Navigator "Load Sample" missing — CHECK B and SPEC TEST 4 both confirm
   button not found. Different label may be used or button is gated.

4. Ko-fi/PayPal missing on 5 of 7 tools — Only shipment-eligibility-checker and
   ulab-export-calculator have both links. 5 tools have neither.

5. Copilot widget has no semantic CSS class or data-testid — Found only by text
   content. Spec TEST 6 works via text filter fallback but is fragile.

6. Basel Copilot response timeout — Widget found and clicked but no response within
   10s. Copilot may be slow or non-responsive to "What is a Basel notification?".

7. ULABExportCalculator buttons not found — Load Example and Submit timed out (10s,
   5s). Tool may use different button labels or form is gated.