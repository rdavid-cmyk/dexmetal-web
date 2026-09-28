import { describe, expect, it, vi } from 'vitest'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))

vi.mock('posthog-js', () => ({
  default: { capture },
}))

import { captureRouteCheckEvent, getRouteCheckEventProperties } from '../../src/lib/analytics/route-check'

describe('Route Check analytics', () => {
  it('marks only the internal test query as internal traffic', () => {
    expect(getRouteCheckEventProperties('?internal_test=1')).toEqual({ internal_test: true })
    expect(getRouteCheckEventProperties('?internal_test=0')).toEqual({ internal_test: false })
    expect(getRouteCheckEventProperties('?internal_test=true')).toEqual({ internal_test: false })
    expect(getRouteCheckEventProperties('')).toEqual({ internal_test: false })
  })

  it('captures the event with the internal-test property and extra properties', () => {
    capture.mockClear()

    captureRouteCheckEvent('route_check_cta_click', '?internal_test=1', { source: 'homepage' })

    expect(capture).toHaveBeenCalledWith('route_check_cta_click', {
      internal_test: true,
      source: 'homepage',
    })
  })
})
