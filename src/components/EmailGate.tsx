'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface EmailGateProps {
  toolName: string
  children: ReactNode
  fallbackCTA?: {
    title: string
    desc: string
    buttonText?: string
  }
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'basel-navigator': 'Basel Navigator',
  'shipment-eligibility-checker': 'Shipment Eligibility',
  'pic-status-checker': 'PIC Status',
  'basel-classification-quickscan': 'Classification',
  'ulab-export-calculator': 'ULAB Export',
  'ewaste-route-mapper': 'E-Waste Route',
  'ewaste-material-recovery': 'Material Recovery',
  'asset01': 'eWaste Trade Compliance Playbook',
  'asset01-blog': 'eWaste Trade Compliance Playbook',
}

export default function EmailGate({ toolName, children, fallbackCTA }: EmailGateProps) {
  const [isLocked, setIsLocked] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showGate, setShowGate] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dexmetal_email_captured')
    if (stored) {
      setIsLocked(false)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowGate(false)
      }
    }
    if (showGate) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showGate])

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
          tool: toolName,
          timestamp: new Date().toISOString()
        })
      })

      if (res.ok) {
        localStorage.setItem('dexmetal_email_captured', 'true')
        localStorage.setItem('dexmetal_email', email)
        setIsLocked(false)
        setShowGate(false)
        setEmail('')
        setName('')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLocked) {
    return <>{children}</>
  }

  const toolDisplayName = TOOL_DISPLAY_NAMES[toolName] || toolName

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          filter: 'blur(12px)', 
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.5,
        }}>
          {children}
        </div>
        
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, rgba(28,27,24,0.7) 0%, rgba(28,27,24,0.95) 100%)',
          borderRadius: '12px',
          padding: '32px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              backgroundColor: '#1D9E75',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px',
            }}>
              🔒
            </div>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '18px', 
              fontWeight: 700, 
              marginBottom: '8px',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Enter your email to view results
            </h3>
            <p style={{ 
              color: '#a0a09a', 
              fontSize: '14px', 
              marginBottom: '20px',
              lineHeight: 1.5,
            }}>
              Get your {toolDisplayName} results instantly.
            </p>
            
            {fallbackCTA && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#e0e0da', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  {fallbackCTA.title}
                </p>
                <p style={{ color: '#a0a09a', fontSize: '12px' }}>
                  {fallbackCTA.desc}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowGate(true)}
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
                transition: 'background-color 0.2s',
              }}
            >
              {fallbackCTA?.buttonText || 'Unlock Results'}
            </button>
          </div>
        </div>
      </div>

      {showGate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div 
            ref={modalRef}
            style={{
              backgroundColor: '#2c2c2a',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid #3a3a38',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: '#0d3326',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '20px',
              }}>
                📧
              </div>
              <h3 style={{ 
                color: '#ffffff', 
                fontSize: '20px', 
                fontWeight: 700, 
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                One quick step
              </h3>
              <p style={{ 
                color: '#a0a09a', 
                fontSize: '14px', 
                lineHeight: 1.5,
              }}>
                Enter your email to unlock your {toolDisplayName} results. We will also send you a copy for your records.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#1C1B18',
                    border: '1px solid #3a3a38',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '12px',
                  }}
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#1C1B18',
                    border: error ? '1px solid #FF5C00' : '1px solid #3a3a38',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {error && (
                  <p style={{ color: '#FF5C00', fontSize: '12px', marginTop: '8px' }}>
                    {error}
                  </p>
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
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                }}
              >
                {submitting ? 'Unlocking...' : 'View Results'}
              </button>
            </form>

            <p style={{ 
              color: '#666662', 
              fontSize: '11px', 
              textAlign: 'center',
              marginTop: '16px',
              lineHeight: 1.5,
            }}>
              By entering your email, you agree to receive updates from DexMetal. No spam, ever.
            </p>
          </div>
        </div>
      )}
    </>
  )
}