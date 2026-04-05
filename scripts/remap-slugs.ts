/**
 * Slug remapping script — locked URL structure 2026-04-04
 *
 * Updates slug fields in knowledge-hub-pages and tools collections
 * to match the locked URL structure defined in CLAUDE.md.
 * Does NOT touch any other fields (content, title, section, etc.)
 *
 * Usage (requires postgres running and .env loaded):
 *   pnpm remap:slugs
 *
 * Source of truth: MIGRATION.md
 * Key: wpUrl field on each record (never changes, set at migration time)
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

// ─── Slug map: wpUrl → new slug ──────────────────────────────────────────────
// Collection: knowledge-hub-pages

const KH_SLUG_MAP: Record<string, string> = {
  // ── Notification App (form-fields) ──────────────────────────────────────
  'https://dexmetal.com/data-library/form-fields/':                                                          'notification-app',
  'https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier/':                               'exporter-notifier',
  'https://dexmetal.com/data-library/form-fields/block-2-importer-consignee/':                              'importer-consignee',
  'https://dexmetal.com/data-library/form-fields/block-3-notification-number/':                             'notification-number',
  'https://dexmetal.com/data-library/form-fields/block-4-total-shipments/':                                 'total-shipments',
  'https://dexmetal.com/data-library/form-fields/block-5-total-quantity/':                                  'total-quantity',
  'https://dexmetal.com/data-library/form-fields/block-6-intended-period/':                                 'intended-period',
  'https://dexmetal.com/data-library/form-fields/block-7-packaging/':                                       'packaging',
  'https://dexmetal.com/data-library/form-fields/block-8-intended-carriers/':                               'intended-carriers',
  'https://dexmetal.com/data-library/form-fields/block-9-waste-generator/':                                 'waste-generator',
  'https://dexmetal.com/data-library/form-fields/block-10-disposal-facility/':                              'disposal-facility',
  'https://dexmetal.com/data-library/form-fields/block-11-operation-code/':                                 'operation-code',
  'https://dexmetal.com/data-library/form-fields/block-12-waste-designation/':                              'waste-designation',
  'https://dexmetal.com/data-library/form-fields/block-13-physical-characteristics/':                       'physical-characteristics',
  'https://dexmetal.com/data-library/form-fields/block-14-waste-codes/':                                    'waste-codes',
  'https://dexmetal.com/data-library/form-fields/block-15-countries-concerned/':                            'countries-concerned',
  'https://dexmetal.com/data-library/form-fields/block-16-customs-offices/':                                'customs-offices',
  'https://dexmetal.com/data-library/form-fields/block-17-declaration/':                                    'declaration',
  'https://dexmetal.com/data-library/form-fields/block-18-annexes/':                                        'annexes',
  'https://dexmetal.com/data-library/form-fields/block-19-ca-acknowledgement/':                             'ca-acknowledgement',
  'https://dexmetal.com/data-library/form-fields/block-20-consent/':                                        'consent',
  'https://dexmetal.com/data-library/form-fields/block-21-conditions/':                                     'conditions',

  // ── Movement Document Guide ──────────────────────────────────────────────
  'https://dexmetal.com/start-basel-movement-document-guide/':                                               'movement-doc',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-1-notification-number/':         'movement-notification-number',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-2-serial-number/':               'movement-serial-number',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-3-exporter-notifier/':           'movement-exporter-notifier',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-4-importer-consignee/':          'movement-importer-consignee',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-5-actual-quantity/':             'movement-actual-quantity',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-6-actual-date/':                 'movement-actual-date',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-7-packaging/':                   'movement-packaging',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-8-carriers/':                    'movement-carriers',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-9-generator/':                   'movement-generator',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-10-facility/':                   'movement-facility',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-11-operation/':                  'movement-operation',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-13-physical-characteristics/':   'movement-physical-characteristics',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-14-waste-identification/':       'movement-waste-identification',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-15-exporter-declaration/':       'movement-exporter-declaration',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-16-additional-information/':     'movement-additional-information',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-17-importer-acceptance/':        'movement-importer-acceptance',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-18-receipt/':                    'movement-receipt',
  'https://dexmetal.com/start-basel-movement-document-guide/movement-block-19-disposal-certification/':     'movement-disposal-certification',

  // ── Supporting Documents ─────────────────────────────────────────────────
  'https://dexmetal.com/data-library/supporting-documents/':                                                 'supporting-docs',
  'https://dexmetal.com/data-library/supporting-documents/contract-requirements/':                          'contract-requirements',
  'https://dexmetal.com/data-library/supporting-documents/document-checklist/':                             'document-checklist',
  'https://dexmetal.com/data-library/supporting-documents/esm-documentation/':                              'esm-documentation',
  'https://dexmetal.com/data-library/supporting-documents/facility-permits/':                               'facility-permits',
  'https://dexmetal.com/data-library/supporting-documents/financial-guarantees/':                           'financial-guarantees',
  'https://dexmetal.com/data-library/supporting-documents/movement-document/':                              'movement-document',
  'https://dexmetal.com/data-library/supporting-documents/reimport-guarantees/':                            'reimport-guarantees',
  'https://dexmetal.com/data-library/supporting-documents/transport-documentation/':                        'transport-documentation',
  'https://dexmetal.com/data-library/supporting-documents/waste-characterization/':                         'waste-characterization',

  // ── PIC Procedure ────────────────────────────────────────────────────────
  'https://dexmetal.com/data-library/pic-procedure/':                                                        'pic-overview',
  'https://dexmetal.com/data-library/pic-procedure/appealing-rejections/':                                  'appealing-rejections',
  'https://dexmetal.com/data-library/pic-procedure/authority-acknowledgment/':                               'authority-acknowledgment',
  'https://dexmetal.com/data-library/pic-procedure/final-authorization/':                                   'final-authorization',
  'https://dexmetal.com/data-library/pic-procedure/import-country-response/':                               'import-country-response',
  'https://dexmetal.com/data-library/pic-procedure/notification-modifications/':                            'notification-modifications',
  'https://dexmetal.com/data-library/pic-procedure/notification-submission/':                               'notification-submission',
  'https://dexmetal.com/data-library/pic-procedure/pre-notification-preparation/':                          'pre-notification-preparation',
  'https://dexmetal.com/data-library/pic-procedure/regional-timelines/':                                    'regional-timelines',
  'https://dexmetal.com/data-library/pic-procedure/rejection-reasons/':                                     'rejection-reasons',
  'https://dexmetal.com/data-library/pic-procedure/transit-country-consent/':                               'transit-country-consent',

  // ── Country Requirements ─────────────────────────────────────────────────
  'https://dexmetal.com/data-library/country-specific-requirements/':                                        'country',
  'https://dexmetal.com/data-library/country-specific-requirements/africa-importing-countries/':             'africa-importing-countries',
  'https://dexmetal.com/data-library/country-specific-requirements/americas-importing-countries/':           'americas-importing-countries',
  'https://dexmetal.com/data-library/country-specific-requirements/asia-importing-countries/':               'asia-importing-countries',
  'https://dexmetal.com/data-library/country-specific-requirements/competent-authority-contacts/':           'competent-authority-contacts',
  'https://dexmetal.com/data-library/country-specific-requirements/eu-waste-shipment/':                     'eu-waste-shipment',
  'https://dexmetal.com/data-library/country-specific-requirements/europe-importing-countries/':             'europe-importing-countries',
  'https://dexmetal.com/data-library/country-specific-requirements/language-requirements/':                 'language-requirements',
  'https://dexmetal.com/data-library/country-specific-requirements/oecd-procedures/':                       'oecd-procedures',
  'https://dexmetal.com/data-library/country-specific-requirements/transit-countries/':                     'transit-countries',
  'https://dexmetal.com/data-library/country-specific-requirements/us-export-requirements/':                'us-export-requirements',

  // ── E-Waste Classifications ──────────────────────────────────────────────
  'https://dexmetal.com/data-library/e-waste-classifications/':                                              'ewaste',
  'https://dexmetal.com/data-library/e-waste-classifications/2025-basel-e-waste-changes/':                  '2025-basel-e-waste-changes',
  'https://dexmetal.com/data-library/e-waste-classifications/battery-and-power-component-rules/':           'battery-and-power-component-rules',
  'https://dexmetal.com/data-library/e-waste-classifications/circuit-board-classification/':                'circuit-board-classification',
  'https://dexmetal.com/data-library/e-waste-classifications/component-level-classification/':              'component-level-classification',
  'https://dexmetal.com/data-library/e-waste-classifications/crt-and-display-panel-guidelines/':            'crt-and-display-panel-guidelines',
  'https://dexmetal.com/data-library/e-waste-classifications/hazardous-characteristics-assessment/':        'hazardous-characteristics-assessment',
  'https://dexmetal.com/data-library/e-waste-classifications/mixed-e-waste-lot-guidance/':                  'mixed-e-waste-lot-guidance',
  'https://dexmetal.com/data-library/e-waste-classifications/y49-vs-a1181-classification-guide/':           'y49-vs-a1181-classification-guide',

  // ── Reference ────────────────────────────────────────────────────────────
  'https://dexmetal.com/additional-reference/':                                                              'reference',
  'https://dexmetal.com/additional-reference/amendments-history/':                                          'amendments-history',
  'https://dexmetal.com/additional-reference/basel-glossary/':                                              'glossary',
  'https://dexmetal.com/additional-reference/code-reference-tables/':                                       'code-reference-tables',
  'https://dexmetal.com/additional-reference/e-waste-materials-reference/':                                 'e-waste-materials-reference',
  'https://dexmetal.com/additional-reference/esm-criteria/':                                                'esm-criteria',
  'https://dexmetal.com/additional-reference/sample-forms/':                                                'sample-forms',

  // ── Knowledge Hub index + misc (no section prefix needed) ───────────────
  'https://dexmetal.com/data-library/':                                                                      'knowledge-hub',
  'https://dexmetal.com/data-library/compliance-checklist/':                                                 'basel-compliance-checklist',
  'https://dexmetal.com/illegal-traffic/':                                                                   'illegal-traffic',
  'https://dexmetal.com/process-flowcharts/':                                                                'process-flowcharts',
  'https://dexmetal.com/data-library/correspondence-log/':                                                   'correspondence-log',
  'https://dexmetal.com/data-library/emergency-plan/':                                                       'emergency-plan',
}

// ─── Slug map: wpUrl → new slug ──────────────────────────────────────────────
// Collection: tools

const TOOLS_SLUG_MAP: Record<string, string> = {
  'https://dexmetal.com/checklist/':              'checklist',
  'https://dexmetal.com/quick-code-lookup/':      'quick-code-lookup',
  'https://dexmetal.com/notification-quick-view/': 'notification-quick-view',
  'https://dexmetal.com/movement-quick-view/':    'movement-quick-view',
  'https://dexmetal.com/basel-api/':              'basel-ca-api',
  'https://dexmetal.com/ulab-value-estimator/':   'ulab-value-estimator',
  'https://dexmetal.com/shipment-schedule-log-template/': 'shipment-schedule-log',
  'https://dexmetal.com/basel-form-tool/':        'basel-notification-form',
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config })

  let updated = 0
  let skipped = 0
  let notFound = 0
  const changes: string[] = []

  // ── knowledge-hub-pages ──────────────────────────────────────────────────
  console.log('\n=== Remapping knowledge-hub-pages slugs ===\n')

  for (const [wpUrl, newSlug] of Object.entries(KH_SLUG_MAP)) {
    const result = await payload.find({
      collection: 'knowledge-hub-pages',
      where: { wpUrl: { equals: wpUrl } },
      limit: 1,
      pagination: false,
      select: { slug: true, title: true },
    })

    const doc = result.docs[0]

    if (!doc) {
      console.log(`  NOT FOUND: ${wpUrl}`)
      notFound++
      continue
    }

    const oldSlug = doc.slug

    if (oldSlug === newSlug) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'knowledge-hub-pages',
      id: doc.id,
      data: { slug: newSlug },
    })

    const line = `  ✓  ${oldSlug}  →  ${newSlug}  (${doc.title})`
    console.log(line)
    changes.push(line)
    updated++
  }

  // ── tools ────────────────────────────────────────────────────────────────
  console.log('\n=== Remapping tools slugs ===\n')

  for (const [wpUrl, newSlug] of Object.entries(TOOLS_SLUG_MAP)) {
    const result = await payload.find({
      collection: 'tools',
      where: { wpUrl: { equals: wpUrl } },
      limit: 1,
      pagination: false,
      select: { slug: true, title: true },
    })

    const doc = result.docs[0]

    if (!doc) {
      // Tools may not have wpUrl field — skip silently
      skipped++
      continue
    }

    const oldSlug = doc.slug

    if (oldSlug === newSlug) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'tools',
      id: doc.id,
      data: { slug: newSlug },
    })

    const line = `  ✓  ${oldSlug}  →  ${newSlug}  (${doc.title})`
    console.log(line)
    changes.push(line)
    updated++
  }

  console.log('\n=== Summary ===')
  console.log(`  Updated : ${updated}`)
  console.log(`  Skipped : ${skipped} (already correct)`)
  console.log(`  Not found: ${notFound}`)
  console.log('\nDone.')

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
