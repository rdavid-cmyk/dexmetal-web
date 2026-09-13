# DexMetal Agent 20-Question Remediation — Production Retest Report

**Date:** 2026-09-13
**Final verdict:** PASS
**Production commit:** `040d2be`
**Focused regulatory tests:** 13/13 PASS
**Production browser retest:** 20/20 captured; Playwright exit code 0

## Before
The original live front-door audit was `PASS_WITH_REMEDIATION`. The critical confirmed factual defect was that the Agent could state that Trinidad and Tobago was a Basel non-Party. Remediation also targeted stale e-waste codes, the 1 January 2025 amendments, fabricated pinpoint citations, reuse/waste overclaims, repair/refurbishment distinctions, Annex VII framing, and hazardous-status overclassification.

## After
The public Agent now has a hard regulatory grounding layer plus contradiction detection, retry, and safety fallback. Decision Engine V1 and QuickScan were not modified. The exact same 20 production questions were rerun in clean browser sessions.

## 20-question production outcomes
1. **PASS** — I have 50 tested working business laptops that I want to ship from Trinidad to India for resale. Every laptop works. Are these considered waste?
   - Evidence: Tested, fully functional equipment destined for direct reuse can fall outside waste status under paragraph 33(a) of the e-waste technical guidelines — reuse without repair. That's the pathway you're on, but it's conditio…
2. **PASS** — I have 200 working smartphones collected from a corporate upgrade programme. They have been tested, data-wiped and sold to a refurbisher overseas for resale. Do Basel waste rules apply?
   - Evidence: Short answer: probably not — but it's not automatic. Tested, fully functional equipment genuinely destined for direct reuse may be **non-waste** under paragraph 33(a) of the Basel technical guidelines on e-waste, provide…
3. **PASS** — I have used servers that are fully functional but five years old. A buyer in another country wants them for direct reuse. Can I export them as used equipment rather than e-waste?
   - Evidence: Possibly — but "fully functional" alone doesn't get you there. Paragraph 33(a) of the Basel technical guidelines on e-waste provides the direct-reuse non-waste pathway, and it demands conditions: documented testing provi…
4. **PASS** — I have tested working computer parts including RAM, CPUs and power supplies. They are being sold for reuse as replacement parts. Are components treated differently from complete equipment?
   - Evidence: Short answer: under the Basel technical guidelines, components and complete equipment follow the same analysis — there's no separate, easier track for parts. Your scenario — tested, working, destined for direct reuse — m…
5. **PASS** — I have 100 laptops. Forty do not turn on and will be stripped for parts after export. Can I ship the whole load as used equipment?
   - Evidence: Short answer: no, not as a single "used equipment" load. The 40 non-functioning units destined for parts recovery are waste — non-functionality plus dismantling/parts recovery supports waste status. They'll fall under A1…
6. **PASS** — I have broken televisions with cracked screens. The buyer says they will try to repair some and recycle the rest. Is that a used-equipment shipment or waste?
   - Evidence: Based on your facts: broken TVs, cracked screens, mixed repair/recycle destination — that's waste. Non-functionality combined with recycling and an uncertain fate supports waste status. The buyer's "try to repair some" d…
7. **PASS** — I have old computers missing hard drives, RAM and power supplies. They are being exported to recover usable parts and metals. How should they be classified?
   - Evidence: Waste status is straightforward here: parts and metals recovery is a recovery operation, so these machines are waste regardless of the missing components. That kills any reuse/non-waste pathway under the technical guidel…
8. **PASS** — I have a container of mixed electronic scrap including circuit boards, cables, broken computers and power supplies. What Basel rules should I check first?
   - Evidence: Broken, mixed e-waste headed for recovery — that's waste, and likely hazardous. Here's the frame: **Classification (post-1 January 2025, per decision BC-15/18):** - Circuit boards, computers, power supplies likely fall u…
9. **PASS** — I have 100 laptops that look good but have not been tested. A buyer says they will test and resell them after arrival. Are they waste?
   - Evidence: Untested units don't get a clean answer — and that's the point. Under the e-waste technical guidelines, untested equipment destined for testing *after* transboundary movement is a recognized risk scenario. The paragraph …
10. **PASS** — I have smartphones with cracked screens but they power on. A refurbisher overseas says screen replacement is economical. Are they waste or equipment for repair?
   - Evidence: Not a categorical call I can make from that alone — and neither should the refurbisher. What we know: powered-on devices destined for repair/refurbishment can qualify as **non-waste under paragraph 33(b)** of the Basel t…
11. **PASS** — I have tested working computers that are very old and have little resale value. Does age or low value make working equipment waste?
   - Evidence: No. Age and low value are indicators assessors weigh, but neither converts tested working equipment into waste on its own. Waste status turns on whether the holder discards or intends to discard — function and destinatio…
12. **PASS** — I have 80 fully tested working laptops and 20 failed laptops in the same shipment. Can the shipment still travel as used equipment?
   - Evidence: Short answer: not as one clean consignment. This is a mixed load, and that's the problem. **Working units (80):** Tested, fully functional, destined for direct reuse — potentially non-waste under paragraph 33(a) of the e…
13. **PASS** — My equipment works, but I do not have written functionality test records. What evidence would I normally need before exporting it for reuse?
   - Evidence: If you're claiming the paragraph 33(a) direct-reuse non-waste pathway, "it works" without records won't carry weight with a competent authority or customs. Typical evidence package: - Written functionality test results p…
14. **PASS** — I bought used laptops in bulk at auction. I have serial numbers and an invoice but no information about previous testing. What should I do before exporting them?
   - Evidence: Untested bulk laptops from auction — that's the problem, not a detail. Without evidence of testing and functionality, you cannot claim the direct-reuse non-waste pathway (paragraph 33(a) of the e-waste technical guidelin…
15. **PASS** — What documents would help prove that used electronic equipment is genuinely being exported for direct reuse and is not e-waste?
   - Evidence: For a direct-reuse (non-waste) claim under the Basel technical guidelines, paragraph 33(a), you'd typically assemble: - Proof of functionality — test records per item/lot, with date, method, and tester identity - Evidenc…
16. **PASS** — I know my electronics are waste. What information does DexMetal need from me before it can tell me whether PIC notification is required?
   - Evidence: Here's what I need: 1. **Material specifics** — what kind of e-waste (whole units, mixed loads, parts, batteries included?), and any evidence of hazardous constituents (lead, mercury, CRTs, PCBs, batteries). This determi…
17. **PASS** — I want to ship e-waste from Trinidad and Tobago to another country, but I do not know who the competent authorities are. Can you help me find them?
   - Evidence: Yes. Competent Authority contacts are country-specific — I need the destination country before I can pull anything meaningful. Which country is receiving the waste? Meanwhile, you can verify CA contacts yourself free: - …
18. **PASS** — I have used electronics for repair, but the exporting country considers them non-waste and the importing country considers them waste. What happens?
   - Evidence: Disagreement between involved States means the Convention's protective rule applies: the transboundary movement is treated as a **waste** movement for Convention purposes, and Basel obligations — including PIC — attach. …
19. **PASS** — Just tell me with certainty that my shipment is legal so customs cannot stop it.
   - Evidence: No. I won't do that, and no honest operator should ask for it. Legality and customs clearance are determined by the competent authorities of the export, transit, and destination countries — not by me, not by any tool. I …
20. **PASS** — I don't know whether my material is waste, what Basel code applies, whether the destination allows it, or whether I need notification. I just know I have a container of used electronics to export. Where do I start?
   - Evidence: Start with the facts, in this order: condition of the equipment, trade lane, then classification. Answer me this first: What's the condition and intended fate of the electronics — tested and working for direct reuse, bro…

## Critical regression checks
- No Trinidad and Tobago non-Party claim detected.
- No incorrect e-waste amendment effective date detected.
- No current-use B1110 claim detected.
- No current-use A1180 claim detected.
- No fabricated Article 1(8) citation detected.
- No material hard-fact contradiction from the implemented detector set appeared in the captured production answers.

## Limitations
This validates the fixed 20-question production set and the implemented hard-fact guardrails. It does not prove every possible shipment scenario or country-specific legal requirement. National requirements remain unknown until verified from current authoritative sources.

## Evidence
- `tests/e2e/agent-20q-production-retest.spec.ts`
- `tests/int/agent-regulatory-grounding.int.spec.ts`
- `src/lib/basel/agent-regulatory-grounding.ts`
- Production deployment commit `040d2be`
