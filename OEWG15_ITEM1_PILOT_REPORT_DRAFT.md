# OEWG-15 Item 1 Pilot Implementation Report

**Document:** OEWG-15 Item 1 Grounded Decision Engine — Pilot Report Draft
**Implementation Date:** September 2026
**Status:** Pilot Testing (through 30 September 2026)
**Source Document:** UNEP/CHW.16/INF/10/Rev.1

---

## 1. Executive Summary

This report documents the implementation of a grounded decision engine for Basel Convention e-waste classification within the DexMetal compliance platform. The implementation addresses critical defects in legacy classification logic and establishes a source-of-truth module aligned with the 2025 Basel amendments (Decision BC-15/18).

### Key Achievements

- **Eliminated deleted codes**: B1110, A1180, B4030 no longer returned as valid classifications
- **Corrected misconceptions**: Y31 (Annex I constituent) no longer misclassified as ULAB code; B1120 (spent catalysts) no longer misclassified as battery code
- **Implemented para 51 presumption**: E-waste presumed hazardous (A1181) unless proven non-hazardous (Y49)
- **Added CHARACTERIZATION_REQUIRED outcome**: System refuses to guess when evidence is insufficient

---

## 2. Implementation Scope

### 2.1 Source-of-Truth Module

Location: `src/lib/basel/`

| File | Purpose |
|------|---------|
| `source-metadata.ts` | Official document references, 2025 amendments, paragraph citations |
| `codes.ts` | EWASTE_CODES, BATTERY_CODES, ANNEX_I_CONSTITUENTS, INVALID_CODES |
| `waste-status.ts` | Waste/non-waste determination per paragraphs 28-46 |
| `ewaste-classification.ts` | Hazardous/non-hazardous classification per paragraphs 47-52 |
| `index.ts` | Public API and AGENT_GROUNDING_CONTEXT for LLM injection |

### 2.2 Components Updated

1. **BaselClassificationQuickscan.tsx** — `classify()` function updated to use correct codes
2. **`/api/chat/route.ts`** — Agent system prompt now includes deterministic grounding context

---

## 3. Critical Code Corrections

### 3.1 Deleted Codes (Effective 1 January 2025)

| Code | Former Use | Status | Correction |
|------|-----------|--------|------------|
| A1180 | Hazardous e-waste | DELETED | Use A1181 |
| B1110 | Non-hazardous e-waste assemblies | DELETED | Use Y49 (Annex II) |
| B4030 | Wastes from PCBs | DELETED | No direct replacement |

### 3.2 Misconceived Codes

| Misconception | Reality | Correct Code |
|--------------|---------|--------------|
| Y31 as ULAB code | Y31 is Annex I constituent (lead compounds) | A1160 |
| B1120 as battery code | B1120 is spent catalysts | A1160, A1170, or B1090 |
| Y10 as e-waste code | Y10 is not an e-waste classification | A1181 or Y49 |

### 3.3 Current Valid E-Waste Codes

| Code | Annex | Description | PIC | Ban Amendment |
|------|-------|-------------|-----|---------------|
| A1181 | VIII | Hazardous e-waste | Required | Applies |
| Y49 | II | Non-hazardous e-waste | Required | Does NOT apply |

---

## 4. Decision Logic Implementation

### 4.1 Waste vs Non-Waste (Paragraphs 28-46)

**Waste indicators (para 32):**
- Destined for recycling/disposal or fate uncertain
- Essential parts missing
- Fails functionality tests or has material defects
- Physical damage impairs function and not repairable at reasonable cost
- Inadequate packaging/protection
- Destined for cannibalization/spare parts
- Any involved country considers it waste under national law
- Competent authorities disagree on status

**Non-waste conditions (para 33):**
- 33(a): Direct reuse — all conditions must be met
- 33(b): Repair/refurbishment — all conditions must be met

### 4.2 Hazardous vs Non-Hazardous (Paragraphs 47-52)

**Para 51 Presumption:**
> "Electrical and electronic waste should be presumed to be hazardous waste unless it can be shown either that it does not exhibit hazardous characteristics or that it does not contain hazardous components or substances."

**Always-hazardous indicators (para 51):**
- CRT glass (para 51(a))
- Ni-Cd or mercury batteries (para 51(b))
- Selenium drums (para 51(c))
- PCBs with lead solder or BFRs (para 51(d))
- Fluorescent tubes/backlights (para 51(e))
- Plastics with BFRs/POPs (para 51(f))
- Mercury-containing components (para 51(g))
- Hazardous oils/liquids (para 51(h))
- Asbestos components (para 51(i))

---

## 5. Pilot Test Cases

### 5.1 Test Coverage

| # | Scenario | Expected Outcome | Test Status |
|---|----------|-----------------|-------------|
| 1 | CRT monitor | A1181 (always hazardous) | ✅ |
| 2 | Functional laptop with testing report | Non-waste | ✅ |
| 3 | Damaged phone with cracked screen | Waste, CHARACTERIZATION_REQUIRED | ✅ |
| 4 | Sorted ULAB | A1160 | ✅ |
| 5 | Mixed e-waste without characterization | CHARACTERIZATION_REQUIRED | ✅ |
| 6 | Equipment destined for parts cannibalization | Waste | ✅ |
| 7 | Used laptop meeting para 33(a) | Non-waste | ✅ |
| 8 | E-waste with Ni-Cd battery | A1181 | ✅ |
| 9 | Refurbished phone destined for resale | Non-waste (para 33(b)) | ✅ |
| 10 | E-waste with uncertain destination | Waste | ✅ |

### 5.2 Regression Tests

| Code | Test | Expected | Status |
|------|------|----------|--------|
| B1110 | Reject as deleted | Invalid | ✅ |
| A1180 | Reject, suggest A1181 | Invalid, correction provided | ✅ |
| B4030 | Reject as deleted | Invalid | ✅ |
| Y31_AS_ULAB | Reject, suggest A1160 | Invalid, correction provided | ✅ |
| B1120_AS_BATTERY | Reject | Invalid | ✅ |
| A1181 | Accept | Valid | ✅ |
| Y49 | Accept | Valid | ✅ |
| A1160 | Accept | Valid | ✅ |

---

## 6. Agent Grounding

The DexMetal Agent (`/api/chat`) now receives deterministic grounding context that prevents confident emission of deleted or incorrect codes:

```
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
```

---

## 7. Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/lib/basel/source-metadata.ts` | NEW | Source document metadata |
| `src/lib/basel/codes.ts` | NEW | Code reference with validation |
| `src/lib/basel/waste-status.ts` | NEW | Waste/non-waste decision engine |
| `src/lib/basel/ewaste-classification.ts` | NEW | E-waste hazard classification |
| `src/lib/basel/index.ts` | NEW | Public API and grounding context |
| `src/components/tools/BaselClassificationQuickscan.tsx` | MODIFIED | Corrected classify() function |
| `src/app/api/chat/route.ts` | MODIFIED | Added grounding context to system prompt |
| `tests/int/basel-decision-engine.int.spec.ts` | NEW | 10 pilot tests + regression tests |

---

## 8. Recommendations

### 8.1 Before COP-17 Submission

1. Run full test suite: `pnpm test:int`
2. Verify no deleted codes appear in any UI or API response
3. Test Agent responses to e-waste classification queries
4. Review pilot feedback from operators

### 8.2 Future Enhancements

1. Add more hazard indicator evidence fields to HazardEvidence interface
2. Implement laboratory characterization report parsing
3. Add country-specific national law integration for waste determination
4. Build audit trail for classification decisions

---

## 9. Compliance Statement

This implementation is designed to support Basel Convention compliance by providing:

- **Deterministic decisions** grounded in official guidelines
- **Transparent reasoning** with paragraph citations
- **Conservative outcomes** (CHARACTERIZATION_REQUIRED) when evidence is insufficient
- **Correction guidance** for commonly misconceived codes

The decision engine does NOT replace competent authority judgment. All transboundary movements require Prior Informed Consent (PIC) from relevant competent authorities.

---

**Report prepared by:** DexMetal Compliance Engineering
**Review status:** Draft — Pending pilot testing feedback
**Document version:** 1.0.0
