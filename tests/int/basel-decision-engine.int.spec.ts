/**
 * Basel Decision Engine — Pilot Case Tests
 *
 * 10 pilot cases per OEWG-15 Item 1 implementation requirements.
 * Tests the source-of-truth module at src/lib/basel/ for correct
 * waste/non-waste determination and e-waste classification.
 *
 * Source: UNEP/CHW.16/INF/10/Rev.1 (Technical Guidelines)
 * Pilot testing period: Through 30 September 2026
 */

import { describe, expect, it } from 'vitest'
import {
  determineWasteStatus,
  classifyEwaste,
  classifyBatteryWaste,
  validateCode,
  type WasteStatusEvidence,
  type HazardEvidence,
} from '@/lib/basel'

describe('Basel Decision Engine — Pilot Cases', () => {
  describe('Pilot Case 1: CRT monitor → A1181 (always hazardous)', () => {
    it('classifies CRT monitor as hazardous A1181 per para 51(a)', () => {
      const evidence: HazardEvidence = {
        crtGlassPresent: true,
      }

      const result = classifyEwaste(evidence)

      expect(result.classification).toBe('A1181')
      expect(result.hazardous).toBe(true)
      expect(result.picRequired).toBe(true)
      expect(result.banAmendmentApplies).toBe(true)
      expect(result.hazardIndicators).toContain('CRT glass present (para 51(a)) — always hazardous')
    })
  })

  describe('Pilot Case 2: Functional laptop with testing report → Non-waste', () => {
    it('determines functional tested laptop as non-waste per para 33(a)', () => {
      const evidence: WasteStatusEvidence = {
        directReuseEvidence: {
          invoiceOrContractPresent: true,
          functionalityTestRecordsForEveryItem: true,
          noCountryConsidersWasteDeclaration: true,
          individualProtectionDuringTransport: true,
        },
      }

      const result = determineWasteStatus(evidence, 'DIRECT_REUSE')

      expect(result.status).toBe('NON_WASTE')
      expect(result.sourceCitation).toContain('para')
    })
  })

  describe('Pilot Case 3: Damaged phone with cracked screen → Waste, CHARACTERIZATION_REQUIRED', () => {
    it('determines damaged phone as waste requiring characterization', () => {
      const wasteEvidence: WasteStatusEvidence = {
        physicalDamageImpairsFunction: true,
        repairableAtReasonableCost: false,
        adequatePackagingProtection: false,
      }

      const wasteResult = determineWasteStatus(wasteEvidence, 'UNKNOWN')
      expect(wasteResult.status).toBe('WASTE')
      expect(wasteResult.reasons.some((r) => r.code === 'W_PHYSICAL_DAMAGE_NOT_REPAIRABLE')).toBe(
        true,
      )

      // Now classify the waste
      const hazardEvidence: HazardEvidence = {}
      const classResult = classifyEwaste(hazardEvidence)

      expect(classResult.classification).toBe('CHARACTERIZATION_REQUIRED')
      expect(classResult.hazardous).toBeNull()
      expect(classResult.evidenceGaps.length).toBeGreaterThan(0)
    })
  })

  describe('Pilot Case 4: Sorted ULAB → A1160', () => {
    it('classifies waste lead-acid batteries as A1160 (not Y31)', () => {
      const result = classifyBatteryWaste('ULAB', 'SCRAP')

      expect(result.code).toBe('A1160')
      expect(result.entry.hazardous).toBe(true)
      expect(result.entry.picRequired).toBe(true)
      expect(result.entry.banAmendmentApplies).toBe(true)
      expect(result.correctedMisconception).toContain('Y31 is an Annex I constituent category')
      expect(result.correctedMisconception).toContain('A1160')
    })
  })

  describe('Pilot Case 5: Mixed e-waste without characterization → CHARACTERIZATION_REQUIRED', () => {
    it('returns CHARACTERIZATION_REQUIRED when no hazard evidence provided', () => {
      const evidence: HazardEvidence = {}

      const result = classifyEwaste(evidence)

      expect(result.classification).toBe('CHARACTERIZATION_REQUIRED')
      expect(result.hazardous).toBeNull()
      expect(result.picRequired).toBe(false) // Cannot determine PIC until classified
      expect(result.evidenceGaps.length).toBeGreaterThan(0)
      expect(result.recommendation).toContain('presumed hazardous')
    })
  })

  describe('Pilot Case 6: Equipment destined for parts cannibalization → Waste', () => {
    it('determines equipment for cannibalization as waste per para 32(i)', () => {
      const evidence: WasteStatusEvidence = {
        destinedForCannibalization: true,
      }

      const result = determineWasteStatus(evidence, 'UNKNOWN')

      expect(result.status).toBe('WASTE')
      expect(result.reasons.some((r) => r.code === 'W_CANNIBALIZATION')).toBe(true)
    })
  })

  describe('Pilot Case 7: Used laptop meeting para 33(a) → Non-waste', () => {
    it('determines used laptop meeting all para 33(a) conditions as non-waste', () => {
      const evidence: WasteStatusEvidence = {
        directReuseEvidence: {
          invoiceOrContractPresent: true,
          functionalityTestRecordsForEveryItem: true,
          noCountryConsidersWasteDeclaration: true,
          individualProtectionDuringTransport: true,
        },
      }

      const result = determineWasteStatus(evidence, 'DIRECT_REUSE')

      expect(result.status).toBe('NON_WASTE')
      expect(result.sourceCitation).toContain('para')
    })
  })

  describe('Pilot Case 8: E-waste with Ni-Cd battery → A1181', () => {
    it('classifies e-waste containing Ni-Cd battery as hazardous A1181', () => {
      const evidence: HazardEvidence = {
        nickelCadmiumBatteryPresent: true,
      }

      const result = classifyEwaste(evidence)

      expect(result.classification).toBe('A1181')
      expect(result.hazardous).toBe(true)
      expect(result.hazardIndicators).toContain('Ni-Cd battery present (para 51(b))')
    })
  })

  describe('Pilot Case 9: Refurbished phone destined for resale → Non-waste (para 33(b))', () => {
    it('determines refurbished phone meeting para 33(b) as non-waste', () => {
      const evidence: WasteStatusEvidence = {
        repairRefurbishmentEvidence: {
          validContractWithReceivingFacility: true,
          residualWasteESMProvisions: true,
          responsibilityAllocation: true,
          feedbackObligations: true,
          noCountryConsidersWasteDeclaration: true,
          individualProtectionDuringTransport: true,
        },
      }

      const result = determineWasteStatus(evidence, 'REPAIR_REFURBISHMENT')

      expect(result.status).toBe('NON_WASTE')
      expect(result.sourceCitation).toContain('para')
    })
  })

  describe('Pilot Case 10: E-waste with uncertain destination → Waste', () => {
    it('determines e-waste with uncertain destination as waste per para 32(a)', () => {
      const evidence: WasteStatusEvidence = {
        fateUncertain: true,
      }

      const result = determineWasteStatus(evidence, 'UNKNOWN')

      expect(result.status).toBe('WASTE')
      expect(result.reasons.some((r) => r.code === 'W_DEST_RECYCLING_DISPOSAL')).toBe(true)
    })
  })
})

describe('Basel Code Validation — Regression Tests', () => {
  describe('Deleted codes must be rejected', () => {
    it('rejects B1110 as deleted effective 2025-01-01', () => {
      const result = validateCode('B1110')

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Deleted')
      expect(result.reason).toContain('2025')
    })

    it('rejects A1180 as replaced by A1181', () => {
      const result = validateCode('A1180')

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Deleted')
      expect(result.correction).toBe('A1181')
    })

    it('rejects B4030 as deleted', () => {
      const result = validateCode('B4030')

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Deleted')
    })
  })

  describe('Misconceived codes must be corrected', () => {
    it('rejects Y31 as ULAB code and suggests A1160', () => {
      const result = validateCode('Y31_AS_ULAB')

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Annex I constituent category')
      expect(result.correction).toBe('A1160')
    })

    it('rejects B1120 as battery code', () => {
      const result = validateCode('B1120_AS_BATTERY')

      expect(result.valid).toBe(false)
      expect(result.reason).toContain('spent catalysts')
    })
  })

  describe('Current codes must be accepted', () => {
    it('accepts A1181 as current hazardous e-waste code', () => {
      const result = validateCode('A1181')
      expect(result.valid).toBe(true)
    })

    it('accepts Y49 as current non-hazardous e-waste code', () => {
      const result = validateCode('Y49')
      expect(result.valid).toBe(true)
    })

    it('accepts A1160 as current ULAB code', () => {
      const result = validateCode('A1160')
      expect(result.valid).toBe(true)
    })
  })
})
