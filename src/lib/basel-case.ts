export type BaselValue = string | string[] | boolean | number | null | undefined
export type BaselData = Record<string, BaselValue>

export interface BaselProject {
  id: string
  status?: string | null
  notification_data?: BaselData | null
  movement_data?: BaselData | null
  export_country_iso?: string | null
  import_country_iso?: string | null
  transit_country_isos?: string[] | string | null
  created_at?: string
  updated_at?: string
}

export type CaseSignal = 'blocker' | 'warning' | 'ready'
export type MoveDecision = 'YES' | 'NO' | 'NOT PROVEN'

export interface CaseIssue {
  signal: CaseSignal
  title: string
  detail: string
  actionHref?: string
}

export interface BaselCaseSummary {
  notificationNo: string
  baselCode: string
  yCode: string
  hCode: string
  operationCode: string
  exportCountry: string
  importCountry: string
  transitCountries: string[]
  wasteDescription: string
  notifiedTonnage: number | null
  plannedShipments: number | null
  currentMovementTonnage: number | null
  movementSerial: number | null
  totalMovements: number | null
  consentStatus: 'CONFIRMED' | 'NOT CONFIRMED'
  moveDecision: MoveDecision
  stage: string
  issues: CaseIssue[]
}

const text = (value: BaselValue): string => {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  return ''
}

const numberValue = (value: BaselValue): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number.parseFloat(text(value))
  return Number.isFinite(parsed) ? parsed : null
}

const transitList = (value: BaselValue | string[] | null | undefined): string[] => {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean)
  return text(value as BaselValue)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

const isConsentConfirmed = (status?: string | null): boolean => {
  const normalized = (status || '').toLowerCase().replace(/[\s_-]+/g, '')
  return ['consented', 'approved', 'authorized', 'movementauthorized', 'moving', 'closed', 'complete', 'completed'].includes(normalized)
}

export function evaluateBaselCase(project: BaselProject): BaselCaseSummary {
  const n = project.notification_data || {}
  const m = project.movement_data || {}
  const notificationNo = text(n.block3_notification_no) || text(m.mv_block1_notification_no)
  const baselCode = text(n.block14_basel)
  const yCode = text(n.block14_y_code)
  const hCode = text(n.block14_h_code)
  const operationCode = text(n.block11_code)
  const exportCountry = text(n.block15_export) || project.export_country_iso || ''
  const importCountry = text(n.block15_import) || project.import_country_iso || ''
  const transitCountries = transitList(n.block15_transit || project.transit_country_isos)
  const wasteDescription = text(n.block12_description)
  const notifiedTonnage = numberValue(n.block5_quantity)
  const plannedShipments = numberValue(n.block4_shipments)
  const currentMovementTonnage = numberValue(m.mv_block2_quantity)
  const movementSerial = numberValue(m.mv_block1_serial)
  const totalMovements = numberValue(m.mv_block1_total) || plannedShipments
  const consentConfirmed = isConsentConfirmed(project.status)

  const issues: CaseIssue[] = []
  const blocker = (title: string, detail: string, actionHref?: string) => issues.push({ signal: 'blocker', title, detail, actionHref })
  const warning = (title: string, detail: string, actionHref?: string) => issues.push({ signal: 'warning', title, detail, actionHref })

  if (!baselCode) blocker('Classification not locked', 'No Basel Annex code is stored for this case.', '/tools/basel-classification-quickscan')
  if (!operationCode) blocker('Recovery/disposal operation missing', 'Add the R-code or D-code used by the destination facility.', '/tools/basel-navigator')
  if (!exportCountry || !importCountry) blocker('Route incomplete', 'Both State of export and State of import are required.', '/tools/ewaste-route-mapper')
  if (!text(n.block1_name)) blocker('Notifier not identified', 'The exporter/notifier legal entity is missing.', '/tools/basel-navigator')
  if (!text(n.block2_name)) blocker('Importer not identified', 'The importer/consignee legal entity is missing.', '/tools/basel-navigator')
  if (!text(n.block10_name)) blocker('Facility not identified', 'The disposal/recovery facility is missing.', '/tools/basel-navigator')
  if (notifiedTonnage === null || notifiedTonnage <= 0) blocker('Notified quantity missing', 'Enter the total intended quantity for the notification.', '/tools/basel-navigator')
  if (!notificationNo) warning('Notification reference missing', 'Add the official or working notification number when available.', '/tools/basel-navigator')
  if (transitCountries.length > 0 && !consentConfirmed) warning('Transit consent not evidenced', `This route includes ${transitCountries.join(', ')}. The case does not yet prove that all required transit consent is in.`)
  if (!consentConfirmed) warning('Consent not evidenced', 'DexMetal has not yet recorded a case status that proves authorization to move.')
  if (currentMovementTonnage !== null && notifiedTonnage !== null && currentMovementTonnage > notifiedTonnage) blocker('Movement exceeds notified quantity', `Current movement quantity (${currentMovementTonnage} t) exceeds the notified quantity (${notifiedTonnage} t).`)

  const hasBlocker = issues.some((issue) => issue.signal === 'blocker')
  let moveDecision: MoveDecision = 'NOT PROVEN'
  if (hasBlocker) moveDecision = 'NO'
  else if (consentConfirmed) moveDecision = 'YES'

  let stage = 'Pre-flight'
  if (baselCode && exportCountry && importCountry) stage = 'Notification preparation'
  if (notificationNo) stage = 'Authority / consent'
  if (consentConfirmed) stage = 'Movement control'
  if (text(m.mv_block5_date) || currentMovementTonnage !== null) stage = 'Shipment in progress'
  if (text(m.mv_block18_date) || text(m.mv_block18_received_date)) stage = 'Receipt confirmation'
  if (text(m.mv_block19_date) || text(m.mv_block19_certification_date)) stage = 'Recovery / disposal confirmation'
  if ((project.status || '').toLowerCase() === 'closed') stage = 'Closed'

  if (issues.length === 0) issues.push({ signal: 'ready', title: 'Case data complete', detail: 'No deterministic pre-flight gaps were detected in the stored case data.' })

  return {
    notificationNo,
    baselCode,
    yCode,
    hCode,
    operationCode,
    exportCountry,
    importCountry,
    transitCountries,
    wasteDescription,
    notifiedTonnage,
    plannedShipments,
    currentMovementTonnage,
    movementSerial,
    totalMovements,
    consentStatus: consentConfirmed ? 'CONFIRMED' : 'NOT CONFIRMED',
    moveDecision,
    stage,
    issues,
  }
}

export function practitionerAnswer(summary: BaselCaseSummary, command: string): string {
  const q = command.toLowerCase()

  if (q.includes('can') && q.includes('move')) {
    if (summary.moveDecision === 'YES') return 'YES — the case record shows consent marked as confirmed and no deterministic pre-flight blocker is present. This reflects the status recorded in this case, not an independent legal determination by DexMetal.'
    if (summary.moveDecision === 'NO') return `NO — ${summary.issues.filter((i) => i.signal === 'blocker').map((i) => i.title).join('; ')}.`
    return 'NOT PROVEN — the case data does not yet contain evidence that all required consent is in.'
  }

  if (q.includes('consent')) return summary.consentStatus === 'CONFIRMED' ? 'Consent is recorded as confirmed for this case.' : 'Consent is not yet evidenced by the stored case status.'
  if (q.includes('classification') || q.includes('basel code')) return summary.baselCode ? `Basel classification: ${summary.baselCode}${summary.yCode ? `; ${summary.yCode}` : ''}${summary.hCode ? `; ${summary.hCode}` : ''}.` : 'Basel classification has not been locked for this case.'
  if (q.includes('route')) return `${summary.exportCountry || '?'} → ${summary.transitCountries.length ? `${summary.transitCountries.join(' → ')} → ` : ''}${summary.importCountry || '?'}.`
  if (q.includes('tonnage')) {
    if (summary.notifiedTonnage === null) return 'No notified tonnage is stored.'
    if (summary.currentMovementTonnage === null) return `Notified tonnage: ${summary.notifiedTonnage} t. DexMetal does not yet have a movement quantity to calculate a current drawdown.`
    return `Notified: ${summary.notifiedTonnage} t. Current movement: ${summary.currentMovementTonnage} t. Balance after this movement only: ${Math.max(0, summary.notifiedTonnage - summary.currentMovementTonnage)} t. This is not a cumulative shipment ledger yet.`
  }
  if (q.includes('close')) return summary.stage === 'Closed' ? 'This case is recorded as closed.' : 'Not ready to close from stored evidence. Confirm receipt and recovery/disposal certification before close-out.'

  return `Current stage: ${summary.stage}. ${summary.issues.filter((i) => i.signal === 'blocker').length} blocker(s), ${summary.issues.filter((i) => i.signal === 'warning').length} warning(s).`
}
