/**
 * Basel Convention Code Reference
 *
 * Official Basel Annex entries relevant to e-waste and battery waste streams.
 * Updated for 2025 amendments (BC-15/18).
 *
 * CRITICAL: B1110 was DELETED effective 1 January 2025 and must not be returned
 * as a valid e-waste classification code.
 */

export type BaselAnnex = 'I' | 'II' | 'III' | 'VIII' | 'IX'

export interface BaselCodeEntry {
  code: string
  annex: BaselAnnex
  title: string
  description: string
  hazardous: boolean
  picRequired: boolean
  article4AStatus: 'POTENTIAL_SCOPE' | 'OUTSIDE_SCOPE'
  effectiveDate?: string
  deletedDate?: string
  replacedBy?: string
  notes?: string
}

/**
 * E-Waste Codes (2025 amendments applied)
 */
export const EWASTE_CODES: Record<string, BaselCodeEntry> = {
  A1181: {
    code: 'A1181',
    annex: 'VIII',
    title: 'Hazardous electrical and electronic waste',
    description:
      'Waste electrical and electronic equipment containing or contaminated with Annex I constituents to an extent that the waste exhibits an Annex III characteristic, or with hazardous components',
    hazardous: true,
    picRequired: true,
    article4AStatus: 'POTENTIAL_SCOPE',
    effectiveDate: '2025-01-01',
    notes: 'Replaces A1180. See para 47 of UNEP/CHW.16/INF/10/Rev.1',
  },
  Y49: {
    code: 'Y49',
    annex: 'II',
    title: 'Non-hazardous electrical and electronic waste',
    description:
      'Waste electrical and electronic equipment not containing and not contaminated with Annex I constituents to hazardous extent, with no hazardous components',
    hazardous: false,
    picRequired: true,
    article4AStatus: 'OUTSIDE_SCOPE',
    effectiveDate: '2025-01-01',
    notes: 'New Annex II entry. PIC required; Article 4A does not apply to Annex II wastes. See paras 44 and 48',
  },
  A1180: {
    code: 'A1180',
    annex: 'VIII',
    title: 'Hazardous e-waste (OBSOLETE)',
    description: 'Former entry for hazardous e-waste',
    hazardous: true,
    picRequired: true,
    article4AStatus: 'POTENTIAL_SCOPE',
    deletedDate: '2025-01-01',
    replacedBy: 'A1181',
    notes: 'DELETED effective 1 January 2025. Use A1181 instead',
  },
  B1110: {
    code: 'B1110',
    annex: 'IX',
    title: 'Electrical and electronic assemblies (DELETED)',
    description: 'Former entry for non-hazardous e-waste assemblies destined for direct reuse',
    hazardous: false,
    picRequired: false,
    article4AStatus: 'OUTSIDE_SCOPE',
    deletedDate: '2025-01-01',
    notes:
      'DELETED effective 1 January 2025. Non-hazardous e-waste now falls under Y49 (Annex II) and requires PIC',
  },
}

/**
 * Battery Codes
 */
export const BATTERY_CODES: Record<string, BaselCodeEntry> = {
  A1160: {
    code: 'A1160',
    annex: 'VIII',
    title: 'Waste lead-acid batteries',
    description: 'Waste lead-acid batteries, whole or crushed',
    hazardous: true,
    picRequired: true,
    article4AStatus: 'POTENTIAL_SCOPE',
    notes: 'The correct code for waste lead-acid batteries (ULAB). NOT Y31.',
  },
  A1170: {
    code: 'A1170',
    annex: 'VIII',
    title: 'Unsorted waste batteries',
    description:
      'Unsorted waste batteries excluding mixtures solely of list B batteries, plus waste batteries not specified on list B containing Annex I constituents to hazardous extent',
    hazardous: true,
    picRequired: true,
    article4AStatus: 'POTENTIAL_SCOPE',
    notes: 'Covers unsorted batteries and hazardous battery types not on list B',
  },
  B1090: {
    code: 'B1090',
    annex: 'IX',
    title: 'Non-hazardous waste batteries',
    description:
      'Waste batteries conforming to a specification, excluding those made with lead, cadmium, or mercury',
    hazardous: false,
    picRequired: false,
    article4AStatus: 'OUTSIDE_SCOPE',
    notes: 'Non-hazardous batteries only. Lead, cadmium, mercury batteries excluded.',
  },
}

/**
 * Annex I Constituent Categories (NOT waste list entries)
 * These are hazard categories, not classification codes for whole items.
 */
export const ANNEX_I_CONSTITUENTS: Record<string, { code: string; name: string; note: string }> = {
  Y26: { code: 'Y26', name: 'Cadmium; cadmium compounds', note: 'Annex I constituent category' },
  Y29: { code: 'Y29', name: 'Mercury; mercury compounds', note: 'Annex I constituent category' },
  Y31: {
    code: 'Y31',
    name: 'Lead; lead compounds',
    note:
      'Annex I constituent category — NOT a waste list entry for ULAB. Use A1160 for waste lead-acid batteries.',
  },
  Y45: {
    code: 'Y45',
    name: 'Organohalogen compounds',
    note: 'Annex I constituent category (includes BFRs)',
  },
}

/**
 * Miscoded entries that must be rejected
 */
export const INVALID_CODES: Record<string, { reason: string; correctCode?: string }> = {
  B1110: {
    reason: 'Deleted effective 1 January 2025. E-waste now classified as A1181 or Y49.',
    correctCode: undefined,
  },
  A1180: {
    reason: 'Deleted effective 1 January 2025. Replaced by A1181.',
    correctCode: 'A1181',
  },
  B4030: {
    reason: 'Deleted effective 1 January 2025.',
    correctCode: undefined,
  },
  Y31_AS_ULAB: {
    reason:
      'Y31 is an Annex I constituent category (lead compounds), not a waste list entry. Use A1160 for waste lead-acid batteries.',
    correctCode: 'A1160',
  },
  B1120_AS_BATTERY: {
    reason: 'B1120 is spent catalysts, not batteries. Use A1160, A1170, or B1090 for batteries.',
    correctCode: undefined,
  },
  Y10_AS_EWASTE: {
    reason:
      'Y10 is not an e-waste code. Use A1181 (hazardous) or Y49 (non-hazardous) for e-waste.',
    correctCode: undefined,
  },
}

/**
 * Check if a code is currently valid (not deleted)
 */
export function isValidCode(code: string): boolean {
  if (code in INVALID_CODES) return false
  const ewaste = EWASTE_CODES[code]
  if (ewaste && ewaste.deletedDate) return false
  return true
}

/**
 * Get code entry by code string
 */
export function getCodeEntry(code: string): BaselCodeEntry | undefined {
  return EWASTE_CODES[code] ?? BATTERY_CODES[code]
}
