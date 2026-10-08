import { NextRequest, NextResponse } from 'next/server'

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const MAX_TEXT_LENGTH = 1200
const hits = new Map<string, number[]>()

function clientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function allowed(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((ts) => now - ts < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request)
    if (!allowed(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { text } = await request.json()
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'text required' }, { status: 400 })
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: 'text too long' }, { status: 413 })
    }

    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: text,
        response_format: 'mp3',
      }),
    })

    if (!res.ok) return NextResponse.json({ error: 'TTS upstream error' }, { status: 502 })

    const audioBuffer = await res.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
