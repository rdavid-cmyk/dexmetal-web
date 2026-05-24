'use client'

import { useEffect, useRef, useState } from 'react'

const COLORS = {
  bg: '#1C1B18',
  card: '#2c2c2a',
  border: '#3a3a38',
  teal: '#1D9E75',
  orange: '#FF5C00',
  muted: '#8f8d86',
  text: '#c8c4bc',
  red: '#ef4444',
}

type ProcessStatus = {
  name: string
  status: string
  uptime: string
  memory: number
  restarts: number
}

type QueueTask = {
  id?: string
  title?: string
  status?: 'pending' | 'in_progress' | 'complete' | 'failed' | string
  assigned_to?: string
  completed_at?: string | null
  created_at?: string
}

type OpsStatus = {
  timestamp: string
  processes: ProcessStatus[]
  queue: {
    total: number
    pending: number
    in_progress: number
    complete: number
    failed: number
    recent: QueueTask[]
  }
  log: string[]
}

const badgeColors: Record<string, string> = {
  pending: COLORS.muted,
  in_progress: COLORS.orange,
  complete: COLORS.teal,
  failed: COLORS.red,
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 MB'
  return `${Math.round(bytes / 1024 / 1024)} MB`
}

function formatTime(value?: string | null) {
  if (!value) return null
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border p-4 shadow-xl shadow-black/10 md:p-6 ${className}`}
      style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
    >
      {children}
    </section>
  )
}

export default function OpsPage() {
  const [data, setData] = useState<OpsStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true

    async function loadStatus() {
      try {
        const response = await fetch('/api/ops-status', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const nextData = (await response.json()) as OpsStatus
        if (active) {
          setData(nextData)
          setError(null)
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to fetch ops status')
      }
    }

    loadStatus()
    const timer = window.setInterval(loadStatus, 10000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [data?.log])

  const isLive = Boolean(data && !error)
  const lastUpdated = data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'Waiting for data'

  return (
    <main className="min-h-screen px-4 py-6 text-white md:px-8 md:py-10" style={{ backgroundColor: COLORS.bg }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-4 rounded-3xl border p-5 md:flex-row md:items-center md:justify-between md:p-7" style={{ backgroundColor: '#171613', borderColor: COLORS.border }}>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: COLORS.teal }}>
              Real-time status
            </p>
            <h1 className="font-display text-3xl font-bold md:text-5xl">DexMetal Ops</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border px-4 py-2 text-sm" style={{ borderColor: COLORS.border, color: COLORS.text }}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: isLive ? COLORS.teal : COLORS.red, boxShadow: `0 0 18px ${isLive ? COLORS.teal : COLORS.red}` }} />
            <span>{isLive ? 'Live' : 'Offline'}</span>
            <span style={{ color: COLORS.muted }}>•</span>
            <span>{lastUpdated}</span>
          </div>
        </header>

        {error && (
          <Card>
            <p className="font-semibold" style={{ color: COLORS.red }}>Status fetch failed: {error}</p>
          </Card>
        )}

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold md:text-xl">PM2 Processes</h2>
            <span className="text-sm" style={{ color: COLORS.muted }}>{data?.processes.length || 0} processes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead style={{ color: COLORS.muted }}>
                <tr className="border-b" style={{ borderColor: COLORS.border }}>
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Uptime</th>
                  <th className="py-3 pr-4 font-semibold">Memory</th>
                  <th className="py-3 pr-4 font-semibold">Restarts</th>
                </tr>
              </thead>
              <tbody>
                {(data?.processes || []).map((proc) => {
                  const online = proc.status === 'online'
                  return (
                    <tr key={proc.name} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                      <td className="py-3 pr-4 font-semibold">{proc.name}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: online ? COLORS.teal : COLORS.red }}>
                          <span className="h-2 w-2 rounded-full bg-white" />
                          {proc.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4" style={{ color: COLORS.text }}>{proc.uptime}</td>
                      <td className="py-3 pr-4" style={{ color: COLORS.text }}>{formatBytes(proc.memory)}</td>
                      <td className="py-3 pr-4" style={{ color: COLORS.text }}>{proc.restarts}</td>
                    </tr>
                  )
                })}
                {data?.processes.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center" style={{ color: COLORS.muted }}>No PM2 process data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold md:text-xl">Task Queue</h2>
            <span className="text-sm" style={{ color: COLORS.muted }}>{data?.queue.total || 0} total tasks</span>
          </div>
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {(['pending', 'in_progress', 'complete', 'failed'] as const).map((status) => (
              <div key={status} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, backgroundColor: '#24231f' }}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: badgeColors[status] }}>{status.replace('_', ' ')}</p>
                <p className="mt-1 text-2xl font-bold">{data?.queue[status] ?? 0}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(data?.queue.recent || []).map((task, index) => {
              const status = task.status || 'pending'
              return (
                <article key={task.id || `${task.title}-${index}`} className="rounded-xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: '#24231f' }}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug">{task.title || 'Untitled task'}</h3>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: badgeColors[status] || COLORS.muted }}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: COLORS.muted }}>
                    <span>assigned_to: <strong style={{ color: COLORS.text }}>{task.assigned_to || 'n/a'}</strong></span>
                    <span>{task.completed_at ? `completed_at: ${formatTime(task.completed_at)}` : status === 'in_progress' ? 'in_progress' : `created_at: ${formatTime(task.created_at) || 'n/a'}`}</span>
                  </div>
                </article>
              )
            })}
            {data?.queue.recent.length === 0 && <p style={{ color: COLORS.muted }}>No recent queue tasks.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold md:text-xl">Log Tail</h2>
            <span className="text-sm" style={{ color: COLORS.muted }}>last 10 lines</span>
          </div>
          <div ref={logRef} className="max-h-80 overflow-y-auto rounded-xl border p-4 font-mono text-xs leading-6 md:text-sm" style={{ backgroundColor: '#11100e', borderColor: COLORS.border, color: COLORS.text }}>
            {(data?.log || []).slice(-10).map((line, index) => (
              <div key={`${line}-${index}`} className="whitespace-pre-wrap break-words">{line}</div>
            ))}
            {data?.log.length === 0 && <div style={{ color: COLORS.muted }}>No log lines available.</div>}
          </div>
        </Card>
      </div>
    </main>
  )
}
