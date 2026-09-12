import { BASEL_SOURCE_METADATA } from './source-metadata'
import { BATTERY_CODES, EWASTE_CODES, INVALID_CODES } from './codes'

export interface AgentBaselGuard {
  relevant: boolean
  context: string
  nextQuestion: string | null
}

export function buildAgentBaselGuard(message: string): AgentBaselGuard {
  const text = message.toLowerCase()
  const relevant = /e[ -]?waste|electronic|used\s+(?:computer|laptop|phone|equipment)|circuit\s*board|\bpcb\b|crt|ulab|lead[ -]?acid|battery|a1180|a1181|b1110|y49|y31|b1120/.test(text)
  if (!relevant) return { relevant: false, context: '', nextQuestion: null }

  const staleCorrections = Object.entries(INVALID_CODES)
    .filter(([code]) => text.includes(code.toLowerCase().replace(/_.*/, '')))
    .map(([code, value]) => `${code}: ${value.reason}`)

  const hasUse = /reuse|resale|repair|refurb|recycl|recover|dispos|cannibali[sz]|spare\s*parts/.test(text)
  const reuse = /reuse|resale/.test(text)
  const repair = /repair|refurb|failure\s*analysis/.test(text)

  let nextQuestion: string | null = null
  if (!hasUse) {
    nextQuestion = 'What will happen to the equipment at destination: direct reuse, repair/refurbishment, recycling/recovery, or disposal?'
  } else if (reuse && !/function|tested|test record/.test(text)) {
    nextQuestion = 'Do you have functionality test records for every item in the shipment?'
  } else if (repair && !/contract|facility/.test(text)) {
    nextQuestion = 'Is there a valid contract with the receiving repair/refurbishment facility covering the paragraph 33(b) conditions?'
  }

  const context = [
    `Authoritative source: ${BASEL_SOURCE_METADATA.documentId}.`,
    'Decision order: determine WASTE vs NON_WASTE first; assign a Basel waste entry only after waste status is established.',
    `Current e-waste entries: ${EWASTE_CODES.A1181.code} hazardous e-waste; ${EWASTE_CODES.Y49.code} non-hazardous e-waste. Both waste movements are controlled/PIC.`,
    `Waste lead-acid batteries: ${BATTERY_CODES.A1160.code}. Y31 is an Annex I constituent category, not the whole-battery waste entry.`,
    'B1110 and A1180 are deleted for current e-waste classification; B1120 is spent catalysts, not batteries.',
    'For waste e-waste with insufficient hazard evidence, presume hazardous pending proof and request characterization; do not guess Y49.',
    'Direct reuse and repair/refurbishment non-waste claims require the evidence conditions in paragraph 33 plus national-law checks.',
    ...staleCorrections,
    nextQuestion ? `If evidence is missing, ask exactly this next question: ${nextQuestion}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return { relevant: true, context, nextQuestion }
}
