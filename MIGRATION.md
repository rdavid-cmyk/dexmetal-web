# MIGRATION.md — DexMetal WordPress → Next.js URL Map
Generated: 2026-04-04 | Source: wp-sitemap.xml (121 URLs)

> **NOTE:** `dexmetal_migration_manifest.csv` was not found in `/dexmetal-web` or anywhere under home.
> This file was built entirely from `wp-sitemap.xml`. Reconcile against the CSV when it is located.
> Status defaults to PENDING until builds are confirmed.

---

## Mapping Rules Applied
- `/data-library/form-fields/*` → `/knowledge-hub/notification-app/*`
- `/data-library/supporting-documents/*` → `/knowledge-hub/supporting-docs/*`
- `/data-library/pic-procedure/*` → `/knowledge-hub/pic/*`
- `/data-library/country-specific-requirements/*` → `/knowledge-hub/country/*`
- `/data-library/e-waste-classifications/*` → `/knowledge-hub/ewaste/*`
- `/data-library/additional-reference/*` → `/knowledge-hub/reference/*`
- `/additional-reference/*` → `/knowledge-hub/reference/*`
- `/additional-reference/basel-glossary/` → `/knowledge-hub/reference/glossary/` (specific rule)
- `/start-basel-movement-document-guide/*` → `/knowledge-hub/movement-doc/*` (inferred from URL structure)
- `/checklist/` → `/tools/checklist/`
- `/quick-code-lookup/` → `/tools/quick-code-lookup/`
- `/notification-quick-view/` → `/tools/notification-quick-view/`
- `/movement-quick-view/` → `/tools/movement-quick-view/`
- `/basel-api/` → `/tools/basel-ca-api/`
- `/data-library/` → `/knowledge-hub/`
- Block-X prefix dropped from all slugs (e.g. `block-14-waste-codes` → `waste-codes`)

---

## CORE PAGES

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/ | / | PENDING | Homepage |
| https://dexmetal.com/about/ | /about/ | PENDING | No mapping rule — keep path |
| https://dexmetal.com/contact/ | /contact/ | PENDING | No mapping rule — keep path |
| https://dexmetal.com/blog/ | /blog/ | PENDING | Blog index |
| https://dexmetal.com/privacy-policy/ | /privacy-policy/ | SKIP | Recreate, no content migration |
| https://dexmetal.com/dexmetal-news-feed/ | — | SKIP | WP-specific feed, no Next.js equivalent |

---

## KNOWLEDGE HUB — Notification App (form-fields)

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/data-library/form-fields/ | /knowledge-hub/notification-app/ | PENDING | Index page |
| https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier/ | /knowledge-hub/notification-app/exporter-notifier/ | PENDING | Drop block-1- prefix |
| https://dexmetal.com/data-library/form-fields/block-2-importer-consignee/ | /knowledge-hub/notification-app/importer-consignee/ | PENDING | Drop block-2- prefix |
| https://dexmetal.com/data-library/form-fields/block-3-notification-number/ | /knowledge-hub/notification-app/notification-number/ | PENDING | Drop block-3- prefix |
| https://dexmetal.com/data-library/form-fields/block-4-total-shipments/ | /knowledge-hub/notification-app/total-shipments/ | PENDING | Drop block-4- prefix |
| https://dexmetal.com/data-library/form-fields/block-5-total-quantity/ | /knowledge-hub/notification-app/total-quantity/ | PENDING | Drop block-5- prefix |
| https://dexmetal.com/data-library/form-fields/block-6-intended-period/ | /knowledge-hub/notification-app/intended-period/ | PENDING | Drop block-6- prefix |
| https://dexmetal.com/data-library/form-fields/block-7-packaging/ | /knowledge-hub/notification-app/packaging/ | PENDING | Drop block-7- prefix |
| https://dexmetal.com/data-library/form-fields/block-8-intended-carriers/ | /knowledge-hub/notification-app/intended-carriers/ | PENDING | Drop block-8- prefix |
| https://dexmetal.com/data-library/form-fields/block-9-waste-generator/ | /knowledge-hub/notification-app/waste-generator/ | PENDING | Drop block-9- prefix |
| https://dexmetal.com/data-library/form-fields/block-10-disposal-facility/ | /knowledge-hub/notification-app/disposal-facility/ | PENDING | Drop block-10- prefix |
| https://dexmetal.com/data-library/form-fields/block-11-operation-code/ | /knowledge-hub/notification-app/operation-code/ | PENDING | Drop block-11- prefix |
| https://dexmetal.com/data-library/form-fields/block-12-waste-designation/ | /knowledge-hub/notification-app/waste-designation/ | PENDING | Drop block-12- prefix |
| https://dexmetal.com/data-library/form-fields/block-13-physical-characteristics/ | /knowledge-hub/notification-app/physical-characteristics/ | PENDING | Drop block-13- prefix |
| https://dexmetal.com/data-library/form-fields/block-14-waste-codes/ | /knowledge-hub/notification-app/waste-codes/ | PENDING | Drop block-14- prefix |
| https://dexmetal.com/data-library/form-fields/block-15-countries-concerned/ | /knowledge-hub/notification-app/countries-concerned/ | PENDING | Drop block-15- prefix |
| https://dexmetal.com/data-library/form-fields/block-16-customs-offices/ | /knowledge-hub/notification-app/customs-offices/ | PENDING | Drop block-16- prefix |
| https://dexmetal.com/data-library/form-fields/block-17-declaration/ | /knowledge-hub/notification-app/declaration/ | PENDING | Drop block-17- prefix |
| https://dexmetal.com/data-library/form-fields/block-18-annexes/ | /knowledge-hub/notification-app/annexes/ | PENDING | Drop block-18- prefix |
| https://dexmetal.com/data-library/form-fields/block-19-ca-acknowledgement/ | /knowledge-hub/notification-app/ca-acknowledgement/ | PENDING | Drop block-19- prefix |
| https://dexmetal.com/data-library/form-fields/block-20-consent/ | /knowledge-hub/notification-app/consent/ | PENDING | Drop block-20- prefix |
| https://dexmetal.com/data-library/form-fields/block-21-conditions/ | /knowledge-hub/notification-app/conditions/ | PENDING | Drop block-21- prefix |

---

## KNOWLEDGE HUB — Movement Document Guide

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/start-basel-movement-document-guide/ | /knowledge-hub/movement-doc/ | PENDING | Index page |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-1-notification-number/ | /knowledge-hub/movement-doc/movement-notification-number/ | PENDING | Drop block-1- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-2-serial-number/ | /knowledge-hub/movement-doc/movement-serial-number/ | PENDING | Drop block-2- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-3-exporter-notifier/ | /knowledge-hub/movement-doc/movement-exporter-notifier/ | PENDING | Drop block-3- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-4-importer-consignee/ | /knowledge-hub/movement-doc/movement-importer-consignee/ | PENDING | Drop block-4- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-5-actual-quantity/ | /knowledge-hub/movement-doc/movement-actual-quantity/ | PENDING | Drop block-5- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-6-actual-date/ | /knowledge-hub/movement-doc/movement-actual-date/ | PENDING | Drop block-6- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-7-packaging/ | /knowledge-hub/movement-doc/movement-packaging/ | PENDING | Drop block-7- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-8-carriers/ | /knowledge-hub/movement-doc/movement-carriers/ | PENDING | Drop block-8- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-9-generator/ | /knowledge-hub/movement-doc/movement-generator/ | PENDING | Drop block-9- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-10-facility/ | /knowledge-hub/movement-doc/movement-facility/ | PENDING | Drop block-10- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-11-operation/ | /knowledge-hub/movement-doc/movement-operation/ | PENDING | Drop block-11- prefix |
| https://dexmetal.com/movement-block-12-designation/ | /knowledge-hub/movement-doc/movement-designation/ | PENDING | Top-level anomaly — not under guide parent; drop block-12- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-13-physical-characteristics/ | /knowledge-hub/movement-doc/movement-physical-characteristics/ | PENDING | Drop block-13- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-14-waste-identification/ | /knowledge-hub/movement-doc/movement-waste-identification/ | PENDING | Drop block-14- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-15-exporter-declaration/ | /knowledge-hub/movement-doc/movement-exporter-declaration/ | PENDING | Drop block-15- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-16-additional-information/ | /knowledge-hub/movement-doc/movement-additional-information/ | PENDING | Drop block-16- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-17-importer-acceptance/ | /knowledge-hub/movement-doc/movement-importer-acceptance/ | PENDING | Drop block-17- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-18-receipt/ | /knowledge-hub/movement-doc/movement-receipt/ | PENDING | Drop block-18- prefix |
| https://dexmetal.com/start-basel-movement-document-guide/movement-block-19-disposal-certification/ | /knowledge-hub/movement-doc/movement-disposal-certification/ | PENDING | Drop block-19- prefix |

---

## KNOWLEDGE HUB — Supporting Documents

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/data-library/supporting-documents/ | /knowledge-hub/supporting-docs/ | PENDING | Index page |
| https://dexmetal.com/data-library/supporting-documents/contract-requirements/ | /knowledge-hub/supporting-docs/contract-requirements/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/document-checklist/ | /knowledge-hub/supporting-docs/document-checklist/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/esm-documentation/ | /knowledge-hub/supporting-docs/esm-documentation/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/facility-permits/ | /knowledge-hub/supporting-docs/facility-permits/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/financial-guarantees/ | /knowledge-hub/supporting-docs/financial-guarantees/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/movement-document/ | /knowledge-hub/supporting-docs/movement-document/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/reimport-guarantees/ | /knowledge-hub/supporting-docs/reimport-guarantees/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/transport-documentation/ | /knowledge-hub/supporting-docs/transport-documentation/ | PENDING | |
| https://dexmetal.com/data-library/supporting-documents/waste-characterization/ | /knowledge-hub/supporting-docs/waste-characterization/ | PENDING | |

---

## KNOWLEDGE HUB — PIC Procedure

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/data-library/pic-procedure/ | /knowledge-hub/pic/ | PENDING | Index page |
| https://dexmetal.com/data-library/pic-procedure/appealing-rejections/ | /knowledge-hub/pic/appealing-rejections/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/authority-acknowledgment/ | /knowledge-hub/pic/authority-acknowledgment/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/final-authorization/ | /knowledge-hub/pic/final-authorization/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/import-country-response/ | /knowledge-hub/pic/import-country-response/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/notification-modifications/ | /knowledge-hub/pic/notification-modifications/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/notification-submission/ | /knowledge-hub/pic/notification-submission/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/pic-overview/ | /knowledge-hub/pic/pic-overview/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/pre-notification-preparation/ | /knowledge-hub/pic/pre-notification-preparation/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/regional-timelines/ | /knowledge-hub/pic/regional-timelines/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/rejection-reasons/ | /knowledge-hub/pic/rejection-reasons/ | PENDING | |
| https://dexmetal.com/data-library/pic-procedure/transit-country-consent/ | /knowledge-hub/pic/transit-country-consent/ | PENDING | |

---

## KNOWLEDGE HUB — Country Requirements

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/data-library/country-specific-requirements/ | /knowledge-hub/country/ | PENDING | Index page |
| https://dexmetal.com/data-library/country-specific-requirements/africa-importing-countries/ | /knowledge-hub/country/africa-importing-countries/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/americas-importing-countries/ | /knowledge-hub/country/americas-importing-countries/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/asia-importing-countries/ | /knowledge-hub/country/asia-importing-countries/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/competent-authority-contacts/ | /knowledge-hub/country/competent-authority-contacts/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/eu-waste-shipment/ | /knowledge-hub/country/eu-waste-shipment/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/europe-importing-countries/ | /knowledge-hub/country/europe-importing-countries/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/language-requirements/ | /knowledge-hub/country/language-requirements/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/oecd-procedures/ | /knowledge-hub/country/oecd-procedures/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/transit-countries/ | /knowledge-hub/country/transit-countries/ | PENDING | |
| https://dexmetal.com/data-library/country-specific-requirements/us-export-requirements/ | /knowledge-hub/country/us-export-requirements/ | PENDING | |

---

## KNOWLEDGE HUB — E-Waste Classifications

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/data-library/e-waste-classifications/ | /knowledge-hub/ewaste/ | PENDING | Index page |
| https://dexmetal.com/data-library/e-waste-classifications/2025-basel-e-waste-changes/ | /knowledge-hub/ewaste/2025-basel-e-waste-changes/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/battery-and-power-component-rules/ | /knowledge-hub/ewaste/battery-and-power-component-rules/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/circuit-board-classification/ | /knowledge-hub/ewaste/circuit-board-classification/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/component-level-classification/ | /knowledge-hub/ewaste/component-level-classification/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/crt-and-display-panel-guidelines/ | /knowledge-hub/ewaste/crt-and-display-panel-guidelines/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/hazardous-characteristics-assessment/ | /knowledge-hub/ewaste/hazardous-characteristics-assessment/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/mixed-e-waste-lot-guidance/ | /knowledge-hub/ewaste/mixed-e-waste-lot-guidance/ | PENDING | |
| https://dexmetal.com/data-library/e-waste-classifications/y49-vs-a1181-classification-guide/ | /knowledge-hub/ewaste/y49-vs-a1181-classification-guide/ | PENDING | |

---

## KNOWLEDGE HUB — Reference

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/additional-reference/ | /knowledge-hub/reference/ | PENDING | Index page |
| https://dexmetal.com/additional-reference/amendments-history/ | /knowledge-hub/reference/amendments-history/ | PENDING | |
| https://dexmetal.com/additional-reference/basel-glossary/ | /knowledge-hub/reference/glossary/ | PENDING | Specific mapping rule |
| https://dexmetal.com/additional-reference/code-reference-tables/ | /knowledge-hub/reference/code-reference-tables/ | PENDING | |
| https://dexmetal.com/additional-reference/e-waste-materials-reference/ | /knowledge-hub/reference/e-waste-materials-reference/ | PENDING | |
| https://dexmetal.com/additional-reference/esm-criteria/ | /knowledge-hub/reference/esm-criteria/ | PENDING | |
| https://dexmetal.com/additional-reference/sample-forms/ | /knowledge-hub/reference/sample-forms/ | PENDING | |
| https://dexmetal.com/data-library/ | /knowledge-hub/ | PENDING | Top-level hub index |

---

## TOOLS

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/checklist/ | /tools/checklist/ | PENDING | |
| https://dexmetal.com/quick-code-lookup/ | /tools/quick-code-lookup/ | PENDING | |
| https://dexmetal.com/notification-quick-view/ | /tools/notification-quick-view/ | PENDING | |
| https://dexmetal.com/movement-quick-view/ | /tools/movement-quick-view/ | PENDING | |
| https://dexmetal.com/basel-api/ | /tools/basel-ca-api/ | PENDING | |

---

## BLOG POSTS

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/the-20-annex-package-nobody-tells-you-about/ | /blog/the-20-annex-package-nobody-tells-you-about/ | PENDING | Top-level WP post |
| https://dexmetal.com/how-to-prepare-a-basel-notification-step-by-step-2026-update/ | /blog/how-to-prepare-a-basel-notification-step-by-step-2026-update/ | PENDING | Top-level WP post |
| https://dexmetal.com/blog-billion-dollar-ewaste-industry-opportunity/ | /blog/blog-billion-dollar-ewaste-industry-opportunity/ | PENDING | Slug has redundant `blog-` prefix — confirm with Richard |
| https://dexmetal.com/introducing-basel-api/ | /blog/introducing-basel-api/ | PENDING | Top-level WP post |
| https://dexmetal.com/basel-pic-2025-guide/ | /blog/basel-pic-2025-guide/ | PENDING | Top-level WP post |
| https://dexmetal.com/urban-mine-the-hunt/ | /blog/urban-mine-the-hunt/ | PENDING | Top-level WP post |
| https://dexmetal.com/red-tape-revenue-mastering-ewaste-compliance-codes/ | /blog/red-tape-revenue-mastering-ewaste-compliance-codes/ | PENDING | Top-level WP post |
| https://dexmetal.com/e-waste-safety-essentials/ | /blog/e-waste-safety-essentials/ | PENDING | Top-level WP post |

---

## UNMAPPED — REQUIRES DECISION

These URLs have no mapping rule and no clear new URL. Do not build until Richard decides.

| WordPress URL | New URL | Status | Notes |
|---|---|---|---|
| https://dexmetal.com/ulab-value-estimator/ | — | PENDING | No mapping rule — interactive tool? Assign to /tools/? |
| https://dexmetal.com/shipment-schedule-log-template/ | — | PENDING | No mapping rule — downloadable template? |
| https://dexmetal.com/data-library/emergency-plan/ | — | PENDING | No mapping rule — assign to /knowledge-hub/? |
| https://dexmetal.com/data-library/correspondence-log/ | — | PENDING | No mapping rule — assign to /knowledge-hub/? |
| https://dexmetal.com/data-library/compliance-checklist/ | — | PENDING | Possible duplicate of /checklist/ — confirm |
| https://dexmetal.com/basel-form-tool/ | — | PENDING | No mapping rule — interactive tool? |
| https://dexmetal.com/basel-checklist/ | — | PENDING | Possible duplicate of /checklist/ — confirm |
| https://dexmetal.com/illegal-traffic/ | — | PENDING | No mapping rule — assign to /knowledge-hub/reference/? |
| https://dexmetal.com/process-flowcharts/ | — | PENDING | No mapping rule — assign to /knowledge-hub/reference/? |
| https://dexmetal.com/reimport-guarantees/ | — | PENDING | Top-level duplicate of /data-library/supporting-documents/reimport-guarantees/ — 301 to /knowledge-hub/supporting-docs/reimport-guarantees/ |

---

## SUMMARY

| Category | Count |
|---|---|
| Core pages | 6 |
| Notification app (form-fields) | 23 |
| Movement document guide | 20 |
| Supporting documents | 10 |
| PIC procedure | 12 |
| Country requirements | 11 |
| E-waste classifications | 9 |
| Reference | 8 |
| Tools | 5 |
| Blog posts | 8 |
| Unmapped — needs decision | 10 |
| **Total** | **122** |

**DONE:** 0 | **PENDING:** 112 | **SKIP:** 2 | **Unmapped/flagged:** 10

---

## SESSION LOG

| Date | Action |
|---|---|
| 2026-04-04 | File created from wp-sitemap.xml — CSV not found, build from scratch |
