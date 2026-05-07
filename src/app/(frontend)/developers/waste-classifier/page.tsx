'use client'

import { useState } from 'react'
import Link from 'next/link'

const EXAMPLE = 'used lead acid batteries, drained, 20 tons'

interface CodeEntry {
  code: string
  name: string
}

interface ClassifyResult {
  list_type?: string
  y_codes?: CodeEntry[]
  a_codes?: CodeEntry[]
  b_codes?: CodeEntry[]
  h_codes?: CodeEntry[]
  un_numbers?: string[]
  pic_required?: boolean
  confidence?: number
  disclaimer?: string
}

function listTypeBadge(listType: string) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    amber: { label: 'Amber List', bg: '#FF5C0022', color: '#FF5C00' },
    green: { label: 'Green List', bg: '#1D9E7522', color: '#1D9E75' },
    'annex i': { label: 'Annex I', bg: '#EF444422', color: '#EF4444' },
  }
  const key = listType.toLowerCase()
  const style = map[key] ?? { label: listType, bg: '#3B82F622', color: '#3B82F6' }
  return (
    <span
      className="inline-block text-xs font-body font-semibold uppercase tracking-widest px-2 py-1 rounded"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}

function CodeSection({
  title,
  codes,
  accent,
}: {
  title: string
  codes: CodeEntry[]
  accent: string
}) {
  if (!codes || codes.length === 0) return null
  return (
    <div className="mb-4">
      <p
        className="text-xs font-body font-semibold uppercase tracking-widest mb-2"
        style={{ color: accent }}
      >
        {title}
      </p>
      <div className="space-y-1">
        {codes.map((c) => (
          <div key={c.code} className="flex gap-2 text-sm font-body">
            <span className="font-mono font-semibold text-white">{c.code}</span>
            <span style={{ color: '#a0a09a' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WasteClassifierPage() {
  const [description, setDescription] = useState(EXAMPLE)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassifyResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClassify() {
    if (!description.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/classify-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError('Classification failed. Please try again.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Classification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* SECTION 1 — Hero */}
        <div className="mb-12">
          <h1
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: '2.75rem' }}
          >
            Basel Waste Code Classifier
          </h1>
          <p
            className="font-body text-lg mb-8"
            style={{ color: '#a0a09a', maxWidth: '600px' }}
          >
            Paste any waste description. Get Y-codes, A-codes, H-codes, UN numbers, and PIC
            requirement — instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://api.dexmetal.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF5C00' }}
            >
              Get Free API Key →
            </Link>
            <Link
              href="https://api.dexmetal.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-lg font-body font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2c2c2a', color: '#a0a09a' }}
            >
              View API Docs →
            </Link>
          </div>
        </div>

        {/* SECTION 2 — Live Demo */}
        <div className="rounded-xl p-6 mb-16" style={{ backgroundColor: '#2c2c2a' }}>
          <p className="font-body font-semibold text-white mb-4">Live Demo</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-white resize-none focus:outline-none focus:ring-2"
            style={{
              backgroundColor: '#1a1a18',
              border: '1px solid #3a3a38',
              color: '#e5e5e3',
            }}
            placeholder="Example: used lead acid batteries, drained, 20 tons"
          />
          <button
            onClick={handleClassify}
            disabled={loading || !description.trim()}
            className="mt-3 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#1D9E75' }}
          >
            {loading ? 'Classifying...' : 'Classify Waste →'}
          </button>

          {error && (
            <p className="mt-4 font-body text-sm" style={{ color: '#EF4444' }}>
              {error}
            </p>
          )}

          {result && (
            <div
              className="mt-6 rounded-lg p-5"
              style={{ backgroundColor: '#1a1a18', border: '1px solid #3a3a38' }}
            >
              <div className="flex flex-wrap gap-3 items-center mb-5">
                {result.list_type && listTypeBadge(result.list_type)}
                {result.pic_required !== undefined && (
                  <span
                    className="inline-block text-xs font-body font-semibold uppercase tracking-widest px-2 py-1 rounded"
                    style={{
                      backgroundColor: result.pic_required ? '#EF444422' : '#1D9E7522',
                      color: result.pic_required ? '#EF4444' : '#1D9E75',
                    }}
                  >
                    PIC {result.pic_required ? 'Required' : 'Not Required'}
                  </span>
                )}
                {result.confidence !== undefined && (
                  <span className="text-xs font-body" style={{ color: '#a0a09a' }}>
                    Confidence: {Math.round(result.confidence * 100)}%
                  </span>
                )}
              </div>

              <CodeSection title="Y-Codes" codes={result.y_codes ?? []} accent="#FF5C00" />
              <CodeSection title="A-Codes" codes={result.a_codes ?? []} accent="#EF4444" />
              <CodeSection title="B-Codes" codes={result.b_codes ?? []} accent="#1D9E75" />
              <CodeSection
                title="H-Codes (Hazard Characteristics)"
                codes={result.h_codes ?? []}
                accent="#8B5CF6"
              />

              {result.un_numbers && result.un_numbers.length > 0 && (
                <div className="mb-4">
                  <p
                    className="text-xs font-body font-semibold uppercase tracking-widest mb-2"
                    style={{ color: '#3B82F6' }}
                  >
                    UN Numbers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.un_numbers.map((un) => (
                      <span
                        key={un}
                        className="text-xs font-mono font-semibold px-2 py-1 rounded"
                        style={{ backgroundColor: '#3B82F622', color: '#3B82F6' }}
                      >
                        {un}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.disclaimer && (
                <p className="mt-4 text-xs font-body" style={{ color: '#6b6b66' }}>
                  {result.disclaimer}
                </p>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3 — What it does */}
        <div className="mb-16">
          <h2
            className="font-display font-bold text-white mb-8"
            style={{ fontSize: '1.75rem' }}
          >
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Plain language input',
                body: "Describe your waste the way you'd describe it to a colleague. No code knowledge required.",
                accent: '#FF5C00',
              },
              {
                title: 'Basel codes output',
                body: 'Returns Y/A/B list codes, hazard characteristics, and UN transport numbers in seconds.',
                accent: '#1D9E75',
              },
              {
                title: 'Notification ready',
                body: 'Use the codes directly in your Basel notification form — no manual lookup required.',
                accent: '#8B5CF6',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border-l-4"
                style={{ backgroundColor: '#2c2c2a', borderLeftColor: item.accent }}
              >
                <h3 className="font-body font-semibold text-white text-base mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 — API Integration */}
        <div className="mb-16">
          <h2
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: '1.75rem' }}
          >
            API Integration
          </h2>
          <div
            className="rounded-xl p-6 mb-6 overflow-x-auto"
            style={{ backgroundColor: '#1a1a18', border: '1px solid #3a3a38' }}
          >
            <pre className="font-mono text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
{`curl -X POST https://api.dexmetal.com/api/v1/classify \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"description": "used lead acid batteries drained 20 tons"}'`}
            </pre>
          </div>
          <Link
            href="https://api.dexmetal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FF5C00' }}
          >
            Get Your Free API Key →
          </Link>
        </div>

        {/* SECTION 5 — Bottom CTA */}
        <div
          className="rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ backgroundColor: '#2c2c2a' }}
        >
          <p className="font-body font-semibold text-white text-lg">
            Ready to integrate? Get your free API key in 30 seconds.
          </p>
          <Link
            href="https://api.dexmetal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg font-body font-semibold text-sm text-white transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#FF5C00' }}
          >
            Get Free API Key →
          </Link>
        </div>
      </div>
    </article>
  )
}
