import { classifyEwaste, type EwasteClassificationResult, type HazardEvidence } from './ewaste-classification'
import { determineWasteStatus, type IntendedUse, type WasteStatusDecision, type WasteStatusEvidence } from './waste-status'

export interface EwasteCaseDecision {
  wasteStatus: WasteStatusDecision
  classification: EwasteClassificationResult | null
  currentWasteCode: string | null
  picRequired: boolean
  nextQuestion: string | null
}

/**
 * Evaluate waste status before assigning a Basel waste entry.
 * UNEP/CHW.16/INF/10/Rev.1 paras 28-56 require this ordering.
 */
export function evaluateEwasteCase(
  wasteEvidence: WasteStatusEvidence,
  intendedUse: IntendedUse,
  hazardEvidence: HazardEvidence = {},
): EwasteCaseDecision {
  const wasteStatus = determineWasteStatus(wasteEvidence, intendedUse)

  if (wasteStatus.status === 'NON_WASTE') {
    return {
      wasteStatus,
      classification: null,
      currentWasteCode: null,
      picRequired: false,
      nextQuestion: null,
    }
  }

  if (wasteStatus.status === 'EVIDENCE_REQUIRED') {
    return {
      wasteStatus,
      classification: null,
      currentWasteCode: null,
      picRequired: true,
      nextQuestion: wasteStatus.evidenceGaps[0] ?? 'Provide the missing waste-status evidence.',
    }
  }

  const classification = classifyEwaste(hazardEvidence, wasteStatus)
  return {
    wasteStatus,
    classification,
    currentWasteCode: classification.code?.code ?? null,
    picRequired: true,
    nextQuestion:
      classification.classification === 'CHARACTERIZATION_REQUIRED'
        ? classification.evidenceGaps[0] ?? 'Provide hazard characterization evidence.'
        : null,
  }
}
