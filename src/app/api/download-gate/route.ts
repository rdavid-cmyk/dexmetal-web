import { NextRequest, NextResponse } from 'next/server'
import { createSign } from 'node:crypto'

const FROM = 'DexMetal <noreply@dexmetal.com>'
const NOTIFY = 'info@dexmetal.com'
const SOURCE = 'Post 2 - Urban Mining'

const PDF_BUYER = 'https://dexmetal.com/templates/dexmetal-buyer-spec-confirmation.pdf'
const PDF_GENERATOR = 'https://dexmetal.com/templates/dexmetal-generator-source-confirmation.pdf'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Google Sheets JWT auth (no extra deps, pure node:crypto) ────────────────

function b64url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function getGoogleAccessToken(serviceEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = b64url(JSON.stringify({
    iss: serviceEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }))

  const toSign = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(toSign)
  const sig = sign.sign(privateKey, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  const jwt = `${toSign}.${sig}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Google token exchange failed: ' + JSON.stringify(data))
  return data.access_token
}

async function appendToSheet(
  spreadsheetId: string,
  serviceEmail: string,
  privateKey: string,
  row: string[],
): Promise<void> {
  const token = await getGoogleAccessToken(serviceEmail, privateKey)
  const range = 'TEMPLATE LEADS!A:D'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error('Sheets append failed: ' + err)
  }
}

// ── Email helpers ────────────────────────────────────────────────────────────

function buildVisitorEmail(firstName: string): { subject: string; html: string; text: string } {
  const subject = 'Your DexMetal templates are ready'

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1C1B18;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1B18;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#2c2c2a;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#1D9E75;padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">DexMetal</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 16px;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3;">
              Hi ${firstName}, your templates are ready.
            </h1>
            <p style="margin:0 0 24px;color:#c8c8c2;font-size:16px;line-height:1.7;">
              Here are the two source documentation templates from the Urban Mining article:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:0 0 12px 0;">
                  <a href="${PDF_BUYER}" style="display:block;background:#1D9E75;color:#ffffff;text-decoration:none;padding:16px 24px;border-radius:8px;font-size:15px;font-weight:600;text-align:center;">
                    ↓ &nbsp; Buyer Specification Confirmation Template
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="${PDF_GENERATOR}" style="display:block;background:#2c2c2a;color:#ffffff;text-decoration:none;padding:16px 24px;border-radius:8px;font-size:15px;font-weight:600;text-align:center;border:1px solid #3a3a38;">
                    ↓ &nbsp; Generator Source Confirmation Template
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 16px;color:#c8c8c2;font-size:14px;line-height:1.7;">
              Use these before any collection is dispatched — the Buyer Spec confirms your downstream buyer's acceptance criteria, and the Generator Source file documents the material at origin.
            </p>
            <p style="margin:0;color:#c8c8c2;font-size:14px;line-height:1.7;">
              Both links are permanent. Bookmark this email or forward it to your operations team.
            </p>

            <hr style="border:none;border-top:1px solid #3a3a38;margin:32px 0;">

            <p style="margin:0;color:#a09e99;font-size:13px;line-height:1.6;">
              Questions? Reply to this email or contact us at
              <a href="mailto:info@dexmetal.com" style="color:#1D9E75;text-decoration:none;">info@dexmetal.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;background:#1a1a18;">
            <p style="margin:0;color:#666662;font-size:12px;text-align:center;line-height:1.6;">
              DexMetal LLC &middot; Diego Martin, Trinidad &amp; Tobago &middot;
              <a href="https://dexmetal.com" style="color:#666662;">dexmetal.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `Hi ${firstName},

Your DexMetal templates are ready.

Buyer Specification Confirmation Template:
${PDF_BUYER}

Generator Source Confirmation Template:
${PDF_GENERATOR}

Use these before any collection is dispatched.

Questions? info@dexmetal.com
DexMetal LLC — dexmetal.com`

  return { subject, html, text }
}

function buildNotificationEmail(firstName: string, email: string): { subject: string; html: string; text: string } {
  const subject = `New lead — ${firstName} (Post 2: Urban Mining)`
  const ts = new Date().toLocaleString('en-TT', { timeZone: 'America/Port_of_Spain' })
  const html = `<p><strong>New download gate lead captured</strong></p>
<ul>
  <li><strong>Name:</strong> ${firstName}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Source:</strong> ${SOURCE}</li>
  <li><strong>Time (AST):</strong> ${ts}</li>
</ul>
<p>Templates delivered to visitor automatically.</p>`
  const text = `New lead — ${SOURCE}\nName: ${firstName}\nEmail: ${email}\nTime: ${ts}`
  return { subject, html, text }
}

async function sendEmail(apiKey: string, to: string, from: string, subject: string, html: string, text: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend send failed (${to}): ${err}`)
  }
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, email } = body

    if (!firstName?.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const name = firstName.trim()
    const ts = new Date().toISOString()

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[download-gate] RESEND_API_KEY not set')
      return NextResponse.json({ error: 'Mail service not configured' }, { status: 500 })
    }

    // Fire all three side effects — fail fast on email delivery, log-and-continue on the rest
    const { subject: vs, html: vh, text: vt } = buildVisitorEmail(name)
    await sendEmail(apiKey, email, FROM, vs, vh, vt)
    console.log('[download-gate] Templates delivered to:', email)

    // Notification to Richard — non-blocking
    const { subject: ns, html: nh, text: nt } = buildNotificationEmail(name, email)
    sendEmail(apiKey, NOTIFY, FROM, ns, nh, nt).catch(err =>
      console.error('[download-gate] Notification failed:', err),
    )

    // Google Sheets — non-blocking, skips if env vars absent
    const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const saKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (sheetId && saEmail && saKey) {
      appendToSheet(sheetId, saEmail, saKey, [ts, name, email, SOURCE]).catch(err =>
        console.error('[download-gate] Sheet append failed:', err),
      )
    } else {
      console.log('[download-gate] Google Sheets env vars not set — skipping sheet append')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[download-gate] Error:', err)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
