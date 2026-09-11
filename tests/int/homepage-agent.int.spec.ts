import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { DexMetalAgent } from '@/components/DexMetalAgent'

describe('homepage DexMetal Agent entry', () => {
  it('renders the approved logo, prompt, and usable input as one embedded block', () => {
    document.body.innerHTML = renderToStaticMarkup(
      React.createElement(DexMetalAgent, { embedded: true }),
    )

    const block = document.querySelector<HTMLElement>('[data-homepage-agent]')
    expect(block).not.toBeNull()
    expect(block?.querySelector('h1')?.textContent).toBe('Tell us about your shipment')

    const logo = block?.querySelector<HTMLImageElement>('img[alt="DexMetal"]')
    expect(logo?.getAttribute('src')).toBe('/images/dexmetal-logo.png')
    expect(logo?.getAttribute('width')).toBe('2508')
    expect(logo?.getAttribute('height')).toBe('627')
    expect(logo?.classList.contains('w-[9.45rem]')).toBe(true)
    expect(logo?.classList.contains('sm:w-[10.8rem]')).toBe(true)

    expect(block?.querySelector('input[placeholder="Describe your shipment or compliance scenario..."]')).not.toBeNull()
    expect(block?.querySelector('button[aria-label="Open DexMetal Agent"]')).toBeNull()
  })
})
