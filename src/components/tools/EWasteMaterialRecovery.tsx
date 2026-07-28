'use client'

import { useState, useEffect } from 'react'
import ratesData from '@/data/ewaste-recovery.json'
import Link from 'next/link'

type TrafficLight = 'GREEN' | 'YELLOW' | 'RED'

interface Country {
  code: string
  name: string
}

interface MaterialResult {
  name: string
  weightKg: number
  recoveryRate: number
  recoveredKg: number
  totalValue: number
  dataNote?: string
}

interface CalcResult {
  streamName: string
  totalWeightKg: number
  materials: MaterialResult[]
  grossRecovery: number
  processingCost: number
  netValue: number
  marginPct: number
  light: TrafficLight
  baselWarning?: string
}

const LIGHT_CONFIG: Record<TrafficLight, { label: string; bg: string; color: string; border: string; desc: string }> = {
  GREEN: { label: 'VIABLE', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75', desc: 'Margin above 20% — material recovery is commercially viable.' },
  YELLOW: { label: 'MARGINAL', bg: '#2a2200', color: '#f5c518', border: '#f5c518', desc: 'Margin 5-20% — viable but thin. Price fluctuations could erode profitability.' },
  RED: { label: 'NOT VIABLE', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00', desc: 'Margin below 5% — not commercially viable at current estimates.' },
}

function getMaterialValue(material: any, weightKg: number, lmePrices: any): number {
  const recoveryRate = material.recoveryRate || 0
  const recoveredKg = weightKg * recoveryRate
  
  let valuePerUnit = 0
  
  if (material.lmeReference) {
    const price = lmePrices[material.lmeReference] || 0
    valuePerUnit = price / 1000
  } else if (material.valuePerTonne) {
    valuePerUnit = material.valuePerTonne / 1000
  }
  
  return recoveredKg * valuePerUnit
}

function calculate(
  streamId: string,
  quantityTonnes: number,
  condition: string,
  destCode: string,
  countries: Country[]
): CalcResult | null {
  if (!streamId || !quantityTonnes || quantityTonnes <= 0 || !condition || !destCode) return null

  const stream = ratesData.wasteStreams.find((s: any) => s.id === streamId)
  if (!stream) return null

  const conditionMultiplier = (ratesData.conditionMultipliers as any)[condition] || 1.0
  const totalWeightKg = quantityTonnes * 1000
  
  const materials: MaterialResult[] = []
  let grossRecovery = 0

  if (stream.isRefurbishment) {
    const avgValuePerUnit = stream.resaleValues.reduce((sum: number, v: any) => sum + (v.valueMin + v.valueMax) / 2, 0) / stream.resaleValues.length
    const estimatedUnits = quantityTonnes * 10
    grossRecovery = estimatedUnits * avgValuePerUnit * conditionMultiplier
  } else {
    for (const material of (stream.materials as any[])) {
      const percentageWeight = (material as any).percentageWeightMin !== undefined
        ? ((material as any).percentageWeightMin + (material as any).percentageWeightMax) / 2
        : material.percentageWeight
      
      const weightKg = totalWeightKg * percentageWeight
      const recoveryRate = (material.recoveryRate || 0) * conditionMultiplier
      const recoveredKg = weightKg * recoveryRate
      const totalValue = getMaterialValue(material, weightKg, ratesData.lmePrices)
      
      materials.push({
        name: material.name,
        weightKg,
        recoveryRate,
        recoveredKg,
        totalValue,
        dataNote: material.dataNote
      })
      
      grossRecovery += totalValue
    }
  }

  const processingCost = grossRecovery * ratesData.processingCostPercent
  const netValue = grossRecovery - processingCost
  const marginPct = grossRecovery > 0 ? (netValue / grossRecovery) * 100 : 0

  let light: TrafficLight = 'GREEN'
  if (marginPct < 5) light = 'RED'
  else if (marginPct < 20) light = 'YELLOW'

  const destCountry = countries.find((c: any) => c.code === destCode)
  const baselWarning = destCountry ? 
    ('Verify Basel notification requirements for ' + stream.name + ' to ' + destCountry.name + '.') : undefined

  return {
    streamName: stream.name,
    totalWeightKg,
    materials,
    grossRecovery,
    processingCost,
    netValue,
    marginPct,
    light,
    baselWarning
  }
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtUSD(n: number): string {
  return '$' + fmt(Math.round(n))
}

export default function EWasteMaterialRecovery() {
  const [quantity, setQuantity] = useState('')
  const [stream, setStream] = useState('')
  const [condition, setCondition] = useState('')
  const [dest, setDest] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateSubmitting, setGateSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(data => {
        const allCountries = [...(data.parties || []), ...(data.nonParties || [])]
        setCountries(allCountries.map((c: any) => ({ code: c.code, name: c.name })))
        setCountriesLoading(false)
      })
      .catch(() => {
        setCountries([])
        setCountriesLoading(false)
      })
  }, [])

  useEffect(() => {
    const q = parseFloat(quantity)
    const r = calculate(stream, q, condition, dest, countries)
    setResult(r)
    setGateUnlocked(false)
  }, [quantity, stream, condition, dest, countries])

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gateEmail) return
    setGateSubmitting(true)
    console.log('[DexMetal] E-Waste Recovery report requested:', { name: gateName, email: gateEmail, quantity, stream, condition, dest })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({ name: gateName, email: gateEmail, quantity, stream, condition, dest, tool: 'ewaste-material-recovery', ts: new Date().toISOString() })
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail, name: gateName || undefined, tool: 'ewaste-material-recovery', timestamp: new Date().toISOString() })
      }).catch(console.error)
      localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
  }

  const selectedStream = ratesData.wasteStreams.find((s: any) => s.id === stream)

  return (
    <div className="font-body" style={{ backgroundColor: '#1C1B18', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', backgroundColor: '#0d3326', padding: '3px 10px', borderRadius: '20px' }}>
              Free Tool
            </span>
          </div>
          <h1 className="font-display font-bold" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            E-Waste Material Recovery Estimator
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Estimate the recoverable material value from your e-waste shipment — copper, gold, lead, silver and more — before you trade.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button onClick={() => { setStream('mixed_ewaste'); setQuantity('10'); setCondition('Average'); setDest('DE'); }} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#1D9E75', border: '1px solid #1D9E75', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Load example: 10t mixed e-waste → Germany →
          </button>
        </div>
        <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #3a3a38' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Waste Stream
              </label>
              <select
                value={stream} onChange={(e) => setStream(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: stream ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
              >
                <option value="" disabled>Select waste stream...</option>
                {ratesData.wasteStreams.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quantity (metric tonnes)
                </label>
                <input
                  type="number" min="0.1" step="0.1" placeholder="e.g. 5"
                  value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Condition
                </label>
                <select
                  value={condition} onChange={(e) => setCondition(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: condition ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
                >
                  <option value="" disabled>Select condition...</option>
                  <option value="Good">Good — Clean, sorted, minimal contamination</option>
                  <option value="Average">Average — Some mixing, moderate contamination</option>
                  <option value="Poor">Poor — Highly mixed, high contamination</option>
                </select>
                {condition && (
                  <p style={{ marginTop: '4px', fontSize: '11px', color: '#1D9E75' }}>
                    Recovery multiplier: {((ratesData.conditionMultipliers as any)[condition] || 1.0) * 100}%
                  </p>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Destination Country
              </label>
              <select
                value={dest} onChange={(e) => setDest(e.target.value)}
                disabled={countriesLoading}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: dest ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
              >
                <option value="" disabled>{countriesLoading ? 'Loading countries...' : 'Select destination...'}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{
              backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px',
              border: '1px solid ' + LIGHT_CONFIG[result.light].border,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  padding: '4px 12px', borderRadius: '20px',
                  backgroundColor: LIGHT_CONFIG[result.light].bg,
                  color: LIGHT_CONFIG[result.light].color,
                  border: '1px solid ' + LIGHT_CONFIG[result.light].border,
                }}>
                  {LIGHT_CONFIG[result.light].label}
                </span>
                <span style={{ fontSize: '12px', color: '#a0a09a' }}>
                  {fmt(parseFloat(quantity))}t · {condition} · {selectedStream?.name}
                </span>
              </div>
              <p style={{ color: '#a0a09a', fontSize: '13px', marginBottom: '20px' }}>
                {LIGHT_CONFIG[result.light].desc}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Total Weight</p>
                  <p style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>{fmt(result.totalWeightKg / 1000, 2)}t</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>{fmt(result.totalWeightKg)} kg</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Gross Recovery Value</p>
                  <p style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>{fmtUSD(result.grossRecovery)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>Before processing costs</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Processing Cost (est.)</p>
                  <p style={{ color: '#FF5C00', fontSize: '1.4rem', fontWeight: 700 }}>-{fmtUSD(result.processingCost)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>{ratesData.processingCostPercent * 100}% of gross</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px', border: '1px solid ' + LIGHT_CONFIG[result.light].border }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Net Estimated Value</p>
                  <p style={{ color: LIGHT_CONFIG[result.light].color, fontSize: '1.4rem', fontWeight: 700 }}>{fmtUSD(result.netValue)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>{fmt(result.marginPct, 1)}% margin</p>
                </div>
              </div>
            </div>

            {!gateUnlocked && (
              <div style={{
                backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '20px 28px',
                border: '1px solid #3a3a38', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Full material breakdown available</p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>Detailed material-by-material recovery table · Basel compliance check</p>
                </div>
                <button
                  onClick={() => setShowGate(true)}
                  style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  Get full report →
                </button>
              </div>
            )}

            {gateUnlocked && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {result.materials.length > 0 && (
                  <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                    <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                      Material Breakdown
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #3a3a38', color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span>Material</span>
                        <span>Weight</span>
                        <span>Recovery</span>
                        <span>Recovered</span>
                        <span>Value</span>
                      </div>
                      {result.materials.map((m, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', padding: '12px 0', borderBottom: i < result.materials.length - 1 ? '1px solid #3a3a38' : 'none', alignItems: 'center' }}>
                          <div>
                            <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>{m.name}</p>
                            {m.dataNote && <p style={{ color: '#a0a09a', fontSize: '10px', marginTop: '2px' }}>{m.dataNote}</p>}
                          </div>
                          <p style={{ color: '#a0a09a', fontSize: '12px' }}>{fmt(m.weightKg)} kg</p>
                          <p style={{ color: '#a0a09a', fontSize: '12px' }}>{Math.round(m.recoveryRate * 100)}%</p>
                          <p style={{ color: '#a0a09a', fontSize: '12px' }}>{fmt(m.recoveredKg)} kg</p>
                          <p style={{ color: m.totalValue >= 0 ? '#1D9E75' : '#FF5C00', fontSize: '13px', fontWeight: 600 }}>{fmtUSD(m.totalValue)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.baselWarning && (
                  <div style={{ borderLeft: '3px solid #f5c518', backgroundColor: '#222200', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
                    <p style={{ color: '#f5c518', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Basel Compliance Check
                    </p>
                    <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
                      {result.baselWarning}{' '}
                      <Link href="/tools/basel-navigator" style={{ color: '#1D9E75', textDecoration: 'underline' }}>Check requirements in Basel Navigator →</Link>
                    </p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { href: '/tools/ulab-export-calculator', title: 'ULAB Export Calc', desc: 'Lead battery value estimator', color: '#FF5C00' },
                    { href: '/tools/ewaste-route-mapper', title: 'E-Waste Route Mapper', desc: 'Check route compliance', color: '#1D9E75' },
                    { href: '/tools/basel-navigator', title: 'Basel Navigator', desc: 'Build notification docs', color: '#FF5C00' },
                  ].map((card) => (
                    <Link key={card.href} href={card.href} style={{ display: 'block', padding: '14px 16px', backgroundColor: '#2c2c2a', borderRadius: '10px', borderLeft: '3px solid ' + card.color, textDecoration: 'none' }}>
                      <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>{card.title}</p>
                      <p style={{ color: '#a0a09a', fontSize: '11px', marginBottom: '8px' }}>{card.desc}</p>
                      <span style={{ color: card.color, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: '14px 18px', backgroundColor: '#222220', borderRadius: '8px', border: '1px solid #3a3a38' }}>
              <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.6 }}>
                <strong style={{ color: '#e0e0da' }}>Disclaimer:</strong> Material recovery rates and values are estimates only. Verify current LME prices before making commercial decisions. This is not financial advice.
              </p>
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


        {showGate && (
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowGate(false) }}
          >
            <div style={{ backgroundColor: '#2c2c2a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid #3a3a38' }}>
              <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}>
                Get your full material recovery report
              </h2>
              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your email to unlock the detailed material breakdown and Basel compliance check. Free — no spam.
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

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #3a3a38' }}>
          <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.6 }}>
            E-Waste classification and compliance:{' '}
            <Link href="/tools/ewaste-route-mapper" style={{ color: '#1D9E75' }}>E-Waste Route Risk Mapper →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}