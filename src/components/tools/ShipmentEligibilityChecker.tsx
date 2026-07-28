'use client'

import { useState, useRef, useEffect } from 'react'
import eligibilityData from '@/data/shipment-eligibility.json'
import Link from 'next/link'
import ShepherdTour, { TourStep } from './ShepherdTour'
import TooltipTerm from '@/components/ui/TooltipTerm'

const CA_API_KEY = 'bca_df927e76febd60b7f97be6e73a3aed205d1b6a0592a97f10'

const ANNEX_VII: string[] = eligibilityData.annexVII
const NON_PARTIES: string[] = eligibilityData.nonParties
const HAZARDOUS_WASTE: string[] = eligibilityData.wasteCategoryHazardous

const WASTE_CATEGORIES = [
  { value: 'ULAB', label: 'Used Lead-Acid Batteries (ULAB)', annex: 'Annex II (Y31/Y32)' },
  { value: 'E-waste', label: 'E-waste / Electronic Scrap', annex: 'Annex I (Y10)' },
  { value: 'Mixed Municipal Waste', label: 'Mixed Municipal Waste', annex: 'Annex II (Y46)' },
  { value: 'Hazardous Waste', label: 'Hazardous Waste (general)', annex: 'Annex I / Annex III' },
  { value: 'Plastic Waste', label: 'Plastic Waste', annex: 'Annex II / Annex IX (B3011)' },
]

const BASEL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AO', name: 'Angola' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' },
  { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' }, { code: 'BJ', name: 'Benin' },
  { code: 'BO', name: 'Bolivia' }, { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' }, { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, DRC' }, { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" }, { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' }, { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' },
  { code: 'GT', name: 'Guatemala' }, { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
  { code: 'HN', name: 'Honduras' }, { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' }, { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' }, { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' }, { code: 'KR', name: 'South Korea' },
  { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' },
  { code: 'MD', name: 'Moldova' }, { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' }, { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' }, { code: 'RW', name: 'Rwanda' },
  { code: 'WS', name: 'Samoa' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' },
  { code: 'SL', name: 'Sierra Leone' }, { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' },
  { code: 'ZA', name: 'South Africa' }, { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'SR', name: 'Suriname' },
  { code: 'SZ', name: 'Eswatini' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' },
  { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' }, { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' },
  { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States (non-party)' },
  { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' }, { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' },
]

type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'RESTRICTED' | 'HIGH_RISK'

interface EligibilityResult {
  status: EligibilityStatus
  reason: string
  annex: string
  pic: boolean
  documents: string[]
}

interface CAData {
  name?: string
  department?: string
  email?: string
  phone?: string
  address?: string
  country?: string
}

function checkEligibility(waste: string, origin: string, dest: string): EligibilityResult {
  if (origin === dest) {
    return {
      status: 'NOT_ELIGIBLE',
      reason: 'Not an international shipment — Basel Convention applies to transboundary movements only.',
      annex: 'Article 2(3)',
      pic: false,
      documents: [],
    }
  }

  const originNonParty = NON_PARTIES.includes(origin)
  const destNonParty = NON_PARTIES.includes(dest)

  if (originNonParty || destNonParty) {
    const which = originNonParty ? 'Origin' : 'Destination'
    return {
      status: 'HIGH_RISK',
      reason: `${which} country is not a Basel Convention party — shipment proceeds outside Convention protections (Article 11 bilateral agreement may apply).`,
      annex: 'Article 11',
      pic: false,
      documents: [
        'Bilateral or multilateral agreement (if any)',
        'National import/export permits from both countries',
        'Carrier transport declaration',
        'Waste characterization report',
      ],
    }
  }

  const originA7 = ANNEX_VII.includes(origin)
  const destA7 = ANNEX_VII.includes(dest)
  const isHazardous = HAZARDOUS_WASTE.includes(waste)

  // Basel Ban Amendment: Annex VII → non-Annex VII, hazardous waste
  if (originA7 && !destA7 && isHazardous) {
    return {
      status: 'NOT_ELIGIBLE',
      reason:
        'Destination country has banned hazardous waste imports from OECD/EU countries under the Basel Ban Amendment (Article 4A). This shipment is prohibited.',
      annex: 'Annex VII / Article 4A (Basel Ban Amendment)',
      pic: false,
      documents: [],
    }
  }

  // Plastic Waste to non-OECD
  if (waste === 'Plastic Waste' && !destA7) {
    return {
      status: 'RESTRICTED',
      reason:
        'Non-hazardous plastic waste exports to non-OECD countries require Prior Informed Consent under the Basel Plastic Waste Amendments (2021).',
      annex: 'Annex II / Annex IX B3011 (Plastic Waste Amendments 2021)',
      pic: true,
      documents: [
        'PIC consent letter from destination Competent Authority',
        'Waste composition and contamination analysis',
        'Annex IX B3011 classification documentation',
        'Basel notification document',
        'Carrier authorization certificate',
        'Financial guarantee / insurance',
        'Recovery facility permit',
      ],
    }
  }

  // Both Annex VII (OECD–OECD)
  if (originA7 && destA7) {
    return {
      status: 'RESTRICTED',
      reason:
        'OECD Decision C(2001)107/FINAL applies — hazardous waste trade permitted between OECD countries with prior notification and written consent from both Competent Authorities.',
      annex: 'OECD Decision C(2001)107 / Annex IX',
      pic: true,
      documents: [
        'OECD notification form (Annex 1A)',
        'Written consent from both Competent Authorities',
        'Waste characterization and analysis report',
        'Carrier authorization certificate',
        'Financial guarantee / insurance',
        'Recovery or disposal facility permit',
        'Movement document',
      ],
    }
  }

  // ULAB between Basel parties
  if (waste === 'ULAB') {
    return {
      status: 'RESTRICTED',
      reason:
        'Used Lead-Acid Batteries are classified under Annex II (Y31/Y32) — transboundary movement requires Prior Informed Consent from the destination Competent Authority.',
      annex: 'Annex II (Y31 / Y32) / Article 6',
      pic: true,
      documents: [
        'Basel notification document',
        'PIC consent from destination Competent Authority',
        'UN3077 / UN3090 transport declaration',
        'Waste characterization and composition report',
        'Carrier authorization (road/sea/air as applicable)',
        'Financial guarantee / insurance certificate',
        'Recovery facility permit (R4/R5 operation)',
        'Exporter/generator declaration',
      ],
    }
  }

  // Default: between Basel parties
  return {
    status: 'RESTRICTED',
    reason:
      'Transboundary movement is subject to Basel Convention Article 6 — Prior Informed Consent from the destination Competent Authority is required before shipment.',
    annex: 'Article 6 / Annex I',
    pic: true,
    documents: [
      'Basel notification document',
      'PIC consent from destination Competent Authority',
      'Waste characterization and analysis report',
      'Carrier authorization certificate',
      'Financial guarantee / insurance',
      'Recovery or disposal facility permit',
      'Movement document',
      'Exporter/generator declaration',
    ],
  }
}

const STATUS_CONFIG: Record<EligibilityStatus, { label: string; bg: string; color: string; border: string }> = {
  ELIGIBLE: { label: 'ELIGIBLE', bg: '#0d3326', color: '#1D9E75', border: '#1D9E75' },
  NOT_ELIGIBLE: { label: 'NOT ELIGIBLE', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00' },
  RESTRICTED: { label: 'RESTRICTED', bg: '#2a2200', color: '#f5c518', border: '#f5c518' },
  HIGH_RISK: { label: 'HIGH RISK', bg: '#3a1200', color: '#FF5C00', border: '#FF5C00' },
}

interface SearchDropdownProps {
  value: string
  onChange: (code: string) => void
  options: { code: string; name: string }[]
  placeholder: string
  id: string
}

function SearchDropdown({ value, onChange, options, placeholder, id }: SearchDropdownProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.code === value)
  const filtered = query
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }} id={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: '#2c2c2a',
          border: '1px solid #3a3a38',
          borderRadius: '8px',
          color: selected ? '#ffffff' : '#a0a09a',
          fontSize: '14px',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'inherit',
        }}
      >
        <span>{selected ? selected.name : placeholder}</span>
        <span style={{ color: '#a0a09a', fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: '#2c2c2a',
            border: '1px solid #3a3a38',
            borderRadius: '8px',
            marginTop: '4px',
            maxHeight: '240px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '8px' }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country..."
              style={{
                width: '100%',
                padding: '7px 10px',
                backgroundColor: '#1C1B18',
                border: '1px solid #3a3a38',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 14px', color: '#a0a09a', fontSize: '13px' }}>No results</div>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.code}
                  type="button"
                  onClick={() => { onChange(o.code); setQuery(''); setOpen(false) }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    backgroundColor: o.code === value ? '#1D9E7520' : 'transparent',
                    border: 'none',
                    color: o.code === value ? '#1D9E75' : '#e0e0da',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {o.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const SHIPMENT_TOUR_STEPS: TourStep[] = [
  { text: 'Select your waste type — ULAB, E-waste, Plastic Waste, and more. Each category triggers different Basel rules.', attachTo: { element: '#tour-waste-select', on: 'bottom' } },
  { text: 'Choose the origin country where the shipment will depart from.', attachTo: { element: '#origin-dropdown', on: 'bottom' } },
  { text: 'Choose the destination country that will receive the shipment.', attachTo: { element: '#dest-dropdown', on: 'bottom' } },
  { text: 'Click Check Eligibility to get an instant Basel compliance ruling — including Ban Amendment and PIC requirements.', attachTo: { element: '#tour-check-btn', on: 'top' } },
  { text: 'Or click Load Example to pre-fill a ULAB · Trinidad → Germany shipment and see a completed result right away.', attachTo: { element: '#tour-load-example', on: 'bottom' } },
]

export default function ShipmentEligibilityChecker() {
  const [waste, setWaste] = useState('')
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateSubmitting, setGateSubmitting] = useState(false)
  const [caData, setCaData] = useState<CAData | null>(null)
  const [caLoading, setCaLoading] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const canCheck = waste && origin && dest

  function handleCheck() {
    if (!canCheck) return
    const r = checkEligibility(waste, origin, dest)
    setResult(r)
    setGateUnlocked(false)
    setShowGate(false)
    setCaData(null)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  async function fetchCA(countryCode: string) {
    setCaLoading(true)
    try {
      const res = await fetch(`https://api.dexmetal.com/api/v1/ca/${countryCode}`, {
        headers: { 'X-API-Key': CA_API_KEY },
      })
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      setCaData(data)
    } catch {
      setCaData(null)
    } finally {
      setCaLoading(false)
    }
  }

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gateEmail) return
    setGateSubmitting(true)
    console.log('[DexMetal] Eligibility report requested:', { name: gateName, email: gateEmail, waste, origin, dest })
    await new Promise((r) => setTimeout(r, 600))
    const stored = JSON.parse(localStorage.getItem('dexmetal_leads') || '[]')
    stored.push({ name: gateName, email: gateEmail, waste, origin, dest, ts: new Date().toISOString() })
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail, name: gateName || undefined, tool: 'shipment-eligibility-checker', timestamp: new Date().toISOString() })
      }).catch(console.error)
      localStorage.setItem('dexmetal_leads', JSON.stringify(stored))
    fetch('/api/resend-tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: gateEmail, tag: 'tool_shipment_eligibility' }),
    }).catch(console.error)
    setGateUnlocked(true)
    setShowGate(false)
    setGateSubmitting(false)
    if (dest) fetchCA(dest)
  }

  function handleLoadExample() {
    const w = 'ULAB', o = 'TT', d = 'DE'
    setWaste(w); setOrigin(o); setDest(d)
    const r = checkEligibility(w, o, d)
    setResult(r); setGateUnlocked(false); setShowGate(false); setCaData(null)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const originName = BASEL_COUNTRIES.find((c) => c.code === origin)?.name || origin
  const destName = BASEL_COUNTRIES.find((c) => c.code === dest)?.name || dest
  const wasteLabel = WASTE_CATEGORIES.find((w) => w.value === waste)?.label || waste

  return (
    <div className="font-body" style={{ backgroundColor: '#1C1B18', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', backgroundColor: '#0d3326', padding: '3px 10px', borderRadius: '20px' }}>
                Free Tool
              </span>
            </div>
            <ShepherdTour steps={SHIPMENT_TOUR_STEPS} tourKey="shipment-eligibility" />
          </div>
          <h1 className="font-display font-bold" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Shipment Eligibility Checker
          </h1>
          <p className="font-body" style={{ color: '#a0a09a', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
            Determine whether your waste shipment is permitted under the Basel Convention — including Ban Amendment rules, OECD controls, and plastic waste amendments.
          </p>
        </div>

        {/* Form */}
        <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #3a3a38' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Load Example */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="tour-load-example"
                onClick={handleLoadExample}
                style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#1D9E75', border: '1px solid #1D9E75', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Load example: ULAB · Trinidad → Germany
              </button>
            </div>

            {/* Waste Category */}
            <div>
              <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Waste Category
              </label>
              <select
                id="tour-waste-select"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1C1B18',
                  border: '1px solid #3a3a38',
                  borderRadius: '8px',
                  color: waste ? '#ffffff' : '#a0a09a',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  appearance: 'none',
                  outline: 'none',
                }}
              >
                <option value="" disabled>Select waste category...</option>
                {WASTE_CATEGORIES.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
              {waste && (
                <p style={{ marginTop: '5px', fontSize: '12px', color: '#1D9E75' }}>
                  Basel classification: {WASTE_CATEGORIES.find((w2) => w2.value === waste)?.annex}
                </p>
              )}
            </div>

            {/* Countries row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Origin Country
                </label>
                <SearchDropdown
                  id="origin-dropdown"
                  value={origin}
                  onChange={setOrigin}
                  options={BASEL_COUNTRIES}
                  placeholder="Select origin..."
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#a0a09a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Destination Country
                </label>
                <SearchDropdown
                  id="dest-dropdown"
                  value={dest}
                  onChange={setDest}
                  options={BASEL_COUNTRIES}
                  placeholder="Select destination..."
                />
              </div>
            </div>

            <button
              id="tour-check-btn"
              onClick={handleCheck}
              disabled={!canCheck}
              style={{
                padding: '12px 24px',
                backgroundColor: canCheck ? '#1D9E75' : '#3a3a38',
                color: canCheck ? '#ffffff' : '#a0a09a',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: canCheck ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
                transition: 'background-color 0.15s',
              }}
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div ref={resultRef} style={{ marginBottom: '24px' }}>
            {/* Status badge + summary */}
            <div
              style={{
                backgroundColor: '#2c2c2a',
                borderRadius: '12px',
                padding: '24px 28px',
                border: `1px solid ${STATUS_CONFIG[result.status].border}`,
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: STATUS_CONFIG[result.status].bg,
                        color: STATUS_CONFIG[result.status].color,
                        border: `1px solid ${STATUS_CONFIG[result.status].border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {STATUS_CONFIG[result.status].label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#a0a09a' }}>
                      {wasteLabel} · {originName} → {destName}
                    </span>
                  </div>
                  <p style={{ color: '#e0e0da', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
                    {result.reason}
                  </p>
                  <p style={{ fontSize: '12px', color: '#1D9E75', fontWeight: 500 }}>
                    Applies: {result.annex}
                  </p>
                </div>
              </div>
            </div>

            {/* View Full Report CTA */}
            {result.status !== 'NOT_ELIGIBLE' && result.documents.length > 0 && !gateUnlocked && (
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
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    Full compliance report available
                  </p>
                  <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                    <TooltipTerm term="Competent Authority" /> contacts · Required documents · <TooltipTerm term="PIC">PIC</TooltipTerm> checklist
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

            {/* Gated content — unlocked */}
            {gateUnlocked && result.documents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Competent Authority */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                    Destination <TooltipTerm term="Competent Authority">Competent Authority</TooltipTerm>
                  </h3>
                  {caLoading ? (
                    <p style={{ color: '#a0a09a', fontSize: '13px' }}>Loading CA data...</p>
                  ) : caData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {caData.name && <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>{caData.name}</p>}
                      {caData.department && <p style={{ color: '#a0a09a', fontSize: '13px' }}>{caData.department}</p>}
                      {caData.email && (
                        <p style={{ fontSize: '13px' }}>
                          <span style={{ color: '#a0a09a' }}>Email: </span>
                          <a href={`mailto:${caData.email}`} style={{ color: '#1D9E75' }}>{caData.email}</a>
                        </p>
                      )}
                      {caData.phone && (
                        <p style={{ color: '#a0a09a', fontSize: '13px' }}>Phone: {caData.phone}</p>
                      )}
                      {caData.address && (
                        <p style={{ color: '#a0a09a', fontSize: '13px' }}>{caData.address}</p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: '#a0a09a', fontSize: '13px' }}>
                      CA data not available for this country.{' '}
                      <a href="https://www.basel.int/Countries/NationalAuthorities/tabid/252/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: '#1D9E75' }}>
                        Search Basel Convention directory →
                      </a>
                    </p>
                  )}
                </div>

                {/* PIC requirement */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
                    Prior Informed Consent (<TooltipTerm term="PIC">PIC</TooltipTerm>)
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: result.pic ? '#0d3326' : '#2a2a28',
                      color: result.pic ? '#1D9E75' : '#a0a09a',
                      border: `1px solid ${result.pic ? '#1D9E75' : '#3a3a38'}`,
                    }}>
                      {result.pic ? 'REQUIRED' : 'NOT REQUIRED'}
                    </span>
                    <p style={{ color: '#a0a09a', fontSize: '13px' }}>
                      {result.pic
                        ? <>You must obtain written consent from the destination <TooltipTerm term="Competent Authority">Competent Authority</TooltipTerm> before shipment.</>
                        : <><TooltipTerm term="PIC">PIC</TooltipTerm> is not required for this route, but notification may still apply.</>}
                    </p>
                  </div>
                </div>

                {/* Required documents */}
                <div style={{ backgroundColor: '#2c2c2a', borderRadius: '12px', padding: '24px 28px', border: '1px solid #3a3a38' }}>
                  <h3 className="font-display" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                    Required Documents Checklist
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.documents.map((doc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: '#1D9E75', fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#e0e0da', fontSize: '13px', lineHeight: 1.5 }}>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div
                  style={{
                    backgroundColor: '#0d3326',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    border: '1px solid #1D9E75',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      Ready to generate your notification document?
                    </p>
                    <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                      Use the Basel Form Assistant to build and export your official movement document.
                    </p>
                  </div>
                  <Link
                    href="/tools/basel-navigator"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#1D9E75',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Generate Notification Document →
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
              </div>
            )}
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
            onClick={(e) => { if (e.target === e.currentTarget) setShowGate(false) }}
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
              <h2 className="font-display font-bold" style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}>
                Get the Full Report
              </h2>
              <p style={{ color: '#a0a09a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your email to unlock the <TooltipTerm term="Competent Authority">Competent Authority</TooltipTerm> contacts, required documents checklist, and <TooltipTerm term="PIC">PIC</TooltipTerm> guidance for this route. Free — no spam.
              </p>
              <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

        {/* Footer note */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #3a3a38' }}>
          <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.6 }}>
            This tool provides guidance based on Basel Convention treaty text and is not legal advice.
            Eligibility determinations may vary by national implementing legislation.{' '}
            <Link href="/tools/basel-navigator" style={{ color: '#1D9E75' }}>
              Generate your notification document →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
