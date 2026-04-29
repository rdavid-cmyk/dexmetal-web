'use client'

import { useState, useEffect, useRef } from 'react'

interface AssetGateProps {
  assetTitle: string
  assetDescription: string
  ctaButtonText: string
  source: string
}

export default function AssetGate({ assetTitle, assetDescription, ctaButtonText, source }: AssetGateProps) {
  const [isLocked, setIsLocked] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dexmetal_email_captured')
    if (stored) {
      setIsLocked(false)
      setSuccess(true)
    }
  }, [])

  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Email is required')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: name || undefined,
          tool: source,
          timestamp: new Date().toISOString()
        })
      })

      if (res.ok) {
        localStorage.setItem('dexmetal_email_captured', 'true')
        localStorage.setItem('dexmetal_email', email)
        setIsLocked(false)
        setSuccess(true)
        setShowGate(false)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="border-b border-[#2f2f2b] bg-[#1C1B18]">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#0d3326' }}>
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="mb-4 font-display text-2xl font-bold text-white">
              Check your inbox!
            </h3>
            <p className="mb-6 text-lg" style={{ color: '#cbc7be' }}>
              We've sent <strong>{assetTitle}</strong> to <span style={{ color: '#1D9E75' }}>{email}</span>.
            </p>
            <p className="text-sm" style={{ color: '#a09e99' }}>
              Not received? Check your spam folder or <button 
                onClick={() => { setSuccess(false); setIsLocked(true); localStorage.removeItem('dexmetal_email_captured') }}
                className="underline hover:text-white"
                style={{ color: '#FF5C00' }}
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-[#2f2f2b]" style={{ backgroundColor: '#171613' }}>
      <div className="container py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
            Free Download
          </p>
          <h3 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            {assetTitle}
          </h3>
          <p className="mb-8 text-lg" style={{ color: '#cbc7be' }}>
            {assetDescription}
          </p>
          
          <button
            onClick={() => setShowGate(true)}
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1D9E75' }}
          >
            {ctaButtonText}
          </button>
        </div>
      </div>

      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-md rounded-2xl border p-8" style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}>
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#0d3326' }}>
                <span className="text-xl">📧</span>
              </div>
              <h4 className="font-display text-xl font-bold text-white">
                One quick step
              </h4>
              <p className="mt-2 text-sm" style={{ color: '#a09e99' }}>
                Enter your email to receive {assetTitle}. No spam, ever.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-3 w-full rounded-lg border bg-[#1C1B18] px-4 py-3 text-sm text-white outline-none"
                  style={{ borderColor: '#3a3a38' }}
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-[#1C1B18] px-4 py-3 text-sm text-white outline-none"
                  style={{ borderColor: error ? '#FF5C00' : '#3a3a38' }}
                />
                {error && (
                  <p className="mt-2 text-xs" style={{ color: '#FF5C00' }}>{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg py-3.5 text-base font-semibold text-white transition-colors"
                style={{ 
                  backgroundColor: submitting ? '#1D9E7580' : '#1D9E75',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Sending...' : 'Send Me The Playbook'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs" style={{ color: '#666662' }}>
              By entering your email, you agree to receive updates from DexMetal.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
