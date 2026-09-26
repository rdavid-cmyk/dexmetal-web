import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const routeCheckInbox = process.env.ROUTE_CHECK_INBOX || 'richard@dexmetal.com'

const REQUIRED_FIELDS = [
  'name', 'email', 'wasteType', 'condition', 'origin',
  'destination', 'originLocation', 'destinationFacility', 'operation', 'transit',
] as const

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function clean(value: unknown, max = 1000) {
  return String(value ?? '').trim().slice(0, max)
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.website) return NextResponse.json({ success: true })

    for (const field of REQUIRED_FIELDS) {
      if (!clean(body[field], 300)) {
        return NextResponse.json({ error: `${field} is required.` }, { status: 400 })
      }
    }

    const email = clean(body.email, 320)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const reference = `SRC-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`
    const submission = {
      reference,
      name: clean(body.name, 120),
      email,
      company: clean(body.company, 160),
      wasteType: clean(body.wasteType, 120),
      condition: clean(body.condition, 120),
      origin: clean(body.origin, 120),
      destination: clean(body.destination, 120),
      originLocation: clean(body.originLocation, 200),
      destinationFacility: clean(body.destinationFacility, 240),
      operation: clean(body.operation, 120),
      transit: clean(body.transit, 500),
      quantity: clean(body.quantity, 120),
      targetDate: clean(body.targetDate, 120),
      knownCode: clean(body.knownCode, 120),
      notes: clean(body.notes, 1500),
    }

    const rows = [
      ['Reference', submission.reference],
      ['Customer', submission.name],
      ['Email', submission.email],
      ['Company', submission.company || '—'],
      ['Waste / material', submission.wasteType],
      ['Condition', submission.condition],
      ['Origin', submission.origin],
      ['Destination', submission.destination],
      ['Dispatch location', submission.originLocation],
      ['Receiving facility / location', submission.destinationFacility],
      ['Intended operation', submission.operation],
      ['Transit countries / route', submission.transit],
      ['Approx. quantity', submission.quantity || '—'],
      ['Target shipment date', submission.targetDate || '—'],
      ['Known Basel code', submission.knownCode || '—'],
    ]
    const tableRows = rows.map(([label, value]) =>
      `<tr><td style="padding:7px 10px;color:#77736b;width:190px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:7px 10px;color:#ffffff">${escapeHtml(value)}</td></tr>`
    ).join('')

    await resend.emails.send({
      from: 'DexMetal Route Check <noreply@dexmetal.com>',
      to: routeCheckInbox,
      replyTo: submission.email,
      subject: `Shipment Route Check ${reference} — ${submission.origin} → ${submission.destination}`,
      html: `<div style="font-family:sans-serif;max-width:720px;margin:0 auto;background:#1C1B18;padding:30px"><h1 style="color:#fff;font-size:20px">New $99 Shipment Route Check</h1><p style="color:#1D9E75;font-weight:700">${reference}</p><table style="width:100%;border-collapse:collapse;background:#2c2c2a">${tableRows}</table><div style="margin-top:20px;padding:16px;background:#2c2c2a"><div style="color:#77736b;font-size:12px;margin-bottom:8px">CUSTOMER NOTES</div><div style="color:#fff;white-space:pre-wrap">${escapeHtml(submission.notes || '—')}</div></div><p style="color:#a0a09a;font-size:12px;margin-top:20px">Fulfillment gate: run the four corrected DexMetal engines, then verify every material conclusion against current primary sources before issuing the one-page report.</p></div>`,
    })

    resend.emails.send({
      from: 'Richard David — DexMetal <noreply@dexmetal.com>',
      to: submission.email,
      subject: `${reference} — Shipment Route Check request received`,
      html: `<div style="font-family:sans-serif;max-width:640px;margin:0 auto;background:#1C1B18;color:#c8c4bc;padding:30px"><h1 style="color:#fff;font-size:20px">Route Check request received.</h1><p>Reference: <strong style="color:#1D9E75">${reference}</strong></p><p>We received the route details for <strong>${escapeHtml(submission.origin)} → ${escapeHtml(submission.destination)}</strong>. Richard will confirm fit and the next step before the $99 Route Check proceeds.</p><p><strong>No payment has been taken.</strong></p><p style="color:#77736b;font-size:12px">DexMetal LLC · dexmetal.com</p></div>`,
    }).catch((err) => console.error('Route Check confirmation email error:', err))
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.HERMES_CHAT_ID
      if (token && chatId) {
        const text = [
          '🧭 NEW SHIPMENT ROUTE CHECK',
          reference,
          `${submission.origin} → ${submission.destination}`,
          submission.wasteType,
          `Customer: ${submission.name} <${submission.email}>`,
          'Full intake: private Route Check inbox',
        ].join('\n')
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        })
      }
    } catch (err) {
      console.error('Route Check Telegram alert error:', err)
    }

    return NextResponse.json({ success: true, reference })
  } catch (err) {
    console.error('Shipment Route Check submission error:', err)
    return NextResponse.json({ error: 'Submission failed. Please email richard@dexmetal.com.' }, { status: 500 })
  }
}
