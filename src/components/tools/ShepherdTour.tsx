'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export interface TourStep {
  text: string
  attachTo?: { element: string; on: 'bottom' | 'top' | 'left' | 'right' }
}

interface ShepherdTourProps {
  steps: TourStep[]
  tourKey: string
}

const SHEPHERD_CSS = `
.shepherd-modal-overlay-container{fill:rgba(0,0,0,.55);height:100%;left:0;opacity:0;pointer-events:none;position:fixed;top:0;transition:all .3s ease-out;width:100%;z-index:9997}
.shepherd-modal-overlay-container.shepherd-modal-is-visible{opacity:1;pointer-events:auto;transition:all .3s ease-out,height 0s}
.shepherd-modal-overlay-container.shepherd-modal-is-visible path{pointer-events:all}
.shepherd-element{background:#1C1B18;border:1px solid #2e2e2c;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,.7);filter:none;font-family:inherit;max-width:300px;opacity:0;outline:none;transition:opacity .3s,visibility .3s;visibility:hidden;z-index:9999}
.shepherd-element.shepherd-enabled{opacity:1;visibility:visible}
.shepherd-element[data-popper-reference-hidden]:not(.shepherd-centered){opacity:0;pointer-events:none;visibility:hidden}
.shepherd-element>.shepherd-arrow{display:block;height:16px;position:absolute;width:16px}
.shepherd-element>.shepherd-arrow::before{background:#1C1B18;border:1px solid #2e2e2c;content:"";display:block;height:12px;transform:rotate(45deg);width:12px}
.shepherd-element[data-popper-placement^=top]>.shepherd-arrow{bottom:-8px}
.shepherd-element[data-popper-placement^=top]>.shepherd-arrow::before{border-left:none;border-top:none}
.shepherd-element[data-popper-placement^=bottom]>.shepherd-arrow{top:-8px}
.shepherd-element[data-popper-placement^=bottom]>.shepherd-arrow::before{border-bottom:none;border-right:none}
.shepherd-element[data-popper-placement^=left]>.shepherd-arrow{right:-8px}
.shepherd-element[data-popper-placement^=left]>.shepherd-arrow::before{border-bottom:none;border-left:none}
.shepherd-element[data-popper-placement^=right]>.shepherd-arrow{left:-8px}
.shepherd-element[data-popper-placement^=right]>.shepherd-arrow::before{border-right:none;border-top:none}
.shepherd-header{align-items:center;background:#232220;border-radius:8px 8px 0 0;display:flex;justify-content:flex-end;padding:8px 12px}
.shepherd-has-title .shepherd-content .shepherd-header{background:#232220;padding:10px 16px}
.shepherd-title{color:#fff;font-size:14px;font-weight:600;margin:0}
.shepherd-text{color:#d0d0ca;font-size:14px;line-height:1.65;padding:16px}
.shepherd-footer{border-radius:0 0 8px 8px;display:flex;justify-content:flex-end;padding:6px 16px 14px;gap:8px}
.shepherd-button{background:#1D9E75;border:none;border-radius:6px;color:#fff;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;padding:8px 18px;transition:background .15s}
.shepherd-button:not(:disabled):hover{background:#178360}
.shepherd-button.shepherd-button-secondary{background:transparent;border:1px solid #3a3a38;color:#a0a09a}
.shepherd-button.shepherd-button-secondary:hover{background:#272724;color:#fff}
.shepherd-cancel-icon{background:transparent;border:none;color:#6a6a65;cursor:pointer;font-size:20px;line-height:1;padding:0;appearance:none;transition:color .15s}
.shepherd-cancel-icon:hover{color:#fff}
`

export default function ShepherdTour({ steps, tourKey }: ShepherdTourProps) {
  const [seen, setSeen] = useState(true)
  const tourRef = useRef<{ complete: () => void } | null>(null)

  const startTour = useCallback(async () => {
    if (typeof window === 'undefined') return

    if (!document.getElementById('shepherd-dexmetal-css')) {
      const style = document.createElement('style')
      style.id = 'shepherd-dexmetal-css'
      style.textContent = SHEPHERD_CSS
      document.head.appendChild(style)
    }

    const Shepherd = (await import('shepherd.js')).default

    if (tourRef.current) {
      try { tourRef.current.complete() } catch (_) { /* already done */ }
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
      },
    })

    tourRef.current = tour as unknown as { complete: () => void }

    steps.forEach((step, i) => {
      const isLast = i === steps.length - 1
      const buttons: Array<{ text: string; action: () => void; classes?: string }> = []

      if (i > 0) {
        buttons.push({ text: 'Back', action: () => tour.back(), classes: 'shepherd-button-secondary' })
      }
      buttons.push({
        text: isLast ? 'Done' : 'Next →',
        action: () => (isLast ? tour.complete() : tour.next()),
      })

      tour.addStep({
        id: `${tourKey}-step-${i}`,
        text: step.text,
        ...(step.attachTo && { attachTo: { element: step.attachTo.element, on: step.attachTo.on } }),
        buttons,
      })
    })

    const markSeen = () => {
      localStorage.setItem(`tourSeen_${tourKey}`, '1')
      setSeen(true)
    }
    tour.on('complete', markSeen)
    tour.on('cancel', markSeen)

    tour.start()
  }, [steps, tourKey])

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tourSeen_${tourKey}`)
    if (!hasSeen) {
      setSeen(false)
      const timer = setTimeout(() => { startTour() }, 500)
      return () => clearTimeout(timer)
    } else {
      setSeen(true)
    }
  }, [tourKey, startTour])

  return (
    <button
      onClick={startTour}
      title={seen ? 'Replay guided tour' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        background: 'transparent',
        color: '#1D9E75',
        border: '1px solid #1D9E75',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      ↗ Take a tour
    </button>
  )
}
