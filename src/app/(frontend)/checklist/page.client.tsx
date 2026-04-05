'use client'

import Link from 'next/link'
import { useState } from 'react'

const FEATURES = [
  'Classify all outbound e-waste streams under the latest Basel codes including A1181 and Y49.',
  'Distinguish correctly between hazardous e-waste and other controlled e-waste exports.',
  'Understand what belongs in the notification application versus the movement document.',
  'Keep each shipment aligned with Prior Informed Consent (PIC) and the Acknowledgement of Consent (AOC).',
  'Avoid common mistakes that delay approvals or cause shipments to be held at customs.',
] as const

export default function ChecklistPageClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/checklist-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Unable to submit the form.')
      }

      setMessage(data.message || 'Thanks. Check your inbox for the checklist.')
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em]" style={{ color: '#1D9E75' }}>
            Basel Checklist
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Basel Notification Application Essentials for E-Waste Exporters
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: '#cbc7be' }}>
            Use this essential checklist to prepare Basel-compliant shipments of e-waste,
            recovered metals from e-waste, and related battery fractions. It distills the key
            steps of the Basel notification and movement documents into a simple, e-waste-specific
            workflow.
          </p>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
                What This Checklist Helps You Do
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Prepare cleaner shipments and avoid preventable filing errors
              </h2>
            </div>
            <div className="grid gap-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="rounded-3xl border p-5"
                  style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
                >
                  <p className="text-sm leading-7" style={{ color: '#cbc7be' }}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Instant Access
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Enter your email to get the Basel Notification Essentials checklist
              </h2>
              <p className="mt-5 text-base leading-8" style={{ color: '#cbc7be' }}>
                This form posts to DexMetal&rsquo;s local checklist signup endpoint and is ready to
                wire into a fuller delivery workflow later.
              </p>
            </div>
            <div
              className="rounded-[2rem] border p-6 md:p-8"
              style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium" htmlFor="checklist-email" style={{ color: '#cbc7be' }}>
                  Email Address
                </label>
                <input
                  id="checklist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-full border px-5 py-3 text-white outline-none"
                  style={{ backgroundColor: '#171613', borderColor: '#3a3a38' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
                  style={{ backgroundColor: '#1D9E75' }}
                >
                  {loading ? 'Submitting...' : 'Send Me the Checklist'}
                </button>
              </form>

              {message && (
                <p className="mt-4 text-sm" style={{ color: '#86efac' }}>
                  {message}
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm" style={{ color: '#fca5a5' }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16 md:py-20">
          <div
            className="rounded-[2rem] border px-6 py-10 md:px-10"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          >
            <h2 className="max-w-3xl font-display text-3xl font-bold text-white md:text-4xl">
              Need the full workflow after the checklist?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: '#cbc7be' }}>
              Continue into the Knowledge Hub for section-by-section guidance on the notification
              form, movement document, supporting documents, PIC procedure, and country
              requirements.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/knowledge-hub"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: '#1D9E75' }}
              >
                Open Knowledge Hub
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                Contact DexMetal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
