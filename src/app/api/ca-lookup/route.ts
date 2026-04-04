import { NextRequest, NextResponse } from 'next/server'

const PB_BASE = process.env.POCKETBASE_URL || 'https://api.dexmetal.com'
const PB_TOKEN = process.env.POCKETBASE_TOKEN || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')?.trim()

  if (!country) {
    return NextResponse.json({ error: 'country param required' }, { status: 400 })
  }

  if (!PB_TOKEN) {
    return NextResponse.json(
      { error: 'POCKETBASE_TOKEN not configured', items: [] },
      { status: 503 }
    )
  }

  try {
    const filter = encodeURIComponent(`country~"${country}"`)
    const url = `${PB_BASE}/api/collections/competent_authorities/records?filter=${filter}&perPage=10`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${PB_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: `Upstream API error ${res.status}`, items: [] },
        { status: res.status }
      )
    }

    const data = await res.json()
    const items = data.items ?? data.records ?? data.docs ?? []
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Fetch failed', items: [] },
      { status: 500 }
    )
  }
}
