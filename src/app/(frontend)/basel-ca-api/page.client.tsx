'use client'

import { useState } from 'react'

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
      const items = data.items ?? []
      setResults(items)
    } catch (err: any) {
      setError(err.message || 'Could not reach the Basel CA API. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-body font-medium mb-4 uppercase tracking-wider"
            style={{ backgroundColor: '#1D9E7522', color: '#1D9E75' }}
          >
            Free API
          </div>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: '2.75rem' }}>
            Basel CA API
          </h1>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#a0a09a' }}>
            Competent Authority contact data for 182 countries. Look up the national Basel authority for any country — free, no login required.
          </p>
        </div>

        {/* Live Lookup Widget */}
        <section className="mb-12 p-8 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h2 className="font-display font-bold text-white text-xl mb-2">
            Country Lookup
          </h2>
          <p className="font-body text-sm mb-6" style={{ color: '#a0a09a' }}>
            Enter a country name to retrieve its Basel Competent Authority contact information.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Germany, Japan, Nigeria…"
              className="flex-1 px-4 py-3 rounded-lg font-body text-white placeholder-[#a0a09a] outline-none transition-all duration-200"
              style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1D9E75')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a38')}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-body font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#1D9E75', whiteSpace: 'nowrap' }}
            >
              {loading ? 'Searching…' : 'Look Up'}
            </button>
          </form>

          {/* Results */}
          {loading && (
            <div className="text-center py-8">
              <div
                className="inline-block w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }}
              />
              <p className="font-body text-sm mt-3" style={{ color: '#a0a09a' }}>Querying Basel CA API…</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#3a2020', border: '1px solid #7a3030' }}>
              <p className="font-body text-sm" style={{ color: '#f87171' }}>{error}</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && !error && (
            <p className="font-body text-sm text-center py-6" style={{ color: '#a0a09a' }}>
              No results found for &ldquo;{query}&rdquo;. Try a different spelling or country name.
            </p>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border-l-4"
                  style={{ backgroundColor: '#1C1B18', borderLeftColor: '#1D9E75' }}
                >
                  <h3 className="font-display font-bold text-white text-lg mb-3">
                    {item.country || item.Country || item.name || 'Unknown Country'}
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-body text-sm">
                    {(item.authority_name || item.authorityName) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Authority</dt>
                        <dd style={{ color: '#a0a09a' }}>{item.authority_name || item.authorityName}</dd>
                      </>
                    )}
                    {(item.contact_person || item.contactPerson) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Contact</dt>
                        <dd style={{ color: '#a0a09a' }}>{item.contact_person || item.contactPerson}</dd>
                      </>
                    )}
                    {(item.email || item.Email) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Email</dt>
                        <dd>
                          <a
                            href={`mailto:${item.email || item.Email}`}
                            style={{ color: '#1D9E75' }}
                            className="hover:opacity-80 transition-opacity"
                          >
                            {item.email || item.Email}
                          </a>
                        </dd>
                      </>
                    )}
                    {(item.phone || item.Phone) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Phone</dt>
                        <dd style={{ color: '#a0a09a' }}>{item.phone || item.Phone}</dd>
                      </>
                    )}
                    {(item.fax || item.Fax) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Fax</dt>
                        <dd style={{ color: '#a0a09a' }}>{item.fax || item.Fax}</dd>
                      </>
                    )}
                    {(item.address || item.Address) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Address</dt>
                        <dd style={{ color: '#a0a09a' }}>{item.address || item.Address}</dd>
                      </>
                    )}
                    {(item.website || item.Website) && (
                      <>
                        <dt style={{ color: '#1D9E75' }} className="font-medium">Website</dt>
                        <dd>
                          <a
                            href={item.website || item.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1D9E75' }}
                            className="hover:opacity-80 transition-opacity"
                          >
                            {item.website || item.Website}
                          </a>
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* API Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
            <h3 className="font-display font-bold text-white text-base mb-3">API Endpoint</h3>
            <code
              className="block p-3 rounded text-xs font-mono break-all"
              style={{ backgroundColor: '#1C1B18', color: '#1D9E75' }}
            >
              GET https://api.dexmetal.com/api/competent-authorities
            </code>
            <p className="font-body text-xs mt-3" style={{ color: '#a0a09a' }}>
              Query params: <code style={{ color: '#FF5C00' }}>country</code>, <code style={{ color: '#FF5C00' }}>limit</code>. No API key required.
            </p>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
            <h3 className="font-display font-bold text-white text-base mb-3">Coverage</h3>
            <ul className="font-body text-sm space-y-2" style={{ color: '#a0a09a' }}>
              <li>&#x2713; 182 countries</li>
              <li>&#x2713; Authority name, contact, email, phone</li>
              <li>&#x2713; Updated from official Basel Convention data</li>
              <li>&#x2713; Free, no authentication needed</li>
            </ul>
          </div>
        </section>

        {/* Code example */}
        <section className="p-6 rounded-xl" style={{ backgroundColor: '#2c2c2a' }}>
          <h3 className="font-display font-bold text-white text-base mb-4">Quick Start</h3>
          <pre
            className="text-xs font-mono overflow-x-auto p-4 rounded-lg leading-relaxed"
            style={{ backgroundColor: '#1C1B18', color: '#a0a09a' }}
          >{`fetch('https://api.dexmetal.com/api/competent-authorities?country=Germany')
  .then(r => r.json())
  .then(data => console.log(data.items))`}</pre>
        </section>
      </div>
    </article>
  )
}
