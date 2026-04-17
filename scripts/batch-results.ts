/**
 * Anthropic Message Batch — poll and retrieve content enrichment results
 *
 * Reads the batch_id written by batch:content, polls until the batch is
 * complete, then streams results and logs a summary of pages processed.
 *
 * Usage:
 *   pnpm batch:results
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface BatchState {
  batch_id: string
  page_count: number
  created_at: string
}

const POLL_INTERVAL_MS = 60_000

async function main() {
  const stateFile = path.join(__dirname, 'batch-state.json')

  if (!fs.existsSync(stateFile)) {
    console.error('No batch-state.json found. Run pnpm batch:content first.')
    process.exit(1)
  }

  const state: BatchState = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
  console.log(`Batch ID:    ${state.batch_id}`)
  console.log(`Pages:       ${state.page_count}`)
  console.log(`Submitted:   ${state.created_at}`)
  console.log('')

  const client = new Anthropic()

  let batch = await client.messages.batches.retrieve(state.batch_id)

  while (batch.processing_status !== 'ended') {
    const { processing, succeeded, errored, expired, canceled } = batch.request_counts
    console.log(
      `Status: ${batch.processing_status} — ` +
        `processing: ${processing}, succeeded: ${succeeded}, ` +
        `errored: ${errored}, expired: ${expired}, canceled: ${canceled}`,
    )
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
    batch = await client.messages.batches.retrieve(state.batch_id)
  }

  console.log('Batch complete. Downloading results...\n')

  let succeeded = 0
  let errored = 0
  let expired = 0

  for await (const result of await client.messages.batches.results(state.batch_id)) {
    switch (result.result.type) {
      case 'succeeded': {
        succeeded++
        const text = result.result.message.content.find(b => b.type === 'text')
        const preview = text?.type === 'text' ? text.text.slice(0, 80).replace(/\n/g, ' ') : ''
        console.log(`✓ ${result.custom_id}: ${preview}…`)
        break
      }
      case 'errored':
        errored++
        console.warn(`✗ ${result.custom_id}: ${result.result.error.type}`)
        break
      case 'expired':
        expired++
        console.warn(`⚠ ${result.custom_id}: expired — resubmit with pnpm batch:content`)
        break
    }
  }

  console.log(`
Summary
-------
Pages submitted:  ${state.page_count}
Succeeded:        ${succeeded}
Errored:          ${errored}
Expired:          ${expired}
  `)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
