import BaselCaApiClient from './page.client'

export const metadata = {
  title: 'Basel CA API | DexMetal',
  description: 'Free Basel Convention Competent Authority API — look up national Basel contacts for 182 countries. No login required.',
}

export default function BaselCaApiPage() {
  return <BaselCaApiClient />
}
