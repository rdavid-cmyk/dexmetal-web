import type { NextConfig } from 'next'
import { REDIRECTS } from './src/lib/redirects'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  const wpMigrationRedirects = REDIRECTS.map((r) => ({
    source: r.from,
    destination: r.to,
    permanent: r.permanent,
  }))

  return [internetExplorerRedirect, ...wpMigrationRedirects]
}
