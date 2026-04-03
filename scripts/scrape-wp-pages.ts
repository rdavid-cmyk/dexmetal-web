import { execSync } from 'child_process'
import fs from 'fs'

const URL = 'https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier'

const STRIP_TAGS = new Set([
  'script', 'style', 'nav', 'header', 'footer', 'aside',
  'img', 'iframe', 'form', 'input', 'button', 'select',
  'link', 'meta', 'svg', 'path',
])

function fetchViaCurl(url: string): string {
  return execSync(
    `curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`,
    { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
  )
}

function extractEntryContent(html: string): string {
  // Find the opening tag
  const ecIdx = html.indexOf('class="entry-content clear"')
  if (ecIdx === -1) throw new Error('Could not find .entry-content in page HTML')

  const divStart = html.lastIndexOf('<div', ecIdx)
  const tagEnd = html.indexOf('>', divStart)
  const contentStart = tagEnd + 1

  // Count nested divs to find the matching closing tag
  let depth = 1
  let pos = contentStart
  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf('<div', pos)
    const nextClose = html.indexOf('</div>', pos)

    if (nextClose === -1) break

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      pos = nextOpen + 4
    } else {
      depth--
      if (depth === 0) {
        return html.substring(contentStart, nextClose)
      }
      pos = nextClose + 6
    }
  }

  throw new Error('Could not find closing </div> for .entry-content')
}

function cleanHtml(raw: string): string {
  let html = raw

  // Strip unwanted tags entirely (with content)
  for (const tag of STRIP_TAGS) {
    html = html.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
    html = html.replace(new RegExp(`<${tag}[^/]*/>`, 'gi'), '')
  }

  // Remove HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // Strip all inline style attributes
  html = html.replace(/\s+style="[^"]*"/gi, '')

  // Strip class, id, role, aria, data, itemprop, itemscope, itemtype attributes
  html = html.replace(/\s+(class|id|role|aria-[\w-]+|data-[\w-]+|itemprop|itemscope|itemtype|onclick|onload|onerror)="[^"]*"/gi, '')

  // Clean up empty attributes and trailing whitespace in tags
  html = html.replace(/<(\w+)\s+>/gi, '<$1>')

  // Remove empty tags
  html = html.replace(/<(\w+)><\/\1>/gi, '')

  // Collapse excess whitespace
  let prev: string
  do {
    prev = html
    html = html.replace(/\n{3,}/g, '\n\n')
  } while (html !== prev)

  html = html.trim()

  return html
}

async function main() {
  let html: string

  console.log(`Fetching: ${URL}`)
  const raw = fetchViaCurl(URL)

  if (raw.includes('403') || !raw.includes('entry-content')) {
    console.log('Direct fetch returned 403 or no content. Trying cached file...')
    const cachedPath = '/tmp/wp-page.html'
    if (fs.existsSync(cachedPath)) {
      html = fs.readFileSync(cachedPath, 'utf-8')
      console.log(`Loaded cached file: ${html.length} bytes`)
    } else {
      throw new Error('No cached WP page found. Run: curl -sL -A "Mozilla/5.0" "https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier/" -o /tmp/wp-page.html')
    }
  } else {
    html = raw
    console.log(`Fetched ${html.length} bytes`)
  }

  const entryContent = extractEntryContent(html)
  console.log(`Extracted entry-content: ${entryContent.length} chars`)

  const cleaned = cleanHtml(entryContent)

  console.log('\n=== CLEANED HTML (first 500 chars) ===')
  console.log(cleaned.substring(0, 500))
  console.log('\n=== END ===')
  console.log(`\nTotal cleaned length: ${cleaned.length} chars`)
}

main().catch(console.error)
