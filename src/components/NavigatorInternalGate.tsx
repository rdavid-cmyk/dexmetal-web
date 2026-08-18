'use client'

/**
 * NavigatorInternalGate
 *
 * Self-contained "unlock final artifact" modal for the Basel Navigator.
 * Mirrors the gating pattern used by the other 6 free tools (notably
 * BaselClassificationQuickscan): the page owns the `gateUnlocked` boolean
 * and renders an inline locked CTA / the real action based on that. When
 * the visitor clicks the locked CTA, the page opens this modal by setting
 * `showGate` true. On successful email capture, this component flips
 * `gateUnlocked` to true in the parent (via `onUnlock`) AND sets the same
 * localStorage key EmailGate used, so a visitor who already unlocked any
 * of the other 6 tools is already considered unlocked here too.
 *
 * Why a new component instead of reusing EmailGate:
 *   EmailGate wraps the entire page and blurs the background, which is
 *   the bug that locked 6 of 7 tools from 2026-04-22 to 2026-08-09.
 *   For a 21+19 block multi-section form, that pattern hides the form
 *   itself; we want everything except the final-artifact download gated.
 *   The other 6 tools solved this with a per-step internal gate; for the
 *   Navigator, the natural final artifact is the generated PDF draft,
 *   so this gate sits in front of exactly those actions.
 *
 * Scope lock (per the 2026-08-09 fix on the other 6 tools):
 *   - Free:    Reference tab, both 21-block Notification fill + local save,
 *              19-block Movement fill + local save, submission package
 *              tracking, "Load progress", "Load example".
 *   - Gated:   "Generate PDF" (Notification), "Generate PDF" (Movement),
 *              submission package download.
 */

import { useState, useEffect, ReactNode } from 'react'

interface NavigatorInternalGateProps {
  /** Open/close control from the parent. */
  showModal: boolean
  setShowModal: (v: boolean) => void
  /** Called when the email is successfully captured and the gate is unlocked. */
  onUnlock: () => void
  /** Human-readable label for what is being unlocked (e.g. "PDF Generation"). */
  label: string
  /** A short description; appears under the modal title. */
  description?: string
  /** Tool name passed to /api/capture-email for attribution. */
  toolName?: string
  /**
   * localStorage key written on success. Defaults to the same key EmailGate
   * uses (`dexmetal_email_captured`) so unlocking any other tool carries
   * over.
   */
  storageKey?: string
}

export default function NavigatorInternalGate({
  showModal,
  setShowModal,
  onUnlock,
  label,
  description,
  toolName = 'basel-navigator',
  storageKey = 'dexmetal_email_captured',
}: NavigatorInternalGateProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Reset form fields when the modal opens fresh.
    if (showModal) {
      setError('')
      setEmail('')
      setName('')
    }
  }, [showModal])

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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
          tool: toolName,
          surface: 'navigator-internal-gate',
          gate: label,
          timestamp: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        try {
          localStorage.setItem(storageKey, 'true')
          localStorage.setItem('dexmetal_email', email)
        } catch {
          // localStorage may be unavailable (private mode, etc.); in-memory
          // unlock still works for this session.
        }
        const tagName = 'tool_' + toolName.replace(/-/g, '_')
        fetch('/api/resend-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tag: tagName }),
        }).catch(() => {})
        setSubmitting(false)
        setShowModal(false)
        onUnlock()
      } else {
        setSubmitting(false)
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setSubmitting(false)
      setError('Failed to submit. Please try again.')
    }
  }

  if (!showModal) return null

  const modalContent: ReactNode = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowModal(false)
      }}
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
        <h2
          className="font-display font-bold"
          style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '8px' }}
        >
          Unlock {label}
        </h2>
        <p
          style={{
            color: '#a0a09a',
            fontSize: '13px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          {description ||
            `Enter your email to unlock ${label.toLowerCase()}. We will also send you a copy for your records.`}
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px 14px',
              backgroundColor: '#1C1B18',
              border: error ? '1px solid #FF5C00' : '1px solid #3a3a38',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          {error && (
            <p style={{ color: '#FF5C00', fontSize: '12px', marginTop: '-6px' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px',
              backgroundColor: submitting ? '#1D9E7580' : '#1D9E75',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: submitting ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Unlocking...' : 'Unlock'}
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
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
        <p
          style={{
            color: '#666662',
            fontSize: '11px',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.5,
          }}
        >
          By entering your email, you agree to receive updates from DexMetal. No spam, ever.
        </p>
      </div>
    </div>
  )

  return modalContent
}
