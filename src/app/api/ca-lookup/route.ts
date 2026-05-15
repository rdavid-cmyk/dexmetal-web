import { NextRequest, NextResponse } from 'next/server'

const PB_BASE = process.env.POCKETBASE_URL || 'https://api.dexmetal.com'
const PB_TOKEN = process.env.POCKETBASE_TOKEN || ''
const FETCH_TIMEOUT_MS = 10_000

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

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    let res: Response
    try {
      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${PB_TOKEN}`,
          Accept: 'application/json',
        },
        next: { revalidate: 3600 },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }

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
    if (err?.name === 'AbortError') {
      return NextResponse.json({ error: 'Authority lookup timed out', items: [] }, { status: 504 })
    }
    if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'EAI_AGAIN') {
      return NextResponse.json({ error: 'Authority API unreachable', items: [] }, { status: 503 })
    }
    return NextResponse.json(
      { error: err.message || 'Fetch failed', items: [] },
      { status: 500 }
    )
  }
}
