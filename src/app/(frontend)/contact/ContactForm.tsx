'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', company: '', question: '' })

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setState('success')
    } catch (err: any) {
      setError(err.message)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <section className="mb-10 p-8 rounded-xl text-center" style={{ backgroundColor: '#2c2c2a', border: '1px solid #1D9E75' }}>
        <div style={{ color: '#1D9E75', fontSize: '2rem', marginBottom: '12px' }}>✓</div>
        <h2 className="font-display font-bold text-white text-lg mb-3">Enquiry received.</h2>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
          Check your inbox — a confirmation is on its way. A practitioner-drafted response will follow within 24 hours.
        </p>
      </section>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D9E75]"
  const inputStyle = { backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }
  const labelClass = "block font-body text-sm font-medium text-white mb-1"

  return (
    <section className="mb-10 p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
      <h2 className="font-display font-bold text-white text-lg mb-6">Submit a Question</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Your Name *</label>
            <input id="name" name="name" type="text" required placeholder="e.g. Maria Santos"
              value={form.name} onChange={handle} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email Address *</label>
            <input id="email" name="email" type="email" required placeholder="you@company.com"
              value={form.email} onChange={handle} className={inputClass} style={inputStyle} />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company / Organisation</label>
          <input id="company" name="company" type="text" placeholder="Optional"
            value={form.company} onChange={handle} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} htmlFor="question">Your Basel Compliance Question *</label>
          <textarea id="question" name="question" rows={5} required
            placeholder="Describe your situation, the countries involved, waste type, and what you need guidance on."
            value={form.question} onChange={handle}
            className={`${inputClass} resize-none`} style={inputStyle} />
        </div>

        {state === 'error' && (
          <p className="font-body text-sm" style={{ color: '#FF5C00' }}>
            {error || 'Something went wrong. Please email info@dexmetal.com directly.'}
          </p>
        )}

        <button type="submit" disabled={state === 'loading'}
          className="w-full py-3 rounded-lg font-body font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#1D9E75' }}>
          {state === 'loading' ? 'Sending…' : 'Send Question'}
        </button>
      </form>
      <p className="mt-4 font-body text-xs text-center" style={{ color: '#a0a09a' }}>
        Response within 24 hours · No commitment required
      </p>
    </section>
  )
}
