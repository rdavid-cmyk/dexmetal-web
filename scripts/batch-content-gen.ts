/**
 * Anthropic Message Batch — knowledge hub content enrichment
 *
 * Reads every knowledge_hub_pages row that has title + content, submits one
 * Anthropic batch request per page, and writes the returned batch_id to
 * scripts/batch-state.json for retrieval by batch:results.
 *
 * Usage:
 *   pnpm batch:content
 */

import Anthropic from '@anthropic-ai/sdk'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SYSTEM_PROMPT =
  'You are a Basel Convention compliance expert. Given this Knowledge Hub page content, ' +
  'write an improved 500-word expert summary optimized for search and AI citation. ' +
  'Return plain text only.'

function extractText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return ''
  const children = (root as Record<string, unknown>).children
  if (!Array.isArray(children)) return ''

  const texts: string[] = []
  const traverse = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const n = node as Record<string, unknown>
    if (n.type === 'text' && typeof n.text === 'string') texts.push(n.text)
    if (Array.isArray(n.children)) n.children.forEach(traverse)
  }
  children.forEach(traverse)
  return texts.join(' ')
}

async function main() {
  const db = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb',
  })
  await db.connect()

  const { rows } = await db.query<{
    id: number
    slug: string
    title: string
    content: unknown
  }>('SELECT id, slug, title, content FROM knowledge_hub_pages ORDER BY id')
  await db.end()

  const pages = rows.filter(r => r.title && r.content)
  console.log(`Found ${pages.length} pages to process`)

  if (pages.length === 0) {
    console.log('Nothing to do.')
    process.exit(0)
  }

  const client = new Anthropic()

  const requests = pages.map(page => ({
    custom_id: `page-${page.id}`,
    params: {
      model: 'claude-opus-4-7' as const,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user' as const,
          content: `Title: ${page.title}\n\nContent:\n${extractText(page.content).slice(0, 2000)}`,
        },
      ],
    },
  }))

  const batch = await client.messages.batches.create({ requests })

  const stateFile = path.join(__dirname, 'batch-state.json')
  fs.writeFileSync(
    stateFile,
    JSON.stringify(
      {
        batch_id: batch.id,
        page_count: pages.length,
        created_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  )

  console.log(`Batch submitted:  ${batch.id}`)
  console.log(`Pages queued:     ${pages.length}`)
  console.log(`State saved to:   ${stateFile}`)
  console.log(`\nRun 'pnpm batch:results' to poll for completion and download results.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
