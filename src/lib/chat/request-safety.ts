/**
 * Untrusted browser/API JSON must never be forwarded directly into LLM message roles.
 * This is an input boundary, not a substitute for retrieval or prompt-injection defenses.
 */
export type SafeChatMessage = { role: 'user' | 'assistant'; content: string }

export type SafeChatRequest = {
  message: string
  history: SafeChatMessage[]
}

const MAX_MESSAGE_CHARS = 4000
const MAX_HISTORY_ITEMS = 12
const MAX_HISTORY_CHARS = 2000

export function normalizeChatRequest(value: unknown): SafeChatRequest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const body = value as Record<string, unknown>

  if (typeof body.message !== 'string') return null
  const message = body.message.trim()
  if (!message || message.length > MAX_MESSAGE_CHARS) return null

  const rawHistory = body.history === undefined ? [] : body.history
  if (!Array.isArray(rawHistory) || rawHistory.length > MAX_HISTORY_ITEMS) return null

  const history: SafeChatMessage[] = []
  for (const item of rawHistory) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null
    const msg = item as Record<string, unknown>
    if (msg.role !== 'user' && msg.role !== 'assistant') return null
    if (typeof msg.content !== 'string') return null
    const content = msg.content.trim()
    if (!content || content.length > MAX_HISTORY_CHARS) return null
    history.push({ role: msg.role, content })
  }

  return { message, history }
}
