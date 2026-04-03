'use client'

import { useEffect } from 'react'

export function KhContentEnhancer() {
  useEffect(() => {
    const content = document.querySelector('.kh-content')
    if (!content) return

    // Quick Reference cards — find divs containing "Quick Reference" text
    content.querySelectorAll('div').forEach((div) => {
      if (div.textContent?.includes('Quick Reference') && !div.closest('.kh-quick-ref')) {
        div.classList.add('kh-quick-ref')
        // Style the label
        div.querySelectorAll('div').forEach((inner) => {
          if (inner.textContent?.match(/Basel Basis|ID Type|Required For/i)) {
            inner.classList.add('kh-quick-ref-label')
          } else if (inner.textContent?.match(/vCOP8|Exporter registration|All Basel/i)) {
            inner.classList.add('kh-quick-ref-value')
          }
        })
      }
    })

    // Warning boxes — find paragraphs/divs starting with ⚠
    content.querySelectorAll('div, p').forEach((el) => {
      const text = el.textContent?.trim() || ''
      if (text.startsWith('⚠') || text.includes('Notifier Identity Must Match Registration')) {
        el.classList.add('kh-warning')
      }
    })

    // Expert Tip boxes
    content.querySelectorAll('div, p').forEach((el) => {
      const text = el.textContent?.trim() || ''
      if (text.includes('DexMetal Expert Tip')) {
        el.classList.add('kh-tip')
      }
    })

    // Comparison table cells — Wrong/Correct
    content.querySelectorAll('td, div').forEach((el) => {
      const text = el.textContent?.trim() || ''
      if (text === 'Wrong') el.classList.add('kh-wrong')
      if (text === 'Correct') el.classList.add('kh-correct')
    })

    // Navigation blocks — find divs with "Back to" or "Next" links
    content.querySelectorAll('div').forEach((div) => {
      const text = div.textContent || ''
      if ((text.includes('← Back') || text.includes('Back to')) && text.includes('Next')) {
        div.classList.add('kh-nav')
        div.querySelectorAll('a').forEach((a) => {
          a.style.textDecoration = 'none'
        })
      }
    })
  }, [])

  return null
}
