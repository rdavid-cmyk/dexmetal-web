'use client'

import { useEffect, useState } from 'react'

interface MetalEntry {
  symbol: string
  label: string
  price: number
  change: number | null
  unit: string
  live: boolean
}

interface MetalPriceData {
  metals: MetalEntry[]
  updated: string
  delayed: boolean
}

function PriceArrow({ change }: { change: number | null }) {
  if (change === null || change === 0) return null
  return change > 0 ? (
    <span style={{ color: '#1D9E75' }} aria-label="up">▲</span>
  ) : (
    <span style={{ color: '#FF5C00' }} aria-label="down">▼</span>
  )
}

function TickerItem({ metal, separator }: { metal: MetalEntry; separator?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 px-4">
      {separator && (
        <span style={{ color: '#2a2a28', userSelect: 'none' }} aria-hidden>◆</span>
      )}
      <span
        className="text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: '#8f8d86' }}
      >
        {metal.label}
      </span>
      <span className="text-sm font-bold text-white tabular-nums">
        ${metal.price.toLocaleString()}
      </span>
      <span className="text-[11px]" style={{ color: '#5a5955' }}>/t</span>
      <PriceArrow change={metal.change} />
      {!metal.live && (
        <span
          className="rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: '#1e1e1c', color: '#6b6966' }}
        >
          ind
        </span>
      )}
    </span>
  )
}

function TickerLabel({ updatedTime, delayed }: { updatedTime: string; delayed: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 px-6">
      <span style={{ color: '#2a2a28', userSelect: 'none' }} aria-hidden>◆</span>
      <span
        className="text-[11px] uppercase tracking-[0.12em]"
        style={{ color: '#3a3836' }}
      >
        LME Spot · {updatedTime}
        {delayed && <span style={{ color: '#FF5C00' }}> · Indicative</span>}
      </span>
    </span>
  )
}

export function LMETicker() {
  const [data, setData] = useState<MetalPriceData | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch('/api/metal-prices', { cache: 'no-store' })
      if (res.ok) setData(await res.json())
    } catch {
      // silently fail — ticker hides if API unreachable
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 15 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (loading) {
    return (
      <div className="border-b border-[#2f2f2b] px-4 py-2" style={{ backgroundColor: '#0f0e0c' }}>
        <span className="text-xs uppercase tracking-[0.18em]" style={{ color: '#3a3836' }}>
          Loading metal prices…
        </span>
      </div>
    )
  }

  if (!data) return null

  const updatedTime = new Date(data.updated).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  // One full content block: metals + timestamp label
  function ContentBlock({ ariaHidden }: { ariaHidden?: boolean }) {
    return (
      <span className="inline-flex items-center" aria-hidden={ariaHidden}>
        {data!.metals.map((metal, i) => (
          <TickerItem key={metal.symbol} metal={metal} separator={i > 0} />
        ))}
        <TickerLabel updatedTime={updatedTime} delayed={data!.delayed} />
      </span>
    )
  }

  return (
    <div
      className="border-b border-[#2f2f2b] overflow-hidden"
      style={{ backgroundColor: '#0f0e0c' }}
      aria-label="LME spot metal prices"
    >
      {/* keyframes injected once; pause-on-hover via group */}
      <style>{`
        @keyframes lme-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lme-ticker-track {
          animation: lme-ticker 40s linear infinite;
          will-change: transform;
        }
        .lme-ticker-wrap:hover .lme-ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="lme-ticker-wrap py-2 cursor-default select-none">
        {/* whitespace: nowrap keeps all items on one line */}
        <div className="lme-ticker-track inline-flex whitespace-nowrap">
          <ContentBlock />
          {/* duplicate creates the seamless loop — hidden from a11y */}
          <ContentBlock ariaHidden />
        </div>
      </div>
    </div>
  )
}
