import Link from 'next/link'

export const metadata = {
  title: 'Developer & AI Agent Tools — DexMetal',
  description:
    'One Basel compliance data layer with REST API access for software systems and read-only MCP access for AI assistants and agents.',
}

const tools = [
  {
    title: 'Basel CA API',
    description:
      'The canonical runtime service for DexMetal competent authority data. Access verified contacts for 182 countries through simple REST calls.',
    endpoint: 'GET https://api.dexmetal.com/api/v1/ca/{country_code}',
    href: 'https://api.dexmetal.com',
    linkText: 'Open Basel API →',
    badge: 'Free REST API',
    accent: '#FF5C00',
    external: true,
  },
  {
    title: 'Basel Waste Code Classifier',
    description:
      'Input a waste description in plain language and return Basel classification signals for workflow support. Verify critical classifications with the relevant authority before filing.',
    endpoint: 'POST https://api.dexmetal.com/api/v1/classify',
    href: '/developers/waste-classifier',
    linkText: 'Live Demo →',
    badge: 'Free API',
    accent: '#1D9E75',
    external: false,
  },
  {
    title: 'DexMetal Basel CA MCP',
    description:
      'Read-only MCP access for AI assistants and agent workflows. The MCP reads the same 182-country CA data from the Basel CA API — it does not maintain a separate authority database.',
    endpoint: 'POST https://mcp.dexmetal.com/mcp',
    href: 'https://mcp.dexmetal.com',
    linkText: 'Open MCP Server →',
    badge: 'Free MCP',
    accent: '#8B5CF6',
    external: true,
  },
  {
    title: 'API Documentation',
    description:
      'Endpoint reference, authentication guidance, and code examples for the canonical DexMetal Basel CA API.',
    endpoint: null,
    href: 'https://api.dexmetal.com/docs',
    linkText: 'Read Docs →',
    badge: 'Docs',
    accent: '#3B82F6',
    external: true,
  },
]

export default function DevelopersPage() {
  return (
    <article className="min-h-screen bg-dex-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: '2.75rem' }}>
            Developer &amp; AI Agent Tools
          </h1>
          <p className="font-body text-lg max-w-3xl" style={{ color: '#a0a09a' }}>
            One Basel data layer, two access paths: use REST in software systems or MCP in AI assistants and agent workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              target={tool.external ? '_blank' : undefined}
              rel={tool.external ? 'noopener noreferrer' : undefined}
              className="block p-6 rounded-xl border-l-4 transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: '#2c2c2a', borderLeftColor: tool.accent }}
            >
              <span
                className="inline-block mb-3 text-xs font-body font-semibold uppercase tracking-widest px-2 py-1 rounded"
                style={{ backgroundColor: tool.accent + '22', color: tool.accent }}
              >
                {tool.badge}
              </span>
              <h2 className="font-body font-semibold text-white text-base mb-2 leading-snug">
                {tool.title}
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#a0a09a' }}>
                {tool.description}
              </p>
              {tool.endpoint && (
                <code
                  className="inline-block mt-3 max-w-full overflow-x-auto text-xs font-mono px-2 py-1 rounded"
                  style={{ backgroundColor: '#1a1a18', color: tool.accent }}
                >
                  {tool.endpoint}
                </code>
              )}
              <span
                className="block mt-3 text-xs font-body font-medium uppercase tracking-wide"
                style={{ color: tool.accent }}
              >
                {tool.linkText}
              </span>
            </Link>
          ))}
        </div>

        <section
          className="mt-8 rounded-xl p-6"
          style={{ backgroundColor: '#1a2e27', border: '1px solid #1D9E75' }}
          aria-labelledby="integration-model-heading"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1D9E75' }}>
            Integration model
          </p>
          <h2 id="integration-model-heading" className="font-display font-bold text-white text-xl mb-3">
            API is the data service. MCP is the AI access adapter.
          </h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: '#a8c4bb' }}>
            <strong className="text-white">api.dexmetal.com</strong> is the canonical runtime source for the 182-country competent authority dataset.
            <strong className="text-white"> mcp.dexmetal.com/mcp</strong> provides read-only Model Context Protocol access to that same data.
            Streamable HTTP at <code>/mcp</code> is the primary MCP endpoint; <code>/sse</code> remains available for legacy compatibility.
          </p>
        </section>

        <div className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a38' }}>
          <p className="font-body text-sm" style={{ color: '#a0a09a' }}>
            REST API access is free.{' '}
            <Link
              href="https://api.dexmetal.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
              style={{ color: '#FF5C00' }}
            >
              Get your free API key →
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
