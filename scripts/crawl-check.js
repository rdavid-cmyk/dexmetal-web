import { createRequire } from 'module'

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb'
const SERVER_URL = (process.env.SERVER_URL || 'http://204.168.231.188:3000').replace(/\/$/, '')

const STATIC_PATHS = ['/', '/knowledge-hub', '/about', '/contact', '/blog', '/tools']

function normalizeSlug(slug) {
  return String(slug || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
}

async function fetchStatus(pathname) {
  const url = `${SERVER_URL}${pathname}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    })

    console.log(`${response.status} ${pathname}`)
    return { pathname, status: response.status }
  } catch (error) {
    console.log(`ERROR ${pathname} ${error.message}`)
    return { pathname, status: 'ERROR', error: error.message }
  }
}

async function main() {
  const require = createRequire(import.meta.url)
  const payloadDbPostgresPath = require.resolve('@payloadcms/db-postgres')
  const payloadScopedRequire = createRequire(payloadDbPostgresPath)
  const { Client: PgClient } = payloadScopedRequire('pg')
  const client = new PgClient({ connectionString: DATABASE_URL })

  try {
    await client.connect()
    const queryResult = await client.query(`
      select slug
      from knowledge_hub_pages
      where slug is not null
      order by slug asc
    `)
    const rows = queryResult.rows

    const knowledgeHubPaths = rows.map(({ slug }) => `/knowledge-hub/${normalizeSlug(slug)}`)
    const paths = [...STATIC_PATHS, ...knowledgeHubPaths]
    const results = []

    for (const pathname of paths) {
      results.push(await fetchStatus(pathname))
    }

    const ok = results.filter((result) => result.status === 200)
    const nonOk = results.filter((result) => result.status !== 200)

    console.log('')
    console.log(`Total checked: ${results.length}`)
    console.log(`Total 200: ${ok.length}`)
    console.log('Non-200:')
    if (nonOk.length === 0) {
      console.log('None')
    } else {
      for (const result of nonOk) {
        console.log(`${result.status} ${result.pathname}`)
      }
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
