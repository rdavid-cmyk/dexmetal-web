import { expect, test } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('premium homepage compliance hero', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 812 },
  ]) {
    test(`${viewport.name} keeps the compliance hero and Agent console responsive`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(baseURL)

      await page.waitForTimeout(750)
      expect(await page.evaluate(() => window.scrollY)).toBe(0)

      const hero = page.locator('[data-homepage-hero]')
      await expect(hero).toBeVisible()

      const mainHeading = hero.getByRole('heading', {
        level: 1,
        name: 'Basel compliance for cross-border e-Waste trade',
      })
      await expect(mainHeading).toBeVisible()
      const headingSize = await mainHeading.evaluate((element) =>
        Number.parseFloat(window.getComputedStyle(element).fontSize),
      )
      if (viewport.name === 'desktop') {
        expect(headingSize).toBeGreaterThanOrEqual(56)
        expect(headingSize).toBeLessThanOrEqual(64)
      } else {
        expect(headingSize).toBeGreaterThanOrEqual(40)
        expect(headingSize).toBeLessThanOrEqual(48)
      }

      await expect(hero.getByText('182 jurisdictions', { exact: true })).toBeVisible()
      await expect(hero.getByText('Official Basel sources', { exact: true })).toBeVisible()
      await expect(hero.locator('[data-route-map]')).toHaveCount(1)

      const agent = page.locator('[data-homepage-agent]')
      await expect(agent).toBeVisible()
      await expect(agent).toHaveAttribute('aria-label', 'DexMetal shipment guidance console')
      await expect(agent.getByRole('heading', { level: 2 })).toHaveText(
        'Tell us about your shipment',
      )
      await expect(agent.locator('img[alt="DexMetal"]')).toHaveCount(0)

      const input = agent.getByPlaceholder('Describe your shipment or compliance scenario...')
      await expect(input).toBeVisible()
      if (viewport.name === 'mobile') {
        await input.scrollIntoViewIfNeeded()
      }
      expect(
        await input.evaluate((element) => {
          const bounds = element.getBoundingClientRect()
          const hitTarget = document.elementFromPoint(
            bounds.left + bounds.width / 2,
            bounds.bottom - 2,
          )
          return hitTarget === element || element.contains(hitTarget)
        }),
      ).toBe(true)

      const agentBox = await agent.boundingBox()
      expect(agentBox).not.toBeNull()
      expect(agentBox!.width).toBeLessThanOrEqual(viewport.width - 24)
      if (viewport.name === 'desktop') {
        expect(agentBox!.width).toBeGreaterThanOrEqual(880)
        expect(agentBox!.y + agentBox!.height).toBeLessThanOrEqual(viewport.height)
      }

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)

      await expect(page.getByRole('button', { name: 'Open DexMetal Agent' })).toHaveCount(0)
      await expect(page.getByText('Built by operators, free to start.')).toHaveCount(0)
      await expect(page.locator('a[href="/playbook"]')).not.toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Basel guidance and resources' })).toBeVisible()
      await expect(page.getByText('How DexMetal Works', { exact: true })).toBeVisible()
    })
  }

  test('keeps normal navigation targets and the floating Agent off-homepage', async ({ page }) => {
    await page.goto(baseURL)

    const expectedLinks = [
      ['Basel Case', '/workspace'],
      ['Tools', '/tools'],
      ['Knowledge Hub', '/knowledge-hub'],
      ['Services', '/services'],
      ['Blog', '/blog'],
      ['News', '/news'],
      ['Developers', '/developers'],
      ['Resources', '/resources'],
    ] as const

    for (const [name, href] of expectedLinks) {
      await expect(page.getByRole('navigation').first().getByRole('link', { name, exact: true })).toHaveAttribute(
        'href',
        href,
      )
    }

    await page.goto(`${baseURL}/tools`)
    await expect(page.getByRole('button', { name: 'Open DexMetal Agent' })).toBeVisible()
    await expect(page.locator('[data-homepage-agent]')).toHaveCount(0)
  })
})
