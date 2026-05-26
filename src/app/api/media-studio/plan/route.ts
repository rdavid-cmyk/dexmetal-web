import { NextRequest, NextResponse } from 'next/server'
import { getMediaStudioAuthMessage, isMediaStudioAuthorized } from '@/lib/media-studio/access'
import {
  buildMediaStudioPlan,
  extractReadableTextFromHtml,
  extractTitleFromHtml,
} from '@/lib/media-studio/planner'
import { createMediaStudioAsset } from '@/lib/media-studio/store'

export async function POST(request: NextRequest) {
  if (!isMediaStudioAuthorized(request)) {
    return NextResponse.json({ error: getMediaStudioAuthMessage() }, { status: 401 })
  }

  try {
    const body = await request.json()
    const sourceUrl = typeof body.sourceUrl === 'string' ? body.sourceUrl.trim() : ''
    let sourceTitle = typeof body.sourceTitle === 'string' ? body.sourceTitle.trim() : ''
    let sourceText = typeof body.sourceText === 'string' ? body.sourceText.trim() : ''

    if (!sourceText && sourceUrl) {
      const response = await fetch(sourceUrl, {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        cache: 'no-store',
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: `Could not fetch source URL (${response.status})` },
          { status: 502 },
        )
      }

      const html = await response.text()
      sourceTitle = sourceTitle || extractTitleFromHtml(html)
      sourceText = extractReadableTextFromHtml(html)
    }

    if (!sourceText || sourceText.length < 80) {
      return NextResponse.json(
        { error: 'Provide a blog URL or at least 80 characters of source text.' },
        { status: 400 },
      )
    }

    const plan = buildMediaStudioPlan({
      sourceUrl: sourceUrl || undefined,
      sourceTitle,
      sourceText,
    })

    await createMediaStudioAsset({
      kind: 'script',
      status: 'draft',
      title: plan.sourceTitle,
      sourceUrl: plan.sourceUrl,
      planId: plan.id,
      notes: plan.clips.map((clip) => `${clip.title}\n${clip.hook}\n${clip.script}`).join('\n\n---\n\n'),
      metadata: { plan },
    })

    for (const [index, prompt] of plan.thumbnailPrompts.entries()) {
      await createMediaStudioAsset({
        kind: 'thumbnail',
        status: 'draft',
        title: `${plan.sourceTitle} thumbnail ${index + 1}`,
        prompt,
        sourceUrl: plan.sourceUrl,
        planId: plan.id,
      })
    }

    return NextResponse.json({ plan })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Plan generation failed' }, { status: 500 })
  }
}

