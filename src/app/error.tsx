'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalErrorBoundary]', error)
  }, [error])

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>
        We couldn't complete your request. Please try again. If the problem
        persists, contact support.
      </p>

      <details style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>
        <summary>Error details</summary>
        <pre>
          {error.message}
          {error?.digest ? `\n\nDigest: ${error.digest}` : ''}
        </pre>
      </details>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button
          type={'button'}
          onClick={() => reset()}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#111',
            textDecoration: 'none',
          }}
        >
          Go home
        </a>
      </div>
    </div>
  )
}
