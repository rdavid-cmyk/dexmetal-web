'use client'

import { useState, useRef } from 'react'
import classificationData from '@/data/basel-classification.json'
import Link from 'next/link'

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

function classify(type: string, condition: string, use: string): ClassificationResult {
  // ULAB / Lead-Acid
  if (type === 'ULAB') {
    if (condition === 'Functional' && (use === 'Reuse' || use === 'Repair')) {
      return {
        code: 'B1120',
        codeName: 'Spent battery packs — Annex IX (B1120)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation: 'Functional ULAB intended for reuse may qualify as B1120 (non-hazardous). However, most regulators default to Y31/Annex II for all ULAB — document functional testing rigorously.',
        picRequired: 'CONDITIONAL',
        picNote: 'PIC may still be required depending on destination country regulations. Many countries treat all ULAB as Y31 regardless of condition.',
        is2025Amendment: false,
        warning: 'Precautionary note: Many competent authorities classify all ULAB as Y31/Annex II regardless of condition. Confirm with your destination CA before relying on B1120.',
      }
    }
    return {
      code: 'Y31',
      codeName: 'Lead-acid batteries — Annex II (Y31)',
      hazardClass: 'ANNEX_II',
      annexType: 'Annex II',
      explanation: 'Spent or damaged lead-acid batteries are classified as Y31 under Annex II. Prior Informed Consent is required from the destination Competent Authority.',
      picRequired: 'YES',
      picNote: 'PIC required — Y31 is an Annex II waste. Destination CA written consent required before shipment.',
      is2025Amendment: false,
    }
  }

  // Lithium Batteries
  if (type === 'Lithium') {
    if (condition === 'Functional' && use === 'Reuse') {
      return {
        code: 'B1120',
        codeName: 'Spent battery packs — Annex IX (B1120)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation: 'Functional lithium battery packs for reuse may qualify as B1120. Ensure UN38.3 testing compliance for transport and document functionality.',
        picRequired: 'CONDITIONAL',
        picNote: 'PIC may not be required for B1120, but some destinations require notification. UN transport rules (Class 9) apply independently.',
        is2025Amendment: false,
        warning: 'UN3480/UN3481 dangerous goods transport rules apply to lithium batteries regardless of Basel classification.',
      }
    }
    return {
      code: 'A1170',
      codeName: 'Waste lithium batteries — Annex VIII (A1170)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'Damaged, non-functional, or end-of-life lithium batteries are classified A1170 — hazardous under Annex VIII. Full PIC and Basel notification required.',
      picRequired: 'YES',
      picNote: 'PIC required — A1170 is Annex VIII (hazardous). UN3480/UN3481 dangerous goods rules apply in parallel.',
      is2025Amendment: false,
    }
  }

  // Mixed E-Waste
  if (type === 'MixedEWaste') {
    if (condition === 'Functional' && use === 'Reuse') {
      return {
        code: 'B1110',
        codeName: 'Electrical/electronic assemblies — Annex IX (B1110)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation: 'Tested-working electronic assemblies intended for reuse may qualify as B1110 (non-hazardous). Every unit must be documented as functional — any damaged item in the consignment triggers A1181 for the whole lot.',
        picRequired: 'CONDITIONAL',
        picNote: 'PIC may not be required for B1110 between OECD countries, but documentation of functionality is essential. Non-OECD destinations require PIC.',
        is2025Amendment: false,
        warning: 'Critical: Mixed lots or lots with ANY untested/damaged units must be classified A1181, not B1110. Document each unit individually.',
      }
    }
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'Mixed, damaged, or scrap e-waste is classified A1181 under Annex VIII (updated from A1180 in 2025). Full Basel notification and PIC required.',
      picRequired: 'YES',
      picNote: 'PIC required — A1181 is Annex VIII (hazardous). Note: Basel Ban Amendment may prohibit this shipment from OECD to non-OECD countries.',
      is2025Amendment: true,
    }
  }

  // CRT
  if (type === 'CRT') {
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'CRT monitors and TVs contain lead glass and are always classified as hazardous waste (A1181). No condition or intended use changes this — CRTs are excluded from non-hazardous classifications.',
      picRequired: 'YES',
      picNote: 'PIC required — CRTs are always A1181 (hazardous). Basel Ban Amendment likely prohibits OECD → non-OECD export.',
      is2025Amendment: true,
      warning: 'CRTs are ALWAYS hazardous. There is no condition or use that permits non-hazardous classification for CRT glass.',
    }
  }

  // PCBs / Circuit Boards
  if (type === 'PCBs') {
    if (condition === 'Functional' && (use === 'Reuse' || use === 'Repair')) {
      return {
        code: 'B1110',
        codeName: 'Electrical/electronic assemblies — Annex IX (B1110)',
        hazardClass: 'NON_HAZARDOUS',
        annexType: 'Annex IX',
        explanation: 'Tested-working circuit board assemblies for reuse/repair may qualify as B1110. Comprehensive testing documentation is mandatory.',
        picRequired: 'CONDITIONAL',
        picNote: 'PIC may not be required between OECD countries for B1110. Non-OECD destinations require explicit notification.',
        is2025Amendment: false,
        warning: 'B1110 requires every board to be tested. PCBs with lead solder, BFRs, or beryllium default to A1181 if damaged or mixed.',
      }
    }
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'Scrap, damaged, or mixed circuit boards are classified A1181 (hazardous). Lead solder, brominated flame retardants, and beryllium compounds are present in most PCB scrap.',
      picRequired: 'YES',
      picNote: 'PIC required — A1181 is hazardous. Check shipment eligibility — Basel Ban may apply for OECD → non-OECD routes.',
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
        explanation: 'Clean, sorted, single-polymer plastic may qualify as B3011 under the 2021 Plastic Waste Amendments. Laboratory testing for PFAS, PBBs, and PBDEs is mandatory before claiming this classification.',
        picRequired: 'CONDITIONAL',
        picNote: 'PIC required for non-OECD destinations under 2021 Plastic Waste Amendments, even for B3011.',
        is2025Amendment: true,
        warning: 'Testing required before classification. E-waste plastic commonly contains brominated flame retardants — if detected, classification becomes A3210 (hazardous).',
      }
    }
    if (condition === 'Mixed' || condition === 'Scrap') {
      return {
        code: 'A3210',
        codeName: 'Plastic waste with POPs/PFAS — Annex VIII (A3210)',
        hazardClass: 'HAZARDOUS',
        annexType: 'Annex VIII',
        explanation: 'Mixed or contaminated plastic from e-waste is likely to contain brominated flame retardants (PBDEs, PBBs) or PFAS compounds, triggering A3210 (hazardous). Laboratory testing required to confirm.',
        picRequired: 'YES',
        picNote: 'PIC required — A3210 is hazardous. Confirm chemical composition before shipment.',
        is2025Amendment: false,
        warning: 'Laboratory analysis for brominated compounds (PBB, PBDE) and PFAS is mandatory. Do not ship until testing is complete.',
      }
    }
    return {
      code: 'REQUIRES_TESTING',
      codeName: 'Classification requires laboratory testing',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Unknown',
      explanation: 'E-waste plastic cannot be classified without laboratory testing for brominated flame retardants, PFAS, and heavy metals. Do not ship until a waste characterization report is obtained.',
      picRequired: 'CONDITIONAL',
      picNote: 'PIC requirement cannot be determined until classification is confirmed. Hold shipment pending testing.',
      is2025Amendment: false,
      warning: 'Shipment must be held until laboratory analysis confirms the presence or absence of hazardous constituents.',
    }
  }

  // Other
  return {
    code: 'Y10',
    codeName: 'Other e-waste / Annex II (Y10)',
    hazardClass: 'ANNEX_II',
    annexType: 'Annex II',
    explanation: 'Waste electrical and electronic equipment not elsewhere classified falls under Y10 (Annex II). Prior Informed Consent is required. A more specific classification may apply — consult a Basel compliance specialist.',
    picRequired: 'YES',
    picNote: 'PIC required under Annex II. Recommend obtaining a specific waste characterization report for a more precise code.',
    is2025Amendment: false,
  }
}

const HAZARD_CONFIG: Record<HazardClass, { label: string; bg: string; color: string; border: string }> = {
  HAZARDOUS: { label: 'HAZARDOUS', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00' },
  NON_HAZARDOUS: { label: 'NON-HAZARDOUS', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75' },
  ANNEX_II: { label: 'ANNEX II', bg: '#2a2200', color: '#f5c518', border: '#f5c518' },
  REQUIRES_TESTING: { label: 'TESTING REQUIRED', bg: '#2a2a28', color: '#a0a09a', border: '#3a3a38' },
}

const PIC_CONFIG: Record<PICRequired, { label: string; color: string }> = {
  YES: { label: 'PIC: REQUIRED', color: '#FF5C00' },
  NO: { label: 'PIC: NOT REQUIRED', color: '#1D9E75' },
  CONDITIONAL: { label: 'PIC: CONDITIONAL', color: '#f5c518' },
}

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
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
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
    console.log('[DexMetal] Classification report requested:', { name: gateName, email: gateEmail, answers })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({ name: gateName, email: gateEmail, answers, tool: 'basel-classification-quickscan', ts: new Date().toISOString() })
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail, name: gateName || undefined, tool: 'basel-classification-quickscan', timestamp: new Date().toISOString() })
      }).catch(console.error)
      localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
  }

  const currentQ = QUESTIONS[step]
  const gatedData = result ? classificationData.codeDescriptions[result.code as keyof typeof classificationData.codeDescriptions] : null

  return (
    <div className="font-body" style={{ backgroundColor: '#1C1B18', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', backgroundColor: '#0d3326', padding: '3px 10px', borderRadius: '20px' }}>
              Free Tool
            </span>
          </div>
          <h1 className="font-display font-bold" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Basel Classification QuickScan
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Answer three questions to identify the correct Basel waste code for your e-waste or battery shipment.
          </p>
        </div>

        {/* 2025 Amendment callout */}
        <div style={{ borderLeft: '3px solid #1D9E75', backgroundColor: '#111310', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: '28px' }}>
          <p style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            2025 Basel Update
          </p>
          <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
            <strong style={{ color: '#ffffff' }}>Annex VIII entry A1180 has been replaced by A1181</strong>, covering all hazardous e-waste.{' '}
            <strong style={{ color: '#ffffff' }}>New Annex II entry Y49</strong> now subjects non-hazardous e-waste to PIC for the first time.
            Update all legacy A1180 references in permits and movement documents immediately.
          </p>
        </div>

        {/* Wizard */}
        {!result && (
          <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', border: '1px solid #3a3a38' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              {QUESTIONS.map((q, i) => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    backgroundColor: i < step ? '#1D9E75' : i === step ? '#0d3326' : '#1C1B18',
                    color: i < step ? '#ffffff' : i === step ? '#1D9E75' : '#3a3a38',
                    border: `2px solid ${i <= step ? '#1D9E75' : '#3a3a38'}`,
                    transition: 'all 0.2s',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < QUESTIONS.length - 1 && (
                    <div style={{ width: '32px', height: '2px', backgroundColor: i < step ? '#1D9E75' : '#3a3a38', transition: 'background-color 0.2s' }} />
                  )}
                </div>
              ))}
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#a0a09a' }}>
                Question {step + 1} of {QUESTIONS.length}
              </span>
            </div>

            {/* Question */}
            <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '20px' }}>
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
                      padding: '12px 16px', backgroundColor: isSelected ? '#0d3326' : '#1C1B18',
                      border: `1px solid ${isSelected ? '#1D9E75' : '#3a3a38'}`,
                      borderRadius: '8px', color: isSelected ? '#1D9E75' : '#e0e0da',
                      fontSize: '14px', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px',
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
                style={{ marginTop: '16px', padding: '8px 0', backgroundColor: 'transparent', color: '#a0a09a', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
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
            <div style={{
              backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px',
              border: `1px solid ${HAZARD_CONFIG[result.hazardClass].border}`,
            }}>
              {/* Code + badges */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className="font-display font-bold" style={{ fontSize: '2rem', color: '#ffffff', letterSpacing: '0.02em' }}>
                    {result.code}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 10px',
                      borderRadius: '20px', backgroundColor: HAZARD_CONFIG[result.hazardClass].bg,
                      color: HAZARD_CONFIG[result.hazardClass].color,
                      border: `1px solid ${HAZARD_CONFIG[result.hazardClass].border}`,
                    }}>
                      {HAZARD_CONFIG[result.hazardClass].label}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', padding: '3px 10px',
                      borderRadius: '20px', backgroundColor: '#1C1B18', color: '#a0a09a', border: '1px solid #3a3a38',
                    }}>
                      {result.annexType}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#a0a09a', fontSize: '13px' }}>{result.codeName}</p>
              </div>

              <p style={{ color: '#e0e0da', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
                {result.explanation}
              </p>

              {/* PIC pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: PIC_CONFIG[result.picRequired].color }}>
                  {PIC_CONFIG[result.picRequired].label}
                </span>
                <span style={{ color: '#a0a09a', fontSize: '12px' }}>→</span>
                <Link href="/tools/pic-status-checker" style={{ color: '#1D9E75', fontSize: '12px' }}>
                  Check PIC requirements →
                </Link>
              </div>

              {/* Warning */}
              {result.warning && (
                <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#3a1200', borderRadius: '6px', borderLeft: '3px solid #FF5C00' }}>
                  <p style={{ color: '#FF5C00', fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>Important</p>
                  <p style={{ color: '#e0a080', fontSize: '12px', lineHeight: 1.5 }}>{result.warning}</p>
                </div>
              )}

              {/* 2025 badge */}
              {result.is2025Amendment && (
                <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: '#0d3326', borderRadius: '20px', border: '1px solid #1D9E75' }}>
                  <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700 }}>2025 AMENDMENT APPLIES</span>
                </div>
              )}
            </div>

            {/* View Full Report CTA */}
            {!gateUnlocked && (
              <div style={{
                backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '20px 28px',
                border: '1px solid #3a3a38', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    Full classification report available
                  </p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                    Legal rationale · Common misclassifications · Required documents checklist
                  </p>
                </div>
                <button
                  onClick={() => setShowGate(true)}
                  style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  View Full Report →
                </button>
              </div>
            )}

            {/* Gated content */}
            {gateUnlocked && gatedData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Rationale */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
                    Classification Rationale
                  </h3>
                  <p style={{ color: '#e0e0da', fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                    {result.picNote}
                  </p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                    Waste type: <span style={{ color: '#e0e0da' }}>{result.codeName}</span>
                  </p>
                </div>

                {/* 2025 Amendment note */}
                {gatedData.amendmentNote && (
                  <div style={{ borderLeft: '3px solid #1D9E75', backgroundColor: '#111310', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
                    <p style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      2025 Amendment Note
                    </p>
                    <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>{gatedData.amendmentNote}</p>
                  </div>
                )}

                {/* Common misclassifications */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                    Common Misclassification Warnings
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {gatedData.misclassifications.map((m, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#FF5C00', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>⚠</span>
                        <span style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.5 }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required documents */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                    Required Documents Checklist
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {gatedData.documents.map((doc, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#1D9E75', fontSize: '13px', flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#e0e0da', fontSize: '13px', lineHeight: 1.5 }}>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Cross-tool cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
              <Link
                href="/tools/shipment-eligibility-checker"
                style={{ display: 'block', padding: '16px 18px', backgroundColor: '#2c2c2a', borderRadius: '10px', borderLeft: '3px solid #1D9E75', textDecoration: 'none', transition: 'filter 0.15s' }}
              >
                <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  Check Shipment Eligibility
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px', marginBottom: '8px' }}>
                  Is this shipment permitted under Basel Convention?
                </p>
                <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Open tool →
                </span>
              </Link>
              <Link
                href="/tools/pic-status-checker"
                style={{ display: 'block', padding: '16px 18px', backgroundColor: '#2c2c2a', borderRadius: '10px', borderLeft: '3px solid #1D9E75', textDecoration: 'none', transition: 'filter 0.15s' }}
              >
                <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  Check PIC Requirements
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px', marginBottom: '8px' }}>
                  What type of consent is needed for this route?
                </p>
                <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Open tool →
                </span>
              </Link>
            </div>

            {/* Donation bar */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #3a3a38' }}>
              <p style={{ color: '#a0a09a', fontSize: '13px', marginBottom: '10px' }}>
                Found this useful? Help keep it free.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="https://ko-fi.com/dexmetal"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#1D9E75',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Support on Ko-fi
                </a>
                <a
                  href="https://www.paypal.biz/dexmetal"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#0070BA',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Donate via PayPal
                </a>
              </div>
            </div>

            {/* Restart */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                onClick={handleReset}
                style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#a0a09a', border: '1px solid #3a3a38', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← Start over
              </button>
            </div>
          </div>
        )}

        {/* Email gate modal */}
        {showGate && (
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowGate(false) }}
          >
            <div style={{ backgroundColor: '#2c2c2a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid #3a3a38' }}>
              <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}>
                Get the Full Classification Report
              </h2>
              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your email to unlock the classification rationale, misclassification warnings, and required documents checklist. Free — no spam.
              </p>
              <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Your name" value={gateName} onChange={(e) => setGateName(e.target.value)}
                  style={{ padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                />
                <input type="email" required placeholder="your@email.com" value={gateEmail} onChange={(e) => setGateEmail(e.target.value)}
                  style={{ padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                />
                <button type="submit" disabled={gateSubmitting}
                  style={{ padding: '12px', backgroundColor: '#FF5C00', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: gateSubmitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}
                >
                  {gateSubmitting ? 'Loading...' : 'Send me the report'}
                </button>
                <button type="button" onClick={() => setShowGate(false)}
                  style={{ padding: '8px', backgroundColor: 'transparent', color: '#a0a09a', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
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
            This tool provides guidance based on Basel Convention treaty text and is not legal advice.
            Classification may vary by jurisdiction.{' '}
            <Link href="/tools/shipment-eligibility-checker" style={{ color: '#1D9E75' }}>
              Check shipment eligibility →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
