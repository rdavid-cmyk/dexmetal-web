/**
 * Basel Convention Source Metadata
 *
 * Official reference document for waste/non-waste distinction and e-waste classification.
 * This module provides the authoritative source information for all Basel decision logic.
 */

export const BASEL_SOURCE_METADATA = {
  documentId: 'UNEP/CHW.16/INF/10/Rev.1',
  title:
    'Technical guidelines on transboundary movements of electrical and electronic waste and used electrical and electronic equipment, in particular regarding the distinction between waste and non-waste under the Basel Convention',
  version: '4 May 2023',
  adoptedAt: 'COP-16, Geneva, 1–12 May 2023',
  decision: 'BC-16/5',
  effectiveDate: '2023-05-04',
  amendmentsEffective: '2025-01-01',
  pilotTestingEndDate: '2026-09-30',
  officialUrl:
    'https://www.basel.int/Implementation/TechnicalMatters/DevelopmentofTechnicalGuidelines/Ewaste/tabid/2377/Default.aspx',
  label: 'UNEP/CHW.16/INF/10/Rev.1 (Item 1 Technical Guidelines)',
} as const

/**
 * 2025 Basel Convention Amendments
 * Per decision BC-15/18 and footnote 13 of the guidelines
 */
export const BASEL_2025_AMENDMENTS = {
  effectiveDate: '2025-01-01',
  changes: {
    annexVIII: {
      deleted: ['A1180'],
      added: ['A1181'],
      note: 'Entry A1180 replaced by A1181 for hazardous e-waste',
    },
    annexII: {
      added: ['Y49'],
      note: 'Y49 added for non-hazardous e-waste (Annex II other wastes)',
    },
    annexIX: {
      deleted: ['B1110', 'B4030'],
      note: 'B1110 (e-waste assemblies) and B4030 deleted effective 1 January 2025',
    },
  },
  source: 'Decision BC-15/18, footnote 13 of UNEP/CHW.16/INF/10/Rev.1',
} as const

/**
 * Paragraph references for key decision logic
 */
export const GUIDELINE_PARAGRAPHS = {
  wasteDefinition: 22,
  nationalDefinitions: 29,
  competentAuthorityDisagreement: 45,
  wasteIndicators: 32,
  nonWasteConditionsDirectReuse: { para: 33, sub: 'a' },
  nonWasteConditionsRepairRefurbishment: { para: 33, sub: 'b' },
  documentationRequirements: 34,
  testingRequirements: { para: 39, to: 43 },
  hazardousDistinction: { para: 47, to: 52 },
  a1181Definition: 47,
  y49Definition: 48,
  hazardousPresumption: 51,
} as const
