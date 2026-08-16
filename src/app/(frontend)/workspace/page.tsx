'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BaselProject, evaluateBaselCase, practitionerAnswer } from '@/lib/basel-case'

const COMMANDS = [
  'Can this shipment move?',
  'Are all consents in?',
  'What is the Basel classification?',
  'Show me the route',
  'What is the tonnage position?',
  'Can I close this notification?',
]

const WORKFLOW = [
  ['1', 'Classify', 'Lock waste status, Basel/Y/H codes'],
  ['2', 'Route & PIC', 'Identify States concerned and control path'],
  ['3', 'Notify', 'Prepare the notification and supporting pack'],
  ['4', 'Consent', 'Track acknowledgements, RFIs and written consent'],
  ['5', 'Move', 'Create and control shipment movement documents'],
  ['6', 'Receipt', 'Record importer/facility receipt'],
  ['7', 'Recover / Dispose', 'Capture facility certification'],
  ['8', 'Close-out', 'Reconcile movements, tonnage and certificates'],
]

const PROJECT_LOOKUP_TIMEOUT_MS = 5000

export default function BaselWorkspacePage() {
  const [project, setProject] = useState<BaselProject | null>(null)
  const [projectId, setProjectId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [command, setCommand] = useState(COMMANDS[0])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        setError('Case could not be loaded')
        setLoading(false)
      }
      controller.abort()
    }, PROJECT_LOOKUP_TIMEOUT_MS)

    const params = new URLSearchParams(window.location.search)
    const id = params.get('project') || localStorage.getItem('dexmetal_project_id') || ''
    setProjectId(id)

    if (!id) {
      window.clearTimeout(timeout)
      setLoading(false)
      return () => {
        cancelled = true
        controller.abort()
      }
    }

    fetch(`/api/form-projects?id=${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Case could not be loaded')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setProject(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.name === 'AbortError' ? 'Case could not be loaded' : err?.message || 'Case could not be loaded')
      })
      .finally(() => {
        window.clearTimeout(timeout)
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const summary = useMemo(() => (project ? evaluateBaselCase(project) : null), [project])
  const answer = summary ? practitionerAnswer(summary, command) : ''
  const blockers = summary?.issues.filter((issue) => issue.signal === 'blocker') || []
  const warnings = summary?.issues.filter((issue) => issue.signal === 'warning') || []

  if (loading) {
    return <main className="min-h-screen bg-dex-bg px-4 py-20 text-center text-white">Loading Basel Case…</main>
  }

  if (!projectId) {
    return (
      <main className="min-h-screen bg-dex-bg px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border p-8" style={{ backgroundColor: '#111310', borderColor: '#3a3a38' }}>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Basel Case Workspace</p>
          <h1 className="mb-4 font-display text-4xl font-bold text-white">Run the Basel process here.</h1>
          <p className="mb-7 font-body leading-relaxed" style={{ color: '#a0a09a' }}>
            Start or save a Basel Navigator project first. DexMetal will then turn that notification into a working case for pre-flight, consent, movement control and close-out.
          </p>
          <Link href="/tools/basel-navigator" className="inline-flex rounded-full px-6 py-3 font-body text-sm font-semibold text-white" style={{ backgroundColor: '#FF5C00' }}>
            Start a Basel Case →
          </Link>
        </div>
      </main>
    )
  }

  if (error || !summary || !project) {
    return (
      <main className="min-h-screen bg-dex-bg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Basel Case unavailable</h1>
        <p className="mt-3 font-body" style={{ color: '#a0a09a' }}>{error || 'The saved case could not be evaluated.'}</p>
      </main>
    )
  }

  const decisionColor = summary.moveDecision === 'YES' ? '#1D9E75' : summary.moveDecision === 'NO' ? '#ff6b6b' : '#f5b942'

  return (
    <main className="min-h-screen bg-dex-bg px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Basel Case Control Desk</p>
            <h1 className="font-display text-4xl font-bold text-white">{summary.notificationNo || 'Working notification'}</h1>
            <p className="mt-2 font-body" style={{ color: '#a0a09a' }}>
              {summary.wasteDescription || 'Waste description pending'} · {summary.exportCountry || '?'} → {summary.importCountry || '?'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/tools/basel-navigator?project=${encodeURIComponent(project.id)}`} className="rounded-full border px-4 py-2 font-body text-sm text-white" style={{ borderColor: '#3a3a38' }}>Open notification</Link>
            <Link href="/tools/pic-status-checker" className="rounded-full border px-4 py-2 font-body text-sm text-white" style={{ borderColor: '#3a3a38' }}>Check PIC</Link>
            <Link href="/tools/basel-classification-quickscan" className="rounded-full border px-4 py-2 font-body text-sm text-white" style={{ borderColor: '#3a3a38' }}>Check classification</Link>
          </div>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <Metric label="Current stage" value={summary.stage} />
          <Metric label="Basel / Y code" value={[summary.baselCode, summary.yCode].filter(Boolean).join(' · ') || 'Not locked'} />
          <Metric label="Operation" value={summary.operationCode || 'Missing'} />
          <div className="rounded-2xl border p-5" style={{ backgroundColor: '#111310', borderColor: decisionColor }}>
            <p className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: '#a0a09a' }}>Can this shipment move?</p>
            <p className="mt-2 font-display text-2xl font-bold" style={{ color: decisionColor }}>{summary.moveDecision}</p>
            <p className="mt-1 font-body text-xs" style={{ color: '#a0a09a' }}>Consent: {summary.consentStatus}</p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border p-6" style={{ backgroundColor: '#111310', borderColor: '#3a3a38' }}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Case workflow</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">One case, end to end</h2>
            </div>
            <span className="rounded-full px-3 py-1 font-body text-xs" style={{ backgroundColor: '#20221f', color: '#a0a09a' }}>{project.status || 'draft'}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {WORKFLOW.map(([no, title, detail]) => (
              <div key={no} className="rounded-xl border p-4" style={{ borderColor: '#30322f', backgroundColor: '#171916' }}>
                <span className="font-body text-xs font-bold" style={{ color: '#FF5C00' }}>{no}</span>
                <h3 className="mt-1 font-body text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 font-body text-xs leading-relaxed" style={{ color: '#a0a09a' }}>{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border p-6" style={{ backgroundColor: '#111310', borderColor: blockers.length ? '#7f3b3b' : '#3a3a38' }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Pre-flight</h2>
              <span className="font-body text-xs" style={{ color: blockers.length ? '#ff8b8b' : '#1D9E75' }}>{blockers.length} blocker{blockers.length === 1 ? '' : 's'}</span>
            </div>
            <div className="space-y-3">
              {summary.issues.map((issue, index) => (
                <div key={`${issue.title}-${index}`} className="rounded-xl border p-4" style={{ borderColor: issue.signal === 'blocker' ? '#653535' : issue.signal === 'warning' ? '#62532f' : '#285c4a', backgroundColor: '#171916' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-body text-sm font-semibold text-white">{issue.title}</p>
                      <p className="mt-1 font-body text-xs leading-relaxed" style={{ color: '#a0a09a' }}>{issue.detail}</p>
                    </div>
                    <span className="shrink-0 font-body text-[10px] font-bold uppercase tracking-wider" style={{ color: issue.signal === 'blocker' ? '#ff8b8b' : issue.signal === 'warning' ? '#f5b942' : '#1D9E75' }}>{issue.signal}</span>
                  </div>
                  {issue.actionHref && <Link href={issue.actionHref} className="mt-3 inline-block font-body text-xs font-semibold" style={{ color: '#1D9E75' }}>Fix this →</Link>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border p-6" style={{ backgroundColor: '#111310', borderColor: '#3a3a38' }}>
            <p className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Practitioner console</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">Ask it like you would at the desk.</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {COMMANDS.map((item) => (
                <button key={item} onClick={() => setCommand(item)} className="rounded-full border px-3 py-2 text-left font-body text-xs transition hover:brightness-125" style={{ borderColor: command === item ? '#1D9E75' : '#3a3a38', color: command === item ? '#ffffff' : '#a0a09a', backgroundColor: '#171916' }}>{item}</button>
              ))}
            </div>
            <div className="mt-5 rounded-xl border p-5" style={{ borderColor: '#30322f', backgroundColor: '#171916' }}>
              <p className="font-body text-xs" style={{ color: '#a0a09a' }}>{command}</p>
              <p className="mt-2 font-body text-base font-semibold leading-relaxed text-white">{answer}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Notified tonnage" value={summary.notifiedTonnage === null ? '—' : `${summary.notifiedTonnage} t`} compact />
              <Metric label="Current movement" value={summary.currentMovementTonnage === null ? '—' : `${summary.currentMovementTonnage} t`} compact />
              <Metric label="Shipments planned" value={summary.plannedShipments === null ? '—' : String(summary.plannedShipments)} compact />
              <Metric label="Movement serial" value={summary.movementSerial === null ? '—' : `${summary.movementSerial}/${summary.totalMovements || '?'}`} compact />
            </div>
          </section>
        </div>

        <section className="rounded-2xl border p-6" style={{ backgroundColor: '#111310', borderColor: '#3a3a38' }}>
          <p className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#1D9E75' }}>Control principle</p>
          <div className="mt-3 grid gap-5 md:grid-cols-3">
            <div><h3 className="font-body font-semibold text-white">Evidence, not assumptions</h3><p className="mt-1 font-body text-sm" style={{ color: '#a0a09a' }}>If consent is not stored, DexMetal says NOT PROVEN rather than pretending the route is cleared.</p></div>
            <div><h3 className="font-body font-semibold text-white">Fix the fatal error first</h3><p className="mt-1 font-body text-sm" style={{ color: '#a0a09a' }}>Classification, route, legal entities, facility, operation and quantity are checked before downstream paperwork.</p></div>
            <div><h3 className="font-body font-semibold text-white">One persistent case</h3><p className="mt-1 font-body text-sm" style={{ color: '#a0a09a' }}>The notification and movement data stay linked instead of forcing practitioners through disconnected tools.</p></div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border ${compact ? 'p-4' : 'p-5'}`} style={{ backgroundColor: compact ? '#171916' : '#111310', borderColor: '#3a3a38' }}>
      <p className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: '#a0a09a' }}>{label}</p>
      <p className={`${compact ? 'mt-1 text-base' : 'mt-2 text-xl'} font-display font-bold text-white`}>{value}</p>
    </div>
  )
}
