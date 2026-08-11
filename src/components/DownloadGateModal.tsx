'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  /** Label shown on the trigger button */
  buttonLabel?: string
  /**
   * Optional props passed through by blog/[slug]/page.tsx companion-template gate.
   * Declared here for type compatibility only — the component renders buttonLabel.
   * (Pre-existing baseline usage; type-only declaration to unblock `next build`.)
   */
  title?: string
  description?: string
  source?: string
  downloadLinks?: { label: string; url: string }[]
}

export function DownloadGateModal({ buttonLabel = 'Download Templates' }: Props) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/download-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setDone(true)
    } catch {
      setError('Failed to submit. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── Trigger block ── */}
      <div style={{
        margin: '2.5rem 0',
        padding: '28px 32px',
        backgroundColor: '#2c2c2a',
        borderRadius: '12px',
        borderLeft: '4px solid #FF5C00',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <p style={{ margin: 0, color: '#ffffff', fontFamily: 'Play, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
          Source Documentation Templates
        </p>
        <p style={{ margin: 0, color: '#c8c8c2', fontSize: '0.9rem', lineHeight: 1.6 }}>
          The two templates referenced in this article — Buyer Specification Confirmation and Generator Source Confirmation — are available as ready-to-use documents.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 24px',
            backgroundColor: '#FF5C00',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          {buttonLabel}
        </button>
      </div>

      {/* ── Modal overlay ── */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.82)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Download templates"
            style={{
              backgroundColor: '#2c2c2a',
              borderRadius: '16px',
              padding: '36px',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid #3a3a38',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#a09e99',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '4px',
              }}
            >
              ✕
            </button>

            {done ? (
              /* ── Success state ── */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#0d3326',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '24px',
                }}>
                  ✅
                </div>
                <h3 style={{
                  margin: '0 0 12px',
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'Play, sans-serif',
                }}>
                  Check your inbox — your documents are on the way.
                </h3>
                <p style={{ margin: '0 0 24px', color: '#c8c8c2', fontSize: '14px', lineHeight: 1.6 }}>
                  Both templates have been sent to <strong style={{ color: '#1D9E75' }}>{email}</strong>. Check your spam folder if they don&apos;t arrive within a few minutes.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: '#1D9E75',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#1a1a10',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    fontSize: '20px',
                  }}>
                    📄
                  </div>
                  <h3 style={{
                    margin: '0 0 8px',
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 700,
                    fontFamily: 'Play, sans-serif',
                  }}>
                    Get both templates
                  </h3>
                  <p style={{ margin: 0, color: '#a09e99', fontSize: '14px', lineHeight: 1.6 }}>
                    Enter your details and we&apos;ll email you both PDFs immediately.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: '#1C1B18',
                        border: error && !firstName.trim() ? '1px solid #FF5C00' : '1px solid #3a3a38',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: '#1C1B18',
                        border: error && !validateEmail(email) ? '1px solid #FF5C00' : '1px solid #3a3a38',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    {error && (
                      <p style={{ margin: 0, color: '#FF5C00', fontSize: '12px' }}>{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: submitting ? '#1D9E7580' : '#1D9E75',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send me the templates'}
                  </button>
                </form>

                <p style={{
                  margin: '14px 0 0',
                  color: '#666662',
                  fontSize: '11px',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  By submitting, you agree to receive updates from DexMetal. No spam, ever.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
