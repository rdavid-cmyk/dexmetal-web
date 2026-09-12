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

/**
 * Grounding context for Agent LLM
 *
 * This constant provides deterministic regulatory facts that the Agent
 * must not contradict. Use as context injection in system prompts.
 */
export const AGENT_GROUNDING_CONTEXT = `
## Basel Convention E-Waste Classification — Official Facts (2025)

Source: UNEP/CHW.16/INF/10/Rev.1 (Technical Guidelines on E-Waste)
Status: Pilot testing through 30 September 2026

### 2025 Amendments (Effective 1 January 2025)
- A1180 DELETED → replaced by A1181 (hazardous e-waste, Annex VIII)
- B1110 DELETED → no replacement; non-hazardous e-waste now Y49 (Annex II)
- B4030 DELETED
- Y49 ADDED → non-hazardous e-waste (Annex II, requires PIC, Ban Amendment does NOT apply)

### Critical Code Corrections
- Y31 is an Annex I CONSTITUENT CATEGORY (lead compounds), NOT a waste list entry
- The correct code for waste lead-acid batteries (ULAB) is A1160, NOT Y31
- B1120 is SPENT CATALYSTS, NOT batteries
- Use A1160, A1170, or B1090 for battery waste

### E-Waste Classification Rule
Per para 51: E-waste should be PRESUMED HAZARDOUS (A1181) unless proven non-hazardous.
- Hazardous e-waste: A1181 (Annex VIII, PIC required, Ban Amendment applies)
- Non-hazardous e-waste: Y49 (Annex II, PIC required, Ban Amendment does NOT apply)
- When evidence is insufficient: CHARACTERIZATION_REQUIRED — do not guess

### Waste vs Non-Waste (paras 28-46)
Equipment is normally WASTE when:
- Destined for recycling/disposal or fate uncertain
- Essential parts missing
- Fails functionality tests or has material defects
- Physical damage impairs function and not repairable at reasonable cost
- Inadequate packaging/protection
- Destined for cannibalization/spare parts
- Any involved country considers it waste under national law
- Competent authorities disagree on status

Equipment may be NON-WASTE only when ALL para 33(a) or 33(b) conditions are met.
`.trim()
