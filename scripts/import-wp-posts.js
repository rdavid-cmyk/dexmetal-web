import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'

import 'dotenv/config'
import { tsImport } from 'tsx/esm/api'
import { getPayload } from 'payload'

process.env.DATABASE_URL ||= 'postgres://dexmetal:dexmetal2026@127.0.0.1:5432/dexmetalweb'

const WP_API_BASE = 'https://dexmetal.com/wp-json/wp/v2'
const POSTS_URL = `${WP_API_BASE}/posts?per_page=20&_embed`
const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'blog-images')
const BLOG_IMAGES_PUBLIC_PREFIX = '/blog-images/'

const downloadedImageCache = new Map()
const mediaCache = new Map()
const categoryCache = new Map()

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function decodeEntities(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number.parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, ' ')
}

function stripHtml(html) {
  return decodeEntities(String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function guessExtension(url, contentType) {
  try {
    const parsed = new URL(url)
    const ext = path.extname(parsed.pathname)
    if (ext) return ext.toLowerCase()
  } catch {
    // ignore
  }

  if (contentType?.includes('png')) return '.png'
  if (contentType?.includes('gif')) return '.gif'
  if (contentType?.includes('webp')) return '.webp'
  if (contentType?.includes('svg')) return '.svg'
  return '.jpg'
}

function sanitizeFilename(input) {
  const ext = path.extname(input)
  const base = path.basename(input, ext)
  const safeBase = slugify(base) || `image-${Date.now()}`
  return `${safeBase}${ext || '.jpg'}`
}

function makeTextNode(text, format = 0) {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function makeParagraphNode(children) {
  return { children, direction: 'ltr', format: '', indent: 0, textFormat: 0, type: 'paragraph', version: 1 }
}

function makeHeadingNode(tag, children) {
  return { children, direction: 'ltr', format: '', indent: 0, tag, textFormat: 0, type: 'heading', version: 1 }
}

function makeListNode(listType, tag, children) {
  return { children, direction: 'ltr', format: '', indent: 0, listType, start: 1, tag, type: 'list', version: 1 }
}

function makeListItemNode(children, value) {
  return { checked: false, children, direction: 'ltr', format: '', indent: 0, type: 'listitem', value, version: 1 }
}

function makeLinkNode(url, children) {
  return {
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', newTab: false, url },
  }
}

function makeMediaBlockNode(mediaId) {
  return {
    type: 'block',
    fields: {
      blockName: '',
      blockType: 'mediaBlock',
      media: mediaId,
    },
    format: '',
    version: 2,
  }
}

function plainTextFallback(cleanedHtml) {
  const text = decodeEntities(cleanedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  return {
    root: {
      children: [makeParagraphNode([makeTextNode(text || '(no content)')])],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function validateLexical(doc) {
  if (!doc || typeof doc !== 'object') return false
  const { root } = doc
  if (!root || !Array.isArray(root.children) || root.children.length === 0) return false
  for (const child of root.children) {
    if (!child || typeof child !== 'object') return false
    if (!child.type || !child.version) return false
  }
  return true
}

function cleanHtml(raw) {
  let html = String(raw || '')
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '')
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  html = html.replace(/\[[^\]]*\]/g, '')
  html = html.replace(/\s+style=(?:"[^"]*"|'[^']*')/gi, '')
  html = html.replace(/\s+class=(?:"[^"]*"|'[^']*')/gi, '')
  html = html.replace(/\s+srcset=(?:"[^"]*"|'[^']*')/gi, '')
  html = html.replace(/\r\n?/g, '\n')
  html = html.replace(/>\s*\n\s*</g, '><')
  return html.trim()
}

function parseInlineNodes(html) {
  const nodes = []
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
    if (tagEnd === -1) {
      pos = html.length
      break
    }

    const tagInner = html.slice(tagStart + 1, tagEnd)

    if (tagInner.startsWith('/') || tagInner.endsWith('/')) {
      pos = tagEnd + 1
      continue
    }

    const tagName = tagInner.split(/[\s/]/)[0].toLowerCase()

    if (tagName === 'strong' || tagName === 'b') {
      const closeTag = `</${tagName}>`
      const closeIdx = html.toLowerCase().indexOf(closeTag, tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        for (const node of inner) {
          if (node.type === 'text') node.format = node.format | 1
        }
        nodes.push(...inner)
        pos = closeIdx + closeTag.length
      } else {
        pos = tagEnd + 1
      }
      continue
    }

    if (tagName === 'em' || tagName === 'i') {
      const closeTag = `</${tagName}>`
      const closeIdx = html.toLowerCase().indexOf(closeTag, tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        for (const node of inner) {
          if (node.type === 'text') node.format = node.format | 2
        }
        nodes.push(...inner)
        pos = closeIdx + closeTag.length
      } else {
        pos = tagEnd + 1
      }
      continue
    }

    if (tagName === 'a') {
      const hrefMatch = tagInner.match(/href=(["'])(.*?)\1/i)
      const url = hrefMatch ? hrefMatch[2] : ''
      const closeIdx = html.toLowerCase().indexOf('</a>', tagEnd + 1)
      if (closeIdx !== -1) {
        const inner = parseInlineNodes(html.slice(tagEnd + 1, closeIdx))
        if (inner.length > 0 && url) nodes.push(makeLinkNode(url, inner))
        else if (inner.length > 0) nodes.push(...inner)
        pos = closeIdx + 4
      } else {
        pos = tagEnd + 1
      }
      continue
    }

    if (tagName === 'br') {
      pos = tagEnd + 1
      continue
    }

    pos = tagEnd + 1
  }

  return nodes.filter((node) => node.type !== 'text' || node.text.length > 0)
}

function parseParagraphBlocks(html, mediaByUrl) {
  const blocks = []
  const imageRegex = /<img[^>]*src=(["'])(.*?)\1[^>]*>/gi
  let lastIndex = 0
  let match

  while ((match = imageRegex.exec(html)) !== null) {
    const before = html.slice(lastIndex, match.index)
    const inlineNodes = parseInlineNodes(before)
    if (inlineNodes.length > 0) blocks.push(makeParagraphNode(inlineNodes))

    const mediaId = mediaByUrl.get(match[2])
    if (mediaId) blocks.push(makeMediaBlockNode(mediaId))

    lastIndex = match.index + match[0].length
  }

  const trailing = html.slice(lastIndex)
  const trailingNodes = parseInlineNodes(trailing)
  if (trailingNodes.length > 0) blocks.push(makeParagraphNode(trailingNodes))

  return blocks
}

function parseListItems(html) {
  const items = []
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
    if (skipTag) {
      remaining = remaining.slice(skipTag[0].length).trim()
      continue
    }

    const skipText = remaining.match(/^[^<]+/)
    if (skipText) {
      remaining = remaining.slice(skipText[0].length).trim()
      continue
    }

    remaining = remaining.slice(1)
  }

  return items
}

function htmlToLexical(cleanedHtml, mediaByUrl) {
  if (!cleanedHtml || cleanedHtml.trim().length === 0) return plainTextFallback('')

  const children = []
  let remaining = cleanedHtml.trim()

  while (remaining.length > 0) {
    remaining = remaining.trim()

    const hMatch = remaining.match(/^<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/i)
    if (hMatch) {
      const inlineNodes = parseInlineNodes(hMatch[2])
      if (inlineNodes.length > 0) children.push(makeHeadingNode(hMatch[1].toLowerCase(), inlineNodes))
      remaining = remaining.slice(hMatch[0].length)
      continue
    }

    const pMatch = remaining.match(/^<p[^>]*>([\s\S]*?)<\/p>/i)
    if (pMatch) {
      children.push(...parseParagraphBlocks(pMatch[1], mediaByUrl))
      remaining = remaining.slice(pMatch[0].length)
      continue
    }

    const imgMatch = remaining.match(/^<img[^>]*src=(["'])(.*?)\1[^>]*>/i)
    if (imgMatch) {
      const mediaId = mediaByUrl.get(imgMatch[2])
      if (mediaId) children.push(makeMediaBlockNode(mediaId))
      remaining = remaining.slice(imgMatch[0].length)
      continue
    }

    const ulMatch = remaining.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i)
    if (ulMatch) {
      const items = parseListItems(ulMatch[1])
      if (items.length > 0) children.push(makeListNode('bullet', 'ul', items))
      remaining = remaining.slice(ulMatch[0].length)
      continue
    }

    const olMatch = remaining.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i)
    if (olMatch) {
      const items = parseListItems(olMatch[1])
      if (items.length > 0) children.push(makeListNode('number', 'ol', items))
      remaining = remaining.slice(olMatch[0].length)
      continue
    }

    const tableMatch = remaining.match(/^<table[\s\S]*?<\/table>/i)
    if (tableMatch) {
      remaining = remaining.slice(tableMatch[0].length)
      continue
    }

    const blockMatch = remaining.match(/^<(div|section|article|aside|blockquote|figure|main)[^>]*>([\s\S]*?)<\/\1>/i)
    if (blockMatch) {
      const inner = htmlToLexical(blockMatch[2], mediaByUrl)
      children.push(...inner.root.children)
      remaining = remaining.slice(blockMatch[0].length)
      continue
    }

    const tagMatch = remaining.match(/^<[^>]+>/)
    if (tagMatch) {
      remaining = remaining.slice(tagMatch[0].length)
      continue
    }

    const textMatch = remaining.match(/^([^<]+)/)
    if (textMatch) {
      const text = decodeEntities(textMatch[1]).trim()
      if (text) children.push(makeParagraphNode([makeTextNode(text)]))
      remaining = remaining.slice(textMatch[0].length)
      continue
    }

    remaining = remaining.slice(1)
  }

  if (children.length > 0) {
    return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
  }

  return plainTextFallback(cleanedHtml)
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return res.json()
}

async function downloadImage(url, preferredBaseName) {
  if (downloadedImageCache.has(url)) return downloadedImageCache.get(url)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download failed ${res.status} for ${url}`)

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const arrayBuffer = await res.arrayBuffer()
  const ext = guessExtension(url, contentType)
  const filename = sanitizeFilename(`${preferredBaseName}${ext}`)
  const absolutePath = path.join(BLOG_IMAGES_DIR, filename)
  const publicPath = `${BLOG_IMAGES_PUBLIC_PREFIX}${filename}`
  const fileBuffer = Buffer.from(arrayBuffer)

  await fs.writeFile(absolutePath, fileBuffer)

  const downloaded = {
    filename,
    absolutePath,
    publicPath,
    file: {
      name: filename,
      data: fileBuffer,
      mimetype: contentType,
      size: fileBuffer.byteLength,
    },
  }

  downloadedImageCache.set(url, downloaded)
  return downloaded
}

async function ensureMediaDoc(payload, imageInfo, altText) {
  if (mediaCache.has(imageInfo.filename)) return mediaCache.get(imageInfo.filename)

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: imageInfo.filename,
      },
    },
  })

  if (existing.docs[0]) {
    mediaCache.set(imageInfo.filename, existing.docs[0])
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: altText || imageInfo.filename,
    },
    file: imageInfo.file,
  })

  mediaCache.set(imageInfo.filename, created)
  return created
}

async function ensureCategory(payload, title) {
  const slug = slugify(title)
  if (!slug) return null
  if (categoryCache.has(slug)) return categoryCache.get(slug)

  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (existing.docs[0]) {
    categoryCache.set(slug, existing.docs[0])
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'categories',
    data: {
      title,
      slug,
    },
  })

  categoryCache.set(slug, created)
  return created
}

function extractCategoryNames(post) {
  const termGroups = Array.isArray(post?._embedded?.['wp:term']) ? post._embedded['wp:term'] : []
  const names = []

  for (const group of termGroups) {
    if (!Array.isArray(group)) continue
    for (const term of group) {
      if (term?.taxonomy === 'category' && term?.name) names.push(term.name)
    }
  }

  return [...new Set(names)]
}

function getFeaturedMedia(post) {
  return Array.isArray(post?._embedded?.['wp:featuredmedia']) ? post._embedded['wp:featuredmedia'][0] : null
}

async function replaceInlineImages(payload, html, postSlug, errors) {
  const mediaByUrl = new Map()
  let updatedHtml = html
  const imageRegex = /<img[^>]*src=(["'])(https?:\/\/[^"']*wp-content\/uploads[^"']+)\1[^>]*>/gi
  const matches = [...html.matchAll(imageRegex)]

  for (let index = 0; index < matches.length; index++) {
    const sourceUrl = matches[index][2]
    const imageBaseName = `${postSlug}-inline-${index + 1}`

    try {
      const downloaded = await downloadImage(sourceUrl, imageBaseName)
      const mediaDoc = await ensureMediaDoc(payload, downloaded, `${postSlug} inline image ${index + 1}`)
      mediaByUrl.set(downloaded.publicPath, mediaDoc.id)
      updatedHtml = updatedHtml.split(sourceUrl).join(downloaded.publicPath)
    } catch (error) {
      errors.push(`${postSlug}: inline image import failed for ${sourceUrl} (${error.message})`)
    }
  }

  return { html: updatedHtml, mediaByUrl }
}

async function buildPayload() {
  const imported = await tsImport('../src/payload.config.ts', import.meta.url)
  return getPayload({ config: imported.default })
}

async function main() {
  await ensureDir(BLOG_IMAGES_DIR)

  const payload = await buildPayload()
  const posts = await fetchJson(POSTS_URL)

  let importedCount = 0
  let skippedCount = 0
  const errors = []

  for (const wpPost of posts) {
    const title = stripHtml(wpPost?.title?.rendered || '')
    const slug = String(wpPost?.slug || '').trim()

    if (!slug) {
      errors.push(`Post missing slug: ${title || wpPost?.id || 'unknown'}`)
      continue
    }

    const duplicate = await payload.find({
      collection: 'posts',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (duplicate.docs[0]) {
      skippedCount++
      console.log(`SKIP duplicate slug: ${slug}`)
      continue
    }

    try {
      const excerpt = stripHtml(wpPost?.excerpt?.rendered || '')
      let contentHtml = String(wpPost?.content?.rendered || '')
      const categoryNames = extractCategoryNames(wpPost)
      const featuredMedia = getFeaturedMedia(wpPost)

      const categoryDocs = []
      for (const categoryName of categoryNames) {
        const categoryDoc = await ensureCategory(payload, categoryName)
        if (categoryDoc) categoryDocs.push(categoryDoc.id)
      }

      let heroImageId = null

      if (featuredMedia?.source_url) {
        const downloaded = await downloadImage(featuredMedia.source_url, `${slug}-featured`)
        const mediaDoc = await ensureMediaDoc(
          payload,
          downloaded,
          featuredMedia.alt_text || title || downloaded.filename
        )
        heroImageId = mediaDoc.id
      }

      const inlineResult = await replaceInlineImages(payload, contentHtml, slug, errors)
      contentHtml = inlineResult.html
      const cleanedHtml = cleanHtml(contentHtml)
      let lexical = htmlToLexical(cleanedHtml, inlineResult.mediaByUrl)

      if (!validateLexical(lexical)) {
        lexical = plainTextFallback(cleanedHtml)
      }

      await payload.create({
        collection: 'posts',
        context: {
          disableRevalidate: true,
        },
        data: {
          title,
          slug,
          _status: 'published',
          heroImage: heroImageId,
          content: lexical,
          categories: categoryDocs,
          publishedAt: new Date(wpPost.date || new Date().toISOString()).toISOString(),
          meta: {
            title,
            description: excerpt || undefined,
            image: heroImageId,
          },
        },
      })

      importedCount++
      console.log(`IMPORTED ${slug}`)
    } catch (error) {
      errors.push(`${slug}: ${error.message}`)
    }
  }

  try {
    execSync('pnpm build && pm2 restart dexmetal-web', {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  } catch (error) {
    errors.push(`build/restart failed: ${error.message}`)
  }

  console.log('')
  console.log('=== Import Summary ===')
  console.log(`Imported: ${importedCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Errors: ${errors.length}`)
  for (const error of errors) {
    console.log(`ERROR ${error}`)
  }

  if (errors.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
