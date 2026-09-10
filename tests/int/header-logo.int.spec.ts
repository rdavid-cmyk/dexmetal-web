import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { DexMetalHeader } from '@/components/DexMetalHeader'

describe('DexMetalHeader', () => {
  it('shows the supplied DexMetal logo as a responsive home link', () => {
    document.body.innerHTML = renderToStaticMarkup(React.createElement(DexMetalHeader))

    const logo = document.querySelector<HTMLImageElement>('img[alt="DexMetal"]')
    expect(logo).not.toBeNull()

    const homeLink = logo!.closest('a')
    expect(homeLink?.getAttribute('href')).toBe('/')
    expect(logo!.getAttribute('src')).toBe('/images/dexmetal-logo.png')
    expect(logo!.getAttribute('width')).toBe('2508')
    expect(logo!.getAttribute('height')).toBe('627')
    expect(logo!.classList.contains('h-auto')).toBe(true)
    expect(logo!.classList.contains('w-28')).toBe(true)
    expect(logo!.classList.contains('sm:w-32')).toBe(true)
  })
})
