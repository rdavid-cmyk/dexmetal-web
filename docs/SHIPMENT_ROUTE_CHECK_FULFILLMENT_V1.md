# DexMetal $99 Shipment Route Check — Fulfillment V1

Status: minimum manual fulfillment loop. Payment intentionally excluded until one route check completes cleanly end-to-end.

## Exact customer intake fields

Required:
1. Customer name
2. Email
3. Waste / material category
4. Condition
5. Origin country
6. Destination country
7. Dispatch location (city / region where the shipment starts)
8. Receiving facility / location (facility name + city / region, or "Not selected")
9. Intended operation
10. Planned transit countries / route — customer must state countries, "Unknown", or "None"

Optional:
- Company / organisation
- Approximate quantity / weight
- Target shipment date
- Known Basel code
- Route notes / receiving-facility context

No document uploads in V1. Do not collect notification files, contracts, IDs, permits, or other sensitive attachments through this form. Each submission is retained in the private server-side Route Check store before alerts are attempted.
## Fulfillment sequence

1. Open the private Route Check submission record using the reference SRC-YYYYMMDD-XXXXXX. Richard receives an immediate Telegram alert.
2. Run the submitted facts through the four existing corrected DexMetal tools — do not build or use a separate route engine:
   - Basel Classification QuickScan
   - Shipment Eligibility Checker
   - PIC Status Checker
   - E-Waste Export Route Risk Mapper
3. Capture the four tool outputs in working notes.
4. Perform the mandatory human/current-primary-source verification gate below.
5. Draft the one-page Route Check report using the template below.
6. Human reviewer signs off with reviewer name and verification date.
7. Deliver the one-page report to the customer by email.

## Mandatory human / current-primary-source verification gate

Do not deliver until each material conclusion has been checked against the current source that controls it.

Minimum checks:
- Basel Party / non-Party status and relevant Convention provisions: official Basel Convention sources.
- Current waste entry / amendment status (including A1181, Y49, A1160 as applicable): official Basel Convention decisions, annexes or technical material.
- Ban Amendment question: official Basel status plus the export State's current national law / authority guidance.
- Export and import controls: relevant national competent authority or government source.
- Transit controls: relevant transit authority / government source for every known transit State.
- OECD route, when relevant: current OECD Decision plus current national implementation.
- Competent authority contact: current official Basel directory and/or national authority page.

For every source record: title, issuing authority, URL, date accessed, and the specific conclusion it supports. If a material point cannot be verified, mark it **UNRESOLVED — authority confirmation required**.
## One-page customer report template

**DexMetal Shipment Route Check**  
Reference: [SRC-…]  
Verification date: [date]  
Reviewer: [name]

### 1. Shipment snapshot
[Waste/material] · [condition] · [origin] → [destination] · [intended operation]  
Transit: [countries / unknown / none] · Quantity: [if supplied] · Target date: [if supplied]

### 2. Route finding
- Likely Basel classification: [code / classification + short basis]
- Shipment eligibility/control status: [finding]
- PIC pathway: [finding]
- Transit / Ban / non-Party flags: [finding]

### 3. What must happen next
1. [highest-priority action]
2. [second action]
3. [third action]

### 4. Current primary sources checked
- [Authority — source title — URL — accessed date]
- [Authority — source title — URL — accessed date]
- [Authority — source title — URL — accessed date]

**Limit:** This is a route-screening report, not legal advice, a permit, or a guarantee of approval. Applicable competent authorities and national law determine the final requirements.

## Acceptance gate

PASS only when: intake is complete; all four existing engines were run; current primary sources were checked for every material conclusion; unresolved points are explicitly labelled; one-page report fits the template; human reviewer name and verification date are present.

FAIL / HOLD when: transit is unknown and materially affects the route; waste/non-waste status is unresolved; a current national rule cannot be verified; or a tool output conflicts with an authoritative current source. In a conflict, the authoritative current source controls and the conflict is logged for engine remediation separately from customer fulfillment.
