import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, question } = await req.json()

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
      subject: `New Basel Compliance Enquiry — ${name}${company ? ` (${company})` : ''}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1B18;color:#c8c4bc;padding:32px;border-radius:8px"><div style="border-left:4px solid #FF5C00;padding-left:16px;margin-bottom:24px"><h1 style="color:#ffffff;font-size:20px;margin:0 0 4px">New Consulting Enquiry</h1><p style="color:#a0a09a;font-size:13px;margin:0">Submitted via dexmetal.com/contact</p></div><table style="width:100%;border-collapse:collapse;margin-bottom:24px"><tr><td style="padding:8px 0;color:#a0a09a;width:120px;font-size:13px">Name</td><td style="padding:8px 0;color:#ffffff;font-size:13px">${name}</td></tr><tr><td style="padding:8px 0;color:#a0a09a;font-size:13px">Email</td><td style="padding:8px 0;font-size:13px"><a href="mailto:${email}" style="color:#1D9E75">${email}</a></td></tr>${company ? `<tr><td style="padding:8px 0;color:#a0a09a;font-size:13px">Company</td><td style="padding:8px 0;color:#ffffff;font-size:13px">${company}</td></tr>` : ''}</table><div style="background:#2c2c2a;border-radius:6px;padding:16px;margin-bottom:24px"><p style="color:#a0a09a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px">Question</p><p style="color:#ffffff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${question}</p></div><p style="color:#77736b;font-size:12px;margin:0">Reply directly to this email to respond to ${name}.</p></div>`,
    })

    await resend.emails.send({
      from: 'Richard David — DexMetal <noreply@dexmetal.com>',
      to: email,
      subject: 'Your DexMetal enquiry — received',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1B18;color:#c8c4bc;padding:32px;border-radius:8px"><div style="border-left:4px solid #1D9E75;padding-left:16px;margin-bottom:24px"><h1 style="color:#ffffff;font-size:20px;margin:0 0 4px">Enquiry received, ${name.split(' ')[0]}.</h1><p style="color:#a0a09a;font-size:13px;margin:0">DexMetal — Basel Convention Compliance</p></div><p style="color:#c8c4bc;font-size:14px;line-height:1.7">Your question has been received. A practitioner-drafted response — grounded in 20+ years of operational Basel compliance experience — will be in your inbox within 24 hours.</p><div style="background:#2c2c2a;border-radius:6px;padding:16px;margin:24px 0"><p style="color:#a0a09a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px">Your question</p><p style="color:#ffffff;font-size:13px;line-height:1.7;margin:0;white-space:pre-wrap">${question}</p></div><p style="color:#c8c4bc;font-size:14px;line-height:1.7">While you wait, the <a href="https://dexmetal.com/tools" style="color:#1D9E75">free compliance tools</a> on DexMetal may be useful for your situation.</p><hr style="border:none;border-top:1px solid #3a3a38;margin:24px 0"/><p style="color:#77736b;font-size:12px;margin:0">DexMetal LLC · <a href="https://dexmetal.com" style="color:#77736b">dexmetal.com</a></p></div>`,
    })


    // Telegram alert — new lead notification
    try {
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '8746639445:AAFz99g3z4QDvOPfWKpKZ1xWjQEm-L2Kuqs'
      const telegramChatId = process.env.HERMES_CHAT_ID || '1894405483'
      const telegramMsg = `🔔 NEW LEAD — DexMetal Contact\n\nName: ${name}${company ? `\nCompany: ${company}` : ''}\nEmail: ${email}\n\nQuestion:\n${question.slice(0, 300)}${question.length > 300 ? '...' : ''}\n\nReply: richard@dexmetal.com`
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text: telegramMsg }),
      })
    } catch (_) {}

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send. Please email info@dexmetal.com directly.' }, { status: 500 })
  }
}
