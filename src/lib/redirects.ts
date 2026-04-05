export interface Redirect {
  from: string
  to: string
  permanent: boolean
}

export const REDIRECTS: Redirect[] = [
  // API
  { from: '/basel-api/', to: '/tools/basel-ca-api', permanent: true },

  // Reference (additional-reference/* → knowledge-hub/reference/*)
  { from: '/additional-reference/basel-glossary/', to: '/knowledge-hub/reference/glossary', permanent: true },
  { from: '/additional-reference/code-reference-tables/', to: '/knowledge-hub/reference/code-reference-tables', permanent: true },
  { from: '/additional-reference/esm-criteria/', to: '/knowledge-hub/reference/esm-criteria', permanent: true },
  { from: '/additional-reference/sample-forms/', to: '/knowledge-hub/reference/sample-forms', permanent: true },
  { from: '/additional-reference/amendments-history/', to: '/knowledge-hub/reference/amendments-history', permanent: true },
  { from: '/additional-reference/e-waste-materials-reference/', to: '/knowledge-hub/reference/e-waste-materials-reference', permanent: true },
  { from: '/additional-reference/', to: '/knowledge-hub/reference', permanent: true },

  // Country
  { from: '/data-library/country-specific-requirements/competent-authority-contacts/', to: '/knowledge-hub/country/competent-authority-contacts', permanent: true },
  { from: '/data-library/country-specific-requirements/eu-waste-shipment/', to: '/knowledge-hub/country/eu-waste-shipment', permanent: true },
  { from: '/data-library/country-specific-requirements/africa-importing-countries/', to: '/knowledge-hub/country/africa-importing-countries', permanent: true },
  { from: '/data-library/country-specific-requirements/americas-importing-countries/', to: '/knowledge-hub/country/americas-importing-countries', permanent: true },
  { from: '/data-library/country-specific-requirements/asia-importing-countries/', to: '/knowledge-hub/country/asia-importing-countries', permanent: true },
  { from: '/data-library/country-specific-requirements/europe-importing-countries/', to: '/knowledge-hub/country/europe-importing-countries', permanent: true },
  { from: '/data-library/country-specific-requirements/oecd-procedures/', to: '/knowledge-hub/country/oecd-procedures', permanent: true },
  { from: '/data-library/country-specific-requirements/transit-countries/', to: '/knowledge-hub/country/transit-countries', permanent: true },
  { from: '/data-library/country-specific-requirements/us-export-requirements/', to: '/knowledge-hub/country/us-export-requirements', permanent: true },
  { from: '/data-library/country-specific-requirements/language-requirements/', to: '/knowledge-hub/country/language-requirements', permanent: true },
  { from: '/data-library/country-specific-requirements/', to: '/knowledge-hub/country', permanent: true },

  // E-Waste
  { from: '/data-library/e-waste-classifications/2025-basel-e-waste-changes/', to: '/knowledge-hub/ewaste/2025-basel-e-waste-changes', permanent: true },
  { from: '/data-library/e-waste-classifications/battery-and-power-component-rules/', to: '/knowledge-hub/ewaste/battery-and-power-component-rules', permanent: true },
  { from: '/data-library/e-waste-classifications/circuit-board-classification/', to: '/knowledge-hub/ewaste/circuit-board-classification', permanent: true },
  { from: '/data-library/e-waste-classifications/hazardous-characteristics-assessment/', to: '/knowledge-hub/ewaste/hazardous-characteristics-assessment', permanent: true },
  { from: '/data-library/e-waste-classifications/y49-vs-a1181-classification-guide/', to: '/knowledge-hub/ewaste/y49-vs-a1181-classification-guide', permanent: true },
  { from: '/data-library/e-waste-classifications/crt-and-display-panel-guidelines/', to: '/knowledge-hub/ewaste/crt-and-display-panel-guidelines', permanent: true },
  { from: '/data-library/e-waste-classifications/component-level-classification/', to: '/knowledge-hub/ewaste/component-level-classification', permanent: true },
  { from: '/data-library/e-waste-classifications/mixed-e-waste-lot-guidance/', to: '/knowledge-hub/ewaste/mixed-e-waste-lot-guidance', permanent: true },
  { from: '/data-library/e-waste-classifications/', to: '/knowledge-hub/ewaste', permanent: true },

  // Knowledge Hub — section indexes and special pages
  { from: '/data-library/form-fields/', to: '/knowledge-hub/notification-app', permanent: true },
  { from: '/data-library/pic-procedure/', to: '/knowledge-hub/pic', permanent: true },
  { from: '/data-library/supporting-documents/', to: '/knowledge-hub/supporting-docs', permanent: true },
  { from: '/start-basel-movement-document-guide/', to: '/knowledge-hub/movement-doc', permanent: true },
  { from: '/data-library/compliance-checklist/', to: '/tools/checklist', permanent: true },
  { from: '/data-library/correspondence-log/', to: '/knowledge-hub/basel-correspondence-record-log', permanent: true },
  { from: '/data-library/emergency-plan/', to: '/knowledge-hub/basel-emergency-response-plan', permanent: true },
  { from: '/illegal-traffic/', to: '/knowledge-hub/basel-illegal-traffic-enforcement', permanent: true },
  { from: '/process-flowcharts/', to: '/knowledge-hub/transboundary-movement-flowcharts', permanent: true },
  { from: '/data-library/', to: '/knowledge-hub', permanent: true },

  // Movement Doc
  { from: '/start-basel-movement-document-guide/movement-block-1-notification-number/', to: '/knowledge-hub/movement-doc/movement-notification-number', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-2-serial-number/', to: '/knowledge-hub/movement-doc/movement-serial-number', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-3-exporter-notifier/', to: '/knowledge-hub/movement-doc/movement-exporter-notifier', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-4-importer-consignee/', to: '/knowledge-hub/movement-doc/movement-importer-consignee', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-5-actual-quantity/', to: '/knowledge-hub/movement-doc/movement-actual-quantity', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-6-actual-date/', to: '/knowledge-hub/movement-doc/movement-actual-date', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-7-packaging/', to: '/knowledge-hub/movement-doc/movement-packaging', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-8-carriers/', to: '/knowledge-hub/movement-doc/movement-carriers', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-9-generator/', to: '/knowledge-hub/movement-doc/movement-generator', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-10-facility/', to: '/knowledge-hub/movement-doc/movement-facility', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-11-operation/', to: '/knowledge-hub/movement-doc/movement-operation', permanent: true },
  { from: '/movement-block-12-designation/', to: '/knowledge-hub/movement-doc/movement-designation', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-13-physical-characteristics/', to: '/knowledge-hub/movement-doc/movement-physical-characteristics', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-14-waste-identification/', to: '/knowledge-hub/movement-doc/movement-waste-identification', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-15-exporter-declaration/', to: '/knowledge-hub/movement-doc/movement-exporter-declaration', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-16-additional-information/', to: '/knowledge-hub/movement-doc/movement-designation', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-17-importer-acceptance/', to: '/knowledge-hub/movement-doc/movement-importer-acceptance', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-18-receipt/', to: '/knowledge-hub/movement-doc/movement-receipt', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-19-disposal-certification/', to: '/knowledge-hub/movement-doc/movement-disposal-certification', permanent: true },

  // Notification Doc
  { from: '/data-library/form-fields/block-1-exporter-notifier/', to: '/knowledge-hub/notification-app/exporter-notifier', permanent: true },
  { from: '/data-library/form-fields/block-2-importer-consignee/', to: '/knowledge-hub/notification-app/importer-consignee', permanent: true },
  { from: '/data-library/form-fields/block-3-notification-number/', to: '/knowledge-hub/notification-app/notification-number', permanent: true },
  { from: '/data-library/form-fields/block-4-total-shipments/', to: '/knowledge-hub/notification-app/total-shipments', permanent: true },
  { from: '/data-library/form-fields/block-5-total-quantity/', to: '/knowledge-hub/notification-app/total-quantity', permanent: true },
  { from: '/data-library/form-fields/block-6-intended-period/', to: '/knowledge-hub/notification-app/intended-period', permanent: true },
  { from: '/data-library/form-fields/block-7-packaging/', to: '/knowledge-hub/notification-app/packaging', permanent: true },
  { from: '/data-library/form-fields/block-8-intended-carriers/', to: '/knowledge-hub/notification-app/intended-carriers', permanent: true },
  { from: '/data-library/form-fields/block-9-waste-generator/', to: '/knowledge-hub/notification-app/waste-generator', permanent: true },
  { from: '/data-library/form-fields/block-10-disposal-facility/', to: '/knowledge-hub/notification-app/disposal-facility', permanent: true },
  { from: '/data-library/form-fields/block-11-operation-code/', to: '/knowledge-hub/notification-app/operation-code', permanent: true },
  { from: '/data-library/form-fields/block-12-waste-designation/', to: '/knowledge-hub/notification-app/waste-designation', permanent: true },
  { from: '/data-library/form-fields/block-13-physical-characteristics/', to: '/knowledge-hub/notification-app/physical-characteristics', permanent: true },
  { from: '/data-library/form-fields/block-14-waste-codes/', to: '/knowledge-hub/notification-app/waste-codes', permanent: true },
  { from: '/data-library/form-fields/block-15-countries-concerned/', to: '/knowledge-hub/notification-app/countries-concerned', permanent: true },
  { from: '/data-library/form-fields/block-16-customs-offices/', to: '/knowledge-hub/notification-app/customs-offices', permanent: true },
  { from: '/data-library/form-fields/block-17-declaration/', to: '/knowledge-hub/notification-app/declaration', permanent: true },
  { from: '/data-library/form-fields/block-18-annexes/', to: '/knowledge-hub/notification-app/annexes', permanent: true },
  { from: '/data-library/form-fields/block-19-ca-acknowledgement/', to: '/knowledge-hub/notification-app/ca-acknowledgement', permanent: true },
  { from: '/data-library/form-fields/block-20-consent/', to: '/knowledge-hub/notification-app/consent', permanent: true },
  { from: '/data-library/form-fields/block-21-conditions/', to: '/knowledge-hub/notification-app/conditions', permanent: true },

  // PIC Workflows
  { from: '/data-library/pic-procedure/appealing-rejections/', to: '/knowledge-hub/pic/appealing-rejections', permanent: true },
  { from: '/data-library/pic-procedure/authority-acknowledgment/', to: '/knowledge-hub/pic/authority-acknowledgment', permanent: true },
  { from: '/data-library/pic-procedure/final-authorization/', to: '/knowledge-hub/pic/final-authorization', permanent: true },
  { from: '/data-library/pic-procedure/import-country-response/', to: '/knowledge-hub/pic/import-country-response', permanent: true },
  { from: '/data-library/pic-procedure/notification-modifications/', to: '/knowledge-hub/pic/notification-modifications', permanent: true },
  { from: '/data-library/pic-procedure/notification-submission/', to: '/knowledge-hub/pic/notification-submission', permanent: true },
  { from: '/data-library/pic-procedure/pre-notification-preparation/', to: '/knowledge-hub/pic/pre-notification-preparation', permanent: true },
  { from: '/data-library/pic-procedure/regional-timelines/', to: '/knowledge-hub/pic/regional-timelines', permanent: true },
  { from: '/data-library/pic-procedure/rejection-reasons/', to: '/knowledge-hub/pic/rejection-reasons', permanent: true },
  { from: '/data-library/pic-procedure/transit-country-consent/', to: '/knowledge-hub/pic/transit-country-consent', permanent: true },

  // Supporting Docs
  { from: '/data-library/supporting-documents/document-checklist/', to: '/knowledge-hub/supporting-docs/document-checklist', permanent: true },
  { from: '/data-library/supporting-documents/contract-requirements/', to: '/knowledge-hub/supporting-docs/contract-requirements', permanent: true },
  { from: '/data-library/supporting-documents/esm-documentation/', to: '/knowledge-hub/supporting-docs/esm-documentation', permanent: true },
  { from: '/data-library/supporting-documents/facility-permits/', to: '/knowledge-hub/supporting-docs/facility-permits', permanent: true },
  { from: '/data-library/supporting-documents/financial-guarantees/', to: '/knowledge-hub/supporting-docs/financial-guarantees', permanent: true },
  { from: '/data-library/supporting-documents/movement-document/', to: '/knowledge-hub/supporting-docs/movement-document', permanent: true },
  { from: '/data-library/supporting-documents/reimport-guarantees/', to: '/knowledge-hub/supporting-docs/reimport-guarantees', permanent: true },
  { from: '/data-library/supporting-documents/transport-documentation/', to: '/knowledge-hub/supporting-docs/transport-documentation', permanent: true },
  { from: '/data-library/supporting-documents/waste-characterization/', to: '/knowledge-hub/supporting-docs/waste-characterization', permanent: true },
  { from: '/reimport-guarantees/', to: '/knowledge-hub/supporting-docs/reimport-guarantees', permanent: true },

  // Tools
  { from: '/checklist/', to: '/tools/checklist', permanent: true },
  { from: '/quick-code-lookup/', to: '/tools/quick-code-lookup', permanent: true },
  { from: '/notification-quick-view/', to: '/tools/notification-quick-view', permanent: true },
  { from: '/movement-quick-view/', to: '/tools/movement-quick-view', permanent: true },
  { from: '/ulab-value-estimator/', to: '/tools/ulab-value-estimator', permanent: true },
  { from: '/shipment-schedule-log-template/', to: '/tools/shipment-schedule-log', permanent: true },
  { from: '/basel-form-tool/', to: '/tools/basel-notification-form', permanent: true },
  { from: '/basel-checklist/', to: '/tools/checklist', permanent: true },

  // Blog posts (top-level WP posts → /blog/*)
  { from: '/the-20-annex-package-nobody-tells-you-about/', to: '/blog/the-20-annex-package-nobody-tells-you-about', permanent: true },
  { from: '/how-to-prepare-a-basel-notification-step-by-step-2026-update/', to: '/blog/how-to-prepare-a-basel-notification-step-by-step-2026-update', permanent: true },
  { from: '/blog-billion-dollar-ewaste-industry-opportunity/', to: '/blog/blog-billion-dollar-ewaste-industry-opportunity', permanent: true },
  { from: '/introducing-basel-api/', to: '/blog/introducing-basel-api', permanent: true },
  { from: '/basel-pic-2025-guide/', to: '/blog/basel-pic-2025-guide', permanent: true },
  { from: '/urban-mine-the-hunt/', to: '/blog/urban-mine-the-hunt', permanent: true },
  { from: '/red-tape-revenue-mastering-ewaste-compliance-codes/', to: '/blog/red-tape-revenue-mastering-ewaste-compliance-codes', permanent: true },
  { from: '/e-waste-safety-essentials/', to: '/blog/e-waste-safety-essentials', permanent: true },

  // Shell / core pages
  { from: '/about/', to: '/about', permanent: true },
  { from: '/blog/', to: '/blog', permanent: true },
  { from: '/contact/', to: '/contact', permanent: true },
  { from: '/privacy-policy/', to: '/privacy-policy', permanent: true },
]
