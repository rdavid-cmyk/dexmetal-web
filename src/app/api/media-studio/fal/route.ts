import { NextRequest, NextResponse } from 'next/server'
import { getMediaStudioAuthMessage, isMediaStudioAuthorized } from '@/lib/media-studio/access'
import { createMediaStudioAsset, updateMediaStudioAsset } from '@/lib/media-studio/store'

function normalizeModel(model: string) {
  return model
    .trim()
    .replace(/^https:\/\/fal\.ai\/models\//, '')
    .replace(/^https:\/\/queue\.fal\.run\//, '')
    .replace(/^\/+/, '')
}

export async function POST(request: NextRequest) {
  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage() }, { status: 401 })
  }

  const apiKey = process.env.FAL_KEY || process.env.FAL_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'FAL_KEY or FAL_API_KEY is not configured.' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const model = typeof body.model === 'string' ? normalizeModel(body.model) : ''
    const input = body.input && typeof body.input === 'object' ? body.input : {}

    if (!model) {
      return NextResponse.json({ error: 'model is required' }, { status: 400 })
    }

    const queuedAsset =
      typeof body.assetId === 'string'
        ? await updateMediaStudioAsset(body.assetId, {
            status: 'queued',
            model,
            prompt: typeof input.prompt === 'string' ? input.prompt : undefined,
            metadata: { input },
          })
        : await createMediaStudioAsset({
            kind: model.includes('video') ? 'video' : 'image',
            status: 'queued',
            title: body.title || `fal job: ${model}`,
            model,
            prompt: typeof input.prompt === 'string' ? input.prompt : undefined,
            metadata: { input },
          })

    const response = await fetch(`https://queue.fal.run/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    })

    const payload = await response.json().catch(async () => ({ message: await response.text() }))

    if (!response.ok) {
      if (queuedAsset) {
        await updateMediaStudioAsset(queuedAsset.id, {
          status: 'failed',
          metadata: { input, falError: payload },
        })
      }

      return NextResponse.json(
        { error: payload?.message || `fal queue failed (${response.status})`, payload },
        { status: response.status },
      )
    }

    if (queuedAsset) {
      await updateMediaStudioAsset(queuedAsset.id, {
        status: 'queued',
        requestId: payload.request_id,
        metadata: { input, fal: payload },
      })
    }

    return NextResponse.json({ asset: queuedAsset, fal: payload })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'fal queue failed' }, { status: 500 })
  }
}

