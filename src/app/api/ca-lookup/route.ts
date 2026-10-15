import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.BASEL_CA_API_URL || 'https://api.dexmetal.com'
const API_KEY = process.env.BASEL_CA_API_KEY || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')?.trim()

  if (!country) {
    return NextResponse.json({ error: 'country param required' }, { status: 400 })
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'CA lookup key not configured', items: [] }, { status: 503 })
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/ca?country=${encodeURIComponent(country)}`, {
      headers: { 'X-API-Key': API_KEY, Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream API error ${res.status}`, items: [] }, { status: 502 })
    }

    const data = await res.json()
    const all: any[] = data.items ?? []
    const q = country.toLowerCase()
    const matches = all.filter((r) => {
      const name = String(r.country_name || '').toLowerCase()
      const code = String(r.country_code || '').toLowerCase()
      return name.includes(q) || (q.length === 2 && code === q)
    })

    const items = matches.slice(0, 10).map((r) => ({
      country: r.country_name,
      code: r.country_code,
      authority_name: r.ca_name,
      department: r.department,
      contact_person: r.contact_person,
      email: r.email_primary,
      phone: r.phone,
      address: r.address,
      website: r.website,
      last_verified: r.last_verified_date,
    }))

    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fetch failed', items: [] }, { status: 500 })
  }
}
