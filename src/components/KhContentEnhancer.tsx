'use client'
import { useEffect } from 'react'

export function KhContentEnhancer() {
  useEffect(() => {
    const content = document.querySelector('.kh-content')
    if (!content) return

    const paras = Array.from(content.querySelectorAll('p'))
    const used = new Set<Element>()

    // 1. Wrong/Correct comparison groups
    for (let i = 0; i < paras.length - 3; i++) {
      if (
        paras[i].textContent?.trim() === 'Wrong' &&
        paras[i + 2]?.textContent?.trim() === 'Correct'
      ) {
        // Find all consecutive Wrong/Correct pairs starting at i
        const pairs: { wrong: string; correct: string }[] = []
        let j = i
        while (
          paras[j]?.textContent?.trim() === 'Wrong' &&
          paras[j + 2]?.textContent?.trim() === 'Correct'
        ) {
          pairs.push({
            wrong: paras[j + 1]?.textContent?.trim() || '',
            correct: paras[j + 3]?.textContent?.trim() || '',
          })
          used.add(paras[j])
          used.add(paras[j + 1])
          used.add(paras[j + 2])
          used.add(paras[j + 3])
          j += 4
        }
        const table = document.createElement('table')
        table.className = 'kh-comparison'
        const thead = document.createElement('thead')
        thead.innerHTML = '<tr><th class="kh-wrong-head">✗ Wrong</th><th class="kh-correct-head">✓ Correct</th></tr>'
        table.appendChild(thead)
        const tbody = document.createElement('tbody')
        pairs.forEach(({ wrong, correct }) => {
          const tr = document.createElement('tr')
          tr.innerHTML = `<td>${wrong}</td><td>${correct}</td>`
          tbody.appendChild(tr)
        })
        table.appendChild(tbody)
        paras[i].parentNode?.insertBefore(table, paras[i])
      }
    }

    // 2. Warning boxes ⚠️
    for (let i = 0; i < paras.length - 1; i++) {
      if (paras[i].textContent?.trim() === '⚠️' || paras[i].textContent?.trim() === '⚠') {
        const box = document.createElement('div')
        box.className = 'kh-warning'
        const title = document.createElement('div')
        title.className = 'kh-warning-title'
        title.textContent = paras[i + 1]?.textContent?.trim() || ''
        const body = document.createElement('div')
        body.className = 'kh-warning-body'
        body.textContent = paras[i + 2]?.textContent?.trim() || ''
        box.appendChild(title)
        box.appendChild(body)
        paras[i].parentNode?.insertBefore(box, paras[i])
        used.add(paras[i])
        used.add(paras[i + 1])
        used.add(paras[i + 2])
      }
    }

    // 3. Expert Tip boxes 💡
    for (let i = 0; i < paras.length - 1; i++) {
      if (paras[i].textContent?.trim() === '💡') {
        const box = document.createElement('div')
        box.className = 'kh-tip'
        const title = document.createElement('div')
        title.className = 'kh-tip-title'
        title.textContent = paras[i + 1]?.textContent?.trim() || ''
        const body = document.createElement('div')
        body.className = 'kh-tip-body'
        body.textContent = paras[i + 2]?.textContent?.trim() || ''
        box.appendChild(title)
        box.appendChild(body)
        paras[i].parentNode?.insertBefore(box, paras[i])
        used.add(paras[i])
        used.add(paras[i + 1])
        used.add(paras[i + 2])
      }
    }

    // 4. Numbered steps — digit / step text / detail text
    for (let i = 0; i < paras.length - 2; i++) {
      if (/^\d+$/.test(paras[i].textContent?.trim() || '')) {
        // Find all consecutive numbered steps
        let j = i
        const steps: { num: string; step: string; detail: string }[] = []
        while (/^\d+$/.test(paras[j]?.textContent?.trim() || '')) {
          steps.push({
            num: paras[j].textContent?.trim() || '',
            step: paras[j + 1]?.textContent?.trim() || '',
            detail: paras[j + 2]?.textContent?.trim() || '',
          })
          used.add(paras[j])
          used.add(paras[j + 1])
          used.add(paras[j + 2])
          j += 3
        }
        if (steps.length > 1) {
          const wrap = document.createElement('ol')
          wrap.className = 'kh-steps'
          steps.forEach(({ step, detail }) => {
            const li = document.createElement('li')
            li.innerHTML = `<strong>${step}</strong><span>${detail}</span>`
            wrap.appendChild(li)
          })
          paras[i].parentNode?.insertBefore(wrap, paras[i])
        }
      }
    }

    // 5. FAQ — question / ▼ / answer
    for (let i = 0; i < paras.length - 2; i++) {
      if (paras[i + 1]?.textContent?.trim() === '▼') {
        const details = document.createElement('details')
        details.className = 'kh-faq'
        const summary = document.createElement('summary')
        summary.textContent = paras[i].textContent?.trim() || ''
        const answer = document.createElement('p')
        answer.textContent = paras[i + 2]?.textContent?.trim() || ''
        details.appendChild(summary)
        details.appendChild(answer)
        paras[i].parentNode?.insertBefore(details, paras[i])
        used.add(paras[i])
        used.add(paras[i + 1])
        used.add(paras[i + 2])
      }
    }

    // 6. Nav block — ← Back to / label / Next → / label
    for (let i = 0; i < paras.length - 3; i++) {
      if (
        paras[i].textContent?.trim().startsWith('←') &&
        paras[i + 2]?.textContent?.trim().startsWith('Next')
      ) {
        const nav = document.createElement('nav')
        nav.className = 'kh-nav'
        const prev = document.createElement('a')
        prev.className = 'kh-nav-prev'
        prev.textContent = '← ' + paras[i + 1]?.textContent?.trim()
        const next = document.createElement('a')
        next.className = 'kh-nav-next'
        next.textContent = paras[i + 3]?.textContent?.trim() + ' →'
        nav.appendChild(prev)
        nav.appendChild(next)
        paras[i].parentNode?.insertBefore(nav, paras[i])
        used.add(paras[i])
        used.add(paras[i + 1])
        used.add(paras[i + 2])
        used.add(paras[i + 3])
      }
    }

    // Remove all used paragraphs
    used.forEach((el) => el.remove())

  }, [])
  return null
}
