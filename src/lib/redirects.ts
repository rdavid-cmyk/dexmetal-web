export interface Redirect {
  from: string
  to: string
  permanent: boolean
}

export const REDIRECTS: Redirect[] = [
  // API
  { from: '/basel-api/', to: '/basel-ca-api', permanent: true },

  // Additional Ref
  { from: '/additional-reference/basel-glossary/', to: '/knowledge-hub/basel-convention-glossary', permanent: true },
  { from: '/additional-reference/code-reference-tables/', to: '/knowledge-hub/basel-complete-code-reference-tables', permanent: true },
  { from: '/additional-reference/esm-criteria/', to: '/knowledge-hub/environmentally-sound-management-criteria', permanent: true },
  { from: '/additional-reference/sample-forms/', to: '/knowledge-hub/sample-completed-basel-forms', permanent: true },
  { from: '/additional-reference/', to: '/knowledge-hub/additional-reference', permanent: true },
  { from: '/additional-reference/amendments-history/', to: '/knowledge-hub/basel-convention-amendments-history', permanent: true },
  { from: '/additional-reference/e-waste-materials-reference/', to: '/knowledge-hub/common-ewaste-materials-reference', permanent: true },

  // Country
  { from: '/data-library/country-specific-requirements/competent-authority-contacts/', to: '/knowledge-hub/competent-authority-contact-directory', permanent: true },
  { from: '/data-library/country-specific-requirements/eu-waste-shipment/', to: '/knowledge-hub/eu-waste-shipment-regulation', permanent: true },
  { from: '/data-library/country-specific-requirements/africa-importing-countries/', to: '/knowledge-hub/major-importing-countries-africa', permanent: true },
  { from: '/data-library/country-specific-requirements/americas-importing-countries/', to: '/knowledge-hub/major-importing-countries-americas', permanent: true },
  { from: '/data-library/country-specific-requirements/asia-importing-countries/', to: '/knowledge-hub/major-importing-countries-asia', permanent: true },
  { from: '/data-library/country-specific-requirements/europe-importing-countries/', to: '/knowledge-hub/major-importing-countries-europe', permanent: true },
  { from: '/data-library/country-specific-requirements/oecd-procedures/', to: '/knowledge-hub/oecd-member-country-basel-procedures', permanent: true },
  { from: '/data-library/country-specific-requirements/transit-countries/', to: '/knowledge-hub/basel-transit-countries-common-routes', permanent: true },
  { from: '/data-library/country-specific-requirements/us-export-requirements/', to: '/knowledge-hub/us-hazardous-waste-export-requirements', permanent: true },
  { from: '/data-library/country-specific-requirements/language-requirements/', to: '/knowledge-hub/basel-language-requirements-by-country', permanent: true },

  // E-Waste
  { from: '/data-library/e-waste-classifications/2025-basel-e-waste-changes/', to: '/knowledge-hub/2025-basel-ewaste-changes', permanent: true },
  { from: '/data-library/e-waste-classifications/battery-and-power-component-rules/', to: '/knowledge-hub/battery-power-component-basel-rules', permanent: true },
  { from: '/data-library/e-waste-classifications/circuit-board-classification/', to: '/knowledge-hub/circuit-board-basel-classification', permanent: true },
  { from: '/data-library/e-waste-classifications/hazardous-characteristics-assessment/', to: '/knowledge-hub/hazardous-characteristics-assessment-ewaste', permanent: true },
  { from: '/data-library/e-waste-classifications/y49-vs-a1181-classification-guide/', to: '/knowledge-hub/y49-vs-a1181-ewaste-classification', permanent: true },
  { from: '/data-library/e-waste-classifications/crt-and-display-panel-guidelines/', to: '/knowledge-hub/crt-display-panel-basel-guidelines', permanent: true },
  { from: '/data-library/e-waste-classifications/component-level-classification/', to: '/knowledge-hub/component-level-ewaste-classification', permanent: true },
  { from: '/data-library/e-waste-classifications/mixed-e-waste-lot-guidance/', to: '/knowledge-hub/mixed-ewaste-lot-guidance', permanent: true },

  // Knowledge Hub
  { from: '/data-library/compliance-checklist/', to: '/knowledge-hub/basel-compliance-checklist', permanent: true },
  { from: '/data-library/form-fields/', to: '/knowledge-hub/basel-notification-document-guide', permanent: true },
  { from: '/data-library/', to: '/knowledge-hub', permanent: true },
  { from: '/start-basel-movement-document-guide/', to: '/knowledge-hub/basel-movement-document-guide', permanent: true },
  { from: '/data-library/country-specific-requirements/', to: '/knowledge-hub/country-specific-basel-requirements', permanent: true },
  { from: '/illegal-traffic/', to: '/knowledge-hub/basel-illegal-traffic-enforcement', permanent: true },
  { from: '/data-library/pic-procedure/', to: '/knowledge-hub/pic-prior-informed-consent-workflows', permanent: true },
  { from: '/data-library/supporting-documents/', to: '/knowledge-hub/basel-supporting-documents', permanent: true },
  { from: '/process-flowcharts/', to: '/knowledge-hub/transboundary-movement-flowcharts', permanent: true },
  { from: '/data-library/e-waste-classifications/', to: '/knowledge-hub/ewaste-basel-classifications', permanent: true },
  { from: '/data-library/correspondence-log/', to: '/knowledge-hub/basel-correspondence-record-log', permanent: true },
  { from: '/data-library/emergency-plan/', to: '/knowledge-hub/basel-emergency-response-plan', permanent: true },

  // Movement Doc
  { from: '/start-basel-movement-document-guide/movement-block-6-actual-date/', to: '/knowledge-hub/movement-document-actual-shipment-date', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-10-facility/', to: '/knowledge-hub/movement-document-disposal-recovery-facility', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-11-operation/', to: '/knowledge-hub/movement-document-disposal-recovery-operation', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-13-physical-characteristics/', to: '/knowledge-hub/movement-document-physical-characteristics', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-1-notification-number/', to: '/knowledge-hub/movement-document-notification-number', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-16-additional-information/', to: '/knowledge-hub/movement-document-customs', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-19-disposal-certification/', to: '/knowledge-hub/movement-document-disposal-recovery-certification', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-15-exporter-declaration/', to: '/knowledge-hub/movement-document-exporter-declaration', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-3-exporter-notifier/', to: '/knowledge-hub/movement-document-exporter-notifier', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-4-importer-consignee/', to: '/knowledge-hub/movement-document-importer-consignee', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-17-importer-acceptance/', to: '/knowledge-hub/movement-document-importer-acceptance', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-2-serial-number/', to: '/knowledge-hub/movement-document-serial-total-number', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-5-actual-quantity/', to: '/knowledge-hub/movement-document-actual-quantity', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-7-packaging/', to: '/knowledge-hub/movement-document-packaging-handling', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-8-carriers/', to: '/knowledge-hub/movement-document-carrier-signatures', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-9-generator/', to: '/knowledge-hub/movement-document-waste-generator', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-18-receipt/', to: '/knowledge-hub/movement-document-receipt-at-facility', permanent: true },
  { from: '/start-basel-movement-document-guide/movement-block-14-waste-identification/', to: '/knowledge-hub/movement-document-waste-identification', permanent: true },

  // Notification Doc
  { from: '/data-library/form-fields/block-10-disposal-facility/', to: '/knowledge-hub/notification-disposal-recovery-facility', permanent: true },
  { from: '/data-library/form-fields/block-11-operation-code/', to: '/knowledge-hub/notification-disposal-recovery-operation', permanent: true },
  { from: '/data-library/form-fields/block-12-waste-designation/', to: '/knowledge-hub/notification-waste-designation-composition', permanent: true },
  { from: '/data-library/form-fields/block-13-physical-characteristics/', to: '/knowledge-hub/notification-waste-physical-characteristics', permanent: true },
  { from: '/data-library/form-fields/block-14-waste-codes/', to: '/knowledge-hub/notification-waste-identification-classification', permanent: true },
  { from: '/data-library/form-fields/block-15-countries-concerned/', to: '/knowledge-hub/notification-countries-border-crossings', permanent: true },
  { from: '/data-library/form-fields/block-16-customs-offices/', to: '/knowledge-hub/notification-customs-offices-eu', permanent: true },
  { from: '/data-library/form-fields/block-17-declaration/', to: '/knowledge-hub/notification-exporter-generator-declaration', permanent: true },
  { from: '/data-library/form-fields/block-18-annexes/', to: '/knowledge-hub/notification-annexes-attached', permanent: true },
  { from: '/data-library/form-fields/block-19-ca-acknowledgement/', to: '/knowledge-hub/notification-competent-authority-acknowledgement', permanent: true },
  { from: '/data-library/form-fields/block-1-exporter-notifier/', to: '/knowledge-hub/notification-exporter-notifier-registration', permanent: true },
  { from: '/data-library/form-fields/block-20-consent/', to: '/knowledge-hub/notification-competent-authority-consent-objection', permanent: true },
  { from: '/data-library/form-fields/block-21-conditions/', to: '/knowledge-hub/notification-specific-conditions-objection-reasons', permanent: true },
  { from: '/data-library/form-fields/block-2-importer-consignee/', to: '/knowledge-hub/notification-importer-consignee-information', permanent: true },
  { from: '/data-library/form-fields/block-3-notification-number/', to: '/knowledge-hub/notification-number-shipment-type', permanent: true },
  { from: '/data-library/form-fields/block-4-total-shipments/', to: '/knowledge-hub/notification-total-intended-shipments', permanent: true },
  { from: '/data-library/form-fields/block-5-total-quantity/', to: '/knowledge-hub/notification-total-intended-quantity', permanent: true },
  { from: '/data-library/form-fields/block-6-intended-period/', to: '/knowledge-hub/notification-shipment-period', permanent: true },
  { from: '/data-library/form-fields/block-7-packaging/', to: '/knowledge-hub/notification-packaging-special-handling', permanent: true },
  { from: '/data-library/form-fields/block-8-intended-carriers/', to: '/knowledge-hub/notification-intended-carriers', permanent: true },
  { from: '/data-library/form-fields/block-9-waste-generator/', to: '/knowledge-hub/notification-waste-generator-producer', permanent: true },

  // PIC Workflows
  { from: '/data-library/pic-procedure/rejection-reasons/', to: '/knowledge-hub/pic-common-rejection-reasons', permanent: true },
  { from: '/data-library/pic-procedure/authority-acknowledgment/', to: '/knowledge-hub/pic-competent-authority-acknowledgment', permanent: true },
  { from: '/data-library/pic-procedure/final-authorization/', to: '/knowledge-hub/pic-final-authorization', permanent: true },
  { from: '/data-library/pic-procedure/import-country-response/', to: '/knowledge-hub/pic-import-country-response', permanent: true },
  { from: '/data-library/pic-procedure/notification-submission/', to: '/knowledge-hub/pic-notification-submission', permanent: true },
  { from: '/data-library/pic-procedure/pre-notification-preparation/', to: '/knowledge-hub/pic-pre-notification-preparation', permanent: true },
  { from: '/data-library/pic-procedure/regional-timelines/', to: '/knowledge-hub/pic-timeline-expectations-by-region', permanent: true },
  { from: '/data-library/pic-procedure/transit-country-consent/', to: '/knowledge-hub/pic-transit-country-consent', permanent: true },
  { from: '/data-library/pic-procedure/appealing-rejections/', to: '/knowledge-hub/pic-appealing-rejections', permanent: true },
  { from: '/data-library/pic-procedure/notification-modifications/', to: '/knowledge-hub/pic-notification-modifications', permanent: true },

  // Shell
  { from: '/about/', to: '/about', permanent: true },
  { from: '/blog/', to: '/blog', permanent: true },
  { from: '/contact/', to: '/contact', permanent: true },
  { from: '/privacy-policy/', to: '/privacy-policy', permanent: true },

  // Supporting Docs
  { from: '/data-library/supporting-documents/document-checklist/', to: '/knowledge-hub/basel-complete-document-checklist', permanent: true },
  { from: '/data-library/supporting-documents/contract-requirements/', to: '/knowledge-hub/basel-contract-requirements', permanent: true },
  { from: '/data-library/supporting-documents/esm-documentation/', to: '/knowledge-hub/esm-documentation-requirements', permanent: true },
  { from: '/data-library/supporting-documents/facility-permits/', to: '/knowledge-hub/facility-permits-authorizations', permanent: true },
  { from: '/data-library/supporting-documents/financial-guarantees/', to: '/knowledge-hub/financial-guarantee-insurance-basel', permanent: true },
  { from: '/data-library/supporting-documents/movement-document/', to: '/knowledge-hub/movement-document-annex-v-b', permanent: true },
  { from: '/data-library/supporting-documents/reimport-guarantees/', to: '/knowledge-hub/re-import-guarantee-documentation', permanent: true },
  { from: '/data-library/supporting-documents/transport-documentation/', to: '/knowledge-hub/basel-transport-documentation', permanent: true },
  { from: '/data-library/supporting-documents/waste-characterization/', to: '/knowledge-hub/waste-characterization-reports', permanent: true },

  // Tools
  { from: '/basel-form-tool/', to: '/tools/basel-notification-form', permanent: true },
  { from: '/movement-quick-view/', to: '/tools/movement-document-checklist', permanent: true },
  { from: '/notification-quick-view/', to: '/tools/notification-document-checklist', permanent: true },
  { from: '/quick-code-lookup/', to: '/tools/basel-waste-code-lookup', permanent: true },
  { from: '/checklist/', to: '/tools/basel-compliance-checklist', permanent: true },
  { from: '/ulab-value-estimator/', to: '/tools/ulab-value-estimator', permanent: true },
  { from: '/shipment-schedule-log-template/', to: '/tools/shipment-schedule-log', permanent: true },
]
