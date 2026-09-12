import { BATTERY_CODES } from './codes'
import { evaluateEwasteCase } from './case-evaluator'
import type { HazardEvidence } from './ewaste-classification'
import type { IntendedUse, WasteStatusEvidence } from './waste-status'

export type QuickScanHazardClass = 'HAZARDOUS' | 'NON_HAZARDOUS' | 'ANNEX_II' | 'REQUIRES_TESTING'
export type QuickScanPICRequired = 'YES' | 'NO' | 'CONDITIONAL'

export interface QuickScanClassificationResult {
  code: string
  codeName: string
  hazardClass: QuickScanHazardClass
  annexType: string
  explanation: string
  picRequired: QuickScanPICRequired
  picNote: string
  is2025Amendment: boolean
  warning?: string
}

function evidenceRequired(explanation: string, warning?: string): QuickScanClassificationResult {
  return {
    code: 'EVIDENCE_REQUIRED',
    codeName: 'Waste-status evidence required',
    hazardClass: 'REQUIRES_TESTING',
    annexType: 'Pending',
    explanation,
    picRequired: 'CONDITIONAL',
    picNote: 'Do not assign a Basel waste code until waste status is established. If the item is waste e-waste, A1181/Y49 control procedures apply.',
    is2025Amendment: true,
    warning,
  }
}

function characterizationRequired(explanation: string): QuickScanClassificationResult {
  return {
    code: 'CHARACTERIZATION_REQUIRED',
    codeName: 'Hazard characterization required',
    hazardClass: 'REQUIRES_TESTING',
    annexType: 'Pending',
    explanation,
    picRequired: 'YES',
    picNote: 'Waste status is established. Both A1181 and Y49 e-waste movements are controlled; treat as hazardous pending proof of non-hazardous status.',
    is2025Amendment: true,
    warning: 'B1110 and A1180 are not current e-waste entries. Do not ship until the applicable current entry and consent requirements are confirmed.',
  }
}

function mapUse(use: string): IntendedUse {
  if (use === 'Reuse') return 'DIRECT_REUSE'
  if (use === 'Repair') return 'REPAIR_REFURBISHMENT'
  if (use === 'Recycling') return 'RECYCLING'
  if (use === 'Disposal') return 'DISPOSAL'
  return 'UNKNOWN'
}

function wasteEvidenceFor(condition: string, use: string): WasteStatusEvidence {
  const evidence: WasteStatusEvidence = {}
  if (use === 'Recycling' || use === 'Disposal') evidence.destinedForRecyclingOrDisposal = true
  if (condition === 'Scrap') evidence.destinedForRecyclingOrDisposal = true
  if (condition === 'Mixed') evidence.fateUncertain = true
  // The 3-question QuickScan cannot prove para 33(a)/(b); leave those evidence blocks absent.
  return evidence
}

export function classifyQuickScan(type: string, condition: string, use: string): QuickScanClassificationResult {
  const intendedUse = mapUse(use)

  // Reuse/repair claims require the detailed para 33 evidence before any waste code is assigned.
  if (use === 'Reuse' || use === 'Repair') {
    return evidenceRequired(
      use === 'Reuse'
        ? 'Direct reuse can normally be non-waste only when all UNEP/CHW.16/INF/10/Rev.1 para 33(a) evidence is present, including item-by-item functionality records, required documents, the no-country-waste declaration, and transport protection.'
        : 'Repair/refurbishment can normally be non-waste only when the para 33(b) contract, responsibility, environmentally sound management, declaration, documentation, and transport-protection conditions are met.',
      type === 'ULAB'
        ? 'A1160 applies to waste lead-acid batteries. Y31 is an Annex I constituent category, not the ULAB waste entry.'
        : 'Waste status must be decided before a Basel waste entry is assigned.',
    )
  }

  // Confirmed waste lead-acid batteries have the specific A1160 entry.
  if (type === 'ULAB') {
    const entry = BATTERY_CODES.A1160
    return {
      code: entry.code,
      codeName: `${entry.title} — Annex VIII (${entry.code})`,
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: `${entry.description}. This result applies because the selected destination use/condition establishes a waste pathway.`,
      picRequired: 'YES',
      picNote: 'A1160 is hazardous waste and is subject to Basel control procedures. Any Article 4A/Ban Amendment question must be assessed for the specific route and legal conditions.',
      is2025Amendment: false,
      warning: 'Y31 identifies lead/lead compounds as an Annex I constituent category; it is not the Basel list entry for whole waste lead-acid batteries.',
    }
  }

  // Standalone lithium battery waste cannot be safely mapped to A1170/B1090 from these three answers alone.
  if (type === 'Lithium') {
    return characterizationRequired(
      'The three QuickScan answers do not establish whether this waste battery meets A1170 or B1090. Battery chemistry, sorting/specification, and hazardous constituent evidence are required. B1120 is spent catalysts, not a battery entry.',
    )
  }

  // Separated plastic fractions may fall under specific plastic entries, so these answers are insufficient.
  if (type === 'Plastic') {
    return characterizationRequired(
      'Separated e-waste plastic may be governed by specific plastic-waste entries rather than A1181/Y49. Composition and contamination evidence are required before assigning B3011, Y48, A3210, or another applicable entry.',
    )
  }

  const wasteEvidence = wasteEvidenceFor(condition, use)
  const hazardEvidence: HazardEvidence = type === 'CRT' ? { crtGlassPresent: true } : {}
  const decision = evaluateEwasteCase(wasteEvidence, intendedUse, hazardEvidence)

  if (decision.wasteStatus.status === 'EVIDENCE_REQUIRED') {
    return evidenceRequired(decision.wasteStatus.recommendation)
  }

  if (decision.classification?.classification === 'A1181') {
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: decision.classification.recommendation,
      picRequired: 'YES',
      picNote: 'A1181 is controlled hazardous e-waste. Article 4A/Ban Amendment applicability requires a separate route- and purpose-specific legal check.',
      is2025Amendment: true,
    }
  }

  if (decision.classification?.classification === 'Y49') {
    return {
      code: 'Y49',
      codeName: 'Non-hazardous e-waste — Annex II (Y49)',
      hazardClass: 'ANNEX_II',
      annexType: 'Annex II',
      explanation: decision.classification.recommendation,
      picRequired: 'YES',
      picNote: 'Y49 is controlled under the Basel Convention. Article 4A does not apply to Annex II wastes.',
      is2025Amendment: true,
    }
  }

  return characterizationRequired(
    `Waste status is established, but these answers do not prove whether A1181 or Y49 applies. ${decision.classification?.recommendation ?? 'Provide hazard characterization evidence.'}`,
  )
}
