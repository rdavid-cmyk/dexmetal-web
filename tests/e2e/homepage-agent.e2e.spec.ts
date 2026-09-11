import { expect, test } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('homepage Agent starting point', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 812 },
  ]) {
    test(`${viewport.name} keeps the embedded Agent input above the fold`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(baseURL)

      await page.waitForTimeout(750)
      expect(await page.evaluate(() => window.scrollY)).toBe(0)

      await expect(
        page.getByRole('heading', { name: 'Basel compliance for cross-border e-waste trade' }),
      ).toBeVisible()

      const agent = page.locator('[data-homepage-agent]')
      await expect(agent).toBeVisible()
      await expect(agent.getByRole('heading', { level: 1 })).toHaveText(
        'Tell us about your shipment',
      )
      await expect(agent.locator('img[alt="DexMetal"]')).toHaveCount(0)

      const input = agent.getByPlaceholder('Describe your shipment or compliance scenario...')
      await expect(input).toBeVisible()
      const inputBox = await input.boundingBox()
      expect(inputBox).not.toBeNull()
      expect(inputBox!.y + inputBox!.height).toBeLessThanOrEqual(viewport.height)

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
