import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const richTextContent = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Follow this step-by-step operator walkthrough to go from zero to compliant Basel shipment.', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Step 1 — Understand Your Obligations', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Start with the Knowledge Hub. Learn what Basel codes apply to your material, what documents are required, and which countries need Prior Informed Consent (PIC).', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Step 2 — Find Your Competent Authority', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Use the Basel CA API to find the correct competent authority contact for your export and import countries. Every Basel notification requires this.', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Step 3 — Build Your Notification Document', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Open the Basel Navigator. Fill in your shipment details and generate your vCOP8 notification form and movement document. Download as PDF.', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Step 4 — Verify Shipment Readiness', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Run through the Basel Checklist before your shipment moves. Confirm all documents, approvals, and carrier requirements are in place.', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Step 5 — Get the Full Operator Playbook', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: 'Download the free Operator Playbook for the complete workflow — written by operators who have managed real Basel notifications from TT, JM, BB, and across the Caribbean.', format: 0, mode: 'normal', style: '', version: 1, detail: 0 }]
      }
    ]
  }
}

const result = await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Getting Started with DexMetal',
    slug: 'getting-started',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richTextContent,
            enableLink: false,
          }
        ]
      }
    ]
  }
})

console.log('Getting Started page created. ID:', result.id)
process.exit(0)
