import { NextRequest, NextResponse } from 'next/server'
import { getMediaStudioAuthMessage, isMediaStudioAuthorized } from '@/lib/media-studio/access'
import { listMediaStudioAssets, updateMediaStudioAsset } from '@/lib/media-studio/store'

function normalizeFalQueueModel(model: string) {
  const cleaned = model
    .trim()
    .replace(/^https:\/\/fal\.ai\/models\//, '')
    .replace(/^https:\/\/queue\.fal\.run\//, '')
    .replace(/^\/+/, '')

  const parts = cleaned.split('/').filter(Boolean)
  if (parts.length <= 2) return cleaned

  return parts.slice(0, 2).join('/')
}

function firstOutputUrl(payload: any) {
  const images: { url?: string }[] = payload?.images || payload?.data?.images || []
  return images[0]?.url || payload?.image?.url || payload?.video?.url || payload?.data?.video?.url || payload?.url || ''
}

export async function POST(request: NextRequest) {
  let body: { assetId?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage() }, { status: 401 })
  }

  const apiKey = process.env.FAL_KEY || process.env.FAL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'FAL_KEY or FAL_API_KEY is not configured.' }, { status: 503 })
  }

  try {
    const { assetId } = body
    const assets = await listMediaStudioAssets()
    const asset = assetId
      ? assets.find((a) => a.id === assetId)
      : assets.find((a) => a.status === 'queued' && a.requestId)

    if (!asset || !asset.requestId) {
      return NextResponse.json({ error: 'No queued asset with requestId found' }, { status: 404 })
    }

    const model = normalizeFalQueueModel(asset.model || 'fal-ai/flux/dev')
    const statusUrl = `https://queue.fal.run/${model}/requests/${asset.requestId}/status`
    const resultUrl = `https://queue.fal.run/${model}/requests/${asset.requestId}`

    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
      cache: 'no-store',
    })

    const statusPayload = await statusRes.json().catch(async () => ({ message: await statusRes.text() }))

    if (!statusRes.ok) {
      return NextResponse.json(
        { error: statusPayload?.message || 'fal poll failed', payload: statusPayload },
        { status: statusRes.status },
      )
    }

    const falStatus: string = statusPayload?.status ?? ''

    if (falStatus === 'COMPLETED') {
      const resultRes = await fetch(resultUrl, {
        headers: { Authorization: `Key ${apiKey}` },
        cache: 'no-store',
      })

      const resultPayload = await resultRes.json().catch(async () => ({ message: await resultRes.text() }))

      if (!resultRes.ok) {
        return NextResponse.json(
          { error: resultPayload?.message || 'fal result fetch failed', payload: resultPayload },
          { status: resultRes.status },
        )
      }

      const outputUrl = firstOutputUrl(resultPayload)
      const updated = await updateMediaStudioAsset(asset.id, {
        status: 'complete',
        outputUrl,
        metadata: { ...((asset.metadata as object) || {}), falStatus: statusPayload, falResult: resultPayload },
      })

      return NextResponse.json({ asset: updated, falStatus, outputUrl })
    }

    if (falStatus === 'FAILED' || falStatus === 'CANCELLED') {
      const updated = await updateMediaStudioAsset(asset.id, {
        status: 'failed',
        metadata: { ...((asset.metadata as object) || {}), falStatus: statusPayload },
      })
      return NextResponse.json({ asset: updated, falStatus })
    }

    return NextResponse.json({ asset, falStatus, queued: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'poll failed' }, { status: 500 })
  }
}
