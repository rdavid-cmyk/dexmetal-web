'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isStaleAction =
    error.message?.includes('Failed to find Server Action') ||
    error.message?.includes('older or newer deployment')

  return (
    <html lang="en" style={{ backgroundColor: '#1C1B18' }}>
      <body style={{ margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#1C1B18',
            color: '#c8c8c2',
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
                ? 'A new version of DexMetal was just deployed. Please refresh.'
                : 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
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
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
