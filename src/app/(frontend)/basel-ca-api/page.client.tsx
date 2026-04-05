'use client'

import Link from 'next/link'
import { useState } from 'react'

const PAIN_POINTS = [
  '2-3 hours per country digging through the Basel Convention website',
  'Outdated contact information buried in PDFs or stale government documents',
  'No programmatic access, which forces manual copy-paste into internal systems',
  'Constant worry about using the wrong email, authority, or phone number',
  'Impossible-to-scale Annex VII and notification workflows when done manually',
] as const

const FEATURES = [
  {
    title: 'Verified Data',
    description:
      'Official competent authority contacts for 182 countries, maintained from Basel Convention sources and updated regularly.',
    accent: '#1D9E75',
  },
  {
    title: 'Instant Access',
    description:
      'Get complete authority records in seconds, including email, phone, address, and other core details.',
    accent: '#FF5C00',
  },
  {
    title: 'Easy Integration',
    description:
      'Use simple REST calls with JSON responses inside ERP, GRC, compliance, and logistics systems.',
    accent: '#1D9E75',
  },
  {
    title: 'Always Current',
    description:
      'DexMetal monitors upstream changes so your team spends less time reconciling source documents.',
    accent: '#FF5C00',
  },
] as const

const AUDIENCES = [
  {
    title: 'E-Waste Recyclers',
    description: 'Shipping internationally and needing authority contacts for every destination or transit country.',
  },
  {
    title: 'Software Developers',
    description: 'Building internal compliance tools, ERP systems, customs workflows, or GRC platforms.',
  },
  {
    title: 'Compliance Officers',
    description: 'Managing Basel notifications and needing verified authority records without manual rework.',
  },
  {
    title: 'Logistics Companies',
    description: 'Automating pre-shipment checks before cargo moves into regulated cross-border flows.',
  },
] as const

const FAQS = [
  {
    question: 'How accurate is the data?',
    answer:
      'Basel API records are derived from official Basel Convention sources and cross-checked against government contact references. Critical submissions should still be confirmed directly with the relevant authority before filing.',
  },
  {
    question: 'What countries are currently covered?',
    answer:
      'The product messaging and on-page references have been updated to 182 countries. This page intentionally replaces earlier 41-country wording.',
  },
  {
    question: 'How quickly can it be integrated?',
    answer:
      'The API is intentionally lightweight: simple authenticated REST requests, JSON responses, and no heavy SDK requirement.',
  },
  {
    question: 'Who is this for?',
    answer:
      'Teams handling Basel notifications, trade compliance, authority lookups, circular economy exports, and related workflow automation.',
  },
] as const

export default function BaselCaApiClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    setResults([])
    setSearched(true)

    try {
      const res = await fetch(`/api/ca-lookup?country=${encodeURIComponent(q)}`)
      const data = await res.json()

      if (!res.ok || data.error) {
        if (res.status === 503) {
          setError('Live lookup is not yet configured. The API key needs to be set up on the server.')
        } else {
          throw new Error(data.error || `API returned ${res.status}`)
        }
        return
      }

      setResults(data.items ?? [])
    } catch (err: any) {
      setError(err.message || 'Could not reach the Basel CA API. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="min-h-screen bg-dex-bg text-white">
      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em]" style={{ color: '#1D9E75' }}>
              Basel API
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Stop manual lookups. Start automating Basel compliance.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: '#cbc7be' }}>
              Get verified competent authority data for 182 countries via simple REST API calls.
              Integrate faster, reduce lookup errors, and keep Basel workflows moving.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://api.dexmetal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: '#1D9E75' }}
              >
                Get Your Free API Key
              </a>
              <a
                href="https://api.dexmetal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-medium"
                style={{ borderColor: '#FF5C00', color: '#FF5C00' }}
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
              The Pain of Manual Lookups
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Every manual authority lookup slows the shipment before the shipment even starts
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {PAIN_POINTS.map((item) => (
              <div
                key={item}
                className="rounded-3xl border p-5"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <p className="text-sm leading-7" style={{ color: '#cbc7be' }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
              Introducing Basel API
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              The first dedicated API for Basel Convention competent authority data
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border p-6"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: feature.accent }}
                >
                  ✓
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-7" style={{ color: '#cbc7be' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
                See It In Action
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                From two hours of digging to one clean API response
              </h2>
              <p className="mt-5 text-base leading-8" style={{ color: '#cbc7be' }}>
                Query a country and return the authority record you need for compliance workflows,
                internal tooling, and operator-facing interfaces.
              </p>
            </div>
            <div
              className="rounded-[2rem] border p-6 md:p-8"
              style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
                Base URL
              </p>
              <code className="block rounded-2xl bg-[#171613] px-4 py-3 text-sm text-[#1D9E75]">
                https://api.dexmetal.com
              </code>
              <pre
                className="mt-5 overflow-x-auto rounded-2xl bg-[#171613] p-4 text-sm leading-7"
                style={{ color: '#cbc7be' }}
              >{`curl -H "X-API-Key: YOUR_API_KEY" \\
  https://api.dexmetal.com/api/v1/ca/BR

// Response (simplified)
{
  "country": "Brazil",
  "code": "BR",
  "competentAuthority": "Instituto Brasileiro do Meio Ambiente...",
  "email": "cgen@ibama.gov.br",
  "phone": "+55 61 3316-1234",
  "address": "SCEN Trecho 2, Brasília...",
  "lastVerified": "2026-01-15"
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
              Live Lookup
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Test the lookup experience before you integrate
            </h2>
          </div>
          <div
            className="rounded-[2rem] border p-6 md:p-8"
            style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
          >
            <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Germany, Brazil, Ghana..."
                className="flex-1 rounded-full border px-5 py-3 text-white outline-none"
                style={{ backgroundColor: '#171613', borderColor: '#3a3a38' }}
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: '#1D9E75' }}
              >
                {loading ? 'Searching...' : 'Look Up Country'}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: '#7a3030', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {!loading && searched && !error && results.length === 0 && (
              <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: '#3a3a38', color: '#cbc7be' }}>
                No result found for &ldquo;{query}&rdquo;.
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6 grid gap-4">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border p-5"
                    style={{ backgroundColor: '#171613', borderColor: '#3a3a38' }}
                  >
                    <h3 className="font-display text-2xl font-bold text-white">
                      {item.country || item.Country || item.name || 'Unknown Country'}
                    </h3>
                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      {Object.entries({
                        Authority: item.authority_name || item.authorityName,
                        Contact: item.contact_person || item.contactPerson,
                        Email: item.email || item.Email,
                        Phone: item.phone || item.Phone,
                        Address: item.address || item.Address,
                      })
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                          <div key={label}>
                            <dt className="font-medium" style={{ color: '#1D9E75' }}>
                              {label}
                            </dt>
                            <dd className="mt-1" style={{ color: '#cbc7be' }}>
                              {String(value)}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b] bg-[#171613]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#FF5C00' }}>
              Who Basel API Is For
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Built for the people who need reliable authority data every day
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {AUDIENCES.map((audience, index) => (
              <div
                key={audience.title}
                className="rounded-3xl border p-6"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-base font-bold text-white"
                  style={{ backgroundColor: index % 2 === 0 ? '#1D9E75' : '#FF5C00' }}
                >
                  {audience.title.charAt(0)}
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{audience.title}</h3>
                <p className="text-sm leading-7" style={{ color: '#cbc7be' }}>
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2f2b]">
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: '#1D9E75' }}>
              Frequently Asked Questions
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Common questions about Basel API</h2>
          </div>
          <div className="grid gap-4">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-3xl border p-6"
                style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
              >
                <h3 className="font-display text-2xl font-bold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: '#cbc7be' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
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
              Ready to automate your Basel compliance workflows?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: '#cbc7be' }}>
              Join compliance teams replacing manual authority lookup work with structured data and
              cleaner internal systems.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://api.dexmetal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: '#1D9E75' }}
              >
                Get Your Free API Key Now
              </a>
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
