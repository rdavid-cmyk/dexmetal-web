import configPromise from '@payload-config'
import { getPayload } from 'payload'
import KnowledgeHubPage from './page.client'

export default async function KnowledgeHubServerPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'knowledge-hub-pages',
    limit: 200,
    sort: 'title',
    overrideAccess: false,
    pagination: false,
  })

  return <KnowledgeHubPage pages={result.docs || []} />
}
