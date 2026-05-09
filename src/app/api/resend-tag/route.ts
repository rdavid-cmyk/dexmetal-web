import { NextRequest, NextResponse } from 'next/server'

const RESEND_AUDIENCE_ID = 'fbdfec0b-9a5f-44e6-8e42-d7fa1ddc9e73'

export async function POST(request: NextRequest) {
  try {
    const { email, tag } = await request.json()

    if (!email || !tag) {
      return NextResponse.json({ error: 'email and tag are required' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('[resend-tag] No RESEND_API_KEY, skipping')
      return NextResponse.json({ success: true, skipped: true })
    }

    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        data: {
          [tag]: 'true',
          tagged_at: new Date().toISOString(),
        },
      }),
    })

    if (res.ok) {
      console.log('[resend-tag] Tagged contact:', email, tag)
      return NextResponse.json({ success: true })
    }

    const err = await res.text()
    console.log('[resend-tag] Resend error:', err)
    return NextResponse.json({ success: false, error: err }, { status: 200 })
  } catch (err) {
    console.error('[resend-tag] Exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
