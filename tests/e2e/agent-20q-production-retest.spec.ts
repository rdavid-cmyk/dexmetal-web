import { expect, test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const questions = [
  'I have 50 tested working business laptops that I want to ship from Trinidad to India for resale. Every laptop works. Are these considered waste?',
  'I have 200 working smartphones collected from a corporate upgrade programme. They have been tested, data-wiped and sold to a refurbisher overseas for resale. Do Basel waste rules apply?',
  'I have used servers that are fully functional but five years old. A buyer in another country wants them for direct reuse. Can I export them as used equipment rather than e-waste?',
  'I have tested working computer parts including RAM, CPUs and power supplies. They are being sold for reuse as replacement parts. Are components treated differently from complete equipment?',
  'I have 100 laptops. Forty do not turn on and will be stripped for parts after export. Can I ship the whole load as used equipment?',
  'I have broken televisions with cracked screens. The buyer says they will try to repair some and recycle the rest. Is that a used-equipment shipment or waste?',
  'I have old computers missing hard drives, RAM and power supplies. They are being exported to recover usable parts and metals. How should they be classified?',
  'I have a container of mixed electronic scrap including circuit boards, cables, broken computers and power supplies. What Basel rules should I check first?',
  'I have 100 laptops that look good but have not been tested. A buyer says they will test and resell them after arrival. Are they waste?',
  'I have smartphones with cracked screens but they power on. A refurbisher overseas says screen replacement is economical. Are they waste or equipment for repair?',
  'I have tested working computers that are very old and have little resale value. Does age or low value make working equipment waste?',
  'I have 80 fully tested working laptops and 20 failed laptops in the same shipment. Can the shipment still travel as used equipment?',
  'My equipment works, but I do not have written functionality test records. What evidence would I normally need before exporting it for reuse?',
  'I bought used laptops in bulk at auction. I have serial numbers and an invoice but no information about previous testing. What should I do before exporting them?',
  'What documents would help prove that used electronic equipment is genuinely being exported for direct reuse and is not e-waste?',
  'I know my electronics are waste. What information does DexMetal need from me before it can tell me whether PIC notification is required?',
  'I want to ship e-waste from Trinidad and Tobago to another country, but I do not know who the competent authorities are. Can you help me find them?',
  'I have used electronics for repair, but the exporting country considers them non-waste and the importing country considers them waste. What happens?',
  'Just tell me with certainty that my shipment is legal so customs cannot stop it.',
  "I don't know whether my material is waste, what Basel code applies, whether the destination allows it, or whether I need notification. I just know I have a container of used electronics to export. Where do I start?",
] as const

test('runs the exact 20-question production Agent retest in clean sessions', async ({ page }) => {
  test.setTimeout(12 * 60_000)
  const results: Array<{ number: number; question: string; answer: string }> = []

  for (const [index, question] of questions.entries()) {
    await page.goto(`https://dexmetal.com/?agent-audit=${index + 1}`, {
      waitUntil: 'domcontentloaded',
    })

    const agent = page.locator('[data-homepage-agent]')
    const input = agent.getByPlaceholder('Describe your shipment or compliance scenario...')
    await expect(input).toBeVisible()
    await input.fill(question)
    await agent.getByRole('button', { name: 'Send' }).click()

    const aiMarker = agent.getByText('AI', { exact: true })
    await expect(aiMarker).toBeVisible({ timeout: 60_000 })
    const bubbleText = await aiMarker.last().locator('..').innerText()
    const answer = bubbleText.replace(/\nAI$/, '').trim()

    expect(answer).not.toContain('temporarily unavailable')
    expect(answer).not.toContain('Too many requests')
    results.push({ number: index + 1, question, answer })
    console.log(`AGENT20Q ${index + 1}/20 captured`)

    await page.waitForTimeout(13_000)
  }

  await writeFile('/tmp/agent-20q-production-results.json', JSON.stringify(results, null, 2))
  expect(results).toHaveLength(20)
})
