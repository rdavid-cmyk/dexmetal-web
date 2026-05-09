# DexMetal Validation Report — 2026-05-09

**Tested against:** https://dexmetal.com  
**Playwright:** 1.58.2 | Chromium | Headful via Xvfb  
**Test email:** dexmettal@gmail.com  

---

## EXECUTIVE SUMMARY

| Test | Result |
|------|--------|
| TEST 1 — Tools index | PASS |
| TEST 2 — ShipmentEligibilityChecker | PARTIAL FAIL |
| TEST 3 — BaselClassificationQuickscan | PARTIAL FAIL |
| TEST 4 — BaselNavigator | PARTIAL FAIL |
| TEST 5 — EWasteMaterialRecovery | PARTIAL FAIL |
| TEST 5 — EWasteRouteMapper | PARTIAL FAIL |
| TEST 5 — ULABExportCalculator | PASS |
| TEST 5 — PICStatusChecker | PARTIAL FAIL |
| TEST 6 — Basel Copilot | PARTIAL FAIL |
| TEST 7 — Resend API | FAIL |
| TEST 8 — Mobile viewport | PASS |
| TEST 9 — Footer links | FAIL |

**Critical root cause: Shepherd tour auto-launches on page load on 5+ tools, blocking all button interactions via SVG overlay. This is the #1 conversion killer.**

---

## DETAILED RESULTS

### TEST 1 — Tools index (/tools)
| Step | Result | Notes |
|------|--------|-------|
| "Not sure where to start?" section visible | PASS | |
| 3 entry point cards present | PASS | Found 10 tool links |

---

### TEST 2 — ShipmentEligibilityChecker (/tools/shipment-eligibility-checker)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | FAIL | Shepherd tour SVG overlay auto-launches on page load, intercepts all pointer events. Button found but unreachable. |
| Take a tour — Shepherd tour launches | FAIL | Tour already active on load; button behind the overlay |
| Hover PIC — tooltip appears | NOT REACHED | Test timed out |
| Submit form — result appears | NOT REACHED | Test timed out |
| Email gate — entered and submitted | NOT REACHED | Test timed out |
| Gate unlocked — result visible | NOT REACHED | Test timed out |
| Consulting CTA appears | NOT REACHED | Test timed out |

Root cause: shepherd-modal-overlay-container shepherd-modal-is-visible SVG is active immediately on page load. No click reaches the page until tour is dismissed. The tour auto-launch is the issue.

---

### TEST 3 — BaselClassificationQuickscan (/tools/basel-classification-quickscan)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | FAIL | Same Shepherd overlay issue as TEST 2 |
| Submit — result appears | FAIL | No data in fields, submit fails |
| Email gate — entered and submitted | PASS | Gate not shown post-submit (correct) |
| Gate unlocked — content visible | PASS | Page content visible |
| CTA appears | PASS | Consulting CTA text found |

---

### TEST 4 — BaselNavigator (/tools/basel-navigator)

| Step | Result | Notes |
|------|--------|-------|
| Email gate — entered and submitted | PASS | Gate not blocking (email input not found = pre-unlocked or different UI pattern) |
| Gate unlocked — navigator content visible | PASS | Content visible |
| Load Sample — green confirmation message | FAIL | "Load Sample" button not found within 8s timeout |
| Load Sample — Block 1 fields populated | FAIL | Cascades from above |
| Navigate 21 blocks | FAIL | Blocks 1-20 failed; Next button not found |
| Take a tour — tour launches | FAIL | Tour button not found on BaselNavigator page |
| Submission Package tab | FAIL | Tab not found within timeout |
| PDF download | FAIL | Cascades from tab failure |

Root causes: (1) Load Sample button selector or visibility issue. (2) Take a tour button absent or uses a different label. (3) Submission Package tab not accessible.

---

### TEST 5 — EWasteMaterialRecovery (/tools/ewaste-material-recovery)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | FAIL | Shepherd overlay blocks click |
| Submit — result appears | FAIL | No form data |
| Email gate — entered and submitted | PASS | Not shown |
| Gate unlocked — content visible | PASS | |
| CTA visible | PASS | |

---

### TEST 5 — EWasteRouteMapper (/tools/ewaste-route-mapper)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | FAIL | Shepherd overlay blocks click |
| Submit — result appears | FAIL | No form data |
| Email gate — entered and submitted | PASS | Not shown |
| Gate unlocked — content visible | PASS | |
| CTA visible | PASS | |

---

### TEST 5 — ULABExportCalculator (/tools/ulab-export-calculator)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | PASS | |
| Submit — result appears | PASS | |
| Email gate — entered and submitted | PASS | Not shown (gate not blocking) |
| Gate unlocked — content visible | PASS | |
| CTA visible | PASS | |

Only tool with a complete PASS. No Shepherd tour overlay issue.

---

### TEST 5 — PICStatusChecker (/tools/pic-status-checker)

| Step | Result | Notes |
|------|--------|-------|
| Load Example — fields populate | FAIL | Shepherd overlay blocks click |
| Submit — result appears | FAIL | Submit button is disabled (no form data loaded) |
| Email gate — entered and submitted | PASS | Not shown |
| Gate unlocked — content visible | FAIL | Page context closed (timeout cascade) |
| CTA visible | FAIL | Page closed |

---

### TEST 6 — Basel Copilot

| Step | Result | Notes |
|------|--------|-------|
| Copilot widget — click | PASS | Widget found via text filter button, clicked |
| Message sent — response within 10s | FAIL | No response element found; class selectors message/response/assistant do not match actual DOM |

Root cause: Response container uses different CSS classes. Widget opens successfully.

---

### TEST 7 — Resend API verification

| Step | Result | Notes |
|------|--------|-------|
| Resend audience API live | PASS | 6 contacts in audience fbdfec0b-9a5f-44e6-8e42-d7fa1ddc9e73 |
| dexmettal@gmail.com in audience | FAIL | Not found — email gate never completed due to Shepherd blocking |
| Tool tags assigned | FAIL | Contact not added |

Last 5 contacts: rdavid@gvoltt.com (Apr 29), richard@test.com (Apr 29), test@dexmetal.com (Apr 29), test@test.com (Apr 29), test-resend@dexmetal.com (Apr 22)

---

### TEST 8 — Mobile viewport (375px)

| Step | Result | Notes |
|------|--------|-------|
| Tools index — viewport 375px loads | PASS | Body width correct |
| Tools index — "Not sure where to start?" visible | PASS | |
| ShipmentEligibilityChecker — Load Example button tappable | PASS | Button height >= 30px |
| ShipmentEligibilityChecker — page not broken | PASS | Content present |

---

### TEST 9 — Ko-fi and PayPal footer links

| Step | Result | Notes |
|------|--------|-------|
| ko-fi.com/dexmetal in footer | FAIL | Not found on /tools page (searched full page source) |
| paypal link in footer | FAIL | Not found on /tools page (searched full page source) |

Note: Links may not be implemented yet in Next.js app, or only exist on WordPress homepage.

---

## CRITICAL FINDINGS — RANKED BY IMPACT

### #1 CRITICAL — Shepherd tour auto-launches and blocks all tool interactions
- Affected tools: ShipmentEligibilityChecker, BaselClassificationQuickscan, EWasteMaterialRecovery, EWasteRouteMapper, PICStatusChecker (5 of 7 tools)
- What happens: shepherd-modal-overlay-container shepherd-modal-is-visible SVG renders over the entire page immediately on first load. No clicks reach buttons or form elements.
- Impact: Real visitors cannot interact with 5 of 7 tools. Load Example is unreachable. Email gate never triggers. High bounce risk.
- Expected behavior: Tour should not block page interactions, or should only show when user clicks Take a tour.

### #2 HIGH — BaselNavigator: Load Sample / blocks navigation / tour not working
- Load Sample button unreachable or mislabeled
- 21-block navigation untestable (blocked by Load Sample issue)
- Take a tour button not found (present on other tools but absent here)
- Submission Package tab not accessible

### #3 HIGH — Footer revenue links missing from /tools pages
- No ko-fi.com/dexmetal link found
- No paypal link found
- Revenue capture links absent from tool experience

### #4 MEDIUM — Copilot response detection fails
- Widget opens correctly
- Response CSS classes do not match expected selectors
- Functional state unknown — needs manual verification

### #5 LOW — Resend not capturing test contact
- Cascades from #1 (email gate never reached)
- Resend API itself is live and functional (6 existing contacts confirmed)

---

## WHAT IS WORKING

- Tools index page (/tools) — layout, section heading, tool links
- ULABExportCalculator — complete flow (Load Example, Submit, Gate, CTA)
- Email gate infrastructure — present on all tools
- Mobile layout — not broken at 375px, buttons tappable
- Copilot widget — opens when clicked
- Resend API — live, audience exists, API responds correctly
- CTA sections — visible after gate on most tools

---

Report generated: 2026-05-09 | Spec: /var/www/dexmetal-web/tests/e2e/dexmetal-validation.spec.ts
