import { redirect } from 'next/navigation'

export default async function ToolsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/knowledge-hub/${slug}`)
}
