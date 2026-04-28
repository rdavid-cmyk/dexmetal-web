import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const CSV_FILE = join(DATA_DIR, 'email-captures.csv')

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function addToBrevo(email: string, tool: string) {
  const apiKey = process.env.BREVO_API_KEY
  const listId = process.env.BREVO_LIST_ID

  if (!apiKey || !listId) {
    console.log('[capture-email] No Brevo config, skipping')
    return
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          TOOL: tool,
          CAPTURED_AT: new Date().toISOString(),
        },
        listIds: [parseInt(listId)],
        updateEnabled: true,
      }),
    })

    if (response.ok) {
      console.log('[capture-email] Added to Brevo:', email, tool)
    } else {
      const err = await response.text()
      console.log('[capture-email] Brevo error:', err)
    }
  } catch (err) {
    console.log('[capture-email] Brevo exception:', err)
  }
}

async function addToResend(email: string, tool: string) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    console.log('[capture-email] No Resend config, skipping')
    return
  }

  try {
    const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        data: {
          tool,
          captured_at: new Date().toISOString(),
        },
      }),
    })

    if (response.ok) {
      console.log('[capture-email] Added to Resend audience:', email, tool)
    } else {
      const err = await response.text()
      console.log('[capture-email] Resend error:', err)
    }
  } catch (err) {
    console.log('[capture-email] Resend exception:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, tool, timestamp } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!tool) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
    }

    const ts = timestamp || new Date().toISOString()
    const nameValue = name || ''
    const row = '"' + ts + '","' + email + '","' + nameValue + '","' + tool + '"'

    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }

    const fileExists = existsSync(CSV_FILE)
    if (!fileExists) {
      appendFileSync(CSV_FILE, 'timestamp,email,name,tool\n')
    }

    appendFileSync(CSV_FILE, row + '\n')

    console.log('[capture-email] Captured:', email, tool)

    addToBrevo(email, tool).catch(console.error)
    addToResend(email, tool).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[capture-email] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
