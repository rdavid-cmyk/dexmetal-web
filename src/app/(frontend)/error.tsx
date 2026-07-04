'use client'

import { useEffect } from 'react'

const STALE_ACTION_KEYWORDS = [
  'Failed to find Server Action',
  'Failed to find Server Action',
  'older or newer deployment',
  'skewProtection',
  'deploymentId',
]

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isStaleAction = STALE_ACTION_KEYWORDS.some((kw) =>
    error.message?.includes(kw),
  )

  useEffect(() => {
    console.error('DexMetal Error Boundary:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#1C1B18',
        color: '#c8c8c2',
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '480px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#FF5C00',
            marginBottom: '1rem',
            fontFamily: 'Play, sans-serif',
          }}
        >
          {isStaleAction ? 'New Version Deployed' : 'Something Went Wrong'}
        </h1>
        <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {isStaleAction
            ? 'A new version of DexMetal was just deployed. Please refresh to get the latest update.'
            : 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={() => {
            // Full page reload bypasses the RSC cache and stale server actions
            window.location.reload()
          }}
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#FF5C00',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}
