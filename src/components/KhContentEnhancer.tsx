'use client'
import { useEffect } from 'react'

export function KhContentEnhancer() {
  useEffect(() => {
    const run = () => {
      const content = document.querySelector<HTMLElement>('.kh-content')
      if (!content) return false
      if (content.dataset.khEnhanced) return true
      const paras = Array.from(content.querySelectorAll('p'))
      if (paras.length < 5) return false
      content.dataset.khEnhanced = 'true'
      console.log('[KHE] running, paras found:', paras.length, 'first:', paras[0]?.textContent?.trim().slice(0, 30))

      const used = new Set<Element>()
      const domRemove = new Set<Element>()

      // 0. Hide duplicate H1 (first heading inside .kh-content duplicates page title)
      const firstHeading = content.querySelector('h1, h2')
      if (firstHeading) firstHeading.remove()

      // 1. Quick Reference card
      // Pattern: p[//Block X], p[Block X – Quick Reference], h3[Title], p[desc], p[label], p[value] x3
      for (let i = 0; i < paras.length - 8; i++) {
        if (used.has(paras[i])) continue
        const t0 = paras[i].textContent?.trim() || ''
        const t1 = paras[i + 1]?.textContent?.trim() || ''
        if (
          (t0.startsWith('//') || t0.match(/^\/\//)) &&
          t1.includes('Quick Reference')
        ) {
          const card = document.createElement('div')
          card.className = 'kh-quick-ref'

          const codeLabel = document.createElement('div')
          codeLabel.className = 'kh-quick-ref-code'
          codeLabel.textContent = paras[i + 1].textContent?.trim() || ''

          // h3 sits between paras[i+1] and paras[i+2] in the DOM
          const maybeH3 = paras[i + 1].nextElementSibling
          const titleEl = document.createElement('div')
          titleEl.className = 'kh-quick-ref-title'
          if (maybeH3 && /^H[1-6]$/.test(maybeH3.tagName)) {
            titleEl.textContent = maybeH3.textContent || ''
            domRemove.add(maybeH3)
          }

          const desc = document.createElement('div')
          desc.className = 'kh-quick-ref-desc'
          desc.textContent = paras[i + 2]?.textContent?.trim() || ''

          const cols = document.createElement('div')
          cols.className = 'kh-quick-ref-cols'
          for (let k = 0; k < 3; k++) {
            const col = document.createElement('div')
            col.className = 'kh-quick-ref-col'
            const lbl = document.createElement('div')
            lbl.className = 'kh-quick-ref-label'
            lbl.textContent = paras[i + 3 + k * 2]?.textContent?.trim() || ''
            const val = document.createElement('div')
            val.className = 'kh-quick-ref-value'
            val.textContent = paras[i + 4 + k * 2]?.textContent?.trim() || ''
            col.appendChild(lbl)
            col.appendChild(val)
            cols.appendChild(col)
          }

          card.appendChild(codeLabel)
          card.appendChild(titleEl)
          card.appendChild(desc)
          card.appendChild(cols)
          paras[i].parentNode?.insertBefore(card, paras[i])

          used.add(paras[i])
          used.add(paras[i + 1])
          for (let k = 2; k <= 8; k++) used.add(paras[i + k])
          break
        }
      }

      // 2. Warning boxes ⚠️ — p[⚠️], p[title], p[body]
      for (let i = 0; i < paras.length - 2; i++) {
        if (used.has(paras[i])) continue
        const t = paras[i].textContent?.trim()
        if (t === '⚠️' || t === '⚠') {
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

      // 3. Expert Tip 💡 — p[💡], p[DexMetal Expert Tip], p[body]
      for (let i = 0; i < paras.length - 2; i++) {
        if (used.has(paras[i])) continue
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

      // 4. Numbered steps — find first digit, collect consecutive triplets
      for (let i = 0; i < paras.length - 2; i++) {
        if (used.has(paras[i])) continue
        if (/^\d+$/.test(paras[i].textContent?.trim() || '')) {
          const steps: { step: string; detail: string }[] = []
          let j = i
          while (
            j < paras.length - 2 &&
            !used.has(paras[j]) &&
            /^\d+$/.test(paras[j]?.textContent?.trim() || '')
          ) {
            steps.push({
              step: paras[j + 1]?.textContent?.trim() || '',
              detail: paras[j + 2]?.textContent?.trim() || '',
            })
            used.add(paras[j])
            used.add(paras[j + 1])
            used.add(paras[j + 2])
            j += 3
          }
          if (steps.length > 0) {
            const ol = document.createElement('ol')
            ol.className = 'kh-steps'
            steps.forEach(({ step, detail }) => {
              const li = document.createElement('li')
              li.innerHTML = `<strong>${step}</strong><span>${detail}</span>`
              ol.appendChild(li)
            })
            paras[i].parentNode?.insertBefore(ol, paras[i])
          }
        }
      }

      // 5. Wrong/Correct comparison — collect all consecutive groups
      for (let i = 0; i < paras.length - 3; i++) {
        if (used.has(paras[i])) continue
        if (
          paras[i].textContent?.trim() === 'Wrong' &&
          paras[i + 2]?.textContent?.trim() === 'Correct'
        ) {
          const pairs: { wrong: string; correct: string }[] = []
          let j = i
          while (
            j < paras.length - 3 &&
            !used.has(paras[j]) &&
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

      // 6. FAQ — p[question], p[▼], p[answer]
      for (let i = 0; i < paras.length - 2; i++) {
        if (used.has(paras[i])) continue
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

      // 7. Nav block — p[← Back to], p[label], p[Next →], p[label]
      for (let i = 0; i < paras.length - 3; i++) {
        if (used.has(paras[i])) continue
        if (
          paras[i].textContent?.trim().startsWith('←') &&
          paras[i + 2]?.textContent?.trim().startsWith('Next')
        ) {
          const nav = document.createElement('nav')
          nav.className = 'kh-nav'

          const prevLink = document.createElement('a')
          prevLink.className = 'kh-nav-prev'
          const prevLabel = document.createElement('span')
          prevLabel.className = 'kh-nav-dir'
          prevLabel.textContent = '← BACK TO'
          const prevTitle = document.createElement('span')
          prevTitle.className = 'kh-nav-title'
          prevTitle.textContent = paras[i + 1]?.textContent?.trim() || ''
          prevLink.appendChild(prevLabel)
          prevLink.appendChild(prevTitle)

          const nextLink = document.createElement('a')
          nextLink.className = 'kh-nav-next'
          const nextLabel = document.createElement('span')
          nextLabel.className = 'kh-nav-dir'
          nextLabel.textContent = 'NEXT →'
          const nextTitle = document.createElement('span')
          nextTitle.className = 'kh-nav-title'
          nextTitle.textContent = paras[i + 3]?.textContent?.trim() || ''
          nextLink.appendChild(nextLabel)
          nextLink.appendChild(nextTitle)

          nav.appendChild(prevLink)
          nav.appendChild(nextLink)
          paras[i].parentNode?.insertBefore(nav, paras[i])
          used.add(paras[i])
          used.add(paras[i + 1])
          used.add(paras[i + 2])
          used.add(paras[i + 3])
        }
      }

      // Remove all used paragraphs and DOM elements
      used.forEach((el) => el.remove())
      domRemove.forEach((el) => el.remove())
      return true
    }

    const attempt = () => run()
    if (!attempt()) {
      setTimeout(() => {
        if (!attempt()) {
          setTimeout(() => attempt(), 1000)
        }
      }, 300)
      const observer = new MutationObserver(() => {
        if (run()) observer.disconnect()
      })
      observer.observe(document.body, { childList: true, subtree: true })
      setTimeout(() => observer.disconnect(), 5000)
    }
  }, [])
  return null
}
