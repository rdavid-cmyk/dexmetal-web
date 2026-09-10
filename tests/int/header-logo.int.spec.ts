import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { DexMetalHeader } from '@/components/DexMetalHeader'

describe('DexMetalHeader', () => {
  it('shows the complete enlarged DexMetal logo inside a fixed-height responsive frame', () => {
    document.body.innerHTML = renderToStaticMarkup(React.createElement(DexMetalHeader))

    const logo = document.querySelector<HTMLImageElement>('img[alt="DexMetal"]')
    expect(logo).not.toBeNull()

    const homeLink = logo!.closest('a')
    expect(homeLink?.getAttribute('href')).toBe('/')
    expect(logo!.getAttribute('src')).toBe('/images/dexmetal-logo.png')
    expect(logo!.getAttribute('width')).toBe('2508')
    expect(logo!.getAttribute('height')).toBe('627')
    expect(logo!.parentElement?.classList.contains('overflow-hidden')).toBe(false)
    expect(logo!.parentElement?.classList.contains('h-7')).toBe(true)
    expect(logo!.parentElement?.classList.contains('sm:h-8')).toBe(true)
    expect(logo!.parentElement?.classList.contains('w-[9.45rem]')).toBe(true)
    expect(logo!.parentElement?.classList.contains('sm:w-[10.8rem]')).toBe(true)
    expect(logo!.classList.contains('h-auto')).toBe(true)
    expect(logo!.classList.contains('left-0')).toBe(true)
    expect(logo!.classList.contains('w-[9.45rem]')).toBe(true)
    expect(logo!.classList.contains('sm:w-[10.8rem]')).toBe(true)
  })
})
