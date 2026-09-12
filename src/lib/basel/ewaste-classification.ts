/**
 * Basel Convention E-Waste Classification Engine
 *
 * Implements hazardous vs non-hazardous e-waste classification per
 * UNEP/CHW.16/INF/10/Rev.1 paragraphs 47-52.
 *
 * Key principle: E-waste should be presumed hazardous (A1181) unless proven
 * non-hazardous (Y49) per para 51. When evidence is insufficient, return
 * CHARACTERIZATION_REQUIRED rather than guessing.
 */

import { BASEL_SOURCE_METADATA, GUIDELINE_PARAGRAPHS } from './source-metadata'
import { EWASTE_CODES, BATTERY_CODES, INVALID_CODES, type BaselCodeEntry } from './codes'
import { type WasteStatusDecision } from './waste-status'

/**
 * Evidence for hazardous/non-hazardous determination
 * Per paragraphs 50-51 of the guidelines
 */
export interface HazardEvidence {
  // Para 50(a): Annex I constituents to hazardous extent
  containsAnnexIConstituentsToHazardousExtent?: boolean

  // Para 50(b): Contains hazardous component
  containsHazardousComponent?: boolean

  // Para 51: Specific hazardous indicators
  crtGlassPresent?: boolean // Para 51(a) - always hazardous
  nickelCadmiumBatteryPresent?: boolean // Para 51(b)
  mercuryBatteryPresent?: boolean // Para 51(b)
  seleniumDrumPresent?: boolean // Para 51(c)
  pcbWithLeadSolderBFR?: boolean // Para 51(d)
  fluorescentTubePresent?: boolean // Para 51(e)
  plasticWithBFRsPOPs?: boolean // Para 51(f)
  mercuryComponentsPresent?: boolean // Para 51(g)
  hazardousOilsLiquids?: boolean // Para 51(h)
  asbestosComponentsPresent?: boolean // Para 51(i)

  // Evidence that equipment is non-hazardous
  testedNonHazardous?: boolean
  noHazardousComponentsConfirmed?: boolean
  laboratoryCharacterizationComplete?: boolean
  characterizationReport?: {
    date: string
    laboratory: string
    conclusion: 'HAZARDOUS' | 'NON_HAZARDOUS' | 'INCONCLUSIVE'
  }
}

export type EwasteClassification =
  | 'A1181' // Hazardous e-waste (Annex VIII)
  | 'Y49' // Non-hazardous e-waste (Annex II)
  | 'CHARACTERIZATION_REQUIRED' // Insufficient evidence

export interface EwasteClassificationResult {
  classification: EwasteClassification
  code: BaselCodeEntry | null
  hazardous: boolean | null
  picRequired: boolean
  article4AStatus: 'POTENTIAL_SCOPE' | 'OUTSIDE_SCOPE' | null
  hazardIndicators: string[]
  nonHazardEvidence: string[]
  evidenceGaps: string[]
  sourceCitation: string
  recommendation: string
  decisionPath: string
}

/**
 * Classify equipment that has already been established as e-waste as A1181 or Y49.
 * Waste/non-waste status must be decided first with determineWasteStatus/evaluateEwasteCase.
 *
 * Per para 51: "Electrical and electronic waste should be presumed to be
 * hazardous waste unless it can be shown either that it does not exhibit
 * hazardous characteristics or that it does not contain hazardous components
 * or substances."
 */
export function classifyEwaste(
  hazardEvidence: HazardEvidence,
  wasteStatus?: WasteStatusDecision
): EwasteClassificationResult {
  const hazardIndicators: string[] = []
  const nonHazardEvidence: string[] = []
  const evidenceGaps: string[] = []
  const decisionSteps: string[] = []

  // Step 1: Check high-confidence hazardous evidence. Para 50(c) distinguishes
  // always-hazardous examples (e.g. CRT glass, PCB capacitors) from components
  // whose hazard status depends on composition.
  decisionSteps.push('Step 1: Check hazardous-component evidence per paras 50-51')

  if (hazardEvidence.crtGlassPresent) {
    hazardIndicators.push('CRT glass present (para 51(a)) — always hazardous')
    decisionSteps.push('→ CRT glass detected: A1181 (hazardous)')
    return buildResult('A1181', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
      'CRT glass is always hazardous. Equipment must be classified as A1181 per para 51(a).')
  }

  if (hazardEvidence.asbestosComponentsPresent) {
    hazardIndicators.push('Asbestos components present (para 51(i)) — hazardous')
    decisionSteps.push('→ Asbestos components detected: A1181 (hazardous)')
    return buildResult('A1181', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
      'Asbestos-containing components render equipment hazardous. Classified as A1181 per para 51(i).')
  }

  // Step 2: Check for other hazardous indicators
  decisionSteps.push('Step 2: Check for other hazardous indicators')

  if (hazardEvidence.nickelCadmiumBatteryPresent) {
    hazardIndicators.push('Ni-Cd battery present (para 51(b))')
  }
  if (hazardEvidence.mercuryBatteryPresent) {
    hazardIndicators.push('Mercury battery present (para 51(b))')
  }
  if (hazardEvidence.seleniumDrumPresent) {
    hazardIndicators.push('Selenium drum present (para 51(c))')
  }
  if (hazardEvidence.pcbWithLeadSolderBFR) {
    hazardIndicators.push('PCB with lead solder/BFR (para 51(d))')
  }
  if (hazardEvidence.fluorescentTubePresent) {
    hazardIndicators.push('Fluorescent tube/backlight present (para 51(e))')
  }
  if (hazardEvidence.plasticWithBFRsPOPs) {
    hazardIndicators.push('Plastic with BFRs/POPs (para 51(f))')
  }
  if (hazardEvidence.mercuryComponentsPresent) {
    hazardIndicators.push('Mercury-containing components (para 51(g))')
  }
  if (hazardEvidence.hazardousOilsLiquids) {
    hazardIndicators.push('Hazardous oils/liquids present (para 51(h))')
  }
  if (hazardEvidence.containsAnnexIConstituentsToHazardousExtent) {
    hazardIndicators.push('Contains Annex I constituents to hazardous extent (para 50(a))')
  }
  if (hazardEvidence.containsHazardousComponent) {
    hazardIndicators.push('Contains at least one hazardous component (para 50(b))')
  }

  // If any hazardous indicators present, classify as A1181
  if (hazardIndicators.length > 0) {
    decisionSteps.push(`→ ${hazardIndicators.length} hazardous indicator(s) found: A1181`)
    return buildResult('A1181', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
      `Equipment contains hazardous components/constituents. Classified as A1181 (Annex VIII). Indicators: ${hazardIndicators.join('; ')}.`)
  }

  // Step 3: Check for non-hazardous evidence
  decisionSteps.push('Step 3: Check for non-hazardous evidence per para 50-51')

  if (hazardEvidence.testedNonHazardous) {
    nonHazardEvidence.push('Tested and confirmed non-hazardous')
  }
  if (hazardEvidence.noHazardousComponentsConfirmed) {
    nonHazardEvidence.push('No hazardous components confirmed')
  }
  if (hazardEvidence.laboratoryCharacterizationComplete) {
    nonHazardEvidence.push('Laboratory characterization complete')
    if (hazardEvidence.characterizationReport?.conclusion === 'NON_HAZARDOUS') {
      nonHazardEvidence.push(`Lab report (${hazardEvidence.characterizationReport.date}): Non-hazardous`)
    } else if (hazardEvidence.characterizationReport?.conclusion === 'HAZARDOUS') {
      hazardIndicators.push(`Lab report (${hazardEvidence.characterizationReport.date}): Hazardous`)
      decisionSteps.push('→ Laboratory report indicates hazardous: A1181')
      return buildResult('A1181', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
        `Laboratory characterization confirms hazardous. Classified as A1181 per ${hazardEvidence.characterizationReport.laboratory} report.`)
    }
  }

  // Step 4: Evaluate if sufficient evidence to classify as non-hazardous
  decisionSteps.push('Step 4: Evaluate sufficiency of non-hazardous evidence')

  const hasPositiveNonHazardEvidence = nonHazardEvidence.length > 0
  const hasLabConfirmation =
    hazardEvidence.characterizationReport?.conclusion === 'NON_HAZARDOUS'

  if (hasLabConfirmation) {
    decisionSteps.push('→ Laboratory confirms non-hazardous: Y49')
    return buildResult('Y49', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
      'Laboratory characterization confirms non-hazardous. Classified as Y49 (Annex II). PIC required but Ban Amendment does not apply.')
  }

  if (hasPositiveNonHazardEvidence && hazardEvidence.noHazardousComponentsConfirmed) {
    decisionSteps.push('→ Non-hazardous evidence present and no hazardous components: Y49')
    return buildResult('Y49', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
      'Equipment confirmed as non-hazardous. Classified as Y49 (Annex II). PIC required but Ban Amendment does not apply.')
  }

  // Step 5: Insufficient evidence — cannot classify without guessing
  decisionSteps.push('Step 5: Insufficient evidence to determine hazard status')

  if (!hazardEvidence.laboratoryCharacterizationComplete) {
    evidenceGaps.push('Laboratory characterization not complete')
  }
  if (hazardEvidence.testedNonHazardous === undefined) {
    evidenceGaps.push('Hazard testing not performed')
  }
  if (hazardEvidence.noHazardousComponentsConfirmed === undefined) {
    evidenceGaps.push('Hazardous component inspection not confirmed')
  }

  decisionSteps.push('→ CHARACTERIZATION_REQUIRED — cannot determine A1181 vs Y49 without evidence')

  return buildResult('CHARACTERIZATION_REQUIRED', hazardIndicators, nonHazardEvidence, evidenceGaps, decisionSteps,
    'Insufficient evidence to determine hazard status. Per para 51, e-waste should be presumed hazardous until proven otherwise. Obtain waste characterization before classification.')
}

/**
 * Conservative helper for confirmed battery waste. Waste/non-waste status must
 * already be established before this function is called.
 */
export function classifyBatteryWaste(
  batteryType: 'ULAB' | 'LITHIUM' | 'NICKEL_CADMIUM' | 'ALKALINE' | 'MIXED' | 'OTHER',
  condition: 'FUNCTIONAL' | 'DAMAGED' | 'SCRAP',
): {
  code: string
  entry: BaselCodeEntry | null
  correctedMisconception?: string
  evidenceRequired?: string
} {
  if (batteryType === 'ULAB') {
    return {
      code: 'A1160',
      entry: BATTERY_CODES.A1160,
      correctedMisconception:
        'Y31 is an Annex I constituent category (lead/lead compounds), not a waste list entry. The correct code for waste lead-acid batteries is A1160.',
    }
  }

  if (batteryType === 'NICKEL_CADMIUM' || batteryType === 'MIXED') {
    return { code: 'A1170', entry: BATTERY_CODES.A1170 }
  }

  return {
    code: 'CHARACTERIZATION_REQUIRED',
    entry: null,
    correctedMisconception:
      'B1120 is spent catalysts, not batteries. B1090 cannot be inferred from functionality alone.',
    evidenceRequired:
      `Confirmed battery waste (${batteryType.toLowerCase()}, ${condition.toLowerCase()}) needs composition, sorting/specification, and hazardous-constituent evidence before assigning A1170 or B1090.`,
  }
}

/**
 * Validate that a code is not deleted/obsolete
 * Provides correction guidance for common misconceptions
 */
export function validateCode(
  code: string
): { valid: boolean; reason?: string; correction?: string } {
  const invalid = INVALID_CODES[code]
  if (invalid) {
    return {
      valid: false,
      reason: invalid.reason,
      correction: invalid.correctCode,
    }
  }

  const ewasteEntry = EWASTE_CODES[code]
  if (ewasteEntry?.deletedDate) {
    return {
      valid: false,
      reason: `${code} was deleted effective ${ewasteEntry.deletedDate}`,
      correction: ewasteEntry.replacedBy,
    }
  }

  return { valid: true }
}

function buildResult(
  classification: EwasteClassification,
  hazardIndicators: string[],
  nonHazardEvidence: string[],
  evidenceGaps: string[],
  decisionSteps: string[],
  recommendation: string
): EwasteClassificationResult {
  const code = classification === 'CHARACTERIZATION_REQUIRED' ? null : EWASTE_CODES[classification]

  return {
    classification,
    code: code ?? null,
    hazardous: classification === 'A1181' ? true : classification === 'Y49' ? false : null,
    // This classifier is only used after e-waste status is established. Both A1181
    // and Y49 movements are controlled, so PIC remains required while hazard
    // characterization is pending.
    picRequired: true,
    article4AStatus:
      classification === 'A1181'
        ? 'POTENTIAL_SCOPE'
        : classification === 'Y49'
          ? 'OUTSIDE_SCOPE'
          : null,
    hazardIndicators,
    nonHazardEvidence,
    evidenceGaps,
    sourceCitation: `${BASEL_SOURCE_METADATA.documentId}, paras ${GUIDELINE_PARAGRAPHS.hazardousDistinction.para}-${GUIDELINE_PARAGRAPHS.hazardousPresumption}`,
    recommendation,
    decisionPath: decisionSteps.join('\n'),
  }
}
