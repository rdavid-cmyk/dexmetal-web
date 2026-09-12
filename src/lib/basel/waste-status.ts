/**
 * Basel Convention Waste/Non-Waste Decision Engine
 *
 * Implements the waste status determination per UNEP/CHW.16/INF/10/Rev.1
 * paragraphs 28-46 (Section III: Guidance on the distinction between waste and non-waste).
 *
 * Key principle: Model waste status BEFORE waste-code classification.
 */

import { BASEL_SOURCE_METADATA, GUIDELINE_PARAGRAPHS } from './source-metadata'

/**
 * Evidence provided for waste/non-waste determination
 */
export interface WasteStatusEvidence {
  // Para 32(a): Destination/fate
  destinedForRecyclingOrDisposal?: boolean
  fateUncertain?: boolean

  // Para 32(b): Completeness
  essentialPartsMissing?: boolean

  // Para 32(c): Functionality
  functionalityTested?: boolean
  testsPassed?: boolean
  materialDefect?: boolean

  // Para 32(d): Physical damage
  physicalDamageImpairsFunction?: boolean
  repairableAtReasonableCost?: boolean

  // Para 32(e): Packaging/protection
  adequatePackagingProtection?: boolean

  // Para 32(f): Appearance
  excessiveWearDamageReducesMarketability?: boolean

  // Para 32(g): Hazardous components
  prohibitedHazardousComponents?: boolean

  // Para 32(h): Market
  regularReuseMarketExists?: boolean

  // Para 32(i): Cannibalization
  destinedForCannibalization?: boolean

  // Para 32(j): Price
  priceSignificantlyBelowFunctionalEquipment?: boolean

  // Para 33(a) evidence for direct reuse
  directReuseEvidence?: {
    invoiceOrContractPresent?: boolean
    functionalityTestRecordsForEveryItem?: boolean
    noCountryConsidersWasteDeclaration?: boolean
    individualProtectionDuringTransport?: boolean
  }

  // Para 33(b) evidence for repair/refurbishment
  repairRefurbishmentEvidence?: {
    validContractWithReceivingFacility?: boolean
    residualWasteESMProvisions?: boolean
    responsibilityAllocation?: boolean
    feedbackObligations?: boolean
    noCountryConsidersWasteDeclaration?: boolean
    individualProtectionDuringTransport?: boolean
  }

  // Para 45: Competent authority disagreement
  competentAuthorityDisagreement?: boolean

  // Para 29: National law considerations
  anyCountryConsidersWaste?: boolean
}

export type WasteStatus =
  | 'WASTE'
  | 'NON_WASTE'
  | 'WASTE_PROCEDURES_APPLY'
  | 'EVIDENCE_REQUIRED'
  | 'CHARACTERIZATION_REQUIRED'

export type IntendedUse = 'DIRECT_REUSE' | 'REPAIR_REFURBISHMENT' | 'RECYCLING' | 'DISPOSAL' | 'UNKNOWN'

export interface WasteStatusDecision {
  status: WasteStatus
  intendedUse: IntendedUse
  reasons: WasteStatusReason[]
  evidenceGaps: string[]
  sourceCitation: string
  picRequired: boolean
  recommendation: string
}

export interface WasteStatusReason {
  code: string
  description: string
  paragraph: string
  isWasteIndicator: boolean
}

/**
 * Reason codes for waste status determination
 */
export const WASTE_REASON_CODES = {
  // Waste indicators (para 32)
  W_DEST_RECYCLING_DISPOSAL: {
    code: 'W_DEST_RECYCLING_DISPOSAL',
    description: 'Destined for disposal or recycling, or fate uncertain',
    paragraph: '32(a)',
    isWasteIndicator: true,
  },
  W_ESSENTIAL_PARTS_MISSING: {
    code: 'W_ESSENTIAL_PARTS_MISSING',
    description: 'Essential parts missing; cannot perform key functions',
    paragraph: '32(b)',
    isWasteIndicator: true,
  },
  W_MATERIAL_DEFECT_FAILS_TESTS: {
    code: 'W_MATERIAL_DEFECT_FAILS_TESTS',
    description: 'Material defect affecting functionality; fails relevant tests',
    paragraph: '32(c)',
    isWasteIndicator: true,
  },
  W_PHYSICAL_DAMAGE_NOT_REPAIRABLE: {
    code: 'W_PHYSICAL_DAMAGE_NOT_REPAIRABLE',
    description: 'Physical damage impairs function/safety and cannot be repaired at reasonable cost',
    paragraph: '32(d)',
    isWasteIndicator: true,
  },
  W_INADEQUATE_PACKAGING: {
    code: 'W_INADEQUATE_PACKAGING',
    description: 'Protection during transport/loading/unloading is inappropriate',
    paragraph: '32(e)',
    isWasteIndicator: true,
  },
  W_EXCESSIVE_WEAR: {
    code: 'W_EXCESSIVE_WEAR',
    description: 'Excessively worn or damaged appearance reduces marketability',
    paragraph: '32(f)',
    isWasteIndicator: true,
  },
  W_PROHIBITED_HAZARDOUS: {
    code: 'W_PROHIBITED_HAZARDOUS',
    description: 'Contains prohibited hazardous components or substances',
    paragraph: '32(g)',
    isWasteIndicator: true,
  },
  W_NO_REUSE_MARKET: {
    code: 'W_NO_REUSE_MARKET',
    description: 'No regular market for the equipment to be reused',
    paragraph: '32(h)',
    isWasteIndicator: true,
  },
  W_CANNIBALIZATION: {
    code: 'W_CANNIBALIZATION',
    description: 'Destined for disassembly and cannibalization for spare parts',
    paragraph: '32(i)',
    isWasteIndicator: true,
  },
  W_PRICE_BELOW_FUNCTIONAL: {
    code: 'W_PRICE_BELOW_FUNCTIONAL',
    description: 'Price significantly lower than expected for fully functional equipment',
    paragraph: '32(j)',
    isWasteIndicator: true,
  },

  // National law / CA disagreement
  W_NATIONAL_LAW: {
    code: 'W_NATIONAL_LAW',
    description: 'At least one involved country considers this equipment waste under national law',
    paragraph: '29',
    isWasteIndicator: true,
  },
  W_CA_DISAGREEMENT: {
    code: 'W_CA_DISAGREEMENT',
    description: 'Competent authorities disagree on waste status; waste procedures apply',
    paragraph: '45',
    isWasteIndicator: true,
  },

  // Non-waste conditions (para 33)
  NW_DIRECT_REUSE_ALL_CONDITIONS: {
    code: 'NW_DIRECT_REUSE_ALL_CONDITIONS',
    description: 'All para 33(a) conditions met for direct reuse: tested functional, documented, declared, protected',
    paragraph: '33(a)',
    isWasteIndicator: false,
  },
  NW_REPAIR_ALL_CONDITIONS: {
    code: 'NW_REPAIR_ALL_CONDITIONS',
    description: 'All para 33(b) conditions met for repair/refurbishment with valid contract and ESM provisions',
    paragraph: '33(b)',
    isWasteIndicator: false,
  },

  // Evidence gaps
  E_NO_FUNCTIONALITY_TEST: {
    code: 'E_NO_FUNCTIONALITY_TEST',
    description: 'No functionality testing records provided',
    paragraph: '33(a)(ii), 39-43',
    isWasteIndicator: true,
  },
  E_MISSING_DOCUMENTATION: {
    code: 'E_MISSING_DOCUMENTATION',
    description: 'Required documentation missing',
    paragraph: '34',
    isWasteIndicator: true,
  },
} as const

/**
 * Determine waste status based on provided evidence
 *
 * Per the guidelines, equipment should be evaluated for waste indicators (para 32)
 * first, then checked against non-waste conditions (para 33) if claiming non-waste.
 */
export function determineWasteStatus(
  evidence: WasteStatusEvidence,
  intendedUse: IntendedUse
): WasteStatusDecision {
  const reasons: WasteStatusReason[] = []
  const evidenceGaps: string[] = []

  // Para 45: Competent authority disagreement trumps everything
  if (evidence.competentAuthorityDisagreement) {
    reasons.push(WASTE_REASON_CODES.W_CA_DISAGREEMENT)
    return buildDecision('WASTE_PROCEDURES_APPLY', intendedUse, reasons, evidenceGaps, true,
      'Competent authorities disagree on waste status. Waste procedures (PIC) apply per para 45.')
  }

  // Para 29: Any country considers it waste
  if (evidence.anyCountryConsidersWaste) {
    reasons.push(WASTE_REASON_CODES.W_NATIONAL_LAW)
    return buildDecision('WASTE', intendedUse, reasons, evidenceGaps, true,
      'At least one involved country considers this waste under national law. Full Basel procedures apply.')
  }

  // Check para 32 waste indicators
  checkWasteIndicators(evidence, reasons)

  // If any waste indicators present, it's waste
  if (reasons.some(r => r.isWasteIndicator)) {
    return buildDecision('WASTE', intendedUse, reasons, evidenceGaps, true,
      'Waste indicators present. Equipment should be considered waste and requires Basel notification/PIC.')
  }

  // Check non-waste conditions based on intended use
  if (intendedUse === 'DIRECT_REUSE') {
    return checkDirectReuseConditions(evidence, reasons, evidenceGaps)
  }

  if (intendedUse === 'REPAIR_REFURBISHMENT') {
    return checkRepairRefurbishmentConditions(evidence, reasons, evidenceGaps)
  }

  if (intendedUse === 'RECYCLING' || intendedUse === 'DISPOSAL') {
    reasons.push(WASTE_REASON_CODES.W_DEST_RECYCLING_DISPOSAL)
    return buildDecision('WASTE', intendedUse, reasons, evidenceGaps, true,
      'Destined for recycling or disposal — classified as waste per para 32(a).')
  }

  // Unknown intended use — need more information
  evidenceGaps.push('Intended use at destination not specified')
  return buildDecision('EVIDENCE_REQUIRED', intendedUse, reasons, evidenceGaps, true,
    'Insufficient information to determine waste status. Specify intended use and provide required evidence.')
}

function checkWasteIndicators(evidence: WasteStatusEvidence, reasons: WasteStatusReason[]): void {
  if (evidence.destinedForRecyclingOrDisposal || evidence.fateUncertain) {
    reasons.push(WASTE_REASON_CODES.W_DEST_RECYCLING_DISPOSAL)
  }
  if (evidence.essentialPartsMissing) {
    reasons.push(WASTE_REASON_CODES.W_ESSENTIAL_PARTS_MISSING)
  }
  if (evidence.materialDefect || (evidence.functionalityTested && !evidence.testsPassed)) {
    reasons.push(WASTE_REASON_CODES.W_MATERIAL_DEFECT_FAILS_TESTS)
  }
  if (evidence.physicalDamageImpairsFunction && !evidence.repairableAtReasonableCost) {
    reasons.push(WASTE_REASON_CODES.W_PHYSICAL_DAMAGE_NOT_REPAIRABLE)
  }
  if (evidence.adequatePackagingProtection === false) {
    reasons.push(WASTE_REASON_CODES.W_INADEQUATE_PACKAGING)
  }
  if (evidence.excessiveWearDamageReducesMarketability) {
    reasons.push(WASTE_REASON_CODES.W_EXCESSIVE_WEAR)
  }
  if (evidence.prohibitedHazardousComponents) {
    reasons.push(WASTE_REASON_CODES.W_PROHIBITED_HAZARDOUS)
  }
  if (evidence.regularReuseMarketExists === false) {
    reasons.push(WASTE_REASON_CODES.W_NO_REUSE_MARKET)
  }
  if (evidence.destinedForCannibalization) {
    reasons.push(WASTE_REASON_CODES.W_CANNIBALIZATION)
  }
  if (evidence.priceSignificantlyBelowFunctionalEquipment) {
    reasons.push(WASTE_REASON_CODES.W_PRICE_BELOW_FUNCTIONAL)
  }
}

function checkDirectReuseConditions(
  evidence: WasteStatusEvidence,
  reasons: WasteStatusReason[],
  evidenceGaps: string[]
): WasteStatusDecision {
  const directReuse = evidence.directReuseEvidence

  if (!directReuse) {
    evidenceGaps.push('Para 33(a) evidence not provided for direct reuse claim')
    return buildDecision('EVIDENCE_REQUIRED', 'DIRECT_REUSE', reasons, evidenceGaps, true,
      'Direct reuse claimed but para 33(a) evidence not provided. Supply invoice/contract, functionality test records, no-waste declaration, and transport protection evidence.')
  }

  // Check each para 33(a) requirement
  if (!directReuse.invoiceOrContractPresent) {
    evidenceGaps.push('Invoice or contract not present (para 33(a)(i))')
  }
  if (!directReuse.functionalityTestRecordsForEveryItem) {
    evidenceGaps.push('Functionality test records not provided for every item (para 33(a)(ii))')
    reasons.push(WASTE_REASON_CODES.E_NO_FUNCTIONALITY_TEST)
  }
  if (!directReuse.noCountryConsidersWasteDeclaration) {
    evidenceGaps.push('No-country-considers-waste declaration not provided (para 33(a)(iii))')
  }
  if (!directReuse.individualProtectionDuringTransport) {
    evidenceGaps.push('Individual protection during transport not confirmed (para 33(a)(iv))')
  }

  if (evidenceGaps.length > 0) {
    return buildDecision('EVIDENCE_REQUIRED', 'DIRECT_REUSE', reasons, evidenceGaps, true,
      `Direct reuse conditions not fully met. Missing: ${evidenceGaps.join('; ')}. Equipment should be treated conservatively as waste until evidence provided.`)
  }

  // All conditions met
  reasons.push(WASTE_REASON_CODES.NW_DIRECT_REUSE_ALL_CONDITIONS)
  return buildDecision('NON_WASTE', 'DIRECT_REUSE', reasons, evidenceGaps, false,
    'All para 33(a) conditions met. Equipment should normally not be considered waste for direct reuse, subject to national law verification.')
}

function checkRepairRefurbishmentConditions(
  evidence: WasteStatusEvidence,
  reasons: WasteStatusReason[],
  evidenceGaps: string[]
): WasteStatusDecision {
  const repair = evidence.repairRefurbishmentEvidence

  if (!repair) {
    evidenceGaps.push('Para 33(b) evidence not provided for repair/refurbishment claim')
    return buildDecision('EVIDENCE_REQUIRED', 'REPAIR_REFURBISHMENT', reasons, evidenceGaps, true,
      'Repair/refurbishment claimed but para 33(b) evidence not provided. Supply valid contract with receiving facility, ESM provisions, responsibility allocation, and feedback obligations.')
  }

  // Check para 33(a)(iii) and (iv) which also apply to 33(b)
  if (!repair.noCountryConsidersWasteDeclaration) {
    evidenceGaps.push('No-country-considers-waste declaration not provided (para 33(a)(iii) via 33(b))')
  }
  if (!repair.individualProtectionDuringTransport) {
    evidenceGaps.push('Individual protection during transport not confirmed (para 33(a)(iv) via 33(b))')
  }

  // Check 33(b)-specific requirements
  if (!repair.validContractWithReceivingFacility) {
    evidenceGaps.push('Valid contract with receiving facility not present (para 33(b)(ii))')
  }
  if (!repair.residualWasteESMProvisions) {
    evidenceGaps.push('Residual waste ESM provisions not in contract (para 33(b)(ii)b)')
  }
  if (!repair.responsibilityAllocation) {
    evidenceGaps.push('Responsibility allocation not in contract (para 33(b)(ii)c.i)')
  }
  if (!repair.feedbackObligations) {
    evidenceGaps.push('Feedback obligations not in contract (para 33(b)(ii)c.ii)')
  }

  if (evidenceGaps.length > 0) {
    return buildDecision('EVIDENCE_REQUIRED', 'REPAIR_REFURBISHMENT', reasons, evidenceGaps, true,
      `Repair/refurbishment conditions not fully met. Missing: ${evidenceGaps.join('; ')}. Equipment should be treated conservatively as waste until evidence provided.`)
  }

  // All conditions met
  reasons.push(WASTE_REASON_CODES.NW_REPAIR_ALL_CONDITIONS)
  return buildDecision('NON_WASTE', 'REPAIR_REFURBISHMENT', reasons, evidenceGaps, false,
    'All para 33(b) conditions met. Equipment should normally not be considered waste for repair/refurbishment, subject to national law verification.')
}

function buildDecision(
  status: WasteStatus,
  intendedUse: IntendedUse,
  reasons: WasteStatusReason[],
  evidenceGaps: string[],
  picRequired: boolean,
  recommendation: string
): WasteStatusDecision {
  return {
    status,
    intendedUse,
    reasons,
    evidenceGaps,
    sourceCitation: `${BASEL_SOURCE_METADATA.documentId}, paras ${GUIDELINE_PARAGRAPHS.wasteIndicators}-${GUIDELINE_PARAGRAPHS.competentAuthorityDisagreement}`,
    picRequired,
    recommendation,
  }
}
