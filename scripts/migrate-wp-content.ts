import { getPayload } from 'payload'
import config from '../src/payload.config'
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ManifestEntry {
  postId: number
  section: string
  pageType: string
  priority: string
  title: string
  wpUrl: string
  newPath: string
}

interface WordPressPost {
  post_id: string | number
  title: string
  content: string
  wpUrl: string
  postDate: string
  status: string
}

const MANIFEST: ManifestEntry[] = [
  { postId: 12125, section: 'API', pageType: 'landing', priority: 'P1', title: 'Basel API - Automate Competent Authority Lookups', wpUrl: 'https://dexmetal.com/basel-api/', newPath: '/basel-ca-api' },
  { postId: 6605, section: 'Additional Ref', pageType: 'reference', priority: 'P1', title: 'Basel Convention Glossary', wpUrl: 'https://dexmetal.com/additional-reference/basel-glossary/', newPath: '/knowledge-hub/basel-convention-glossary' },
  { postId: 6600, section: 'Additional Ref', pageType: 'reference', priority: 'P1', title: 'Complete Code Reference Tables', wpUrl: 'https://dexmetal.com/additional-reference/code-reference-tables/', newPath: '/knowledge-hub/basel-complete-code-reference-tables' },
  { postId: 6614, section: 'Additional Ref', pageType: 'guide', priority: 'P1', title: 'Environmentally Sound Management (ESM) Criteria', wpUrl: 'https://dexmetal.com/additional-reference/esm-criteria/', newPath: '/knowledge-hub/environmentally-sound-management-criteria' },
  { postId: 6620, section: 'Additional Ref', pageType: 'reference', priority: 'P1', title: 'Sample Completed Forms', wpUrl: 'https://dexmetal.com/additional-reference/sample-forms/', newPath: '/knowledge-hub/sample-completed-basel-forms' },
  { postId: 6594, section: 'Additional Ref', pageType: 'index', priority: 'P2', title: 'Additional Reference Content', wpUrl: 'https://dexmetal.com/additional-reference/', newPath: '/knowledge-hub/additional-reference' },
  { postId: 6629, section: 'Additional Ref', pageType: 'guide', priority: 'P2', title: 'Amendments History and Future Changes', wpUrl: 'https://dexmetal.com/additional-reference/amendments-history/', newPath: '/knowledge-hub/basel-convention-amendments-history' },
  { postId: 6609, section: 'Additional Ref', pageType: 'reference', priority: 'P2', title: 'Common E-Waste Materials Reference', wpUrl: 'https://dexmetal.com/additional-reference/e-waste-materials-reference/', newPath: '/knowledge-hub/common-ewaste-materials-reference' },
  { postId: 6468, section: 'Country', pageType: 'reference', priority: 'P1', title: 'Competent Authority Contact Directory', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/competent-authority-contacts/', newPath: '/knowledge-hub/competent-authority-contact-directory' },
  { postId: 6476, section: 'Country', pageType: 'guide', priority: 'P1', title: 'EU Waste Shipment Regulation', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/eu-waste-shipment/', newPath: '/knowledge-hub/eu-waste-shipment-regulation' },
  { postId: 6462, section: 'Country', pageType: 'guide', priority: 'P1', title: 'Major Importing Countries: Africa', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/africa-importing-countries/', newPath: '/knowledge-hub/major-importing-countries-africa' },
  { postId: 6459, section: 'Country', pageType: 'guide', priority: 'P1', title: 'Major Importing Countries: Americas', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/americas-importing-countries/', newPath: '/knowledge-hub/major-importing-countries-americas' },
  { postId: 6453, section: 'Country', pageType: 'guide', priority: 'P1', title: 'Major Importing Countries: Asia', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/asia-importing-countries/', newPath: '/knowledge-hub/major-importing-countries-asia' },
  { postId: 6456, section: 'Country', pageType: 'guide', priority: 'P1', title: 'Major Importing Countries: Europe', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/europe-importing-countries/', newPath: '/knowledge-hub/major-importing-countries-europe' },
  { postId: 6474, section: 'Country', pageType: 'guide', priority: 'P1', title: 'OECD Member Country Procedures', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/oecd-procedures/', newPath: '/knowledge-hub/oecd-member-country-basel-procedures' },
  { postId: 6464, section: 'Country', pageType: 'guide', priority: 'P1', title: 'Transit Countries: Common Routes', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/transit-countries/', newPath: '/knowledge-hub/basel-transit-countries-common-routes' },
  { postId: 6479, section: 'Country', pageType: 'guide', priority: 'P1', title: 'US Export Requirements (Non-Party Status)', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/us-export-requirements/', newPath: '/knowledge-hub/us-hazardous-waste-export-requirements' },
  { postId: 6470, section: 'Country', pageType: 'reference', priority: 'P2', title: 'Language Requirements by Country', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/language-requirements/', newPath: '/knowledge-hub/basel-language-requirements-by-country' },
  { postId: 5695, section: 'E-Waste', pageType: 'guide', priority: 'P1', title: '2025 Basel E-Waste Changes', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/2025-basel-e-waste-changes/', newPath: '/knowledge-hub/2025-basel-ewaste-changes' },
  { postId: 5701, section: 'E-Waste', pageType: 'guide', priority: 'P1', title: 'Battery and Power Component Rules', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/battery-and-power-component-rules/', newPath: '/knowledge-hub/battery-power-component-basel-rules' },
  { postId: 5703, section: 'E-Waste', pageType: 'guide', priority: 'P1', title: 'Circuit Board Classification', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/circuit-board-classification/', newPath: '/knowledge-hub/circuit-board-basel-classification' },
  { postId: 5693, section: 'E-Waste', pageType: 'guide', priority: 'P1', title: 'Hazardous Characteristics Assessment', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/hazardous-characteristics-assessment/', newPath: '/knowledge-hub/hazardous-characteristics-assessment-ewaste' },
  { postId: 5690, section: 'E-Waste', pageType: 'guide', priority: 'P1', title: 'Y49 vs A1181 Classification Guide', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/y49-vs-a1181-classification-guide/', newPath: '/knowledge-hub/y49-vs-a1181-ewaste-classification' },
  { postId: 5699, section: 'E-Waste', pageType: 'guide', priority: 'P2', title: 'CRT and Display Panel Guidelines', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/crt-and-display-panel-guidelines/', newPath: '/knowledge-hub/crt-display-panel-basel-guidelines' },
  { postId: 5697, section: 'E-Waste', pageType: 'guide', priority: 'P2', title: 'Component-Level Classification', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/component-level-classification/', newPath: '/knowledge-hub/component-level-ewaste-classification' },
  { postId: 5705, section: 'E-Waste', pageType: 'guide', priority: 'P2', title: 'Mixed E-Waste Lot Guidance', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/mixed-e-waste-lot-guidance/', newPath: '/knowledge-hub/mixed-ewaste-lot-guidance' },
  { postId: 9491, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Basel Compliance Checklist', wpUrl: 'https://dexmetal.com/data-library/compliance-checklist/', newPath: '/knowledge-hub/basel-compliance-checklist' },
  { postId: 5403, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Basel Export Application Form Guide (Notification Document)', wpUrl: 'https://dexmetal.com/data-library/form-fields/', newPath: '/knowledge-hub/basel-notification-document-guide' },
  { postId: 5401, section: 'Knowledge Hub', pageType: 'index', priority: 'P1', title: 'Basel Knowledge Hub', wpUrl: 'https://dexmetal.com/data-library/', newPath: '/knowledge-hub' },
  { postId: 6936, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Basel Movement Document Guide', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/', newPath: '/knowledge-hub/basel-movement-document-guide' },
  { postId: 6426, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Country-Specific Requirements', wpUrl: 'https://dexmetal.com/data-library/country-specific-requirements/', newPath: '/knowledge-hub/country-specific-basel-requirements' },
  { postId: 6625, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Illegal Traffic and Enforcement', wpUrl: 'https://dexmetal.com/illegal-traffic/', newPath: '/knowledge-hub/basel-illegal-traffic-enforcement' },
  { postId: 6261, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'PIC Procedure Workflows', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/', newPath: '/knowledge-hub/pic-prior-informed-consent-workflows' },
  { postId: 6381, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Supporting Documents', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/', newPath: '/knowledge-hub/basel-supporting-documents' },
  { postId: 6617, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'Transboundary Movement Flowcharts', wpUrl: 'https://dexmetal.com/process-flowcharts/', newPath: '/knowledge-hub/transboundary-movement-flowcharts' },
  { postId: 5667, section: 'Knowledge Hub', pageType: 'guide', priority: 'P1', title: 'e-Waste Classifications', wpUrl: 'https://dexmetal.com/data-library/e-waste-classifications/', newPath: '/knowledge-hub/ewaste-basel-classifications' },
  { postId: 17567, section: 'Knowledge Hub', pageType: 'tool', priority: 'P2', title: 'Correspondence Record Log', wpUrl: 'https://dexmetal.com/data-library/correspondence-log/', newPath: '/knowledge-hub/basel-correspondence-record-log' },
  { postId: 17387, section: 'Knowledge Hub', pageType: 'guide', priority: 'P2', title: 'Emergency Response Plan', wpUrl: 'https://dexmetal.com/data-library/emergency-plan/', newPath: '/knowledge-hub/basel-emergency-response-plan' },
  { postId: 7011, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Actual Date of Shipment (Movement Block 6)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-6-actual-date/', newPath: '/knowledge-hub/movement-document-actual-shipment-date' },
  { postId: 7082, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Block 10: Disposal/Recovery Facility', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-10-facility/', newPath: '/knowledge-hub/movement-document-disposal-recovery-facility' },
  { postId: 18823, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Block 11: Disposal/Recovery Operation', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-11-operation/', newPath: '/knowledge-hub/movement-document-disposal-recovery-operation' },
  { postId: 19274, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Block 13: Physical Characteristics', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-13-physical-characteristics/', newPath: '/knowledge-hub/movement-document-physical-characteristics' },
  { postId: 6974, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Block 1: Notification Number', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-1-notification-number/', newPath: '/knowledge-hub/movement-document-notification-number' },
  { postId: 7101, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Customs (Movement Block 16)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-16-additional-information/', newPath: '/knowledge-hub/movement-document-customs' },
  { postId: 7115, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Disposal/Recovery Certification (Movement Block 19)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-19-disposal-certification/', newPath: '/knowledge-hub/movement-document-disposal-recovery-certification' },
  { postId: 7097, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Exporter Declaration (Movement Block 15)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-15-exporter-declaration/', newPath: '/knowledge-hub/movement-document-exporter-declaration' },
  { postId: 6996, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Exporter/Notifier (Movement Block 3)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-3-exporter-notifier/', newPath: '/knowledge-hub/movement-document-exporter-notifier' },
  { postId: 7001, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Importer/Consignee (Movement Block 4)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-4-importer-consignee/', newPath: '/knowledge-hub/movement-document-importer-consignee' },
  { postId: 7105, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 17: Importer Acceptance', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-17-importer-acceptance/', newPath: '/knowledge-hub/movement-document-importer-acceptance' },
  { postId: 6992, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 2: Serial & Total Number', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-2-serial-number/', newPath: '/knowledge-hub/movement-document-serial-total-number' },
  { postId: 7006, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 5: Actual Quantity', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-5-actual-quantity/', newPath: '/knowledge-hub/movement-document-actual-quantity' },
  { postId: 18182, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 7: Packaging & Handling', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-7-packaging/', newPath: '/knowledge-hub/movement-document-packaging-handling' },
  { postId: 6983, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 8: Carrier Signatures', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-8-carriers/', newPath: '/knowledge-hub/movement-document-carrier-signatures' },
  { postId: 7051, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Movement Block 9: Waste Generator', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-9-generator/', newPath: '/knowledge-hub/movement-document-waste-generator' },
  { postId: 7110, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Receipt at Facility (Movement Block 18)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-18-receipt/', newPath: '/knowledge-hub/movement-document-receipt-at-facility' },
  { postId: 7090, section: 'Movement Doc', pageType: 'reference', priority: 'P2', title: 'Waste Identification (Movement Block 14)', wpUrl: 'https://dexmetal.com/start-basel-movement-document-guide/movement-block-14-waste-identification/', newPath: '/knowledge-hub/movement-document-waste-identification' },
  { postId: 5445, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 10: Disposal/Recovery Facility', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-10-disposal-facility/', newPath: '/knowledge-hub/notification-disposal-recovery-facility' },
  { postId: 5446, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 11: Disposal/Recovery Operation', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-11-operation-code/', newPath: '/knowledge-hub/notification-disposal-recovery-operation' },
  { postId: 5447, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 12: Designation & Composition of the Waste', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-12-waste-designation/', newPath: '/knowledge-hub/notification-waste-designation-composition' },
  { postId: 5448, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 13: Waste Physical Characteristics', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-13-physical-characteristics/', newPath: '/knowledge-hub/notification-waste-physical-characteristics' },
  { postId: 5449, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 14: Waste Identification and Classification', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-14-waste-codes/', newPath: '/knowledge-hub/notification-waste-identification-classification' },
  { postId: 5450, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 15: Countries/States Concerned & Border Crossings', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-15-countries-concerned/', newPath: '/knowledge-hub/notification-countries-border-crossings' },
  { postId: 5451, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 16: Customs Offices (EU Member States Only)', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-16-customs-offices/', newPath: '/knowledge-hub/notification-customs-offices-eu' },
  { postId: 5452, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 17: Exporter & Generator Declaration', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-17-declaration/', newPath: '/knowledge-hub/notification-exporter-generator-declaration' },
  { postId: 5453, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 18: Number of Annexes Attached', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-18-annexes/', newPath: '/knowledge-hub/notification-annexes-attached' },
  { postId: 5454, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 19: Competent Authority Acknowledgement', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-19-ca-acknowledgement/', newPath: '/knowledge-hub/notification-competent-authority-acknowledgement' },
  { postId: 5406, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 1: Exporter-Notifier Registration', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier/', newPath: '/knowledge-hub/notification-exporter-notifier-registration' },
  { postId: 5455, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 20: Competent Authority Consent/Objection', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-20-consent/', newPath: '/knowledge-hub/notification-competent-authority-consent-objection' },
  { postId: 5456, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 21: Specific Conditions or Objection Reasons', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-21-conditions/', newPath: '/knowledge-hub/notification-specific-conditions-objection-reasons' },
  { postId: 5409, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 2: Importer-Consignee Information', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-2-importer-consignee/', newPath: '/knowledge-hub/notification-importer-consignee-information' },
  { postId: 5463, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 3: Notification Number & Shipment Type', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-3-notification-number/', newPath: '/knowledge-hub/notification-number-shipment-type' },
  { postId: 5439, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 4: Total Intended Number of Shipments', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-4-total-shipments/', newPath: '/knowledge-hub/notification-total-intended-shipments' },
  { postId: 5440, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 5: Total Intended Quantity', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-5-total-quantity/', newPath: '/knowledge-hub/notification-total-intended-quantity' },
  { postId: 5487, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 6: Intended Period of Time for Shipment(s)', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-6-intended-period/', newPath: '/knowledge-hub/notification-shipment-period' },
  { postId: 5442, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 7: Packaging Type(s) & Special Handling', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-7-packaging/', newPath: '/knowledge-hub/notification-packaging-special-handling' },
  { postId: 5443, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 8: Intended Carrier(s)', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-8-intended-carriers/', newPath: '/knowledge-hub/notification-intended-carriers' },
  { postId: 5444, section: 'Notification Doc', pageType: 'reference', priority: 'P2', title: 'Block 9: Waste Generator-Producer', wpUrl: 'https://dexmetal.com/data-library/form-fields/block-9-waste-generator/', newPath: '/knowledge-hub/notification-waste-generator-producer' },
  { postId: 6371, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Common Rejection Reasons', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/rejection-reasons/', newPath: '/knowledge-hub/pic-common-rejection-reasons' },
  { postId: 6355, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Competent Authority Acknowledgment', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/authority-acknowledgment/', newPath: '/knowledge-hub/pic-competent-authority-acknowledgment' },
  { postId: 6361, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Final Authorization', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/final-authorization/', newPath: '/knowledge-hub/pic-final-authorization' },
  { postId: 6357, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Import Country Response', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/import-country-response/', newPath: '/knowledge-hub/pic-import-country-response' },
  { postId: 6348, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Notification Submission', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/notification-submission/', newPath: '/knowledge-hub/pic-notification-submission' },
  { postId: 6313, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Pre-Notification Preparation', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/pre-notification-preparation/', newPath: '/knowledge-hub/pic-pre-notification-preparation' },
  { postId: 6363, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Timeline Expectations by Region', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/regional-timelines/', newPath: '/knowledge-hub/pic-timeline-expectations-by-region' },
  { postId: 6359, section: 'PIC Workflows', pageType: 'guide', priority: 'P1', title: 'Transit Country Consent', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/transit-country-consent/', newPath: '/knowledge-hub/pic-transit-country-consent' },
  { postId: 6376, section: 'PIC Workflows', pageType: 'guide', priority: 'P2', title: 'Appealing Rejections', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/appealing-rejections/', newPath: '/knowledge-hub/pic-appealing-rejections' },
  { postId: 6379, section: 'PIC Workflows', pageType: 'guide', priority: 'P2', title: 'Notification Modifications', wpUrl: 'https://dexmetal.com/data-library/pic-procedure/notification-modifications/', newPath: '/knowledge-hub/pic-notification-modifications' },
  { postId: 503, section: 'Shell', pageType: 'landing', priority: 'P1', title: 'Home', wpUrl: 'https://dexmetal.com/', newPath: '/' },
  { postId: 474, section: 'Shell', pageType: 'static', priority: 'P2', title: 'About', wpUrl: 'https://dexmetal.com/about/', newPath: '/about' },
  { postId: 476, section: 'Shell', pageType: 'index', priority: 'P2', title: 'Blog', wpUrl: 'https://dexmetal.com/blog/', newPath: '/blog' },
  { postId: 478, section: 'Shell', pageType: 'static', priority: 'P2', title: 'Contact', wpUrl: 'https://dexmetal.com/contact/', newPath: '/contact' },
  { postId: 3, section: 'Shell', pageType: 'static', priority: 'P3', title: 'Privacy Policy', wpUrl: 'https://dexmetal.com/privacy-policy/', newPath: '/privacy-policy' },
  { postId: 6397, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Complete Document Checklist', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/document-checklist/', newPath: '/knowledge-hub/basel-complete-document-checklist' },
  { postId: 6400, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Contract Requirements', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/contract-requirements/', newPath: '/knowledge-hub/basel-contract-requirements' },
  { postId: 6412, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Environmentally Sound Management Documentation', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/esm-documentation/', newPath: '/knowledge-hub/esm-documentation-requirements' },
  { postId: 6404, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Facility Permits and Authorizations', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/facility-permits/', newPath: '/knowledge-hub/facility-permits-authorizations' },
  { postId: 6402, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Financial Guarantee and Insurance', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/financial-guarantees/', newPath: '/knowledge-hub/financial-guarantee-insurance-basel' },
  { postId: 6410, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Movement Document (Annex V B)', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/movement-document/', newPath: '/knowledge-hub/movement-document-annex-v-b' },
  { postId: 6417, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Re-Import Guarantee Documentation', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/reimport-guarantees/', newPath: '/knowledge-hub/re-import-guarantee-documentation' },
  { postId: 6408, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Transport Documentation', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/transport-documentation/', newPath: '/knowledge-hub/basel-transport-documentation' },
  { postId: 6406, section: 'Supporting Docs', pageType: 'reference', priority: 'P1', title: 'Waste Characterization Reports', wpUrl: 'https://dexmetal.com/data-library/supporting-documents/waste-characterization/', newPath: '/knowledge-hub/waste-characterization-reports' },
  { postId: 17274, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'Basel Form Tool', wpUrl: 'https://dexmetal.com/basel-form-tool/', newPath: '/tools/basel-notification-form' },
  { postId: 19488, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'Basel Movement Document — Quick View Checklist', wpUrl: 'https://dexmetal.com/movement-quick-view/', newPath: '/tools/movement-document-checklist' },
  { postId: 19486, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'Basel Notification Document — Quick View Checklist', wpUrl: 'https://dexmetal.com/notification-quick-view/', newPath: '/tools/notification-document-checklist' },
  { postId: 19490, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'Basel Waste Code Quick Lookup Table', wpUrl: 'https://dexmetal.com/quick-code-lookup/', newPath: '/tools/basel-waste-code-lookup' },
  { postId: 10553, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'Get the Basel Checklist', wpUrl: 'https://dexmetal.com/checklist/', newPath: '/tools/basel-compliance-checklist' },
  { postId: 1265, section: 'Tools', pageType: 'tool', priority: 'P1', title: 'ULAB Value Estimator', wpUrl: 'https://dexmetal.com/ulab-value-estimator/', newPath: '/tools/ulab-value-estimator' },
  { postId: 18296, section: 'Tools', pageType: 'tool', priority: 'P2', title: 'Shipment Schedule Log Template', wpUrl: 'https://dexmetal.com/shipment-schedule-log-template/', newPath: '/tools/shipment-schedule-log' },
]

function htmlToLexical(html: string): any {
  if (!html || html.trim().length === 0) {
    return {
      root: {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  const paragraphs = html.split(/<\/?p[^>]*>/g).filter((p) => p.trim().length > 0)

  const children = paragraphs.map((text) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: text.replace(/<[^>]+>/g, '').trim(),
        type: 'text',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }))

  if (children.length === 0) {
    children.push({
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: html.replace(/<[^>]+>/g, '').trim(),
          type: 'text',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
    })
  }

  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

async function main() {
  const xmlPath = path.resolve(__dirname, 'dexmetal_WordPress_2026-04-03.xml')

  if (!fs.existsSync(xmlPath)) {
    console.error(`ERROR: WordPress XML file not found at ${xmlPath}`)
    console.error('Copy your WordPress export to scripts/dexmetal_WordPress_2026-04-03.xml and re-run.')
    process.exit(1)
  }

  console.log('Parsing WordPress XML export...')
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8')

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseTagValue: true,
    trimValues: true,
  })

  const parsed = parser.parse(xmlContent)
  const channel = parsed.rss?.channel
  if (!channel) {
    console.error('ERROR: Could not parse WordPress XML — no <channel> found')
    process.exit(1)
  }

  const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : []
  console.log(`Found ${items.length} items in WordPress XML`)

  const manifestByPostId = new Map<number, ManifestEntry>()
  for (const entry of MANIFEST) {
    manifestByPostId.set(entry.postId, entry)
  }

  const wpPosts = new Map<number, WordPressPost>()
  for (const item of items) {
    const postId = parseInt(item['wp:post_id'] || item.post_id || '0', 10)
    if (postId > 0) {
      wpPosts.set(postId, {
        post_id: postId,
        title: item.title || item['title']?.['#text'] || '',
        content: item['content:encoded'] || item.content || '',
        wpUrl: item['wp:post_name'] || item.link || '',
        postDate: item['wp:post_date'] || item.pubDate || '',
        status: item['wp:status'] || 'publish',
      })
    }
  }

  console.log(`Indexed ${wpPosts.size} WordPress posts by post_id`)

  console.log('\nInitializing Payload...')
  const payload = await getPayload({
    config,
  })

  let created = 0
  let skipped = 0
  let errors = 0

  const total = MANIFEST.length

  for (let i = 0; i < total; i++) {
    const entry = MANIFEST[i]
    const wpPost = wpPosts.get(entry.postId)

    if (!wpPost) {
      console.log(`[${i + 1}/${total}] SKIP (not found in XML): ${entry.title} (post_id: ${entry.postId})`)
      skipped++
      continue
    }

    const slug = entry.newPath.replace(/^\//, '')

    console.log(`[${i + 1}/${total}] Migrating: ${entry.title}`)

    try {
      const existing = await payload.find({
        collection: 'knowledge-hub-pages',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  -> Already exists (slug: ${slug}), skipping`)
        skipped++
        continue
      }

      const lexicalContent = htmlToLexical(wpPost.content)

      await payload.create({
        collection: 'knowledge-hub-pages',
        overrideAccess: true,
        data: {
          title: entry.title,
          slug,
          section: entry.section as any,
          pageType: entry.pageType as any,
          priority: entry.priority as any,
          content: lexicalContent,
          wpUrl: entry.wpUrl,
          wpPostId: entry.postId,
          redirectFrom: entry.newPath,
          publishedAt: wpPost.postDate ? new Date(wpPost.postDate).toISOString() : undefined,
        },
      })

      created++
    } catch (err: any) {
      console.error(`  -> ERROR: ${err.message}`)
      errors++
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
