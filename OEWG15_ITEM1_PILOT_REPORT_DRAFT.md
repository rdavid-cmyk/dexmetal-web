# OEWG-15 Item 1 Pilot Testing Report — Draft

**Pilot subject:** Technical guidelines on transboundary movements of electrical and electronic waste and used electrical and electronic equipment, in particular regarding the distinction between waste and non-waste under the Basel Convention
**Official source:** UNEP/CHW.16/INF/10/Rev.1
**Pilot-testing window:** through 30 September 2026
**Status:** Internal draft — not submitted; Council and Chairman review required before external use

## 1. Objective

Test whether a deterministic implementation of the guideline can consistently separate: (1) used EEE that may normally be treated as non-waste, subject to the national law of all involved countries and competent-authority determination; (2) equipment that should be treated as waste; and, only after waste status is established, (3) hazardous A1181 e-waste, non-hazardous Y49 e-waste, or cases requiring further characterization.

## 2. Method

The implementation follows a strict sequence:

1. Apply national-law and competent-authority rules plus the waste indicators in paragraphs 28–32 and 45–46.
2. For direct reuse, require all paragraph 33(a) evidence. For failure analysis/repair/refurbishment, require the paragraph 33(b) conditions.
3. Only after waste status is established, classify e-waste under the current 2025 entries. A1180 and B1110 are not treated as current entries.
4. Apply the paragraph 51 hazardous presumption. If non-hazardous status is not demonstrated, the engine returns `CHARACTERIZATION_REQUIRED` and retains controlled/PIC handling while evidence is pending.
5. Preserve specific entries where they govern instead of A1181/Y49, including A1160 for confirmed waste lead-acid batteries.

The implementation does not replace national law or competent-authority determinations.

## 3. Ten pilot cases

| # | Scenario | Expected result | Engine result | Validation |
|---|---|---|---|---|
| 1 | Functional direct reuse; all para 33(a) evidence; no country treats as waste | Normally NON_WASTE, subject to national law of all involved countries and competent-authority determination | NON_WASTE | PASS |
| 2 | Direct reuse; functionality test record missing | EVIDENCE_REQUIRED / conservative waste handling | EVIDENCE_REQUIRED | PASS |
| 3 | Failure analysis/repair/refurbishment; all para 33(b) conditions | Normally NON_WASTE, subject to the national law of all involved countries and competent-authority determination | NON_WASTE | PASS |
| 4 | Same repair case; one involved country considers it waste | WASTE; waste procedures/PIC | WASTE | PASS |
| 5 | Destination is recycling | WASTE | WASTE | PASS |
| 6 | Cannibalization for spare parts | WASTE | WASTE | PASS |
| 7 | Inadequate packaging/protection | WASTE | WASTE | PASS |
| 8 | Physical damage impairs function/safety and is not reasonably repairable | WASTE | WASTE | PASS |
| 9 | Competent authorities disagree on waste status | WASTE_PROCEDURES_APPLY | WASTE_PROCEDURES_APPLY | PASS |
| 10 | Established e-waste: hazardous evidence / proven non-hazardous / insufficient evidence | A1181 / Y49 / CHARACTERIZATION_REQUIRED with hazardous presumption and PIC | A1181 / Y49 / CHARACTERIZATION_REQUIRED | PASS |

## 4. Regulatory defects identified and corrected during pilot implementation

- Legacy B1110 logic was still present even though B1110 was deleted effective 1 January 2025.
- A1180 was retained in legacy references even though A1181 is the current hazardous e-waste entry.
- Y31 had been incorrectly presented as the Basel waste-list entry for whole waste lead-acid batteries; Y31 is an Annex I constituent category for lead/lead compounds. Confirmed waste lead-acid batteries are A1160.
- B1120 had been incorrectly presented as a battery entry; B1120 is an Annex IX spent-catalyst entry.
- The legacy QuickScan sometimes assigned a waste code before establishing whether used equipment was waste. The pilot architecture reverses that order.
- Legacy Y49 metadata incorrectly described Y49 as Annex I/hazardous. It is Annex II non-hazardous e-waste and is controlled under the Convention.
- Earlier wording treated Article 4A/Ban Amendment applicability as automatic from an OECD-to-non-OECD route. The corrected implementation treats Article 4A as a separate legal-scope check; Y49 Annex II waste is outside Article 4A.

## 5. Hazardous-evidence nuance

Paragraph 50(c) distinguishes examples that are always hazardous from equipment/components whose hazard status depends on composition. The implementation therefore does not treat every printed circuit board, display device, or brominated-plastic fraction as automatically A1181. Once an item is established as waste, A1181 is returned only when hazardous evidence supports it; otherwise the canonical pilot wording is: "Where hazard evidence is insufficient, waste is treated as hazardous under paragraph 51 and remains subject to prior informed consent procedures pending full characterization."

## 6. Product integration

- One Basel decision module under `src/lib/basel/` is the source of truth for the Item 1 workflow.
- QuickScan uses that module and returns evidence-required states instead of forcing a waste code from three answers.
- The DexMetal Agent receives a deterministic message-specific Basel guard built from the same code/reference module. It is instructed to ask one focused missing-evidence question rather than confidently invent a classification.
- The homepage Agent remains embedded-only; off-homepage pages retain the single floating launcher. Code review plus existing integration/E2E coverage affirmatively confirmed this intended mount pattern. No reproducible launcher defect was found, so changing launcher code would have added risk without a demonstrated failure.

## 7. Council conditions resolved

1. Every external-use reference to a normally non-waste outcome is expressly qualified by the national law of all involved countries and competent-authority determination.
2. Characterization-pending wording is standardized: "Where hazard evidence is insufficient, waste is treated as hazardous under paragraph 51 and remains subject to prior informed consent procedures pending full characterization."
3. Country-specific jurisdiction examples are excluded from this Item 1 submission. They are reserved for the separate Basel-jurisdiction expansion workstream after each national-law mapping is independently verified.

## 8. Validation record

- Engineering lock: feature-branch commit `5750797`.
- TypeScript `--noEmit`: PASS.
- Focused Item 1 decision-engine and homepage Agent integration tests: 16/16 PASS.
- Production webpack compile: PASS. Production TypeScript phase: PASS.
- Isolated full build stops only during page-data collection because production-only runtime secrets (Resend and Payload secret) are deliberately absent from the validation clone. This is an environment-isolation limitation, not an Item 1 code failure; nothing was deployed during validation.
- Regulatory Council verdict: PASS WITH CONDITIONS; conditions above resolved in this report.

## 9. Submission gate

This document is an internal pilot draft. It must not be presented as a competent-authority determination or submitted to the Basel Secretariat until regulatory Council review is complete and Richard David, as Chairman, approves the external package.
