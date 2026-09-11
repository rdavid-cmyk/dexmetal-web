import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { DexMetalAgent } from '@/components/DexMetalAgent'

describe('homepage DexMetal Agent entry', () => {
  it('renders the prompt and usable input as one embedded block, without a duplicate logo', () => {
    document.body.innerHTML = renderToStaticMarkup(
      React.createElement(DexMetalAgent, { embedded: true }),
    )

    const block = document.querySelector<HTMLElement>('[data-homepage-agent]')
    expect(block).not.toBeNull()
    expect(block?.querySelector('h1')?.textContent).toBe('Tell us about your shipment')

    expect(block?.querySelector('img[alt="DexMetal"]')).toBeNull()

    expect(block?.querySelector('input[placeholder="Describe your shipment or compliance scenario..."]')).not.toBeNull()
    expect(block?.querySelector('button[aria-label="Open DexMetal Agent"]')).toBeNull()
  })
})
