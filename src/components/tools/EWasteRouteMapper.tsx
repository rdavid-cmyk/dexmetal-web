'use client'

import { useState } from 'react'
import routeData from '@/data/ewaste-routes.json'
import Link from 'next/link'

type RiskLevel = 'RED' | 'YELLOW' | 'GREEN'
type Complexity = 'HIGH' | 'MEDIUM' | 'LOW'

interface RouteResult {
  banTriggered: boolean
  banExplanation: string
  picRequired: boolean
  picNote: string
  complexity: Complexity
  complexityReason: string
  riskLevel: RiskLevel
  transitWarning: string
  complianceSteps: string[]
  wasteCode: string
  originIsAnnexVII: boolean
  destIsAnnexVII: boolean
  nonPartyInvolved: string | null
}

const RISK_CONFIG: Record<RiskLevel, { label: string; bg: string; color: string; border: string }> = {
  RED: { label: 'HIGH RISK', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00' },
  YELLOW: { label: 'NOTIFICATION REQUIRED', bg: '#2a2200', color: '#f5c518', border: '#f5c518' },
  GREEN: { label: 'LOW BARRIER', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75' },
}

const COMPLEXITY_CONFIG: Record<Complexity, { color: string; bg: string }> = {
  HIGH: { color: '#FF5C00', bg: '#3a1200' },
  MEDIUM: { color: '#f5c518', bg: '#2a2200' },
  LOW: { color: '#1D9E75', bg: '#0d3326' },
}

function getOriginRegion(origin: string): string {
  for (const [region, countries] of Object.entries(routeData.originRegions)) {
    if ((countries as string[]).includes(origin)) return region
  }
  return 'Other'
}

function getTransitWarning(origin: string, dest: string): string {
  const originRegion = getOriginRegion(origin)
  const destRegion = Object.entries(routeData.destinationRegions).find(([, countries]) =>
    (countries as string[]).includes(dest)
  )?.[0] || 'Other'

  if (originRegion === 'Caribbean' && destRegion === 'Western Europe') return routeData.transitWarnings['Caribbean-to-Europe']
  if (originRegion === 'Caribbean' && (destRegion === 'East Asia' || destRegion === 'South Asia' || destRegion === 'Southeast Asia')) return routeData.transitWarnings['Caribbean-to-Asia']
  if (originRegion === 'West Africa' && destRegion === 'Western Europe') return routeData.transitWarnings['WestAfrica-to-Europe']
  if ((originRegion === 'Southeast Asia') && destRegion === 'Western Europe') return routeData.transitWarnings['Asia-to-Europe']
  return routeData.transitWarnings['default']
}

function assessRoute(waste: string, origin: string, dest: string, purpose: string): RouteResult {
  const originCode = routeData.originCodes[origin as keyof typeof routeData.originCodes] || ''
  const destCode = routeData.destCodes[dest as keyof typeof routeData.destCodes] || ''
  const wasteEntry = routeData.wasteCategories.find((w) => w.value === waste)
  const isHazardous = wasteEntry?.hazardous ?? true
  const wasteCode = wasteEntry?.code || 'A1181'

  const originIsAnnexVII = routeData.annexVII.includes(originCode)
  const destIsAnnexVII = routeData.annexVII.includes(destCode)
  const nonParty = routeData.nonParties.includes(originCode) ? origin : routeData.nonParties.includes(destCode) ? dest : null

  const transitWarning = getTransitWarning(origin, dest)

  // Non-party involved
  if (nonParty) {
    return {
      banTriggered: false,
      banExplanation: '',
      picRequired: false,
      picNote: `${nonParty} is not a Basel Convention party. No PIC framework applies — any agreement would be bilateral under Article 11.`,
      complexity: 'HIGH',
      complexityReason: `${nonParty} operates outside the Basel Convention framework, creating significant legal uncertainty.`,
      riskLevel: 'RED',
      transitWarning,
      complianceSteps: routeData.complianceSteps.high,
      wasteCode,
      originIsAnnexVII,
      destIsAnnexVII,
      nonPartyInvolved: nonParty,
    }
  }

  // Basel Ban Amendment: Annex VII → non-Annex VII, hazardous waste
  const banTriggered = originIsAnnexVII && !destIsAnnexVII && isHazardous && purpose !== 'refurbishment' && waste !== 'WholeUnits'

  // WholeUnits for refurbishment — generally lower barrier
  if (waste === 'WholeUnits' && purpose === 'refurbishment') {
    const complexity: Complexity = (!originIsAnnexVII || !destIsAnnexVII) ? 'MEDIUM' : 'LOW'
    return {
      banTriggered: false,
      banExplanation: '',
      picRequired: !originIsAnnexVII || !destIsAnnexVII,
      picNote: 'Tested-working equipment for refurbishment may qualify as B1110 (non-hazardous). PIC may not apply, but destination CA notification is recommended.',
      complexity,
      complexityReason: complexity === 'LOW'
        ? 'B1110 classification for tested-working units significantly reduces compliance burden between OECD countries.'
        : 'Non-OECD route requires explicit notification and confirmation that units are genuinely tested-working.',
      riskLevel: complexity === 'LOW' ? 'GREEN' : 'YELLOW',
      transitWarning,
      complianceSteps: routeData.complianceSteps[complexity.toLowerCase() as 'low' | 'medium'],
      wasteCode: 'B1110',
      originIsAnnexVII,
      destIsAnnexVII,
      nonPartyInvolved: null,
    }
  }

  if (banTriggered) {
    return {
      banTriggered: true,
      banExplanation: `Basel Ban Amendment (Article 4A) prohibits hazardous waste exports from Annex VII (OECD/EU) countries to non-Annex VII countries. ${origin} is Annex VII; ${dest} is not. This shipment is prohibited.`,
      picRequired: false,
      picNote: 'PIC cannot be obtained for a prohibited shipment.',
      complexity: 'HIGH',
      complexityReason: 'Shipment is prohibited — no compliance pathway exists without changing origin, destination, or waste classification.',
      riskLevel: 'RED',
      transitWarning,
      complianceSteps: routeData.complianceSteps.banned,
      wasteCode,
      originIsAnnexVII,
      destIsAnnexVII,
      nonPartyInvolved: null,
    }
  }

  // OECD-to-OECD
  if (originIsAnnexVII && destIsAnnexVII) {
    const isY49 = waste === 'WholeUnits'
    const complexity: Complexity = waste === 'CRTs' ? 'HIGH' : 'MEDIUM'
    return {
      banTriggered: false,
      banExplanation: '',
      picRequired: true,
      picNote: waste === 'CRTs'
        ? 'CRTs always require PIC — lead glass makes them permanently hazardous regardless of OECD status.'
        : 'OECD Decision C(2001)107 applies — 30-day tacit consent period. Notification required.',
      complexity,
      complexityReason: waste === 'CRTs'
        ? 'CRTs require additional processing documentation and specialist disposal — higher complexity even on OECD routes.'
        : 'OECD-to-OECD route with established notification framework. Documentation required but pathway is well-defined.',
      riskLevel: complexity === 'HIGH' ? 'RED' : 'YELLOW',
      transitWarning,
      complianceSteps: routeData.complianceSteps[complexity.toLowerCase() as 'high' | 'medium'],
      wasteCode,
      originIsAnnexVII,
      destIsAnnexVII,
      nonPartyInvolved: null,
    }
  }

  // Non-Annex VII origin → any destination (or Annex VII → non-Annex VII non-hazardous)
  const complexity: Complexity = waste === 'CRTs' || dest === 'Ghana' || dest === 'Nigeria' ? 'HIGH' : 'MEDIUM'
  const destKnownRisk = dest === 'Ghana' || dest === 'Nigeria'

  return {
    banTriggered: false,
    banExplanation: '',
    picRequired: true,
    picNote: 'Explicit Prior Informed Consent from the destination Competent Authority is required under Article 6 before shipment can proceed.',
    complexity,
    complexityReason: destKnownRisk
      ? `${dest} has a history of receiving illegal e-waste shipments. Expect heightened scrutiny from both your national CA and the destination CA.`
      : 'Non-OECD route requires explicit PIC notification and full documentation package. Allow 60–90 days for consent.',
    riskLevel: complexity === 'HIGH' ? 'RED' : 'YELLOW',
    transitWarning,
    complianceSteps: routeData.complianceSteps[complexity.toLowerCase() as 'high' | 'medium'],
    wasteCode,
    originIsAnnexVII,
    destIsAnnexVII,
    nonPartyInvolved: null,
  }
}

const STEPS = [
  { id: 'waste', label: 'Waste Type', question: 'What are you shipping?' },
  { id: 'origin', label: 'Origin', question: 'Where is the shipment coming from?' },
  { id: 'dest', label: 'Destination', question: 'Where is it going?' },
  { id: 'purpose', label: 'Purpose', question: 'What is the intended use?' },
]

export default function EWasteRouteMapper() {
  const [step, setStep] = useState(0)
  const [waste, setWaste] = useState('')
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [purpose, setPurpose] = useState('')
  const [result, setResult] = useState<RouteResult | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateSubmitting, setGateSubmitting] = useState(false)

  const values: Record<string, string> = { waste, origin, dest, purpose }
  const setters: Record<string, (v: string) => void> = { waste: setWaste, origin: setOrigin, dest: setDest, purpose: setPurpose }

  function handleSelect(fieldId: string, value: string) {
    setters[fieldId](value)
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 180)
    } else {
      const w = fieldId === 'waste' ? value : waste
      const o = fieldId === 'origin' ? value : origin
      const d = fieldId === 'dest' ? value : dest
      const p = fieldId === 'purpose' ? value : purpose
      const r = assessRoute(w, o, d, p)
      setResult(r)
      setGateUnlocked(false)
      setTimeout(() => { document.getElementById('route-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 200)
    }
  }

  function handleReset() {
    setStep(0)
    setWaste(''); setOrigin(''); setDest(''); setPurpose('')
    setResult(null); setGateUnlocked(false)
  }

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gateEmail) return
    setGateSubmitting(true)
    console.log('[DexMetal] Route report requested:', { name: gateName, email: gateEmail, waste, origin, dest, purpose })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({ name: gateName, email: gateEmail, waste, origin, dest, purpose, tool: 'ewaste-route-mapper', ts: new Date().toISOString() })
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail, name: gateName || undefined, tool: 'ewaste-route-mapper', timestamp: new Date().toISOString() })
      }).catch(console.error)
      localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
  }

  function handleLoadExample() {
    const r = assessRoute('ULAB', 'Trinidad and Tobago', 'Germany', 'recycling')
    setWaste('ULAB'); setOrigin('Trinidad and Tobago'); setDest('Germany'); setPurpose('recycling')
    setStep(3); setResult(r); setGateUnlocked(false)
    setTimeout(() => { document.getElementById('route-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 200)
  }

  function getOptions(stepId: string): { value: string; label: string; group?: string }[] {
    if (stepId === 'waste') return routeData.wasteCategories.map((w) => ({ value: w.value, label: w.label }))
    if (stepId === 'origin') {
      return Object.entries(routeData.originRegions).flatMap(([region, countries]) =>
        (countries as string[]).map((c) => ({ value: c, label: c, group: region }))
      )
    }
    if (stepId === 'dest') {
      return Object.entries(routeData.destinationRegions).flatMap(([region, countries]) =>
        (countries as string[]).map((c) => ({ value: c, label: c, group: region }))
      )
    }
    if (stepId === 'purpose') return routeData.purposes.map((p) => ({ value: p.value, label: p.label }))
    return []
  }

  const currentStep = STEPS[step]
  const options = getOptions(currentStep.id)

  // Group options by region if applicable
  const grouped = options.some((o) => o.group)
  const groups: Record<string, { value: string; label: string }[]> = {}
  if (grouped) {
    options.forEach((o) => {
      const g = o.group || 'Other'
      if (!groups[g]) groups[g] = []
      groups[g].push({ value: o.value, label: o.label })
    })
  }

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
            E-Waste Export Route Risk Mapper
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Map your e-waste export route and instantly identify Basel notification requirements, ban restrictions, and compliance complexity before you ship.
          </p>
        </div>

        {/* Load Example */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleLoadExample}
            style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#1D9E75', border: '1px solid #1D9E75', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Load example: ULAB export · Trinidad → Germany
          </button>
        </div>

        {/* Wizard */}
        {!result && (
          <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', border: '1px solid #3a3a38' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  {i < STEPS.length - 1 && (
                    <div style={{ width: '24px', height: '2px', backgroundColor: i < step ? '#1D9E75' : '#3a3a38', transition: 'background-color 0.2s' }} />
                  )}
                </div>
              ))}
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#a0a09a' }}>
                {STEPS[step].label} — Step {step + 1} of {STEPS.length}
              </span>
            </div>

            {/* Selections summary */}
            {step > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {STEPS.slice(0, step).map((s) => values[s.id] ? (
                  <span key={s.id} style={{ fontSize: '12px', padding: '3px 10px', backgroundColor: '#0d3326', color: '#1D9E75', borderRadius: '20px', border: '1px solid #1D9E75' }}>
                    {values[s.id] === 'waste' ? routeData.wasteCategories.find(w => w.value === values[s.id])?.label : values[s.id]}
                  </span>
                ) : null)}
              </div>
            )}

            <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '20px' }}>
              {currentStep.question}
            </h2>

            {/* Options */}
            {!grouped ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {options.map((opt) => {
                  const isSelected = values[currentStep.id] === opt.value
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => handleSelect(currentStep.id, opt.value)}
                      style={{
                        padding: '12px 16px', backgroundColor: isSelected ? '#0d3326' : '#1C1B18',
                        border: `1px solid ${isSelected ? '#1D9E75' : '#3a3a38'}`,
                        borderRadius: '8px', color: isSelected ? '#1D9E75' : '#e0e0da',
                        fontSize: '14px', textAlign: 'left', cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(groups).map(([region, opts]) => (
                  <div key={region}>
                    <p style={{ color: '#a0a09a', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{region}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px' }}>
                      {opts.map((opt) => {
                        const isSelected = values[currentStep.id] === opt.value
                        return (
                          <button key={opt.value} type="button"
                            onClick={() => handleSelect(currentStep.id, opt.value)}
                            style={{
                              padding: '10px 12px', backgroundColor: isSelected ? '#0d3326' : '#1C1B18',
                              border: `1px solid ${isSelected ? '#1D9E75' : '#3a3a38'}`,
                              borderRadius: '8px', color: isSelected ? '#1D9E75' : '#e0e0da',
                              fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                              fontFamily: 'inherit', transition: 'all 0.15s',
                            }}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}
                style={{ marginTop: '16px', padding: '8px 0', backgroundColor: 'transparent', color: '#a0a09a', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div id="route-result" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Risk card */}
            <div style={{
              backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px',
              border: `1px solid ${RISK_CONFIG[result.riskLevel].border}`,
            }}>
              {/* Route summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', padding: '4px 12px',
                  borderRadius: '20px', backgroundColor: RISK_CONFIG[result.riskLevel].bg,
                  color: RISK_CONFIG[result.riskLevel].color, border: `1px solid ${RISK_CONFIG[result.riskLevel].border}`,
                }}>
                  {RISK_CONFIG[result.riskLevel].label}
                </span>
                <span style={{ fontSize: '12px', color: '#a0a09a' }}>
                  {waste === 'WholeUnits' ? 'Whole Units (Refurb)' : routeData.wasteCategories.find(w => w.value === waste)?.label} · {origin} → {dest}
                </span>
              </div>

              {/* Key indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {/* Ban */}
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '12px 14px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Basel Ban</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: result.banTriggered ? '#FF5C00' : '#1D9E75' }}>
                    {result.banTriggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
                  </p>
                </div>
                {/* PIC */}
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '12px 14px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>PIC Required</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: result.picRequired ? '#f5c518' : '#1D9E75' }}>
                    {result.nonPartyInvolved ? 'N/A' : result.picRequired ? 'YES' : 'NO'}
                  </p>
                </div>
                {/* Complexity */}
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '12px 14px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Complexity</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: COMPLEXITY_CONFIG[result.complexity].color }}>
                    {result.complexity}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              {result.banTriggered && (
                <div style={{ padding: '12px 14px', backgroundColor: '#3a1200', borderRadius: '8px', borderLeft: '3px solid #FF5C00', marginBottom: '12px' }}>
                  <p style={{ color: '#FF5C00', fontSize: '12px', fontWeight: 700, marginBottom: '3px' }}>Ban Amendment Triggered</p>
                  <p style={{ color: '#e0a080', fontSize: '13px', lineHeight: 1.5 }}>{result.banExplanation}</p>
                </div>
              )}
              {result.nonPartyInvolved && (
                <div style={{ padding: '12px 14px', backgroundColor: '#3a1200', borderRadius: '8px', borderLeft: '3px solid #FF5C00', marginBottom: '12px' }}>
                  <p style={{ color: '#FF5C00', fontSize: '12px', fontWeight: 700, marginBottom: '3px' }}>Non-Basel Party Involved</p>
                  <p style={{ color: '#e0a080', fontSize: '13px', lineHeight: 1.5 }}>{result.picNote}</p>
                </div>
              )}

              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>{result.complexityReason}</p>
              <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                Basel code: <span style={{ color: '#e0e0da', fontWeight: 600 }}>{result.wasteCode}</span>
                {' · '}
                Route: <span style={{ color: result.originIsAnnexVII ? '#1D9E75' : '#a0a09a' }}>
                  {result.originIsAnnexVII ? 'Annex VII' : 'Non-Annex VII'}
                </span>
                {' → '}
                <span style={{ color: result.destIsAnnexVII ? '#1D9E75' : '#a0a09a' }}>
                  {result.destIsAnnexVII ? 'Annex VII' : 'Non-Annex VII'}
                </span>
              </p>
            </div>

            {/* Transit warning */}
            <div style={{ borderLeft: '3px solid #f5c518', backgroundColor: '#1f1d10', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
              <p style={{ color: '#f5c518', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Transit Country Note
              </p>
              <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>{result.transitWarning}</p>
            </div>

            {/* Gate CTA */}
            {!gateUnlocked && (
              <div style={{
                backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '20px 28px',
                border: '1px solid #3a3a38', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Get your full route compliance report</p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>Step-by-step compliance checklist · CA contacts · Detailed risk notes</p>
                </div>
                <button onClick={() => setShowGate(true)}
                  style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  Get Full Report →
                </button>
              </div>
            )}

            {/* Gated content */}
            {gateUnlocked && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Compliance steps */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>
                    Required Compliance Steps for This Route
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.complianceSteps.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: result.banTriggered ? '#3a1200' : '#0d3326',
                          border: `1px solid ${result.banTriggered ? '#FF5C00' : '#1D9E75'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700,
                          color: result.banTriggered ? '#FF5C00' : '#1D9E75',
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ color: '#e0e0da', fontSize: '13px', lineHeight: 1.5, paddingTop: '2px' }}>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CA contact for destination */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
                    Destination Competent Authority
                  </h3>
                  {(() => {
                    const destCode = routeData.destCodes[dest as keyof typeof routeData.destCodes]
                    const ca = destCode ? routeData.knownCAContacts[destCode as keyof typeof routeData.knownCAContacts] : null
                    return ca ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>{ca.name}</p>
                        {ca.email && (
                          <p style={{ fontSize: '13px' }}>
                            <span style={{ color: '#a0a09a' }}>Email: </span>
                            <a href={`mailto:${ca.email}`} style={{ color: '#1D9E75' }}>{ca.email}</a>
                          </p>
                        )}
                        <p style={{ color: '#a0a09a', fontSize: '12px', marginTop: '4px' }}>
                          Always verify current contact details at the{' '}
                          <a href="https://www.basel.int/Countries/NationalAuthorities/tabid/252/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: '#1D9E75' }}>
                            Basel Convention directory →
                          </a>
                        </p>
                      </div>
                    ) : (
                      <p style={{ color: '#a0a09a', fontSize: '13px' }}>
                        CA data not in our database for {dest}.{' '}
                        <a href="https://www.basel.int/Countries/NationalAuthorities/tabid/252/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: '#1D9E75' }}>
                          Search Basel Convention directory →
                        </a>
                      </p>
                    )
                  })()}
                </div>

                {/* Cross-links */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { href: '/tools/shipment-eligibility-checker', title: 'Eligibility Check', desc: 'Is this shipment permitted?', color: '#1D9E75' },
                    { href: '/tools/pic-status-checker', title: 'PIC Status', desc: 'What consent is needed?', color: '#1D9E75' },
                    { href: '/tools/basel-navigator', title: 'Notification Doc', desc: 'Start your formal document', color: '#FF5C00' },
                  ].map((card) => (
                    <Link key={card.href} href={card.href} style={{ display: 'block', padding: '14px 16px', backgroundColor: '#2c2c2a', borderRadius: '10px', borderLeft: `3px solid ${card.color}`, textDecoration: 'none' }}>
                      <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>{card.title}</p>
                      <p style={{ color: '#a0a09a', fontSize: '11px', marginBottom: '8px' }}>{card.desc}</p>
                      <span style={{ color: card.color, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open →</span>
                    </Link>
                  ))}
                </div>

                {/* Consulting CTA */}
                <div style={{ backgroundColor: '#1a1208', borderRadius: '12px', padding: '20px 24px', border: '1px solid #FF5C00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Need expert review of these results?</p>
                    <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.5 }}>This shipment may require Basel notification — book a done-for-you assessment.</p>
                  </div>
                  <Link href="/contact" style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Book an assessment →</Link>
                </div>
              </div>
            )}

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
            <div style={{ textAlign: 'center' }}>
              <button onClick={handleReset}
                style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#a0a09a', border: '1px solid #3a3a38', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← Map another route
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
                Get Your Full Route Compliance Report
              </h2>
              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your email to unlock the step-by-step compliance checklist, Competent Authority contacts, and detailed risk notes for this route. Free — no spam.
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
            Eligibility and PIC requirements may vary by national implementing legislation.{' '}
            <Link href="/tools/shipment-eligibility-checker" style={{ color: '#1D9E75' }}>
              Run a full eligibility check →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
