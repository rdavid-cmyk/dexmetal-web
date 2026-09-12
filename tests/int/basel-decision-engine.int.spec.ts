import { describe, expect, it } from 'vitest'
import {
  classifyEwaste,
  classifyQuickScan,
  determineWasteStatus,
  evaluateEwasteCase,
  validateCode,
  type HazardEvidence,
  type WasteStatusEvidence,
} from '@/lib/basel'

const directReuseEvidence = {
  invoiceOrContractPresent: true,
  functionalityTestRecordsForEveryItem: true,
  noCountryConsidersWasteDeclaration: true,
  individualProtectionDuringTransport: true,
}

const repairEvidence = {
  validContractWithReceivingFacility: true,
  residualWasteESMProvisions: true,
  responsibilityAllocation: true,
  feedbackObligations: true,
  noCountryConsidersWasteDeclaration: true,
  individualProtectionDuringTransport: true,
}

describe('OEWG-15 Item 1 pilot cases', () => {
  it('1: direct reuse with all para 33(a) evidence is normally non-waste', () => {
    const result = determineWasteStatus({ directReuseEvidence }, 'DIRECT_REUSE')
    expect(result.status).toBe('NON_WASTE')
    expect(result.picRequired).toBe(false)
  })

  it('2: direct reuse without functionality testing does not qualify as non-waste', () => {
    const result = determineWasteStatus(
      {
        directReuseEvidence: {
          ...directReuseEvidence,
          functionalityTestRecordsForEveryItem: false,
        },
      },
      'DIRECT_REUSE',
    )
    expect(result.status).toBe('EVIDENCE_REQUIRED')
    expect(result.evidenceGaps.join(' ')).toMatch(/functionality/i)
    expect(result.picRequired).toBe(true)
  })

  it('3: repair/refurbishment with all para 33(b) conditions is normally non-waste', () => {
    const result = determineWasteStatus({ repairRefurbishmentEvidence: repairEvidence }, 'REPAIR_REFURBISHMENT')
    expect(result.status).toBe('NON_WASTE')
  })

  it('4: a repair case is waste when any involved country considers it waste', () => {
    const result = determineWasteStatus(
      { repairRefurbishmentEvidence: repairEvidence, anyCountryConsidersWaste: true },
      'REPAIR_REFURBISHMENT',
    )
    expect(result.status).toBe('WASTE')
    expect(result.picRequired).toBe(true)
  })

  it('5: destination recycling is waste', () => {
    const result = determineWasteStatus({ destinedForRecyclingOrDisposal: true }, 'RECYCLING')
    expect(result.status).toBe('WASTE')
  })

  it('6: cannibalization for spare parts is waste', () => {
    const result = determineWasteStatus({ destinedForCannibalization: true }, 'UNKNOWN')
    expect(result.status).toBe('WASTE')
    expect(result.reasons.some((r) => r.code === 'W_CANNIBALIZATION')).toBe(true)
  })

  it('7: inadequate transport protection is a waste indicator', () => {
    const result = determineWasteStatus({ adequatePackagingProtection: false }, 'DIRECT_REUSE')
    expect(result.status).toBe('WASTE')
    expect(result.reasons.some((r) => r.code === 'W_INADEQUATE_PACKAGING')).toBe(true)
  })

  it('8: irreparable physical damage is waste', () => {
    const result = determineWasteStatus(
      { physicalDamageImpairsFunction: true, repairableAtReasonableCost: false },
      'UNKNOWN',
    )
    expect(result.status).toBe('WASTE')
    expect(result.reasons.some((r) => r.code === 'W_PHYSICAL_DAMAGE_NOT_REPAIRABLE')).toBe(true)
  })

  it('9: competent-authority disagreement applies waste procedures', () => {
    const result = determineWasteStatus({ competentAuthorityDisagreement: true }, 'DIRECT_REUSE')
    expect(result.status).toBe('WASTE_PROCEDURES_APPLY')
    expect(result.picRequired).toBe(true)
  })

  it('10: established e-waste maps to A1181, Y49, or controlled characterization', () => {
    const wasteEvidence: WasteStatusEvidence = { destinedForRecyclingOrDisposal: true }

    const hazardous = evaluateEwasteCase(wasteEvidence, 'RECYCLING', {
      containsAnnexIConstituentsToHazardousExtent: true,
    })
    expect(hazardous.currentWasteCode).toBe('A1181')
    expect(hazardous.picRequired).toBe(true)

    const nonHazardEvidence: HazardEvidence = {
      testedNonHazardous: true,
      noHazardousComponentsConfirmed: true,
    }
    const nonHazardous = evaluateEwasteCase(wasteEvidence, 'RECYCLING', nonHazardEvidence)
    expect(nonHazardous.currentWasteCode).toBe('Y49')
    expect(nonHazardous.picRequired).toBe(true)

    const unresolved = evaluateEwasteCase(wasteEvidence, 'RECYCLING', {})
    expect(unresolved.classification?.classification).toBe('CHARACTERIZATION_REQUIRED')
    expect(unresolved.classification?.picRequired).toBe(true)
    expect(unresolved.classification?.recommendation).toMatch(/presumed hazardous/i)
  })
})

describe('2025 regression protections', () => {
  it('rejects deleted current e-waste codes', () => {
    expect(validateCode('B1110').valid).toBe(false)
    expect(validateCode('A1180').valid).toBe(false)
  })

  it('does not use B1120 or Y31 as battery waste entries', () => {
    expect(validateCode('B1120_AS_BATTERY').valid).toBe(false)
    expect(validateCode('Y31_AS_ULAB').valid).toBe(false)
  })

  it('QuickScan does not assign a waste code before direct-reuse evidence is established', () => {
    const result = classifyQuickScan('CRT', 'Functional', 'Reuse')
    expect(result.code).toBe('EVIDENCE_REQUIRED')
  })

  it('QuickScan uses A1160 only after a waste pathway is established for ULAB', () => {
    expect(classifyQuickScan('ULAB', 'Functional', 'Reuse').code).toBe('EVIDENCE_REQUIRED')
    expect(classifyQuickScan('ULAB', 'Scrap', 'Recycling').code).toBe('A1160')
  })

  it('classifyEwaste keeps PIC required while hazard characterization is pending', () => {
    const result = classifyEwaste({})
    expect(result.classification).toBe('CHARACTERIZATION_REQUIRED')
    expect(result.picRequired).toBe(true)
  })
})
