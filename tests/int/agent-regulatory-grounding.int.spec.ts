import { describe, expect, it } from 'vitest'

import {
  AGENT_REGULATORY_GROUNDING,
  detectHardFactContradictions,
} from '@/lib/basel/agent-regulatory-grounding'

describe('DexMetal Agent regulatory grounding', () => {
  it('pins the current Basel e-waste facts and preserves national unknowns', () => {
    expect(AGENT_REGULATORY_GROUNDING).toContain('Trinidad and Tobago is a Party')
    expect(AGENT_REGULATORY_GROUNDING).toContain('Y49')
    expect(AGENT_REGULATORY_GROUNDING).toContain('A1181')
    expect(AGENT_REGULATORY_GROUNDING).toContain('A1180')
    expect(AGENT_REGULATORY_GROUNDING).toContain('B1110')
    expect(AGENT_REGULATORY_GROUNDING).toContain('1 January 2025')
    expect(AGENT_REGULATORY_GROUNDING).toContain('UNKNOWN')
    expect(AGENT_REGULATORY_GROUNDING).toContain('Article 1(8)(b) does not exist')
  })

  it.each([
    [
      "Trinidad and Tobago specifically — it's a non-Party to Basel.",
      'trinidad-and-tobago-party-status',
      '',
    ],
    ['The e-waste amendments became effective 1 Jan 2021.', 'ewaste-effective-date', ''],
    ['Classify this shipment under B1110.', 'deleted-b1110', ''],
    ['The current hazardous e-waste code is A1180.', 'obsolete-a1180', ''],
    [
      'Basel Convention Article 1(8)(b) settles this disagreement.',
      'fabricated-article-1-8-b',
      '',
    ],
    [
      'The dead laptops fall under A1181 and trigger PIC.',
      'unsupported-a1181',
      'Forty laptops do not turn on and will be stripped for parts.',
    ],
    [
      'Repair/refurbishment shipments are still subject to the Convention.',
      'categorical-repair-is-waste',
      'The buyer will repair some televisions.',
    ],
  ])('detects the historical contradiction in %s', (answer, expectedCode, question) => {
    expect(detectHardFactContradictions(answer, question)).toContain(expectedCode)
  })

  it('allows accurate historical explanations of deleted codes', () => {
    expect(
      detectHardFactContradictions(
        'B1110 was deleted and A1180 was replaced by A1181, effective 1 January 2025.',
      ),
    ).toEqual([])
  })
})
