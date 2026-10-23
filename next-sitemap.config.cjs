const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://dexmetal.com'
const SITE_URL = `${configuredSiteUrl.startsWith('http') ? '' : 'https://'}${configuredSiteUrl}`.replace(
  /\/+$/,
  '',
)

async function fetchCollection(collection) {
  const response = await fetch(`${SITE_URL}/api/${collection}?limit=1000&depth=0`, {
    headers: { 'User-Agent': 'DexMetal-Sitemap-Builder/1.0' },
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    throw new Error(`Could not fetch ${collection} for sitemap: HTTP ${response.status}`)
  }

  const payload = await response.json()
  return Array.isArray(payload.docs) ? payload.docs : []
}

function sitemapField(loc, updatedAt) {
  return {
    loc,
    lastmod: updatedAt || new Date().toISOString(),
    changefreq: 'weekly',
    priority: loc === '/' ? 1 : 0.7,
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin*',
    '/ops',
    '/posts',
    '/posts/*',
    '/pages-sitemap.xml',
    '/posts-sitemap.xml',
    '/services/shipment-compliance-review',
    '/services/full-notification-package',
    '/services/operator-retainer',
    '/services/pic-navigation',
    '/services/trade-lane-setup',
    '/services/waste-classification-audit',
    '/tools/basel-form-assistant',
    '/tools/media-studio',
    '/workspace',
  ],
  additionalPaths: async () => {
    const [knowledgePages, posts] = await Promise.all([
      fetchCollection('knowledge-hub-pages'),
      fetchCollection('posts'),
    ])

    const paths = [
      ...knowledgePages
        .filter(({ slug }) => slug && slug !== 'knowledge-hub' && slug !== '/')
        .map(({ slug, updatedAt }) => sitemapField(`/knowledge-hub/${slug}`, updatedAt)),
      ...posts
        .filter(({ slug }) => Boolean(slug))
        .map(({ slug, updatedAt }) => sitemapField(`/blog/${slug}`, updatedAt)),
    ]

    const unique = new Map(paths.map((entry) => [entry.loc, entry]))
    return [...unique.values()]
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
  },
}
