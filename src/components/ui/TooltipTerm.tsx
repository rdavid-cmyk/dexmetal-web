'use client'

import { useState, useRef, useEffect } from 'react'

const TERM_DEFINITIONS: Record<string, string> = {
  PIC: 'Prior Informed Consent — written approval required from importing country before shipment',
  Y31: 'Basel waste code for lead-acid batteries',
  'Annex II': 'Wastes requiring special consideration under the Basel Convention',
  ULAB: 'Used Lead-Acid Battery — most traded hazardous waste globally',
  'Competent Authority': 'Government body responsible for Basel Convention implementation in each country',
}

interface TooltipTermProps {
  term: keyof typeof TERM_DEFINITIONS
  children?: React.ReactNode
}

export default function TooltipTerm({ term, children }: TooltipTermProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const spanRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const definition = TERM_DEFINITIONS[term]

  function show() {
    if (!spanRef.current) return
    const rect = spanRef.current.getBoundingClientRect()
    setCoords({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX + rect.width / 2,
    })
    setVisible(true)
  }

  function hide() {
    setVisible(false)
  }

  useEffect(() => {
    if (!visible || !tooltipRef.current) return
    const tip = tooltipRef.current
    const rect = tip.getBoundingClientRect()
    const vw = window.innerWidth
    if (rect.right > vw - 8) {
      tip.style.transform = `translateX(calc(-50% - ${rect.right - vw + 12}px))`
    } else if (rect.left < 8) {
      tip.style.transform = `translateX(calc(-50% + ${8 - rect.left}px))`
    }
  }, [visible])

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        style={{
          borderBottom: '1px dotted #1D9E75',
          cursor: 'help',
          color: 'inherit',
          outline: 'none',
        }}
      >
        {children ?? term}
      </span>
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: 'translateX(-50%)',
            backgroundColor: '#111310',
            border: '1px solid #2e2e2c',
            borderRadius: '6px',
            color: '#d0d0ca',
            fontSize: '12px',
            lineHeight: 1.55,
            maxWidth: '260px',
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 9000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: '#1D9E75', fontWeight: 700 }}>{term}</span>
          {' — '}
          {definition}
        </div>
      )}
    </>
  )
}

export { TERM_DEFINITIONS }
