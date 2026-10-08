import { NextResponse } from 'next/server'

const disabled = () =>
  NextResponse.json(
    { error: 'Cloud project storage is temporarily disabled while access controls are upgraded.' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )

export const GET = disabled
export const POST = disabled
