'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { type RegulatoryEvent, typeLabels, typeColors } from '@/data/regulatory-radar'

const IMPACT_BADGE: Record<string, { label: string; color: string }> = {
  high: { label: 'HIGH', color: '#e53e3e' },
  medium: { label: 'MEDIUM', color: '#FF5C00' },
  low: { label: 'LOW', color: '#8f8d86' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High Impact' },
  { key: 'cop-decision', label: 'COP Decisions' },
  { key: 'ban-amendment', label: 'Ban Amendment' },
  { key: 'country-update', label: 'Country Updates' },
  { key: 'listing-change', label: 'Listing Changes' },
] as const

export function RegulatoryFilterBar({ events }: { events: RegulatoryEvent[] }) {
  const [active, setActive] = useState<string>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return events
    if (active === 'high') return events.filter((e) => e.impact === 'high')
    return events.filter((e) => e.type === active)
  }, [active, events])

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: active === f.key ? '#1D9E75' : '#2c2c2a',
              color: active === f.key ? '#ffffff' : '#8f8d86',
              border: `1px solid ${active === f.key ? '#1D9E75' : '#3a3a38'}`,
            }}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs" style={{ color: '#8f8d86' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-3xl border px-6 py-20 text-center"
          style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
        >
          <p className="font-display text-2xl font-bold text-white">No matching events</p>
          <p className="mt-3 text-sm" style={{ color: '#8f8d86' }}>
            Try a different filter or check back for new updates.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((event) => renderEventCard(event))}
        </div>
      )}
    </>
  )
}

function renderEventCard(event: RegulatoryEvent) {
  const impactBadge = IMPACT_BADGE[event.impact]
  const typeColor = typeColors[event.type]
  const formattedDate = formatDate(event.date)

  return (
    <div
      key={event.id}
      className="event-card flex flex-col rounded-3xl border p-6"
      style={{ backgroundColor: '#2c2c2a', borderColor: '#3a3a38' }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${typeColor}22`,
            color: typeColor,
            border: `1px solid ${typeColor}44`,
          }}
        >
          {typeLabels[event.type]}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase"
          style={{ backgroundColor: impactBadge.color, color: '#ffffff' }}
        >
          {impactBadge.label}
        </span>
      </div>

      <div className="mb-2 text-xs" style={{ color: '#8f8d86' }}>
        {formattedDate}
      </div>

      <h3 className="font-display text-xl font-bold text-white leading-snug mb-3">
        {event.title}
      </h3>

      <p className="mb-4 text-sm leading-7" style={{ color: '#c8c4bc' }}>
        {event.summary}
      </p>

      {event.affectedRegions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {event.affectedRegions.map((region) => (
            <span
              key={region}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: '#3a3a38', color: '#8f8d86' }}
            >
              {region}
            </span>
          ))}
        </div>
      )}

      <div className="mb-4 text-xs italic" style={{ color: '#8f8d86' }}>
        Source: {event.source}
      </div>

      {event.serviceLink && (
        <Link
          href={event.serviceLink}
          className="mt-auto pt-2 inline-flex text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: '#1D9E75' }}
        >
          → See how DexMetal can help
        </Link>
      )}
    </div>
  )
}
