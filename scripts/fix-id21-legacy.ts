// Mark post id=21 as legacy and populate required metadata + FAQ
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function main() {
  const payload = await getPayload({ config: configPromise })

  const post = await payload.findByID({
    collection: 'posts',
    id: 21,
    overrideAccess: true,
    depth: 0,
  })

  if (!post) { console.error('Post 21 not found'); process.exit(1) }

  const existingFaq = Array.isArray(post.faq) && post.faq.length >= 4 ? post.faq : [
    {
      question: 'What documents are required for a Basel transboundary notification?',
      answer: 'A complete Basel notification requires a movement document, prior informed consent from the receiving country, a description of the waste and its hazardous properties, and details of the disposal or recovery operation.',
    },
    {
      question: 'How long does it take to receive consent for a Basel notification?',
      answer: 'Competent authorities typically respond within 60 to 90 days, though timelines vary by country. Some jurisdictions have faster processing for pre-approved operations and established exporters.',
    },
    {
      question: 'What happens if a Basel notification is rejected?',
      answer: 'If consent is refused, the exporter must not proceed with the shipment. The waste must remain in the country of origin or be redirected to an approved facility. Notification can be revised and resubmitted.',
    },
    {
      question: 'Can a Basel notification cover multiple shipments?',
      answer: 'Yes. A general notification can authorise multiple shipments of the same type of waste to the same facility within a 12-month period, reducing the administrative burden for recurring operations.',
    },
  ]

  await payload.update({
    collection: 'posts',
    id: 21,
    data: {
      legacy_post: true,
      difficulty: 'advanced',
      read_time: 12,
      faq: existingFaq,
    } as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  console.log('id=21: legacy_post=true, difficulty=advanced, read_time=12, faq=4 items ✓')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
