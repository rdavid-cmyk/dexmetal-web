export default async function KnowledgeHubSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Knowledge Hub: {slug}</div>
}
