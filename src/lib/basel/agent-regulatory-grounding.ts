/**
 * Hard regulatory facts supplied to the public Agent.
 *
 * This is intentionally separate from the Decision Engine and QuickScan. The
 * Agent is probabilistic; these facts are the non-negotiable floor for answers
 * while shipment-specific and national-law facts remain unknown until verified.
 */
export const AGENT_REGULATORY_GROUNDING = `
REGULATORY GROUND TRUTH — DO NOT CONTRADICT:
- Trinidad and Tobago is a Party to the Basel Convention. It acceded on 18 February 1994, effective 19 May 1994 (United Nations Treaty Collection, Chapter XXVII-3).
- The Basel e-waste amendments adopted in decision BC-15/18 became effective on 1 January 2025 for Parties that did not notify non-acceptance.
- A1181 is the current Annex VIII entry for hazardous e-waste. It replaced A1180, which ceased to be current after 31 December 2024.
- Y49 is the current Annex II entry for other e-waste not covered by A1181 or another applicable entry. Transboundary movements of waste covered by A1181 or Y49 are subject to PIC.
- B1110 was deleted from Annex IX effective 1 January 2025. Never present B1110 as a current classification.

WASTE-STATUS GUARDRAILS:
- Do not classify an item under A1181 or Y49 until it is determined to be waste. Tested, fully functional equipment genuinely destined for direct reuse may be non-waste when the applicable technical-guideline conditions and every involved country's law are satisfied.
- Broken, failed, mixed, untested, incomplete, repair/refurbishment, and parts shipments require evidence-led analysis; do not convert uncertainty into a categorical answer.
- Non-functionality or a recovery destination can establish waste status, but does not by itself establish hazardous status. Without hazardous-characteristic evidence, present A1181 and Y49 as alternatives requiring characterization; never assign A1181 solely because equipment is broken or waste.
- Repair/refurbishment is not automatically waste under the technical guidelines. Paragraph 33(b) provides a possible non-waste pathway when all applicable conditions and national laws are satisfied; some Parties still treat it as waste. Never say all repair/refurbishment shipments are waste or are always subject to the Convention.
- Age, low value, damage, missing records, hazardous constituents, intended operation, packaging, and national definitions can be relevant indicators. No single slogan replaces the full facts.
- Country-specific definitions, prohibitions, acceptance conditions, competent-authority identity, and shipment permission are UNKNOWN unless verified from an authoritative current source or provided by the user. Say what remains unknown and direct the operator to verify it; never invent it.
- If involved countries disagree whether material is waste, apply the Convention's protective rule and treat the movement as waste for Convention purposes.
- For that disagreement rule, cite UNEP/CHW.16/INF/10/Rev.1, paragraphs 45–46. Article 1(8)(b) does not exist. Do not invent an article, paragraph, decision, or quotation; omit a pinpoint citation when unsure.
- Never promise legality, customs clearance, or competent-authority approval.

When a code or date matters, identify the official basis concisely: Basel Convention decision BC-15/18 / official E-waste Amendments FAQ, or the United Nations Treaty Collection for Party status.
`.trim()

export type HardFactContradiction =
  | 'trinidad-and-tobago-party-status'
  | 'ewaste-effective-date'
  | 'deleted-b1110'
  | 'obsolete-a1180'
  | 'fabricated-article-1-8-b'
  | 'unsupported-a1181'
  | 'categorical-repair-is-waste'

export function detectHardFactContradictions(
  answer: string,
  question = '',
): HardFactContradiction[] {
  const normalized = answer.replace(/\s+/g, ' ').trim()
  const contradictions: HardFactContradiction[] = []

  if (
    /Trinidad and Tobago.{0,80}(?:(?:is|remains|as) (?:a )?|it(?:'|’)s (?:a )?)(?:non[- ]Party|not a Party)/i.test(
      normalized,
    )
  ) {
    contradictions.push('trinidad-and-tobago-party-status')
  }

  const amendmentDateClaim = normalized.match(
    /(?:e-waste|electronic waste).{0,60}amendments?.{0,80}(?:effective|effect|force).{0,30}(?:1 )?Jan(?:uary)? (\d{4})/i,
  )
  if (amendmentDateClaim && amendmentDateClaim[1] !== '2025') {
    contradictions.push('ewaste-effective-date')
  }

  if (
    /\bB1110\b/i.test(normalized) &&
    !/\bB1110\b.{0,100}(?:deleted|obsolete|no longer|not (?:a )?(?:current|valid)|former|historical)/i.test(
      normalized,
    )
  ) {
    contradictions.push('deleted-b1110')
  }

  if (
    /(?:current|use|classif(?:y|ied|ication)|code is).{0,40}\bA1180\b|\bA1180\b.{0,40}(?:current|use|classif(?:y|ied|ication))/i.test(
      normalized,
    ) &&
    !/\bA1180\b.{0,100}(?:deleted|obsolete|replaced|no longer|not (?:a )?(?:current|valid)|former|historical)/i.test(
      normalized,
    )
  ) {
    contradictions.push('obsolete-a1180')
  }

  if (/\bArticle\s*1\s*(?:\(\s*8\s*\)|,\s*paragraph\s*8)/i.test(normalized)) {
    contradictions.push('fabricated-article-1-8-b')
  }

  const questionSuppliesHazardEvidence =
    /\b(?:hazardous|lead|mercury|cadmium|pcb|crt|brominated|contaminated)\b/i.test(question)
  const categoricallyAssignsA1181 =
    /\b(?:fall(?:s)? under|classif(?:y|ied) as|is|are)\s+(?:the\s+)?A1181\b/i.test(normalized)
  if (
    categoricallyAssignsA1181 &&
    !/\bA1181\b.{0,30}\bor\b.{0,30}\bY49\b|\bY49\b.{0,30}\bor\b.{0,30}\bA1181\b/i.test(
      normalized,
    ) &&
    !questionSuppliesHazardEvidence
  ) {
    contradictions.push('unsupported-a1181')
  }

  if (
    /\brepair(?:\/refurbishment)? shipments? (?:are|remain) (?:still )?subject to (?:the )?(?:Basel )?Convention\b/i.test(
      normalized,
    )
  ) {
    contradictions.push('categorical-repair-is-waste')
  }

  return contradictions
}

export function hardFactSafetyFallback(): string {
  return 'I cannot give a reliable shipment-specific conclusion from the available facts. The current Basel baseline is: Trinidad and Tobago is a Party; the e-waste amendments took effect on 1 January 2025; A1181 replaced A1180; B1110 was deleted; and Y49 covers other e-waste. Whether the material is waste and what national controls apply remain unknown until the facts and current competent-authority requirements are verified.'
}
