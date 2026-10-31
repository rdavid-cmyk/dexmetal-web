import { getPayload } from 'payload'
import config from '/var/www/dexmetal-web/src/payload.config.js'

const ROUTE_URL = 'https://dexmetal.com/services/shipment-route-check'
const ROUTE_TEXT = 'Need a first pass on a cross-border route? Get a $99 Shipment Route Check.'

const targets = {
  knowledgeHub: {
    'country/us-export-requirements': {
      title: 'Amber-List & Basel Waste Export Permits (US)',
      description: 'What US exporters need before amber-listed or Basel-controlled waste ships: permits, written consent, and the documents to have ready.',
    },
    'reference/e-waste-materials-reference': {
      title: 'E-Waste Composition & Hazardous Materials',
      description: 'What e-waste is made of, including PCBs and hazardous materials like lead and mercury, and how materials map to Basel codes such as A1181, B1010 and Y49.',
    },
    'ewaste/y49-vs-a1181-classification-guide': {
      title: 'Y49 vs A1181: Classifying E-Waste Under Basel',
      description: 'Y49 or A1181? A plain guide to classifying e-waste under the 2025 Basel amendments, and what each code means for consent before you ship.',
    },
  },
  posts: {
    'how-to-prepare-a-basel-notification-part-1': {
      title: 'Basel Notification Form: What to Include',
      description: 'How to prepare the Basel notification form: the information it must contain, which documents to attach, and the checks to run before you submit.',
    },
    'how-to-prepare-a-basel-notification-part-2': {
      title: 'Basel Notification: Submission & Consent Timing',
      description: 'How to submit a Basel notification, how long prior informed consent takes, country authority rules, and what the movement document needs.',
    },
  },
}

function extractText(node) {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(extractText).join(' ')
  if (Array.isArray(node.fields?.children)) return node.fields.children.map(extractText).join(' ')
  if (node.fields?.content) return extractText(node.fields.content)
  return ''
}

function hasRouteLink(node) {
  if (!node) return false
  if (node.root && hasRouteLink(node.root)) return true
  if (node.type === 'link' && node.fields?.url === ROUTE_URL) return true
  if (Array.isArray(node.children) && node.children.some(hasRouteLink)) return true
  if (Array.isArray(node.fields?.children) && node.fields.children.some(hasRouteLink)) return true
  if (node.fields?.content && hasRouteLink(node.fields.content)) return true
  return false
}

function collectLinks(node, out = []) {
  if (!node) return out
  if (node.root) collectLinks(node.root, out)
  if (node.type === 'link') out.push({ url: node.fields?.url ?? null, text: extractText(node) })
  if (Array.isArray(node.children)) for (const child of node.children) collectLinks(child, out)
  if (Array.isArray(node.fields?.children)) for (const child of node.fields.children) collectLinks(child, out)
  if (node.fields?.content) collectLinks(node.fields.content, out)
  return out
}

function firstLink(node) {
  if (!node) return null
  if (node.type === 'link') return node
  if (node.root) return firstLink(node.root)
  if (Array.isArray(node.children)) for (const child of node.children) { const found = firstLink(child); if (found) return found }
  if (Array.isArray(node.fields?.children)) for (const child of node.fields.children) { const found = firstLink(child); if (found) return found }
  if (node.fields?.content) return firstLink(node.fields.content)
  return null
}

function routeParagraph() {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
    children: [{
      type: 'link',
      fields: {
        url: ROUTE_URL,
        newTab: false,
        linkType: 'custom',
      },
      format: '',
      indent: 0,
      version: 3,
      direction: 'ltr',
      children: [{
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: ROUTE_TEXT,
          version: 1,
      }],
    }],
  }
}

function normalizeRouteLinks(node) {
  if (!node || typeof node !== 'object') return node
  if (node.type === 'link' && node.fields?.url === ROUTE_URL) {
    return {
      ...node,
      fields: {
        url: ROUTE_URL,
        newTab: node.fields.newTab ?? false,
        linkType: node.fields.linkType ?? 'custom',
      },
      format: node.format ?? '',
      indent: node.indent ?? 0,
      version: 3,
      direction: node.direction ?? 'ltr',
      children: node.children ?? node.fields.children ?? [],
    }
  }
  const result = { ...node }
  if (Array.isArray(node.children)) result.children = node.children.map(normalizeRouteLinks)
  if (node.root) result.root = normalizeRouteLinks(node.root)
  if (node.fields?.content) result.fields = { ...node.fields, content: normalizeRouteLinks(node.fields.content) }
  return result
}

function withRouteLink(content) {
  const value = content && typeof content === 'object' ? structuredClone(content) : {
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [] },
  }
  const normalized = normalizeRouteLinks(value)
  const children = normalized.root?.children ?? []
  if (hasRouteLink(normalized)) return { content: normalized, added: false }
  normalized.root = { ...normalized.root, children: [...children, routeParagraph()] }
  return { content: normalized, added: true }
}

function brief(doc, key, collection) {
  const content = doc.content
  const children = content?.root?.children ?? []
  return {
    collection,
    key,
    id: doc.id,
    slug: doc.slug,
    status: doc._status ?? null,
    updatedAt: doc.updatedAt ?? null,
    title: doc.title,
    metaTitle: collection === 'posts' ? doc.meta?.title ?? null : doc.metaTitle ?? null,
    metaDescription: collection === 'posts' ? doc.meta?.description ?? null : doc.metaDescription ?? null,
    routeLink: hasRouteLink(content),
    lastRouteLink: hasRouteLink(children.at(-1)),
    links: collectLinks(content).slice(-5),
    childCount: children.length,
    lastText: children.slice(-3).map(extractText).filter(Boolean),
    lastNode: children.at(-1) ?? null,
  }
}

async function main() {
  const mode = process.argv[2] ?? 'inspect'
  const payload = await getPayload({ config })

  const khResult = await payload.find({
    collection: 'knowledge-hub-pages',
    where: { slug: { in: Object.keys(targets.knowledgeHub) } },
    limit: 20,
    pagination: false,
    draft: true,
    overrideAccess: true,
  })
  const postResult = await payload.find({
    collection: 'posts',
    where: { slug: { in: Object.keys(targets.posts) } },
    limit: 20,
    pagination: false,
    draft: false,
    overrideAccess: true,
  })

  if (mode === 'repair-us') {
    const doc = await payload.findByID({ collection: 'knowledge-hub-pages', id: 17, draft: true, overrideAccess: true })
    if (!doc) throw new Error('Knowledge-hub page id=17 not found')
    const route = withRouteLink(doc.content)
    await payload.update({
      collection: 'knowledge-hub-pages',
      id: doc.id,
      data: { slug: 'country/us-export-requirements', content: route.content, _status: 'published' },
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(JSON.stringify({ collection: 'knowledge-hub-pages', id: doc.id, oldSlug: doc.slug, slug: 'country/us-export-requirements', routeLinkAdded: route.added }))
    process.exit(0)
  }

  if (mode === 'country') {
    const result = await payload.find({
      collection: 'knowledge-hub-pages',
      where: { slug: { like: 'country/' } },
      limit: 200,
      pagination: false,
      draft: true,
      overrideAccess: true,
      select: { id: true, slug: true, title: true, _status: true, updatedAt: true },
    })
    for (const doc of result.docs) console.log(JSON.stringify(doc))
    process.exit(0)
  }

  if (mode === 'find-us') {
    for (const draft of [false, true]) {
      const result = await payload.find({
        collection: 'knowledge-hub-pages',
        where: { slug: { equals: 'country/us-export-requirements' } },
        limit: 20,
        pagination: false,
        draft,
        overrideAccess: true,
      })
      console.log(JSON.stringify({ draft, docs: result.docs.map((doc) => ({ id: doc.id, slug: doc.slug, status: doc._status, title: doc.title })) }))
    }
    process.exit(0)
  }

  if (mode === 'find-all') {
    const result = await payload.find({ collection: 'knowledge-hub-pages', limit: 1000, pagination: false, draft: true, overrideAccess: true, select: { id: true, slug: true, title: true, _status: true } })
    for (const doc of result.docs) {
      if (String(doc.id) === '17' || String(doc.title ?? '').toLowerCase().includes('us export')) console.log(JSON.stringify(doc))
    }
    console.log(JSON.stringify({ total: result.docs.length }))
    process.exit(0)
  }

  if (mode === 'dump-link') {
    const doc = await payload.findByID({ collection: 'knowledge-hub-pages', id: 8, draft: false, overrideAccess: true })
    console.log(JSON.stringify(firstLink(doc.content)))
    process.exit(0)
  }

  if (mode === 'inspect') {
    for (const doc of khResult.docs) console.log(JSON.stringify(brief(doc, doc.slug, 'knowledge-hub-pages')))
    for (const doc of postResult.docs) console.log(JSON.stringify(brief(doc, doc.slug, 'posts')))
    process.exit(0)
  }

  if (mode !== 'apply') throw new Error(`Unknown mode: ${mode}`)

  for (const doc of khResult.docs) {
    const target = targets.knowledgeHub[doc.slug]
    const route = withRouteLink(doc.content)
    await payload.update({
      collection: 'knowledge-hub-pages',
      id: doc.id,
      data: { content: route.content, _status: 'published' },
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(JSON.stringify({ collection: 'knowledge-hub-pages', slug: doc.slug, routeLinkAdded: route.added, title: target.title, description: target.description }))
  }

  for (const doc of postResult.docs) {
    const target = targets.posts[doc.slug]
    const route = withRouteLink(doc.content)
    const existingImage = doc.meta?.image
    await payload.update({
      collection: 'posts',
      id: doc.id,
      data: {
        meta: {
          title: target.title,
          description: target.description,
          ...(existingImage ? { image: typeof existingImage === 'object' ? existingImage.id : existingImage } : {}),
        },
        content: route.content,
      },
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(JSON.stringify({ collection: 'posts', slug: doc.slug, routeLinkAdded: route.added, title: target.title, description: target.description }))
  }
  process.exit(0)
}

main().catch((error) => { console.error(error); process.exit(1) })
