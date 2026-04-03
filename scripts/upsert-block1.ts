import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Reused from migrate-wp-content.ts ────────────────────────────────────────

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'").replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;/g, '...')
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, ' ')
}

function cleanHtml(raw: string): string {
  let html = raw
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '')
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  html = html.replace(/\[[^\]]*\]/g, '')
  html = html.replace(/\s+style=(?:"[^"]*"|'[^']*')/gi, '')
  html = html.replace(/\s+class=(?:"[^"]*"|'[^']*')/gi, '')
  html = html.replace(/\r\n?/g, '\n')
  html = html.replace(/>\s*\n\s*</g, '><')
  return html.trim()
}

function makeTextNode(text: string, format: number = 0): any {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}
function makeParagraphNode(children: any[]): any {
  return { children, direction: 'ltr', format: '', indent: 0, textFormat: 0, type: 'paragraph', version: 1 }
}
function makeHeadingNode(tag: string, children: any[]): any {
  return { children, direction: 'ltr', format: '', indent: 0, tag, textFormat: 0, type: 'heading', version: 1 }
}
function makeListNode(listType: 'bullet' | 'number', tag: string, children: any[]): any {
  return { children, direction: 'ltr', format: '', indent: 0, listType, start: 1, tag, type: 'list', version: 1 }
}
function makeListItemNode(children: any[], value: number): any {
  return { checked: false, children, direction: 'ltr', format: '', indent: 0, type: 'listitem', value, version: 1 }
}
function makeLinkNode(url: string, children: any[]): any {
  return { children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 3, fields: { linkType: 'custom', newTab: false, url } }
}

function parseInlineNodes(html: string): any[] {
  const nodes: any[] = []
  let pos = 0
  while (pos < html.length) {
    const tagStart = html.indexOf('<', pos)
    if (tagStart === -1) {
      const text = decodeEntities(html.slice(pos)).replace(/\s+/g, ' ').trim()
      if (text) nodes.push(makeTextNode(text))
      break
    }
    if (tagStart > pos) {
      const text = decodeEntities(html.slice(pos, tagStart)).replace(/\s+/g, ' ').trim()
      if (text) nodes.push(makeTextNode(text))
    }
    const tagEnd = html.indexOf('>', tagStart)
    if (tagEnd === -1) { pos = html.length; break }
    const tagInner = html.slice(tagStart + 1, tagEnd)
    if (tagInner.startsWith('/') || tagInner.endsWith('/')) { pos = tagEnd + 1; continue }
    const tagName = tagInner.split(/[\s/]/)[0].toLowerCase()
    if (tagName === 'strong' || tagName === 'b') {
      const closeIdx = html.toLowerCase().indexOf(`</${tagName}>`, tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        for (const n of inner) { if (n.type === 'text') n.format = n.format | 1 }
        nodes.push(...inner); pos = closeIdx + (`</${tagName}>`).length
      } else { pos = tagEnd + 1 }
      continue
    }
    if (tagName === 'em' || tagName === 'i') {
      const closeIdx = html.toLowerCase().indexOf(`</${tagName}>`, tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        for (const n of inner) { if (n.type === 'text') n.format = n.format | 2 }
        nodes.push(...inner); pos = closeIdx + (`</${tagName}>`).length
      } else { pos = tagEnd + 1 }
      continue
    }
    if (tagName === 'a') {
      const hrefMatch = tagInner.match(/href="([^"]*)"/)
      const url = hrefMatch ? hrefMatch[1] : ''
      const closeIdx = html.toLowerCase().indexOf('</a>', tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        if (inner.length > 0 && url) nodes.push(makeLinkNode(url, inner))
        else if (inner.length > 0) nodes.push(...inner)
        pos = closeIdx + 4
      } else { pos = tagEnd + 1 }
      continue
    }
    pos = tagEnd + 1
  }
  return nodes.filter((n) => n.type !== 'text' || n.text.length > 0)
}

function parseListItems(html: string): any[] {
  const items: any[] = []
  let remaining = html.trim()
  let value = 1
  while (remaining.length > 0) {
    const liMatch = remaining.match(/^<li[^>]*>([\s\S]*?)<\/li>/i)
    if (liMatch) {
      const inlineNodes = parseInlineNodes(liMatch[1])
      if (inlineNodes.length > 0) items.push(makeListItemNode(inlineNodes, value++))
      remaining = remaining.slice(liMatch[0].length).trim()
      continue
    }
    const skipTag = remaining.match(/^<[^>]+>/)
    if (skipTag) { remaining = remaining.slice(skipTag[0].length).trim(); continue }
    const skipText = remaining.match(/^[^<]+/)
    if (skipText) { remaining = remaining.slice(skipText[0].length).trim(); continue }
    remaining = remaining.slice(1)
  }
  return items
}

function plainTextFallback(cleanedHtml: string): any {
  const text = decodeEntities(cleanedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  return { root: { children: [makeParagraphNode([makeTextNode(text || '(no content)')])], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}

function htmlToLexical(cleanedHtml: string): any {
  if (!cleanedHtml || cleanedHtml.trim().length === 0) return plainTextFallback('')
  const children: any[] = []
  let remaining = cleanedHtml.trim()
  while (remaining.length > 0) {
    remaining = remaining.trim()
    const hMatch = remaining.match(/^<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/i)
    if (hMatch) {
      const inlineNodes = parseInlineNodes(hMatch[2])
      if (inlineNodes.length > 0) children.push(makeHeadingNode(hMatch[1].toLowerCase(), inlineNodes))
      remaining = remaining.slice(hMatch[0].length); continue
    }
    const pMatch = remaining.match(/^<p[^>]*>([\s\S]*?)<\/p>/i)
    if (pMatch) {
      const inlineNodes = parseInlineNodes(pMatch[1])
      if (inlineNodes.length > 0) children.push(makeParagraphNode(inlineNodes))
      remaining = remaining.slice(pMatch[0].length); continue
    }
    const ulMatch = remaining.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i)
    if (ulMatch) {
      const items = parseListItems(ulMatch[1])
      if (items.length > 0) children.push(makeListNode('bullet', 'ul', items))
      remaining = remaining.slice(ulMatch[0].length); continue
    }
    const olMatch = remaining.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i)
    if (olMatch) {
      const items = parseListItems(olMatch[1])
      if (items.length > 0) children.push(makeListNode('number', 'ol', items))
      remaining = remaining.slice(olMatch[0].length); continue
    }
    const tableMatch = remaining.match(/^<table[\s\S]*?<\/table>/i)
    if (tableMatch) { remaining = remaining.slice(tableMatch[0].length); continue }
    const blockMatch = remaining.match(/^<(div|section|article|aside|blockquote|figure|main)[^>]*>([\s\S]*?)<\/\1>/i)
    if (blockMatch) {
      const inner = htmlToLexical(blockMatch[2])
      children.push(...inner.root.children)
      remaining = remaining.slice(blockMatch[0].length); continue
    }
    const tagMatch = remaining.match(/^<[^>]+>/)
    if (tagMatch) { remaining = remaining.slice(tagMatch[0].length); continue }
    const textMatch = remaining.match(/^([^<]+)/)
    if (textMatch) {
      const text = decodeEntities(textMatch[1]).trim()
      if (text) children.push(makeParagraphNode([makeTextNode(text)]))
      remaining = remaining.slice(textMatch[0].length); continue
    }
    remaining = remaining.slice(1)
  }
  if (children.length > 0) {
    return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
  }
  return plainTextFallback(cleanedHtml)
}

function validateLexical(doc: any): boolean {
  if (!doc || typeof doc !== 'object') return false
  const { root } = doc
  if (!root || !Array.isArray(root.children) || root.children.length === 0) return false
  for (const child of root.children) {
    if (!child || typeof child !== 'object') return false
    if (!Array.isArray(child.children) || child.children.length === 0) return false
    if (!child.type || !child.version) return false
  }
  return true
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const htmlPath = path.resolve(__dirname, 'block1-sample.html')
  if (!fs.existsSync(htmlPath)) {
    console.error(`ERROR: block1-sample.html not found at ${htmlPath}`)
    process.exit(1)
  }

  const rawHtml = fs.readFileSync(htmlPath, 'utf-8')
  const cleaned = cleanHtml(rawHtml)
  const lexical = htmlToLexical(cleaned)

  if (!validateLexical(lexical)) {
    console.error('ERROR: Lexical validation failed')
    process.exit(1)
  }

  console.log(`Lexical valid: ${lexical.root.children.length} children`)

  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  const slug = 'block-1-exporter-notifier-registration'
  const title = 'Block 1: Exporter-Notifier Registration'

  // Check existing
  const existing = await payload.find({
    collection: 'knowledge-hub-pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const recordData = {
    title,
    slug,
    section: 'Notification Doc' as any,
    pageType: 'reference' as any,
    priority: 'P2' as any,
    content: lexical,
    wpUrl: 'https://dexmetal.com/data-library/form-fields/block-1-exporter-notifier',
    wpPostId: 5406,
    redirectFrom: '/knowledge-hub/notification-exporter-notifier-registration',
    publishedAt: new Date().toISOString(),
  }

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'knowledge-hub-pages',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: recordData,
    })
    console.log(`Updated: ${title} (slug: ${slug})`)
  } else {
    await payload.create({
      collection: 'knowledge-hub-pages',
      overrideAccess: true,
      data: recordData,
    })
    console.log(`Created: ${title} (slug: ${slug})`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
