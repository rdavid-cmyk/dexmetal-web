import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
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

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(req: NextRequest) {
  try {
    if (!allowed(clientIp(req))) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json()
    if (body.website) return NextResponse.json({ success: true })

    const name = clean(body.name, 120)
    const email = clean(body.email, 254)
    const company = clean(body.company, 160)
    const question = clean(body.question, 4000)

    if (!name || !email || !question) {
      return NextResponse.json({ error: 'Name, email and question are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'DexMetal Contact <noreply@dexmetal.com>',
      to: 'info@dexmetal.com',
      replyTo: email,
      subject: 'New Basel Compliance Enquiry',
      text: [
        'New DexMetal enquiry',
        `Name: ${name}`,
        company ? `Company: ${company}` : '',
        `Email: ${email}`,
        '',
        'Question:',
        question,
      ].filter(Boolean).join('\n'),
    })

    await resend.emails.send({
      from: 'Richard David — DexMetal <noreply@dexmetal.com>',
      to: email,
      subject: 'Your DexMetal enquiry — received',
      text: `Enquiry received, ${name.split(/\s+/)[0]}.\n\nYour question has been received. A practitioner-drafted response will be in your inbox within 24 hours.\n\nYour question:\n${question}\n\nDexMetal LLC · https://dexmetal.com`,
    })

    try {
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN
      const telegramChatId = process.env.HERMES_CHAT_ID
      if (telegramToken && telegramChatId) {
        const telegramMsg = `🔔 NEW LEAD — DexMetal Contact\n\nName: ${name}${company ? `\nCompany: ${company}` : ''}\nEmail: ${email}\n\nQuestion:\n${question.slice(0, 300)}${question.length > 300 ? '...' : ''}`
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: telegramMsg }),
        })
      }
    } catch {}

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send. Please email info@dexmetal.com directly.' }, { status: 500 })
  }
}
