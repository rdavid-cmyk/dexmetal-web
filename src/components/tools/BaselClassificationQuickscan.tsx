'use client'

import { useState, useRef } from 'react'
import classificationData from '@/data/basel-classification.json'
import Link from 'next/link'
import ShepherdTour, { TourStep } from './ShepherdTour'
import TooltipTerm from '@/components/ui/TooltipTerm'

type HazardClass = 'HAZARDOUS' | 'NON_HAZARDOUS' | 'ANNEX_II' | 'REQUIRES_TESTING'
type PICRequired = 'YES' | 'NO' | 'CONDITIONAL'

interface ClassificationResult {
  code: string
  codeName: string
  hazardClass: HazardClass
  annexType: string
  explanation: string
  picRequired: PICRequired
  picNote: string
  is2025Amendment: boolean
  warning?: string
}

const QUESTIONS = [
  {
    id: 'type',
    text: 'What are you shipping?',
    options: [
      { value: 'ULAB', label: 'ULAB / Lead-Acid Batteries', icon: '🔋' },
      { value: 'Lithium', label: 'Lithium Batteries', icon: '⚡' },
      { value: 'MixedEWaste', label: 'Mixed E-Waste', icon: '📦' },
      { value: 'CRT', label: 'CRT Monitors / TVs', icon: '📺' },
      { value: 'PCBs', label: 'Circuit Boards / PCBs', icon: '🔌' },
      { value: 'Plastic', label: 'Plastic from E-Waste', icon: '♻️' },
      { value: 'Other', label: 'Other', icon: '❓' },
    ],
  },
  {
    id: 'condition',
    text: 'What is its condition?',
    options: [
      { value: 'Functional', label: 'Functional / Tested Working', icon: '✅' },
      { value: 'Damaged', label: 'Damaged / Non-functional', icon: '⚠️' },
      { value: 'Mixed', label: 'Mixed / Unknown', icon: '🔀' },
      { value: 'Scrap', label: 'Scrap / End-of-Life', icon: '🗑️' },
    ],
  },
  {
    id: 'use',
    text: 'Intended destination use?',
    options: [
      { value: 'Reuse', label: 'Reuse / Resale', icon: '🔄' },
      { value: 'Repair', label: 'Repair / Refurbishment', icon: '🔧' },
      { value: 'Recycling', label: 'Recycling / Recovery', icon: '♻️' },
      { value: 'Disposal', label: 'Disposal', icon: '🗑️' },
    ],
  },
]

/**
 * Classification logic updated for OEWG-15 Item 1 grounded decision engine.
 * Source: UNEP/CHW.16/INF/10/Rev.1 (Technical Guidelines)
 *
 * 2025 AMENDMENTS (effective 1 January 2025):
 * - B1110 DELETED — do not return as valid e-waste code
 * - A1180 replaced by A1181
 * - Y49 added for non-hazardous e-waste (Annex II, PIC required)
 *
 * CRITICAL CODE CORRECTIONS:
 * - Y31 is an Annex I constituent category, NOT a waste list entry for ULAB
 * - A1160 is the correct code for waste lead-acid batteries (ULAB)
 * - B1120 is spent catalysts, NOT batteries
 * - B1090 is non-hazardous batteries (excluding Pb, Cd, Hg)
 */
function classify(type: string, condition: string, use: string): ClassificationResult {
  // ULAB / Lead-Acid — ALWAYS A1160 (hazardous)
  // CORRECTED: Y31 is Annex I constituent category, not waste list entry
  // CORRECTED: B1120 is spent catalysts, not batteries
  if (type === 'ULAB') {
    return {
      code: 'A1160',
      codeName: 'Waste lead-acid batteries — Annex VIII (A1160)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation:
        'Waste lead-acid batteries (ULAB), whole or crushed, are classified A1160 under Annex VIII (hazardous). Full PIC and Basel notification required regardless of condition. Note: Y31 is an Annex I constituent category (lead compounds), not a waste list entry.',
      picRequired: 'YES',
      picNote:
        'PIC required — A1160 is Annex VIII (hazardous). Basel Ban Amendment applies for OECD → non-OECD routes.',
      is2025Amendment: false,
      warning:
        'All ULAB are hazardous waste. Y31 is NOT a Basel list entry for batteries — it is an Annex I constituent category. The correct code is A1160.',
    }
  }

  // Lithium Batteries
  // CORRECTED: B1090 for non-hazardous (not B1120 which is spent catalysts)
  if (type === 'Lithium') {
    if (condition === 'Functional' && use === 'Reuse') {
      return {
        code: 'B1090',
        codeName: 'Non-hazardous waste batteries — Annex IX (B1090)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation:
          'Functional lithium batteries conforming to specification and not containing lead, cadmium, or mercury may qualify as B1090. Ensure UN38.3 testing compliance for transport and document functionality rigorously.',
        picRequired: 'CONDITIONAL',
        picNote:
          'PIC may not be required for B1090 between OECD countries. UN3480/UN3481 dangerous goods transport rules apply independently.',
        is2025Amendment: false,
        warning:
          'UN3480/UN3481 dangerous goods transport rules apply regardless of Basel classification. Damaged or end-of-life lithium batteries are A1170.',
      }
    }
    return {
      code: 'A1170',
      codeName: 'Unsorted/hazardous waste batteries — Annex VIII (A1170)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation:
        'Damaged, non-functional, or end-of-life lithium batteries are classified A1170 — hazardous under Annex VIII. Full PIC and Basel notification required.',
      picRequired: 'YES',
      picNote:
        'PIC required — A1170 is Annex VIII (hazardous). UN3480/UN3481 dangerous goods rules apply in parallel.',
      is2025Amendment: false,
    }
  }

  // Mixed E-Waste
  // CORRECTED: B1110 DELETED effective 1 January 2025
  // Non-hazardous e-waste is now Y49 (Annex II, requires PIC)
  if (type === 'MixedEWaste') {
    // Even functional used EEE for reuse requires waste characterization evidence
    // Per para 33(a), all conditions must be met to claim non-waste status
    if (condition === 'Functional' && use === 'Reuse') {
      return {
        code: 'EVIDENCE_REQUIRED',
        codeName: 'Waste status determination required',
        hazardClass: 'REQUIRES_TESTING',
        annexType: 'Pending',
        explanation:
          'Per UNEP/CHW.16/INF/10/Rev.1 para 33(a), functional used EEE for direct reuse may be non-waste ONLY if ALL conditions are met: (i) invoice/contract, (ii) functionality test records for EVERY item, (iii) no-country-considers-waste declaration, (iv) individual protection during transport. Without this evidence, treat conservatively as waste.',
        picRequired: 'CONDITIONAL',
        picNote:
          'If classified as waste: A1181 (hazardous, PIC required) or Y49 (non-hazardous, PIC required). B1110 was DELETED effective 1 January 2025.',
        is2025Amendment: true,
        warning:
          'B1110 was DELETED effective 1 January 2025. Non-hazardous e-waste now falls under Y49 (Annex II) and requires PIC. Provide para 33(a) evidence or classify as A1181/Y49.',
      }
    }
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation:
        'Mixed, damaged, or scrap e-waste is classified A1181 under Annex VIII (updated from A1180 in 2025). Full Basel notification and PIC required. Per para 51, e-waste should be presumed hazardous unless proven non-hazardous.',
      picRequired: 'YES',
      picNote:
        'PIC required — A1181 is Annex VIII (hazardous). Basel Ban Amendment applies for OECD → non-OECD routes.',
      is2025Amendment: true,
    }
  }

  // CRT — always hazardous per para 51(a)
  if (type === 'CRT') {
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation:
        'CRT monitors and TVs contain lead glass and are ALWAYS classified as hazardous waste (A1181) per UNEP/CHW.16/INF/10/Rev.1 para 51(a). No condition or intended use changes this classification.',
      picRequired: 'YES',
      picNote:
        'PIC required — CRTs are always A1181 (hazardous). Basel Ban Amendment applies for OECD → non-OECD routes.',
      is2025Amendment: true,
      warning:
        'CRTs are ALWAYS hazardous per para 51(a). Lead glass from CRTs falls under A1181 and A2010. No non-hazardous classification is possible.',
    }
  }

  // PCBs / Circuit Boards
  // CORRECTED: B1110 DELETED effective 1 January 2025
  if (type === 'PCBs') {
    // PCBs with lead solder, BFRs are hazardous per para 51(d)
    if (condition === 'Functional' && (use === 'Reuse' || use === 'Repair')) {
      return {
        code: 'EVIDENCE_REQUIRED',
        codeName: 'Hazard characterization required',
        hazardClass: 'REQUIRES_TESTING',
        annexType: 'Pending',
        explanation:
          'Per para 51(d), PCBs commonly contain lead solder, brominated flame retardants, and beryllium compounds rendering them hazardous. Functional PCBs for reuse require hazard characterization. If proven non-hazardous and meeting para 33(a) conditions, may qualify as Y49 (not B1110, which was deleted).',
        picRequired: 'CONDITIONAL',
        picNote:
          'B1110 was DELETED effective 1 January 2025. Most PCBs classify as A1181 due to lead/BFR content. Y49 requires proof of non-hazardous status.',
        is2025Amendment: true,
        warning:
          'B1110 was DELETED effective 1 January 2025. PCBs are presumed hazardous (A1181) unless laboratory characterization proves otherwise. Lead solder and BFRs trigger A1181.',
      }
    }
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation:
        'Scrap, damaged, or mixed circuit boards are classified A1181 (hazardous) per para 51(d). Lead solder, brominated flame retardants, and beryllium compounds are present in most PCB scrap.',
      picRequired: 'YES',
      picNote:
        'PIC required — A1181 is hazardous. Basel Ban Amendment applies for OECD → non-OECD routes.',
      is2025Amendment: true,
    }
  }

  // Plastic from E-Waste
  if (type === 'Plastic') {
    if (condition === 'Functional' && (use === 'Reuse' || use === 'Recycling')) {
      return {
        code: 'B3011',
        codeName: 'Clean plastic waste — Annex IX (B3011)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation:
          'Clean, sorted, single-polymer plastic may qualify as B3011 under the 2021 Plastic Waste Amendments. Laboratory testing for PFAS, PBBs, and PBDEs is mandatory before claiming this classification.',
        picRequired: 'CONDITIONAL',
        picNote:
          'PIC required for non-OECD destinations under 2021 Plastic Waste Amendments, even for B3011.',
        is2025Amendment: true,
        warning:
          'Testing required before classification. E-waste plastic commonly contains brominated flame retardants — if detected, classification becomes A3210 (hazardous).',
      }
    }
    if (condition === 'Mixed' || condition === 'Scrap') {
      return {
        code: 'A3210',
        codeName: 'Plastic waste with POPs/PFAS — Annex VIII (A3210)',
        hazardClass: 'HAZARDOUS',
        annexType: 'Annex VIII',
        explanation:
          'Mixed or contaminated plastic from e-waste is likely to contain brominated flame retardants (PBDEs, PBBs) or PFAS compounds, triggering A3210 (hazardous). Laboratory testing required to confirm.',
        picRequired: 'YES',
        picNote: 'PIC required — A3210 is hazardous. Confirm chemical composition before shipment.',
        is2025Amendment: false,
        warning:
          'Laboratory analysis for brominated compounds (PBB, PBDE) and PFAS is mandatory. Do not ship until testing is complete.',
      }
    }
    return {
      code: 'REQUIRES_TESTING',
      codeName: 'Classification requires laboratory testing',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Unknown',
      explanation:
        'E-waste plastic cannot be classified without laboratory testing for brominated flame retardants, PFAS, and heavy metals. Do not ship until a waste characterization report is obtained.',
      picRequired: 'CONDITIONAL',
      picNote:
        'PIC requirement cannot be determined until classification is confirmed. Hold shipment pending testing.',
      is2025Amendment: false,
      warning:
        'Shipment must be held until laboratory analysis confirms the presence or absence of hazardous constituents.',
    }
  }

  // Other e-waste — CORRECTED: Y10 is NOT an e-waste code
  // Per 2025 amendments, e-waste is A1181 (hazardous) or Y49 (non-hazardous)
  return {
    code: 'CHARACTERIZATION_REQUIRED',
    codeName: 'Waste characterization required',
    hazardClass: 'REQUIRES_TESTING',
    annexType: 'Pending',
    explanation:
      'Per UNEP/CHW.16/INF/10/Rev.1 para 51, e-waste should be presumed hazardous (A1181) unless proven non-hazardous (Y49). A waste characterization report is required to determine hazard status. Y10 is NOT an e-waste classification code.',
    picRequired: 'YES',
    picNote:
      'E-waste requires either A1181 (hazardous, Annex VIII) or Y49 (non-hazardous, Annex II). Both require PIC. Obtain waste characterization.',
    is2025Amendment: true,
    warning:
      'Do not use Y10 for e-waste. Per 2025 amendments: hazardous e-waste = A1181; non-hazardous e-waste = Y49. Both require PIC.',
  }
}

const HAZARD_CONFIG: Record<
  HazardClass,
  { label: string; bg: string; color: string; border: string }
> = {
  HAZARDOUS: { label: 'HAZARDOUS', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00' },
  NON_HAZARDOUS: { label: 'NON-HAZARDOUS', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75' },
  ANNEX_II: { label: 'ANNEX II', bg: '#2a2200', color: '#f5c518', border: '#f5c518' },
  REQUIRES_TESTING: {
    label: 'TESTING REQUIRED',
    bg: '#2a2a28',
    color: '#a0a09a',
    border: '#3a3a38',
  },
}

const PIC_CONFIG: Record<PICRequired, { label: string; color: string }> = {
  YES: { label: 'PIC: REQUIRED', color: '#FF5C00' },
  NO: { label: 'PIC: NOT REQUIRED', color: '#1D9E75' },
  CONDITIONAL: { label: 'PIC: CONDITIONAL', color: '#f5c518' },
}

const CLASSIFICATION_TOUR_STEPS: TourStep[] = [
  {
    text: 'Answer three quick questions to get your Basel waste code. Start by selecting what you are shipping.',
    attachTo: { element: '#tour-classification-questions', on: 'top' },
  },
  {
    text: 'Select the physical state or condition of the material — Functional, Damaged, Mixed, or Scrap.',
    attachTo: { element: '#tour-classification-questions', on: 'top' },
  },
  {
    text: 'Choose the intended use at destination. The tool calculates your Basel classification and PIC requirements automatically.',
    attachTo: { element: '#tour-classification-questions', on: 'top' },
  },
  {
    text: 'Load Example pre-fills a ULAB Trinidad → Germany recycling scenario so you can see a sample classification instantly.',
    attachTo: { element: '#tour-load-example', on: 'bottom' },
  },
]

export default function BaselClassificationQuickscan() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateSubmitting, setGateSubmitting] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  function handleAnswer(questionId: string, value: string) {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 180)
    } else {
      const r = classify(newAnswers.type, newAnswers.condition, newAnswers.use)
      setResult(r)
      setGateUnlocked(false)
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        200,
      )
    }
  }

  function handleReset() {
    setStep(0)
    setAnswers({})
    setResult(null)
    setGateUnlocked(false)
  }

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gateEmail) return
    setGateSubmitting(true)
    console.log('[DexMetal] Classification report requested:', {
      name: gateName,
      email: gateEmail,
      answers,
    })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({
      name: gateName,
      email: gateEmail,
      answers,
      tool: 'basel-classification-quickscan',
      ts: new Date().toISOString(),
    })
    fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: gateEmail,
        name: gateName || undefined,
        tool: 'basel-classification-quickscan',
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error)
    localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    fetch('/api/resend-tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: gateEmail, tag: 'tool_classification_quickscan' }),
    }).catch(console.error)
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
  }

  const currentQ = QUESTIONS[step]
  const gatedData = result
    ? classificationData.codeDescriptions[
        result.code as keyof typeof classificationData.codeDescriptions
      ]
    : null

  return (
    <div className="font-body" style={{ backgroundColor: '#1C1B18', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#1D9E75',
                  backgroundColor: '#0d3326',
                  padding: '3px 10px',
                  borderRadius: '20px',
                }}
              >
                Free Tool
              </span>
            </div>
            <ShepherdTour steps={CLASSIFICATION_TOUR_STEPS} tourKey="classification-quickscan" />
          </div>
          <h1
            className="font-display font-bold"
            style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}
          >
            Basel Classification QuickScan
          </h1>
          <p
            className="font-body"
            style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}
          >
            Answer three questions to identify the correct Basel waste code for your e-waste or
            battery shipment.
          </p>
          <div style={{ marginTop: '12px' }}>
            <button
              id="tour-load-example"
              onClick={() => {
                setAnswers({ type: 'ULAB', condition: 'Scrap', use: 'Recycling' })
                setStep(3)
                setGateUnlocked(false)
              }}
              style={{
                padding: '6px 14px',
                backgroundColor: 'transparent',
                color: '#1D9E75',
                border: '1px solid #1D9E75',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Load example: ULAB T&T → Germany (recycling) →
            </button>
          </div>
        </div>

        {/* 2025 Amendment callout */}
        <div
          style={{
            borderLeft: '3px solid #1D9E75',
            backgroundColor: '#111310',
            borderRadius: '0 8px 8px 0',
            padding: '14px 18px',
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              color: '#1D9E75',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            2025 Basel Update
          </p>
          <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
            <strong style={{ color: '#ffffff' }}>
              Annex VIII entry A1180 has been replaced by A1181
            </strong>
            , covering all hazardous e-waste.{' '}
            <strong style={{ color: '#ffffff' }}>
              New <TooltipTerm term="Annex II">Annex II</TooltipTerm> entry Y49
            </strong>{' '}
            now subjects non-hazardous e-waste to <TooltipTerm term="PIC">PIC</TooltipTerm> for the
            first time. Update all legacy A1180 references in permits and movement documents
            immediately.
          </p>
        </div>

        {/* Wizard */}
        {!result && (
          <div
            id="tour-classification-questions"
            style={{
              backgroundColor: '#2c2c2a',
              borderRadius: '12px',
              padding: '28px',
              border: '1px solid #3a3a38',
            }}
          >
            {/* Progress */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}
            >
              {QUESTIONS.map((q, i) => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: i < step ? '#1D9E75' : i === step ? '#0d3326' : '#1C1B18',
                      color: i < step ? '#ffffff' : i === step ? '#1D9E75' : '#3a3a38',
                      border: `2px solid ${i <= step ? '#1D9E75' : '#3a3a38'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < QUESTIONS.length - 1 && (
                    <div
                      style={{
                        width: '32px',
                        height: '2px',
                        backgroundColor: i < step ? '#1D9E75' : '#3a3a38',
                        transition: 'background-color 0.2s',
                      }}
                    />
                  )}
                </div>
              ))}
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#a0a09a' }}>
                Question {step + 1} of {QUESTIONS.length}
              </span>
            </div>

            {/* Question */}
            <h2
              className="font-display font-bold"
              style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '20px' }}
            >
              {currentQ.text}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswer(currentQ.id, opt.value)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: isSelected ? '#0d3326' : '#1C1B18',
                      border: `1px solid ${isSelected ? '#1D9E75' : '#3a3a38'}`,
                      borderRadius: '8px',
                      color: isSelected ? '#1D9E75' : '#e0e0da',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Back button */}
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  marginTop: '16px',
                  padding: '8px 0',
                  backgroundColor: 'transparent',
                  color: '#a0a09a',
                  border: 'none',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Classification card */}
            <div
              style={{
                backgroundColor: '#2c2c2a',
                borderRadius: '12px',
                padding: '24px 28px',
                border: `1px solid ${HAZARD_CONFIG[result.hazardClass].border}`,
              }}
            >
              {/* Code + badges */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    className="font-display font-bold"
                    style={{ fontSize: '2rem', color: '#ffffff', letterSpacing: '0.02em' }}
                  >
                    {result.code}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: HAZARD_CONFIG[result.hazardClass].bg,
                        color: HAZARD_CONFIG[result.hazardClass].color,
                        border: `1px solid ${HAZARD_CONFIG[result.hazardClass].border}`,
                      }}
                    >
                      {HAZARD_CONFIG[result.hazardClass].label}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: '#1C1B18',
                        color: '#a0a09a',
                        border: '1px solid #3a3a38',
                      }}
                    >
                      {result.annexType}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#a0a09a', fontSize: '13px' }}>{result.codeName}</p>
              </div>

              <p
                style={{
                  color: '#e0e0da',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  marginBottom: '12px',
                }}
              >
                {result.explanation}
              </p>

              {/* PIC pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: PIC_CONFIG[result.picRequired].color,
                  }}
                >
                  {PIC_CONFIG[result.picRequired].label}
                </span>
                <span style={{ color: '#a0a09a', fontSize: '12px' }}>→</span>
                <Link
                  href="/tools/pic-status-checker"
                  style={{ color: '#1D9E75', fontSize: '12px' }}
                >
                  Check PIC requirements →
                </Link>
              </div>

              {/* Warning */}
              {result.warning && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    backgroundColor: '#3a1200',
                    borderRadius: '6px',
                    borderLeft: '3px solid #FF5C00',
                  }}
                >
                  <p
                    style={{
                      color: '#FF5C00',
                      fontSize: '12px',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    Important
                  </p>
                  <p style={{ color: '#e0a080', fontSize: '12px', lineHeight: 1.5 }}>
                    {result.warning}
                  </p>
                </div>
              )}

              {/* 2025 badge */}
              {result.is2025Amendment && (
                <div
                  style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 10px',
                    backgroundColor: '#0d3326',
                    borderRadius: '20px',
                    border: '1px solid #1D9E75',
                  }}
                >
                  <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700 }}>
                    2025 AMENDMENT APPLIES
                  </span>
                </div>
              )}
            </div>

            {/* View Full Report CTA */}
            {!gateUnlocked && (
              <div
                style={{
                  backgroundColor: '#2c2c2a',
                  borderRadius: '12px',
                  padding: '20px 28px',
                  border: '1px solid #3a3a38',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p
                    style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Full classification report available
                  </p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                    Legal rationale · Common misclassifications · Required documents checklist
                  </p>
                </div>
                <button
                  onClick={() => setShowGate(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF5C00',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Full Report →
                </button>
              </div>
            )}

            {/* Gated content */}
            {gateUnlocked && gatedData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Rationale */}
                <div
                  style={{
                    backgroundColor: '#2c2c2a',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    border: '1px solid #3a3a38',
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    Classification Rationale
                  </h3>
                  <p
                    style={{
                      color: '#e0e0da',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      marginBottom: '8px',
                    }}
                  >
                    {result.picNote}
                  </p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                    Waste type: <span style={{ color: '#e0e0da' }}>{result.codeName}</span>
                  </p>
                </div>

                {/* 2025 Amendment note */}
                {gatedData.amendmentNote && (
                  <div
                    style={{
                      borderLeft: '3px solid #1D9E75',
                      backgroundColor: '#111310',
                      borderRadius: '0 8px 8px 0',
                      padding: '14px 18px',
                    }}
                  >
                    <p
                      style={{
                        color: '#1D9E75',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      2025 Amendment Note
                    </p>
                    <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
                      {gatedData.amendmentNote}
                    </p>
                  </div>
                )}

                {/* Common misclassifications */}
                <div
                  style={{
                    backgroundColor: '#2c2c2a',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    border: '1px solid #3a3a38',
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      marginBottom: '16px',
                    }}
                  >
                    Common Misclassification Warnings
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {gatedData.misclassifications.map((m, i) => (
                      <div
                        key={i}
                        style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                      >
                        <span
                          style={{
                            color: '#FF5C00',
                            fontSize: '13px',
                            flexShrink: 0,
                            marginTop: '1px',
                          }}
                        >
                          ⚠
                        </span>
                        <span style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.5 }}>
                          {m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required documents */}
                <div
                  style={{
                    backgroundColor: '#2c2c2a',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    border: '1px solid #3a3a38',
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      marginBottom: '16px',
                    }}
                  >
                    Required Documents Checklist
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {gatedData.documents.map((doc, i) => (
                      <div
                        key={i}
                        style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                      >
                        <span style={{ color: '#1D9E75', fontSize: '13px', flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#e0e0da', fontSize: '13px', lineHeight: 1.5 }}>
                          {doc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Cross-tool cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '4px',
              }}
            >
              <Link
                href="/tools/shipment-eligibility-checker"
                style={{
                  display: 'block',
                  padding: '16px 18px',
                  backgroundColor: '#2c2c2a',
                  borderRadius: '10px',
                  borderLeft: '3px solid #1D9E75',
                  textDecoration: 'none',
                  transition: 'filter 0.15s',
                }}
              >
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Check Shipment Eligibility
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px', marginBottom: '8px' }}>
                  Is this shipment permitted under Basel Convention?
                </p>
                <span
                  style={{
                    color: '#1D9E75',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Open tool →
                </span>
              </Link>
              <Link
                href="/tools/pic-status-checker"
                style={{
                  display: 'block',
                  padding: '16px 18px',
                  backgroundColor: '#2c2c2a',
                  borderRadius: '10px',
                  borderLeft: '3px solid #1D9E75',
                  textDecoration: 'none',
                  transition: 'filter 0.15s',
                }}
              >
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Check <TooltipTerm term="PIC">PIC</TooltipTerm> Requirements
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px', marginBottom: '8px' }}>
                  What type of consent is needed for this route?
                </p>
                <span
                  style={{
                    color: '#1D9E75',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Open tool →
                </span>
              </Link>
            </div>

            {/* Consulting CTA */}
            <div
              style={{
                backgroundColor: '#1a1208',
                borderRadius: '12px',
                padding: '20px 24px',
                border: '1px solid #FF5C00',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Need expert review of these results?
                </p>
                <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.5 }}>
                  This shipment may require Basel notification — book a done-for-you assessment.
                </p>
              </div>
              <Link
                href="/contact"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF5C00',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Book an assessment →
              </Link>
            </div>

            {/* Restart */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#a0a09a',
                  border: '1px solid #3a3a38',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ← Start over
              </button>
            </div>
          </div>
        )}

        {/* Email gate modal */}
        {showGate && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowGate(false)
            }}
          >
            <div
              style={{
                backgroundColor: '#2c2c2a',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '440px',
                border: '1px solid #3a3a38',
              }}
            >
              <h2
                className="font-display font-bold"
                style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}
              >
                Get the Full Classification Report
              </h2>
              <p
                style={{
                  color: '#a0a09a',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                Enter your email to unlock the classification rationale, misclassification warnings,
                and required documents checklist. Free — no spam.
              </p>
              <form
                onSubmit={handleGateSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={gateName}
                  onChange={(e) => setGateName(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#1C1B18',
                    border: '1px solid #3a3a38',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#1C1B18',
                    border: '1px solid #3a3a38',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={gateSubmitting}
                  style={{
                    padding: '12px',
                    backgroundColor: '#FF5C00',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: gateSubmitting ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {gateSubmitting ? 'Loading...' : 'Send me the report'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGate(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    color: '#a0a09a',
                    border: 'none',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #3a3a38' }}>
          <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.6 }}>
            This tool provides guidance based on Basel Convention treaty text and is not legal
            advice. Classification may vary by jurisdiction.{' '}
            <Link href="/tools/shipment-eligibility-checker" style={{ color: '#1D9E75' }}>
              Check shipment eligibility →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
