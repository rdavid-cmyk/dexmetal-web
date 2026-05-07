import { NextRequest, NextResponse } from 'next/server'

const DEMO_KEY = 'bca_df927e76febd60b7f97be6e73a3aed205d1b6a0592a97f10'
const CLASSIFY_URL = 'https://api.dexmetal.com/api/v1/classify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description } = body

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'description is required' }, { status: 400 })
    }

    const upstream = await fetch(CLASSIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': DEMO_KEY,
      },
      body: JSON.stringify({ description }),
    })

    const data = await upstream.json()
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 })
  }
}
