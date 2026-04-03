export default async function ToolsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Tool: {slug}</div>
}
