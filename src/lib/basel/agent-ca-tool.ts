/** Read-only CA lookup for explicit requests. No privileged or payment tools. */
export type CAContact = {
  country: string
  code: string
  authority_name: string
  website?: string
  last_verified?: string
}

export function requestedCACountry(message: string): string | null {
  const trimmed = message.trim()
  const match = trimmed.match(/^(?:(?:please\s+)?(?:find|show|get|look up|lookup)\s+|(?:who|what|which)\s+is\s+)?(?:the\s+)?(?:basel\s+)?(?:competent authority|ca contacts?|authority contacts?|ca)(?:\s+contacts?)?\s+(?:for|in|of)\s+([a-zA-Z][a-zA-Z .'-]{1,69})[?.!]?$/i)
  if (!match) return null
  const country = match[1].trim().replace(/[?.!]$/, '').trim()
  return country.length >= 2 && country.length <= 70 ? country : null
}

export async function readOnlyCALookup(country: string): Promise<CAContact[] | null> {
  const key = process.env.BASEL_CA_API_KEY
  if (!key || !/^[a-zA-Z][a-zA-Z .'-]{1,69}$/.test(country)) return null
  const base = process.env.BASEL_CA_API_URL || 'https://api.dexmetal.com'
  try {
    const url = new URL('/api/v1/ca', base)
    url.searchParams.set('country', country)
    const response = await fetch(url, {
      headers: { 'X-API-Key': key, Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    })
    if (!response.ok) return null
    const data: unknown = await response.json()
    if (!data || typeof data !== 'object') return null
    const items = (data as { items?: unknown }).items
    if (!Array.isArray(items)) return null
    const requested = country.toLowerCase()
    const matched = items.filter((item) => {
      if (!item || typeof item !== 'object') return false
      const row = item as Record<string, unknown>
      return String(row.country_name || '').toLowerCase() === requested ||
        (requested.length === 2 && String(row.country_code || '').toLowerCase() === requested)
    })
    return matched.slice(0, 3).map((row: Record<string, unknown>) => ({
      country: String(row.country_name || '').slice(0, 100),
      code: String(row.country_code || '').slice(0, 5),
      authority_name: String(row.ca_name || 'Not supplied').slice(0, 180),
      website: /^https?:\/\//i.test(String(row.website || '')) ? String(row.website).slice(0, 300) : undefined,
      last_verified: String(row.last_verified_date || '').slice(0, 30) || undefined,
    }))
  } catch {
    return null
  }
}

export function formatCAResponse(contacts: CAContact[] | null, country: string): string {
  if (!contacts?.length) return `I could not verify a competent authority record for ${country} right now. Please check the official Basel Convention country contacts and ask the authority directly before shipping.`
  const details = contacts.map(c => `${c.country} (${c.code}): ${c.authority_name}.${c.website ? ' Website: ' + c.website + '.' : ''}${c.last_verified ? ' Database last-verified date: ' + c.last_verified + '.' : ''}`).join('\n')
  return `${details}\n\nSource: DexMetal Competent Authorities API (secondary directory). Confirm current contacts and shipment-specific rules with the relevant authorities before acting. No shipment approval is implied.`
}
