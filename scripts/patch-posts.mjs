import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import dotenv from 'dotenv'
dotenv.config()

const payload = getPayload({ config })
await payload.init()

const posts = [
  { id: 19, excerpt: 'Explore the emerging 62 billion dollar e-waste recycling industry and learn how to capitalize on recoverable metals in discarded electronics.', read_time: 8, meta: { title: 'The Billion-Dollar Industry Hiding in Plain Sight: e-Waste', description: 'Discover the 62B e-waste opportunity. Learn how to source, evaluate, and profit from recoverable metals in discarded electronics.' }, categories: [7] },
  { id: 18, excerpt: 'Essential safety protocols for handling hazardous e-waste materials. Protect your team and stay compliant with regulations.', read_time: 7, meta: { title: 'e-Waste Safety Essentials', description: 'Protect your team and comply with regulations. Essential safety protocols for handling hazardous e-waste materials.' }, categories: [4] },
  { id: 17, excerpt: 'This guide covers what keeps your e-waste business safe from regulators, lawsuits, and financial disasters through proper compliance documentation.', read_time: 9, meta: { title: 'Red Tape Revenue: Mastering e-Waste Compliance Codes', description: 'Master Basel compliance codes to avoid regulatory penalties. Get step-by-step guidance for correct e-waste classification.' }, categories: [7] },
  { id: 16, excerpt: 'Strategic sourcing is the key to e-waste profitability. Learn what veteran dealers look for and where to find it.', read_time: 6, meta: { title: 'Urban Mine | The Hunt', description: 'Learn strategic sourcing tactics used by veteran e-waste dealers. Find valuable materials before your competitors do.' }, categories: [7] },
  { id: 15, excerpt: 'This guide covers the new 2025 Basel PIC procedures for international e-waste shipments. Ensure your compliance is up to date.', read_time: 6, meta: { title: 'Navigating Basel PIC 2025: Your e-Waste Compliance Guide', description: 'Navigate the new 2025 Basel PIC requirements. Ensure your e-waste shipments pass customs and avoid costly delays.' }, categories: [7] },
  { id: 14, excerpt: 'Automate Basel competent authority lookups with the DexMetal API. Save hours of manual research.', read_time: 4, meta: { title: 'Introducing Basel API: Automate Your Competent Authority Lookups', description: 'Automate competent authority lookups for Basel notifications. Save hours of research with programmatic API access.' }, categories: [7] },
  { id: 13, excerpt: 'A single rejected Basel notification can cost 10K to 50K. This step-by-step guide walks you through preparing compliant submissions.', read_time: 17, meta: { title: 'How to Prepare a Basel Notification Step-by-Step (2026 Update)', description: 'Prepare compliant Basel notifications from scratch. Follow this step-by-step guide to avoid rejection and financial loss.' }, categories: [7] },
  { id: 12, excerpt: 'Most Basel notifications fail due to missing documents. Get the complete 20-annex checklist to ensure your submission is accepted.', read_time: 18, meta: { title: 'The 20-Annex Package Nobody Tells You About', description: 'Complete your Basel notification with all 20 required annexes. Avoid rejection with this comprehensive document checklist.' }, categories: [7] }
]

console.log('Patching ' + posts.length + ' posts...')

for (const p of posts) {
  try {
    const result = await payload.update({ collection: 'posts', id: p.id, data: { excerpt: p.excerpt, read_time: p.read_time, meta: p.meta, categories: p.categories } })
    console.log('✓ Post ' + p.id + ' updated')
  } catch(e) {
    console.log('✗ Post ' + p.id + ' error: ' + e.message)
  }
}
console.log('Done!')
