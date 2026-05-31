'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Clapperboard,
  Copy,
  FileText,
  Image,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Wand2,
} from 'lucide-react'
import type { MediaStudioAsset, MediaStudioPlan } from '@/lib/media-studio/types'

const panelStyle = {
  backgroundColor: '#242320',
  border: '1px solid #3a3a38',
  borderRadius: '8px',
} as const

const fieldStyle = {
  width: '100%',
  backgroundColor: '#1C1B18',
  border: '1px solid #3a3a38',
  borderRadius: '6px',
  color: '#fff',
  padding: '11px 12px',
  fontSize: '14px',
  lineHeight: 1.45,
} as const

function authHeaders(token: string): Record<string, string> {
  return token ? { 'x-media-studio-token': token } : {}
}

function StatusPill({ status }: { status: MediaStudioAsset['status'] }) {
  const color =
    status === 'complete' ? '#1D9E75' : status === 'queued' ? '#f5c518' : status === 'failed' ? '#FF5C00' : '#a0a09a'

  return (
    <span
      style={{
        color,
        border: `1px solid ${color}`,
        borderRadius: '999px',
        padding: '3px 8px',
        fontSize: '11px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}

function KindIcon({ kind }: { kind: MediaStudioAsset['kind'] }) {
  if (kind === 'script') return <FileText size={16} />
  if (kind === 'video' || kind === 'hyperframes' || kind === 'remotion') return <Clapperboard size={16} />
  return <Image size={16} />
}

export default function MediaStudioClient() {
  const [token, setToken] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceTitle, setSourceTitle] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [plan, setPlan] = useState<MediaStudioPlan | null>(null)
  const [assets, setAssets] = useState<MediaStudioAsset[]>([])
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [queueingId, setQueueingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem('dexmetal-media-studio-token') || ''
    setToken(saved)
  }, [])

  useEffect(() => {
    if (token) window.localStorage.setItem('dexmetal-media-studio-token', token)
  }, [token])

  useEffect(() => {
    if (!token.trim()) return
    void loadAssets(token)
  }, [token])

  const agentPayload = useMemo(
    () => ({
      endpoint: '/api/media-studio/assets',
      headers: { 'x-media-studio-token': '<MEDIA_STUDIO_TOKEN>' },
      body: {
        kind: 'thumbnail',
        status: 'draft',
        title: 'Agent-generated DexMetal thumbnail concept',
        prompt: 'Describe the fal/visual prompt here',
        sourceUrl: sourceUrl || 'https://dexmetal.com/blog/example',
      },
    }),
    [sourceUrl],
  )

  async function loadAssets(activeToken = token) {
    setLoadingAssets(true)
    setMessage('')

    try {
      const response = await fetch('/api/media-studio/assets', {
        headers: authHeaders(activeToken),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Could not load assets')

      setAssets(data.assets || [])
    } catch (error: any) {
      setMessage(error?.message || 'Could not load assets')
    } finally {
      setLoadingAssets(false)
    }
  }

  async function createPlan() {
    setLoadingPlan(true)
    setMessage('')

    try {
      const response = await fetch('/api/media-studio/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token),
        },
        body: JSON.stringify({ sourceUrl, sourceTitle, sourceText }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Could not create plan')

      setPlan(data.plan)
      await loadAssets()
      setMessage('Media plan created and saved to the asset grid.')
    } catch (error: any) {
      setMessage(error?.message || 'Could not create plan')
    } finally {
      setLoadingPlan(false)
    }
  }

  async function queueFal(asset: MediaStudioAsset) {
    setQueueingId(asset.id)
    setMessage('')

    try {
      const response = await fetch('/api/media-studio/fal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token),
        },
        body: JSON.stringify({
          assetId: asset.id,
          title: asset.title,
          model: asset.model || 'fal-ai/flux/dev',
          input: {
            prompt: asset.prompt,
            image_size: 'landscape_16_9',
            num_images: 1,
          },
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Could not queue fal job')

      await loadAssets()
      setMessage(`Queued fal job${data.fal?.request_id ? `: ${data.fal.request_id}` : ''}.`)
    } catch (error: any) {
      setMessage(error?.message || 'Could not queue fal job')
    } finally {
      setQueueingId(null)
    }
  }

  async function pollAsset(assetId: string) {
    try {
      const response = await fetch('/api/media-studio/fal/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify({ assetId }),
      })
      const data = await response.json()
      return data.falStatus === 'COMPLETED' || data.falStatus === 'FAILED'
    } catch {
      return false
    }
  }

  useEffect(() => {
    if (!token.trim()) return

    const pollQueuedAssets = async () => {
      const queued = assets.filter((asset) => asset.status === 'queued' && asset.requestId)
      if (queued.length === 0) return

      const results = await Promise.all(queued.map((asset) => pollAsset(asset.id)))
      if (results.some(Boolean)) await loadAssets(token)
    }

    void pollQueuedAssets()
    const interval = setInterval(() => {
      void pollQueuedAssets()
    }, 5000)

    return () => clearInterval(interval)
  }, [assets, token])

  async function copyAgentPayload() {
    await navigator.clipboard.writeText(JSON.stringify(agentPayload, null, 2))
    setMessage('Agent asset payload copied.')
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1C1B18' }}>
      <div className="container py-12 md:py-16">
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '18px',
            marginBottom: '24px',
          }}
        >
          <div>
            <p
              style={{
                color: '#1D9E75',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Private publishing workspace
            </p>
            <h1 className="font-display" style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
              DexMetal Media Studio
            </h1>
            <p style={{ color: '#a0a09a', maxWidth: '760px', marginTop: '12px', fontSize: '16px', lineHeight: 1.7 }}>
              Convert DexMetal blog expertise into video scripts, thumbnail prompts, Remotion briefs, HyperFrames briefs, and fal.ai generation jobs.
            </p>
          </div>
        </header>

        <section
          style={{
            ...panelStyle,
            padding: '18px',
            marginBottom: '20px',
            display: 'grid',
            gap: '12px',
          }}
        >
          <label style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }} htmlFor="media-studio-token">
            Access token
          </label>
          <input
            id="media-studio-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="MEDIA_STUDIO_TOKEN"
            style={fieldStyle}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-5">
          <section style={{ ...panelStyle, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Wand2 size={18} color="#1D9E75" />
              <h2 style={{ color: '#fff', fontSize: '20px' }}>Blog-to-video plan</h2>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://dexmetal.com/blog/..."
                style={fieldStyle}
              />
              <input
                value={sourceTitle}
                onChange={(event) => setSourceTitle(event.target.value)}
                placeholder="Optional title override"
                style={fieldStyle}
              />
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Optional pasted source text when URL fetch is not needed"
                rows={8}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
              <button
                type="button"
                onClick={createPlan}
                disabled={loadingPlan}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: '0',
                  borderRadius: '6px',
                  backgroundColor: '#1D9E75',
                  color: '#08120f',
                  padding: '12px 14px',
                  fontWeight: 700,
                  cursor: loadingPlan ? 'wait' : 'pointer',
                }}
              >
                {loadingPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Create media plan
              </button>
            </div>
          </section>

          <section style={{ ...panelStyle, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image size={18} color="#FF5C00" />
                <h2 style={{ color: '#fff', fontSize: '20px' }}>Asset grid</h2>
              </div>
              <button
                type="button"
                onClick={() => loadAssets()}
                disabled={loadingAssets}
                aria-label="Refresh assets"
                title="Refresh assets"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  border: '1px solid #3a3a38',
                  backgroundColor: '#1C1B18',
                  color: '#fff',
                  cursor: loadingAssets ? 'wait' : 'pointer',
                }}
              >
                <RefreshCw size={16} className={loadingAssets ? 'animate-spin' : ''} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '10px', maxHeight: '620px', overflow: 'auto', paddingRight: '4px' }}>
              {assets.length === 0 ? (
                <p style={{ color: '#a0a09a', lineHeight: 1.6 }}>No assets loaded yet.</p>
              ) : (
                assets.map((asset) => (
                  <article
                    key={asset.id}
                    style={{
                      border: '1px solid #3a3a38',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#1C1B18',
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
                      <div style={{ display: 'flex', gap: '9px', minWidth: 0 }}>
                        <span style={{ color: '#1D9E75', paddingTop: '2px' }}>
                          <KindIcon kind={asset.kind} />
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ color: '#fff', fontSize: '14px', lineHeight: 1.35, marginBottom: '4px' }}>{asset.title}</h3>
                          <p style={{ color: '#a0a09a', fontSize: '12px' }}>{asset.kind}</p>
                        </div>
                      </div>
                      <StatusPill status={asset.status} />
                    </div>
                    {asset.prompt && <p style={{ color: '#d7d4cc', fontSize: '12px', lineHeight: 1.55 }}>{asset.prompt}</p>}
                    {asset.outputUrl && (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {(asset.kind === 'image' || asset.kind === 'thumbnail') && (
                          <img
                            src={asset.outputUrl}
                            alt={asset.title}
                            style={{ width: '100%', borderRadius: '6px', marginBottom: '8px', display: 'block' }}
                          />
                        )}
                        <a href={asset.outputUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1D9E75', fontSize: '12px' }}>
                          Open output ↗
                        </a>
                      </div>
                    )}
                    {asset.kind === 'thumbnail' && (
                      <button
                        type="button"
                        onClick={() => queueFal(asset)}
                        disabled={queueingId === asset.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          width: 'fit-content',
                          border: '1px solid #FF5C00',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#FF5C00',
                          padding: '8px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: queueingId === asset.id ? 'wait' : 'pointer',
                        }}
                      >
                        {queueingId === asset.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Queue fal image
                      </button>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        {plan && (
          <section style={{ ...panelStyle, padding: '18px', marginTop: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '14px' }}>Current plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plan.clips.map((clip) => (
                <article key={clip.title} style={{ border: '1px solid #3a3a38', borderRadius: '8px', padding: '14px', backgroundColor: '#1C1B18' }}>
                  <p style={{ color: '#1D9E75', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {clip.format} · {clip.seconds}s
                  </p>
                  <h3 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px', lineHeight: 1.35 }}>{clip.title}</h3>
                  <p style={{ color: '#fff', fontSize: '13px', lineHeight: 1.55, marginBottom: '8px' }}>{clip.hook}</p>
                  <p style={{ color: '#a0a09a', fontSize: '12px', lineHeight: 1.55 }}>{clip.cta}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <article style={{ border: '1px solid #3a3a38', borderRadius: '8px', padding: '14px', backgroundColor: '#1C1B18' }}>
                <h3 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>Remotion brief</h3>
                <p style={{ color: '#d7d4cc', fontSize: '13px', lineHeight: 1.6 }}>{plan.remotionBrief}</p>
              </article>
              <article style={{ border: '1px solid #3a3a38', borderRadius: '8px', padding: '14px', backgroundColor: '#1C1B18' }}>
                <h3 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>HyperFrames brief</h3>
                <p style={{ color: '#d7d4cc', fontSize: '13px', lineHeight: 1.6 }}>{plan.hyperframesBrief}</p>
              </article>
            </div>
          </section>
        )}

        <section style={{ ...panelStyle, padding: '18px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
            <h2 style={{ color: '#fff', fontSize: '20px' }}>Agent handoff</h2>
            <button
              type="button"
              onClick={copyAgentPayload}
              title="Copy agent payload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #3a3a38',
                borderRadius: '6px',
                backgroundColor: '#1C1B18',
                color: '#fff',
                padding: '9px 11px',
                cursor: 'pointer',
              }}
            >
              <Copy size={14} />
              Copy JSON
            </button>
          </div>
          <pre
            style={{
              overflow: 'auto',
              backgroundColor: '#1C1B18',
              border: '1px solid #3a3a38',
              borderRadius: '8px',
              color: '#d7d4cc',
              padding: '14px',
              fontSize: '12px',
              lineHeight: 1.55,
            }}
          >
            {JSON.stringify(agentPayload, null, 2)}
          </pre>
        </section>

        {message && (
          <p style={{ color: message.toLowerCase().includes('could') || message.toLowerCase().includes('required') ? '#FF5C00' : '#1D9E75', marginTop: '18px' }}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
