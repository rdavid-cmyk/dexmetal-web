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

function classify(type: string, condition: string, use: string): ClassificationResult {
  const reuseOrRepair = use === 'Reuse' || use === 'Repair'
  const functionalReuse = condition === 'Functional' && reuseOrRepair

  // Used equipment/products claimed for direct reuse or repair are not assigned a waste code
  // merely because they are electrical/electronic equipment. The waste/non-waste determination
  // is case-specific and depends on evidence plus the law of the States concerned.
  const nonWasteCheck = (item: string, ifWaste: string): ClassificationResult => ({
    code: 'NON-WASTE CHECK',
    codeName: `${item} — waste/non-waste determination required`,
    hazardClass: 'REQUIRES_TESTING',
    annexType: 'Not assigned until waste status is determined',
    explanation: `Functional ${item.toLowerCase()} intended for reuse or repair may be non-waste, but that is not automatic. Document functionality, intended use, destination and the evidence required by the relevant authorities. If it is waste, classify it under ${ifWaste}.`,
    picRequired: 'CONDITIONAL',
    picNote: 'If the item is genuinely non-waste, Basel waste PIC does not apply. If it is waste, apply the relevant Basel/OECD/national controls.',
    is2025Amendment: true,
    warning: 'Do not use deleted Basel e-waste entry B1110 for shipments on or after 1 January 2025.',
  })

  // ULAB / lead-acid batteries
  if (type === 'ULAB') {
    if (functionalReuse) return nonWasteCheck('Used lead-acid battery', 'A1160 (with Y31 and, where relevant, Y34)')
    return {
      code: 'A1160',
      codeName: 'Waste lead-acid batteries — Annex VIII (A1160)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'Waste lead-acid batteries, whole or crushed, are listed as A1160. Y31 identifies lead/lead compounds and Y34 may apply to acidic electrolyte.',
      picRequired: 'YES',
      picNote: 'Basel-controlled hazardous waste; apply the PIC procedure and current national requirements.',
      is2025Amendment: false,
    }
  }

  // Other batteries, including lithium
  if (type === 'Lithium') {
    if (functionalReuse) return nonWasteCheck('Used battery', 'A1170 or B1090, depending composition, specification and hazardous characteristics')
    return {
      code: 'A1170 / B1090',
      codeName: 'Waste battery classification requires composition/specification check',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Annex VIII or Annex IX',
      explanation: 'A1170 covers unsorted waste batteries and waste batteries not on list B that contain Annex I constituents to an extent that renders them hazardous. B1090 covers specified waste batteries excluding those made with lead, cadmium or mercury. Dangerous-goods rules apply independently.',
      picRequired: 'CONDITIONAL',
      picNote: 'PIC depends on the confirmed Basel classification and national controls.',
      is2025Amendment: false,
      warning: 'Do not use B1120 for batteries; B1120 is a spent-catalyst entry.',
    }
  }

  // Mixed e-waste
  if (type === 'MixedEWaste') {
    if (functionalReuse) return nonWasteCheck('Used electrical/electronic equipment', 'A1181 or Y49')
    return {
      code: 'A1181 / Y49',
      codeName: 'E-waste — hazardous determination required',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Annex VIII or Annex II',
      explanation: 'From 1 January 2025, e-waste that is waste is classified under A1181 when hazardous or Y49 for other e-waste, unless another Basel entry applies.',
      picRequired: 'YES',
      picNote: 'Both A1181 and Y49 are subject to Basel PIC for Parties bound by the e-waste amendments; OECD and national controls must also be checked.',
      is2025Amendment: true,
    }
  }

  // CRT equipment
  if (type === 'CRT') {
    if (functionalReuse) return nonWasteCheck('Used CRT equipment', 'A1181 if it is waste and contains hazardous leaded CRT glass')
    return {
      code: 'A1181',
      codeName: 'Hazardous e-waste — Annex VIII (A1181)',
      hazardClass: 'HAZARDOUS',
      annexType: 'Annex VIII',
      explanation: 'Waste CRT equipment containing leaded CRT glass is hazardous e-waste and falls under A1181.',
      picRequired: 'YES',
      picNote: 'PIC required for A1181; verify Ban Amendment and national restrictions for the route.',
      is2025Amendment: true,
    }
  }

  // Circuit boards / electronic assemblies
  if (type === 'PCBs') {
    if (functionalReuse) return nonWasteCheck('Used circuit-board assembly', 'A1181 or Y49')
    return {
      code: 'A1181 / Y49',
      codeName: 'Waste circuit boards — constituent/hazard check required',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Annex VIII or Annex II',
      explanation: 'Waste circuit boards may fall under A1181 when Annex I constituents are present to an extent that the waste or a component exhibits an Annex III characteristic; otherwise Y49 or another applicable entry may apply.',
      picRequired: 'YES',
      picNote: 'If classified as A1181 or Y49, apply the Basel PIC procedure and current national/OECD controls.',
      is2025Amendment: true,
    }
  }

  // Plastics arising from e-waste may fall under the plastic entries rather than Y49.
  if (type === 'Plastic') {
    return {
      code: 'A3210 / Y48 / B3011',
      codeName: 'Plastic waste — composition and contamination check required',
      hazardClass: 'REQUIRES_TESTING',
      annexType: 'Annex VIII, Annex II or Annex IX',
      explanation: 'Plastic waste classification depends on polymer composition, mixtures, contamination and hazardous characteristics. E-waste-derived plastic may fall under another Basel plastic entry rather than Y49.',
      picRequired: 'CONDITIONAL',
      picNote: 'PIC depends on the confirmed plastic-waste entry, the States concerned and applicable national/OECD controls.',
      is2025Amendment: false,
    }
  }

  return {
    code: 'REQUIRES_TESTING',
    codeName: 'Classification requires evidence',
    hazardClass: 'REQUIRES_TESTING',
    annexType: 'Unknown',
    explanation: 'The available answers do not support a reliable Basel code. Confirm waste status, composition, hazardous characteristics and any more specific Basel entry before shipment.',
    picRequired: 'CONDITIONAL',
    picNote: 'PIC cannot be determined until classification and route controls are confirmed.',
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

const CLASSIFICATION_TOUR_STEPS: TourStep[] = [
  { text: 'Answer three quick questions to get your Basel waste code. Start by selecting what you are shipping.', attachTo: { element: '#tour-classification-questions', on: 'top' } },
  { text: 'Select the physical state or condition of the material — Functional, Damaged, Mixed, or Scrap.', attachTo: { element: '#tour-classification-questions', on: 'top' } },
  { text: 'Choose the intended use at destination. The tool calculates your Basel classification and PIC requirements automatically.', attachTo: { element: '#tour-classification-questions', on: 'top' } },
  { text: 'Load Example pre-fills a ULAB Trinidad → Germany recycling scenario so you can see a sample classification instantly.', attachTo: { element: '#tour-load-example', on: 'bottom' } },
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
  const gatedData = result ? classificationData.codeDescriptions[result.code as keyof typeof classificationData.codeDescriptions] : null

  return (
    <div className="font-body" style={{ backgroundColor: '#1C1B18', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', backgroundColor: '#0d3326', padding: '3px 10px', borderRadius: '20px' }}>
                Free Tool
              </span>
            </div>
            <ShepherdTour steps={CLASSIFICATION_TOUR_STEPS} tourKey="classification-quickscan" />
          </div>
          <h1 className="font-display font-bold" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Basel Classification QuickScan
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Answer three questions to identify the correct Basel waste code for your e-waste or battery shipment.
          </p>
          <div style={{ marginTop: '12px' }}>
            <button id="tour-load-example" onClick={() => { setAnswers({ type: 'ULAB', condition: 'Scrap', use: 'Recycling' }); setStep(3); setGateUnlocked(false); }} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#1D9E75', border: '1px solid #1D9E75', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Load example: ULAB T&T → Germany (recycling) →
            </button>
          </div>
        </div>

        {/* 2025 Amendment callout */}
        <div style={{ borderLeft: '3px solid #1D9E75', backgroundColor: '#111310', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: '28px' }}>
          <p style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            2025 Basel Update
          </p>
          <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
            <strong style={{ color: '#ffffff' }}>Annex VIII entry A1180 has been replaced by A1181</strong>, covering all hazardous e-waste.{' '}
            <strong style={{ color: '#ffffff' }}>New <TooltipTerm term="Annex II">Annex II</TooltipTerm> entry Y49</strong> now subjects non-hazardous e-waste to <TooltipTerm term="PIC">PIC</TooltipTerm> for the first time.
            Update all legacy A1180 references in permits and movement documents immediately.
          </p>
        </div>

        {/* Wizard */}
        {!result && (
          <div id="tour-classification-questions" style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', border: '1px solid #3a3a38' }}>
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
                  Check <TooltipTerm term="PIC">PIC</TooltipTerm> Requirements
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px', marginBottom: '8px' }}>
                  What type of consent is needed for this route?
                </p>
                <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Open tool →
                </span>
              </Link>
            </div>

            {/* Consulting CTA */}
            <div style={{ backgroundColor: '#1a1208', borderRadius: '12px', padding: '20px 24px', border: '1px solid #FF5C00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Need expert review of these results?</p>
                <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.5 }}>This shipment may require Basel notification — book a done-for-you assessment.</p>
              </div>
              <Link href="/contact" style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Book an assessment →</Link>
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
