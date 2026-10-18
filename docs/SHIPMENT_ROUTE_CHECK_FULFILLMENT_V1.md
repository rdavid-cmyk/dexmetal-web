# DexMetal $99 Shipment Route Check — Fulfillment V1

**Status:** ACTIVE — REVIEW FIRST -> PAYMENT -> FULFILLMENT  
**Canonical commercial record:** `rdavid-cmyk/DexMetal-PKM/00_SYSTEM_CONTROL/commerce/SHIPMENT_ROUTE_CHECK_SERVICE_V1.md`  
**Locked output template:** `docs/SHIPMENT_ROUTE_CHECK_REPORT_TEMPLATE_V1.md`

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

1. Customer submits the live Shipment Route Check intake. The API creates an `SRC-YYYYMMDD-XXXXXX` reference and stores the record privately.
2. Richard reviews the submission for fit. No payment is collected at intake.
3. If accepted, send the current PayPal payment link from the canonical commercial record. If clarification is required or the request is not a fit, do not request payment.
4. Begin fulfillment only after USD 99 payment is confirmed.
5. Open the private Route Check submission using the SAME intake reference.
6. Run the submitted facts through the four existing corrected DexMetal tools — do not build or use a separate route engine:
   - Basel Classification QuickScan
   - Shipment Eligibility Checker
   - PIC Status Checker
   - E-Waste Export Route Risk Mapper
7. Capture the four tool outputs in working notes.
8. Perform the mandatory human/current-primary-source verification gate below.
9. Draft the customer report using `docs/SHIPMENT_ROUTE_CHECK_REPORT_TEMPLATE_V1.md`. The report reference must match the intake reference exactly.
10. Human reviewer signs off internally; place the verification date in the approved report footer.
11. Deliver the one-page US-Legal portrait report to the customer by email.

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

## Locked customer report

The approved customer-facing output is defined only by `docs/SHIPMENT_ROUTE_CHECK_REPORT_TEMPLATE_V1.md`. Do not substitute the older inline text skeleton or change the page size/layout without Richard approval.

## Acceptance gate

PASS only when:
- intake is complete;
- the report reference exactly matches the intake reference;
- payment has been confirmed for an accepted case;
- all four existing engines were run;
- current primary sources were checked for every material conclusion;
- unresolved points are explicitly labelled;
- the report uses the locked one-page US-Legal portrait template;
- human review is recorded and the verification date is present.

FAIL / HOLD when:
- transit is unknown and materially affects the route;
- waste/non-waste status is unresolved;
- a current national rule cannot be verified;
- payment is not confirmed for an accepted case; or
- a tool output conflicts with an authoritative current source.

In a conflict, the authoritative current source controls and the conflict is logged for engine remediation separately from customer fulfillment.
