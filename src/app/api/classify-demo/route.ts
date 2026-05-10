import { NextRequest, NextResponse } from 'next/server'

const DEMO_KEY = 'bca_df927e76febd60b7f97be6e73a3aed205d1b6a0592a97f10'
const CLASSIFY_URL = process.env.CLASSIFY_API_URL || 'https://api.dexmetal.com/api/v1/classify'
const FETCH_TIMEOUT_MS = 10_000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description } = body

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'description is required' }, { status: 400 })
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    let upstream: Response
    try {
      upstream = await fetch(CLASSIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': DEMO_KEY,
        },
        body: JSON.stringify({ description }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }

    const data = await upstream.json()
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return NextResponse.json({ error: 'Classification service timed out' }, { status: 504 })
    }
    if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'EAI_AGAIN') {
      return NextResponse.json({ error: 'Classification service unreachable' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 })
  }
}
