import { describe, expect, it } from 'vitest'
import { evaluateBaselCase, practitionerAnswer } from '@/lib/basel-case'

describe('Basel case workspace', () => {
  it('refuses to prove movement when consent evidence is missing', () => {
    const summary = evaluateBaselCase({
      id: 'case-1',
      status: 'draft',
      notification_data: {
        block1_name: 'Exporter Ltd',
        block2_name: 'Importer Ltd',
        block3_notification_no: 'TT-2026-001',
        block4_shipments: '2',
        block5_quantity: '50',
        block10_name: 'Recovery Facility',
        block11_code: 'R4',
        block12_description: 'Used lead-acid batteries',
        block14_basel: 'A1160',
        block14_y_code: 'Y31',
        block15_export: 'Trinidad and Tobago',
        block15_import: 'Germany',
      },
    })

    expect(summary.moveDecision).toBe('NOT PROVEN')
    expect(practitionerAnswer(summary, 'Can this shipment move?')).toContain('NOT PROVEN')
  })

  it('returns NO when a fatal pre-flight field is missing', () => {
    const summary = evaluateBaselCase({
      id: 'case-2',
      status: 'approved',
      notification_data: {
        block1_name: 'Exporter Ltd',
        block2_name: 'Importer Ltd',
        block5_quantity: '20',
        block10_name: 'Recovery Facility',
        block11_code: 'R4',
        block15_export: 'Trinidad and Tobago',
        block15_import: 'Germany',
      },
    })

    expect(summary.moveDecision).toBe('NO')
    expect(summary.issues.some((issue) => issue.title === 'Classification not locked')).toBe(true)
  })

  it('returns YES only when consent status is recorded and no blocker is present', () => {
    const summary = evaluateBaselCase({
      id: 'case-3',
      status: 'consented',
      notification_data: {
        block1_name: 'Exporter Ltd',
        block2_name: 'Importer Ltd',
        block3_notification_no: 'TT-2026-003',
        block4_shipments: '1',
        block5_quantity: '24.5',
        block10_name: 'Recovery Facility',
        block11_code: 'R4',
        block12_description: 'Used lead-acid batteries',
        block14_basel: 'A1160',
        block14_y_code: 'Y31',
        block15_export: 'Trinidad and Tobago',
        block15_import: 'Germany',
      },
    })

    expect(summary.moveDecision).toBe('YES')
  })

  it('does not mislabel one movement as cumulative notification drawdown', () => {
    const summary = evaluateBaselCase({
      id: 'case-4',
      status: 'consented',
      notification_data: {
        block1_name: 'Exporter Ltd',
        block2_name: 'Importer Ltd',
        block4_shipments: '4',
        block5_quantity: '100',
        block10_name: 'Recovery Facility',
        block11_code: 'R4',
        block14_basel: 'A1160',
        block15_export: 'Trinidad and Tobago',
        block15_import: 'Germany',
      },
      movement_data: {
        mv_block1_serial: '2',
        mv_block1_total: '4',
        mv_block2_quantity: '20',
      },
    })

    expect(practitionerAnswer(summary, 'What is the tonnage position?')).toContain('after this movement only')
    expect(practitionerAnswer(summary, 'What is the tonnage position?')).toContain('not a cumulative shipment ledger yet')
  })
})
