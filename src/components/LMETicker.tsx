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
    <span style={{ color: '#1D9E75' }} aria-label="up">
      ▲
    </span>
  ) : (
    <span style={{ color: '#FF5C00' }} aria-label="down">
      ▼
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
      <div className="border-b border-[#2f2f2b] px-4 py-2.5" style={{ backgroundColor: '#0f0e0c' }}>
        <div className="container">
          <span className="text-xs uppercase tracking-[0.18em]" style={{ color: '#5a5955' }}>
            Loading metal prices…
          </span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const updatedTime = new Date(data.updated).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return (
    <div
      className="border-b border-[#2f2f2b]"
      style={{ backgroundColor: '#0f0e0c' }}
      aria-label="LME spot metal prices"
    >
      <div className="container">
        <div className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-2">
            {data.metals.map((metal, i) => (
              <div key={metal.symbol} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && (
                  <span
                    className="hidden h-3 w-px sm:block"
                    style={{ backgroundColor: '#3a3a38' }}
                    aria-hidden
                  />
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
                <span className="text-[11px]" style={{ color: '#5a5955' }}>
                  /t
                </span>
                <PriceArrow change={metal.change} />
                {!metal.live && (
                  <span
                    className="rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: '#1e1e1c', color: '#6b6966' }}
                  >
                    ind
                  </span>
                )}
              </div>
            ))}
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 text-[11px]"
            style={{ color: '#4a4947' }}
          >
            <span className="uppercase tracking-[0.12em]">LME Spot</span>
            <span aria-hidden>·</span>
            <span>Updated {updatedTime}</span>
            {data.delayed && (
              <>
                <span aria-hidden>·</span>
                <span style={{ color: '#FF5C00' }}>Indicative</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
