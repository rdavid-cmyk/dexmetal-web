'use client'

import { useEffect } from 'react'

export function BlogContentEnhancer() {
  useEffect(() => {
    const run = () => {
      const content = document.querySelector<HTMLElement>('.payload-richtext')
      if (!content) return false
      if (content.dataset.blogEnhanced) return true

      const paras = Array.from(content.querySelectorAll('p'))
      if (paras.length < 3) return false

      content.dataset.blogEnhanced = 'true'
      console.log('[BCE] running, paras found:', paras.length)

      const used = new Set<Element>()

      for (let i = 0; i < paras.length - 2; i++) {
        if (used.has(paras[i])) continue

        const text = paras[i].textContent?.trim() || ''
        const emojiOnly = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]$/u

        if (emojiOnly.test(text) && text.length === 1) {
          const titlePara = paras[i + 1]
          const bodyPara = paras[i + 2]

          if (!titlePara || !bodyPara) continue

          const wrapper = document.createElement('div')
          wrapper.style.cssText = 'background: #2c2c2a; border-left: 4px solid #1D9E75; padding: 1rem 1.25rem; border-radius: 6px; margin-bottom: 1.5rem; display: flex; gap: 0.75rem;'

          const emojiDiv = document.createElement('div')
          emojiDiv.style.cssText = 'font-size: 1.5rem; margin-top: 2px; flex-shrink: 0;'
          emojiDiv.textContent = text

          const textWrapper = document.createElement('div')
          textWrapper.style.flex = '1'

          const titleDiv = document.createElement('div')
          titleDiv.style.cssText = 'font-weight: bold; color: #ffffff; margin-bottom: 0.25rem;'
          titleDiv.textContent = titlePara.textContent?.trim() || ''

          const bodyDiv = document.createElement('div')
          bodyDiv.style.cssText = 'color: #c8c8c2; font-size: 0.95rem; line-height: 1.5;'
          bodyDiv.textContent = bodyPara.textContent?.trim() || ''

          textWrapper.appendChild(titleDiv)
          textWrapper.appendChild(bodyDiv)
          wrapper.appendChild(emojiDiv)
          wrapper.appendChild(textWrapper)
          paras[i].parentNode?.insertBefore(wrapper, paras[i])

          used.add(paras[i])
          used.add(titlePara)
          used.add(bodyPara)
        }
      }

      used.forEach((el) => el.remove())
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