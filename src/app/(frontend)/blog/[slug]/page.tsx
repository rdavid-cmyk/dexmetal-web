export default async function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Blog Post: {slug}</div>
}
