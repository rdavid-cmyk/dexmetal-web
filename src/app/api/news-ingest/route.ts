import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { NewsArticle } from '@/payload-types'

export const dynamic = 'force-dynamic'

type ValidTag = NonNullable<NonNullable<NewsArticle['tags']>[number]['tag']>

const VALID_TAGS: ValidTag[] = [
  'basel',
  'ewaste',
  'hazardous-waste',
  'compliance',
  'trade',
  'recycling',
  'regulation',
]

interface ArticleInput {
  title: string
  url: string
  source?: string
  summary?: string
  relevance_score?: number
  published_at?: string
  tags?: string[]
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-ingest-key')
  if (!key || key !== process.env.NEWS_INGEST_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { articles: ArticleInput[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { articles } = body
  if (!Array.isArray(articles)) {
    return NextResponse.json({ error: 'articles must be an array' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  let ingested = 0
  let skipped = 0

  for (const article of articles) {
    if (!article.title || !article.url) {
      skipped++
      continue
    }

    // Reject articles older than 90 days
    if (article.published_at) {
      const age = Date.now() - new Date(article.published_at).getTime()
      const ninetyDays = 90 * 24 * 60 * 60 * 1000
      if (age > ninetyDays) {
        skipped++
        continue
      }
    }

    try {
      const existing = await payload.find({
        collection: 'news-articles',
        where: { url: { equals: article.url } },
        limit: 1,
        overrideAccess: true,
      })

      const tags = (article.tags || [])
        .filter((t): t is ValidTag => (VALID_TAGS as string[]).includes(t))
        .map((t) => ({ tag: t }))

      const data = {
        title: article.title,
        url: article.url,
        source: article.source || null,
        summary: article.summary || null,
        relevance_score: article.relevance_score ?? null,
        published_at: article.published_at || null,
        tags,
        fetched_at: new Date().toISOString(),
      }

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'news-articles',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
        skipped++
      } else {
        await payload.create({
          collection: 'news-articles',
          data,
          overrideAccess: true,
        })
        ingested++
      }
    } catch (err) {
      console.error('[news-ingest] Error processing article:', article.url, err)
      skipped++
    }
  }

  return NextResponse.json({ ingested, skipped })
}
