import { expect, test } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test('workspace fails closed when project lookup is too slow after refresh', async ({ page }) => {
  await page.goto(`${BASE_URL}/workspace`)
  await page.evaluate(() => localStorage.setItem('dexmetal_project_id', 'qa-hanging-project'))

  await page.route('**/api/form-projects?id=qa-hanging-project', async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000))
  })

  await page.goto(`${BASE_URL}/workspace`)
  await expect(page.getByText('Loading Basel Case')).toBeVisible()

  await page.reload({ waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { name: 'Basel Case unavailable' })).toBeVisible({ timeout: 7000 })
  await expect(page.getByText('Case could not be loaded')).toBeVisible()
})
