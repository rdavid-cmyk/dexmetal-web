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
        id: null,
        linkType: 'custom',
        newTab: false,
        url: ROUTE_URL,
        children: [{
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: ROUTE_TEXT,
          version: 1,
        }],
      },
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 2,
    }],
  }
}

function withRouteLink(content) {
  const value = content && typeof content === 'object' ? structuredClone(content) : {
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [] },
  }
  const children = value.root?.children ?? []
  if (hasRouteLink(value)) return { content: value, added: false }
  value.root = { ...value.root, children: [...children, routeParagraph()] }
  return { content: value, added: true }
}

function brief(doc, key, collection) {
  const content = doc.content
  const children = content?.root?.children ?? []
  return {
    collection,
    key,
    id: doc.id,
    slug: doc.slug,
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
    draft: false,
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
      data: { content: route.content },
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
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(JSON.stringify({ collection: 'posts', slug: doc.slug, routeLinkAdded: route.added, title: target.title, description: target.description }))
  }
  process.exit(0)
}

main().catch((error) => { console.error(error); process.exit(1) })
