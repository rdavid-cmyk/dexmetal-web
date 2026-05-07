import Link from 'next/link'

export const metadata = {
  title: 'Developer Tools — DexMetal',
  description:
    'Programmatic access to Basel Convention compliance data. Free API keys for CA lookup, waste code classification, and MCP integration.',
}

const tools = [
  {
    title: 'Basel CA API',
    description:
      'Verified competent authority contacts for 182 countries. One API call returns the correct ministry, email, phone, and address for any Basel notification.',
    endpoint: 'GET /api/v1/ca/{country_code}',
    href: 'https://api.dexmetal.com',
    linkText: 'View API →',
    badge: 'Free API',
    accent: '#FF5C00',
    external: true,
  },
  {
    title: 'Basel Waste Code Classifier',
    description:
      'Input any waste description in plain language — get Y-codes, A-codes, H-codes, UN numbers, list type, and PIC requirement instantly. Built for brokers preparing Basel notifications.',
    endpoint: 'POST /api/v1/classify',
    href: '/developers/waste-classifier',
    linkText: 'Live Demo →',
    badge: 'Free API',
    accent: '#1D9E75',
    external: false,
  },
  {
    title: 'Basel CA MCP',
    description:
      'Model Context Protocol server for AI assistants. Ask Claude or any MCP-compatible agent for competent authority data directly — no code required.',
    endpoint: null,
    href: 'https://smithery.ai/servers/rdavid/basel-ca-mcp',
    linkText: 'View on Smithery →',
    badge: 'Free MCP',
    accent: '#8B5CF6',
    external: true,
  },
  {
    title: 'API Documentation',
    description:
      'Full endpoint reference, authentication guide, code examples in JavaScript, Python, and PHP. Get your free API key in 30 seconds.',
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
            Developer Tools
          </h1>
          <p className="font-body text-lg" style={{ color: '#a0a09a' }}>
            Programmatic access to Basel compliance data. Free API keys, no credit card required.
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
                  className="inline-block mt-3 text-xs font-mono px-2 py-1 rounded"
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

        <div className="mt-16 pt-8 border-t" style={{ borderColor: '#3a3a38' }}>
          <p className="font-body text-sm" style={{ color: '#a0a09a' }}>
            All APIs are free to use.{' '}
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
