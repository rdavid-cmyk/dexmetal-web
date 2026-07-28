'use client'

import { useState, useEffect } from 'react'
import ratesData from '@/data/ulab-export.json'
import Link from 'next/link'

type TrafficLight = 'GREEN' | 'YELLOW' | 'RED'

interface CalcResult {
  leadContentKg: number
  leadContentTonnes: number
  grossRecovery: number
  logisticsCost: number
  netValue: number
  marginPct: number
  light: TrafficLight
}

const CONDITIONS = ['Whole Uncracked', 'Cracked/Drained', 'Mixed']

function getRegion(originCode: string): string {
  return ratesData.originRegions[originCode as keyof typeof ratesData.originRegions] || 'Other'
}

function getLogisticsRate(originCode: string, dest: string): number {
  const region = getRegion(originCode)
  const rates = ratesData.logisticsRates[region as keyof typeof ratesData.logisticsRates]
  return rates[dest as keyof typeof rates] ?? 250
}

function calculate(
  quantityT: number,
  condition: string,
  originCode: string,
  dest: string,
  lmePrice: number,
): CalcResult | null {
  if (!quantityT || quantityT <= 0 || !condition || !originCode || !dest || !lmePrice) return null

  const leadFactor = ratesData.recoveryFactors[condition as keyof typeof ratesData.recoveryFactors] ?? 0.57
  const leadContentTonnes = quantityT * leadFactor
  const leadContentKg = leadContentTonnes * 1000
  const grossRecovery = leadContentTonnes * lmePrice * ratesData.smelterRecoveryRate
  const logisticsRatePerTonne = getLogisticsRate(originCode, dest)
  const logisticsCost = quantityT * logisticsRatePerTonne
  const netValue = grossRecovery - logisticsCost
  const marginPct = grossRecovery > 0 ? (netValue / grossRecovery) * 100 : 0

  let light: TrafficLight = 'GREEN'
  if (marginPct < 0) light = 'RED'
  else if (marginPct < 15) light = 'YELLOW'

  return { leadContentKg, leadContentTonnes, grossRecovery, logisticsCost, netValue, marginPct, light }
}

const LIGHT_CONFIG: Record<TrafficLight, { label: string; bg: string; color: string; border: string; desc: string }> = {
  GREEN: { label: 'VIABLE', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75', desc: 'Margin above 15% — shipment is commercially viable at current LME price.' },
  YELLOW: { label: 'MARGINAL', bg: '#2a2200', color: '#f5c518', border: '#f5c518', desc: 'Margin below 15% — viable but thin. Small LME moves or cost overruns could erode profitability.' },
  RED: { label: 'NOT VIABLE', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00', desc: 'Net value is negative at current LME price and logistics estimate.' },
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtUSD(n: number): string {
  return '$' + fmt(Math.round(n))
}

export default function ULABExportCalculator() {
  const [quantity, setQuantity] = useState('')
  const [condition, setCondition] = useState('')
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [lme, setLme] = useState(String(ratesData.defaultLmePrice))
  const [result, setResult] = useState<CalcResult | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateSubmitting, setGateSubmitting] = useState(false)

  useEffect(() => {
    const q = parseFloat(quantity)
    const l = parseFloat(lme)
    const r = calculate(q, condition, origin, dest, l)
    setResult(r)
    setGateUnlocked(false)
  }, [quantity, condition, origin, dest, lme])

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gateEmail) return
    setGateSubmitting(true)
    console.log('[DexMetal] ULAB Export report requested:', { name: gateName, email: gateEmail, quantity, condition, origin, dest, lme })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({ name: gateName, email: gateEmail, quantity, condition, origin, dest, lme, tool: 'ulab-export-calculator', ts: new Date().toISOString() })
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail, name: gateName || undefined, tool: 'ulab-export-calculator', timestamp: new Date().toISOString() })
      }).catch(console.error)
      localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
  }

  const baselCostMid = (ratesData.baselComplianceCostLow + ratesData.baselComplianceCostHigh) / 2

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
            ULAB Export Calculator
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Estimate the value of your used lead-acid battery shipment and whether it is commercially viable after logistics costs.
          </p>
        </div>

        {/* Inputs */}
        <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #3a3a38' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Row 1: Quantity + LME */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quantity (metric tonnes)
                </label>
                <input
                  type="number" min="0.1" step="0.1" placeholder="e.g. 10"
                  value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LME Lead Price (USD/tonne)
                </label>
                <input
                  type="number" min="0" step="10" placeholder="1950"
                  value={lme} onChange={(e) => setLme(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
                <p style={{ marginTop: '4px', fontSize: '11px', color: '#a0a09a' }}>Default: $1,950/t — update with today&apos;s price</p>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Battery Condition
              </label>
              <select
                value={condition} onChange={(e) => setCondition(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: condition ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
              >
                <option value="" disabled>Select condition...</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {condition && (
                <p style={{ marginTop: '4px', fontSize: '11px', color: '#1D9E75' }}>
                  Lead content factor: {Math.round((ratesData.recoveryFactors[condition as keyof typeof ratesData.recoveryFactors] ?? 0.57) * 100)}% of battery weight
                </p>
              )}
            </div>

            {/* Origin + Destination */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Origin Country
                </label>
                <select
                  value={origin} onChange={(e) => setOrigin(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: origin ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
                >
                  <option value="" disabled>Select origin...</option>
                  {ratesData.originCountries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Destination Country
                </label>
                <select
                  value={dest} onChange={(e) => setDest(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1C1B18', border: '1px solid #3a3a38', borderRadius: '8px', color: dest ? '#ffffff' : '#a0a09a', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
                >
                  <option value="" disabled>Select destination...</option>
                  {ratesData.destinationCountries.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results — live */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Traffic light + summary */}
            <div style={{
              backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px',
              border: `1px solid ${LIGHT_CONFIG[result.light].border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  padding: '4px 12px', borderRadius: '20px',
                  backgroundColor: LIGHT_CONFIG[result.light].bg,
                  color: LIGHT_CONFIG[result.light].color,
                  border: `1px solid ${LIGHT_CONFIG[result.light].border}`,
                }}>
                  {LIGHT_CONFIG[result.light].label}
                </span>
                <span style={{ fontSize: '12px', color: '#a0a09a' }}>
                  {fmt(parseFloat(quantity))}t · {condition} · {ratesData.originCountries.find(c => c.code === origin)?.name} → {dest}
                </span>
              </div>
              <p style={{ color: '#a0a09a', fontSize: '13px', marginBottom: '20px' }}>
                {LIGHT_CONFIG[result.light].desc}
              </p>

              {/* Key metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Lead Content</p>
                  <p style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>{fmt(result.leadContentTonnes, 2)}t</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>{fmt(result.leadContentKg)} kg</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Gross Recovery Value</p>
                  <p style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>{fmtUSD(result.grossRecovery)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>At LME ${fmt(parseFloat(lme))}/t × 85% recovery</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Est. Logistics Cost</p>
                  <p style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700 }}>{fmtUSD(result.logisticsCost)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>${fmt(getLogisticsRate(origin, dest))}/tonne for this route</p>
                </div>
                <div style={{ backgroundColor: '#1C1B18', borderRadius: '8px', padding: '14px 16px', border: `1px solid ${LIGHT_CONFIG[result.light].border}` }}>
                  <p style={{ color: '#a0a09a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Net Est. Value</p>
                  <p style={{ color: LIGHT_CONFIG[result.light].color, fontSize: '1.4rem', fontWeight: 700 }}>{fmtUSD(result.netValue)}</p>
                  <p style={{ color: '#a0a09a', fontSize: '11px' }}>{fmt(result.marginPct, 1)}% margin (before Basel costs)</p>
                </div>
              </div>
            </div>

            {/* View full breakdown CTA */}
            {!gateUnlocked && (
              <div style={{
                backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '20px 28px',
                border: '1px solid #3a3a38', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Full cost breakdown available</p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>Basel compliance costs · Net margin % · Compliance action plan</p>
                </div>
                <button
                  onClick={() => setShowGate(true)}
                  style={{ padding: '10px 20px', backgroundColor: '#FF5C00', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  View Full Breakdown →
                </button>
              </div>
            )}

            {/* Gated content */}
            {gateUnlocked && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Full cost table */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                    Full Cost Breakdown
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                      { label: 'Lead recovery value (gross)', value: fmtUSD(result.grossRecovery), note: `${fmt(result.leadContentTonnes, 2)}t lead × $${fmt(parseFloat(lme))}/t × 85%`, color: '#1D9E75' },
                      { label: 'Estimated freight cost', value: `–${fmtUSD(result.logisticsCost)}`, note: `$${fmt(getLogisticsRate(origin, dest))}/tonne × ${fmt(parseFloat(quantity))}t`, color: '#FF5C00' },
                      { label: 'Basel compliance est.', value: `–$${fmt(baselCostMid)}`, note: 'Y31/Annex II notification, PIC, movement docs ($800–$2,500 range)', color: '#FF5C00' },
                      { label: 'Net estimated value', value: fmtUSD(result.netValue - baselCostMid), note: 'After freight + compliance (midpoint estimate)', color: LIGHT_CONFIG[result.light].color },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: i < 3 ? '1px solid #3a3a38' : 'none', gap: '12px' }}>
                        <div>
                          <p style={{ color: '#e0e0da', fontSize: '13px', fontWeight: 500 }}>{row.label}</p>
                          <p style={{ color: '#a0a09a', fontSize: '12px', marginTop: '2px' }}>{row.note}</p>
                        </div>
                        <p style={{ color: row.color, fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.value}</p>
                      </div>
                    ))}
                    {/* Margin summary */}
                    <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#1C1B18', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: '#a0a09a', fontSize: '13px' }}>Net margin (after compliance costs)</p>
                      <p style={{ color: LIGHT_CONFIG[result.light].color, fontSize: '14px', fontWeight: 700 }}>
                        {fmt(((result.netValue - baselCostMid) / result.grossRecovery) * 100, 1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basel compliance note */}
                <div style={{ borderLeft: '3px solid #1D9E75', backgroundColor: '#111310', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
                  <p style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Basel Compliance Note
                  </p>
                  <p style={{ color: '#c8c8c2', fontSize: '13px', lineHeight: 1.6 }}>
                    ULAB exports are classified <strong style={{ color: '#ffffff' }}>Y31/Annex II</strong> under the Basel Convention.
                    Prior Informed Consent (PIC) is required from the destination Competent Authority.
                    Estimated documentation costs: <strong style={{ color: '#ffffff' }}>${fmt(ratesData.baselComplianceCostLow)}–${fmt(ratesData.baselComplianceCostHigh)}</strong> depending on complexity and route.
                  </p>
                </div>

                {/* Cross-tool cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { href: '/tools/basel-classification-quickscan', title: 'Confirm ULAB Code', desc: 'Verify Y31 or Y32 classification', color: '#1D9E75' },
                    { href: '/tools/pic-status-checker', title: 'Check PIC Required', desc: 'What consent is needed for this route?', color: '#1D9E75' },
                    { href: '/tools/basel-navigator', title: 'Start Notification Doc', desc: 'Build your official movement document', color: '#FF5C00' },
                  ].map((card) => (
                    <Link key={card.href} href={card.href} style={{ display: 'block', padding: '14px 16px', backgroundColor: '#2c2c2a', borderRadius: '10px', borderLeft: `3px solid ${card.color}`, textDecoration: 'none' }}>
                      <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>{card.title}</p>
                      <p style={{ color: '#a0a09a', fontSize: '11px', marginBottom: '8px' }}>{card.desc}</p>
                      <span style={{ color: card.color, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ padding: '14px 18px', backgroundColor: '#222220', borderRadius: '8px', border: '1px solid #3a3a38' }}>
              <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.6 }}>
                <strong style={{ color: '#e0e0da' }}>Disclaimer:</strong> This calculator provides estimates only. LME prices fluctuate daily. Actual recovery rates vary by smelter contract. Always verify current pricing before making shipment decisions. This is not financial advice.
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


        {/* Email gate modal */}
        {showGate && (
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowGate(false) }}
          >
            <div style={{ backgroundColor: '#2c2c2a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid #3a3a38' }}>
              <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}>
                Get the Full Cost Breakdown
              </h2>
              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your email to unlock the full cost breakdown including Basel compliance costs and net margin. Free — no spam.
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
                  {gateSubmitting ? 'Loading...' : 'Send me the breakdown'}
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
            ULAB classification and compliance requirements:{' '}
            <Link href="/tools/basel-classification-quickscan" style={{ color: '#1D9E75' }}>Basel Classification QuickScan →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
