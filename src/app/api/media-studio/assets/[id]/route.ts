import { NextRequest, NextResponse } from 'next/server'
import { getMediaStudioAuthMessage, isMediaStudioAuthorized } from '@/lib/media-studio/access'
import { updateMediaStudioAsset } from '@/lib/media-studio/store'

type Args = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: Args) {
  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage() }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const asset = await updateMediaStudioAsset(id, body)

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ asset })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Asset update failed' }, { status: 500 })
  }
}

