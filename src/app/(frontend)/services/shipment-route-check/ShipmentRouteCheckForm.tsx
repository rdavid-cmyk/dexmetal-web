'use client'

import { FormEvent, useState } from 'react'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const wasteOptions = [
  'Used lead-acid batteries (ULAB)',
  'Mixed e-waste / electronic scrap',
  'CRT monitors / televisions',
  'Circuit boards / PCBs',
  'Whole used equipment for reuse / refurbishment',
]

const conditionOptions = [
  'Functional / tested working',
  'Damaged / non-functional',
  'Mixed / unknown',
  'Scrap / end-of-life',
]

const operationOptions = [
  'Recycling / recovery',
  'Repair / refurbishment',
  'Reuse / resale',
  'Disposal',
]
const initialForm = {
  name: '', email: '', company: '', wasteType: '', condition: '',
  origin: '', destination: '', originLocation: '', destinationFacility: '', operation: '', transit: '', quantity: '',
  targetDate: '', knownCode: '', notes: '', website: '',
}

export default function ShipmentRouteCheckForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  const setField = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/shipment-route-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setReference(data.reference || '')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setStatus('error')
    }
  }

  const inputClass = 'w-full rounded-lg px-4 py-3 font-body text-white outline-none focus:ring-2 focus:ring-[#1D9E75]'
  const inputStyle = { backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }
  const labelClass = 'mb-1 block font-body text-sm font-medium text-white'

  if (status === 'success') {
    return (
      <section className="rounded-xl p-7" style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}>
        <div className="mb-3 text-3xl" style={{ color: '#1D9E75' }}>✓</div>
        <h2 className="mb-2 font-display text-xl font-bold text-white">Route Check request received.</h2>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#a8c4bb' }}>
          Reference <strong className="text-white">{reference}</strong>. We sent you a confirmation email. Richard will confirm fit and the next step before the $99 Route Check proceeds. No payment has been taken.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a37' }}>
      <h2 className="mb-2 font-display text-xl font-bold text-white">Shipment intake</h2>
      <p className="mb-6 font-body text-sm" style={{ color: '#a0a09a' }}>
        Route facts only. Do not upload notification files, contracts, IDs, or other sensitive documents here.
      </p>
      <form onSubmit={submit} className="space-y-5">
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor="website">Leave empty</label>
          <input id="website" value={form.website} onChange={(e) => setField('website', e.target.value)} tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Your name *</label><input required className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setField('name', e.target.value)} /></div>
          <div><label className={labelClass}>Email *</label><input required type="email" className={inputClass} style={inputStyle} value={form.email} onChange={(e) => setField('email', e.target.value)} /></div>
        </div>
        <div><label className={labelClass}>Company / organisation</label><input className={inputClass} style={inputStyle} value={form.company} onChange={(e) => setField('company', e.target.value)} /></div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Waste / material *</label>
            <select required className={inputClass} style={inputStyle} value={form.wasteType} onChange={(e) => setField('wasteType', e.target.value)}>
              <option value="">Select…</option>{wasteOptions.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition *</label>
            <select required className={inputClass} style={inputStyle} value={form.condition} onChange={(e) => setField('condition', e.target.value)}>
              <option value="">Select…</option>{conditionOptions.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Origin country *</label><input required placeholder="e.g. Trinidad and Tobago" className={inputClass} style={inputStyle} value={form.origin} onChange={(e) => setField('origin', e.target.value)} /></div>
          <div><label className={labelClass}>Destination country *</label><input required placeholder="e.g. Germany" className={inputClass} style={inputStyle} value={form.destination} onChange={(e) => setField('destination', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Dispatch location *</label><input required placeholder="City / region where shipment starts" className={inputClass} style={inputStyle} value={form.originLocation} onChange={(e) => setField('originLocation', e.target.value)} /></div>
          <div><label className={labelClass}>Receiving facility / location *</label><input required placeholder="Facility name + city / region, or Not selected" className={inputClass} style={inputStyle} value={form.destinationFacility} onChange={(e) => setField('destinationFacility', e.target.value)} /></div>
        </div>

        <div>
          <label className={labelClass}>Intended operation *</label>
          <select required className={inputClass} style={inputStyle} value={form.operation} onChange={(e) => setField('operation', e.target.value)}>
            <option value="">Select…</option>{operationOptions.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Planned transit countries / route *</label>
          <input required placeholder="List known transit countries, or enter Unknown / None" className={inputClass} style={inputStyle} value={form.transit} onChange={(e) => setField('transit', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Approx. quantity / weight</label><input placeholder="e.g. 20 tonnes" className={inputClass} style={inputStyle} value={form.quantity} onChange={(e) => setField('quantity', e.target.value)} /></div>
          <div><label className={labelClass}>Target shipment date</label><input placeholder="e.g. November 2026" className={inputClass} style={inputStyle} value={form.targetDate} onChange={(e) => setField('targetDate', e.target.value)} /></div>
        </div>
        <div><label className={labelClass}>Known Basel code, if any</label><input placeholder="e.g. A1160, A1181, Y49" className={inputClass} style={inputStyle} value={form.knownCode} onChange={(e) => setField('knownCode', e.target.value)} /></div>
        <div>
          <label className={labelClass}>Anything else that may affect the route?</label>
          <textarea rows={4} placeholder="National permits already held, intended receiving facility, known restrictions, or questions." className={`${inputClass} resize-none`} style={inputStyle} value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
        </div>

        {status === 'error' && <p className="font-body text-sm" style={{ color: '#FF5C00' }}>{error}</p>}

        <button type="submit" disabled={status === 'loading'} className="w-full rounded-lg px-5 py-3 font-body font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#1D9E75' }}>
          {status === 'loading' ? 'Submitting…' : 'Request the $99 Route Check →'}
        </button>
        <p className="text-center font-body text-xs" style={{ color: '#77736b' }}>
          No payment is collected on this page. Submission is retained privately by DexMetal and triggers an internal alert.
        </p>
      </form>
    </section>
  )
}
