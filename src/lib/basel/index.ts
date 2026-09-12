/**
 * Basel Convention Decision Engine
 *
 * Source-of-truth module for OEWG-15 Item 1 grounded waste/non-waste
 * and e-waste classification decisions.
 *
 * Based on: UNEP/CHW.16/INF/10/Rev.1 (Technical Guidelines)
 * Pilot testing period: Through 30 September 2026
 *
 * This module replaces hardcoded classification logic in QuickScan
 * and provides deterministic grounding for the Agent.
 */

// Source metadata
export {
  BASEL_SOURCE_METADATA,
  BASEL_2025_AMENDMENTS,
  GUIDELINE_PARAGRAPHS,
} from './source-metadata'

// Code reference
export {
  EWASTE_CODES,
  BATTERY_CODES,
  ANNEX_I_CONSTITUENTS,
  INVALID_CODES,
  isValidCode,
  getCodeEntry,
  type BaselAnnex,
  type BaselCodeEntry,
} from './codes'

// Waste status decision engine
export {
  determineWasteStatus,
  WASTE_REASON_CODES,
  type WasteStatusEvidence,
  type WasteStatus,
  type IntendedUse,
  type WasteStatusDecision,
  type WasteStatusReason,
} from './waste-status'

// E-waste classification engine
export {
  classifyEwaste,
  classifyBatteryWaste,
  validateCode,
  type HazardEvidence,
  type EwasteClassification,
  type EwasteClassificationResult,
} from './ewaste-classification'

export { evaluateEwasteCase, type EwasteCaseDecision } from './case-evaluator'
export { classifyQuickScan, type QuickScanClassificationResult, type QuickScanHazardClass, type QuickScanPICRequired } from './quickscan'
export { buildAgentBaselGuard, type AgentBaselGuard } from './agent-grounding'
