# DexMetal Shipment Route Check — Report Template V1

**Status:** LOCKED DEFAULT  
**Offer:** Shipment Route Check — USD 99  
**Role:** Customer-facing fulfillment/output template  
**Paired input:** Live Shipment Route Check intake at `/services/shipment-route-check`  
**Canonical commercial record:** `rdavid-cmyk/DexMetal-PKM/00_SYSTEM_CONTROL/commerce/SHIPMENT_ROUTE_CHECK_SERVICE_V1.md`

## Approved visual master

- Filename: `DexMetal_Shipment_Route_Check_Legal_Centered_Footer.pdf`
- SHA-256: `8d0010fc434e793ef0156c40066d092070e05d2f6708a2f4330a6ce1a17cd453`
- Pages: 1
- Page size: US Legal, 8.5 x 14 in (612 x 1008 pt)
- Orientation: Portrait

Any operational copy represented as the locked visual master must match this fingerprint.

## Input-to-output binding

The report MUST carry the same live intake reference created by `/api/shipment-route-check`, currently `SRC-YYYYMMDD-XXXXXX`.

The `DMX-RC-2026-0001 (sample)` reference visible in the approved sample artwork is illustrative only. It is not the production reference format and must be replaced by the actual intake reference when fulfilling a customer case.

### Shipment snapshot mapping

| Report field | Intake field |
| --- | --- |
| Material | `wasteType` |
| Condition | `condition` |
| Origin | `origin` |
| Destination | `destination` |
| Transit | `transit` |
| Intended operation | `operation` |
| Quantity | `quantity` when supplied |
| Basel code | verified classification; customer `knownCode` is input context only |

`originLocation`, `destinationFacility`, `targetDate`, and `notes` remain part of the reviewer context and must be considered where they affect the route finding.

## Locked layout

Keep the approved design and hierarchy unchanged except for case-specific content:

- DexMetal header and Shipment Route Check title
- Route determination headline
- Rectangular CONTROLLED stamp with subtle rubber-stamp treatment
- Shipment snapshot
- Route graphic
- What we checked
- Next actions
- Sources
- Legal disclaimer/footer

Use the Legal-page height for breathing room and readability. The footer is one visually centered block, lifted from the bottom edge. Do not convert the CONTROLLED mark to a circular seal.

## Fulfillment rule

This template is the OUTPUT of the $99 Route Check workflow. It is not generated directly from unverified engine output.

`INTAKE -> RICHARD FIT REVIEW -> PAYMENT -> FOUR ENGINE CHECKS -> CURRENT PRIMARY-SOURCE VERIFICATION -> HUMAN REVIEW -> LEGAL-SIZE REPORT DELIVERY`

The report may be issued only after the verification and acceptance gates in `docs/SHIPMENT_ROUTE_CHECK_FULFILLMENT_V1.md` pass.
