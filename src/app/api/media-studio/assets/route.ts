import { NextRequest, NextResponse } from 'next/server'
import { getMediaStudioAuthMessage, isMediaStudioAuthorized } from '@/lib/media-studio/access'
import { createMediaStudioAsset, listMediaStudioAssets } from '@/lib/media-studio/store'

export async function GET(request: NextRequest) {
  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage(), assets: [] }, { status: 401 })
  }

  const assets = await listMediaStudioAssets()
  return NextResponse.json({ assets })
}

export async function POST(request: NextRequest) {
  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage() }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body?.title || !body?.kind) {
      return NextResponse.json({ error: 'title and kind are required' }, { status: 400 })
    }

    const asset = await createMediaStudioAsset(body)
    return NextResponse.json({ asset }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Asset creation failed' }, { status: 500 })
  }
}

