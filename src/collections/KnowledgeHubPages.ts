import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const KnowledgeHubPages: CollectionConfig = {
  slug: 'knowledge-hub-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'pageType', 'priority', 'publishedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'section',
      type: 'select',
      required: true,
      options: [
        'Knowledge Hub',
        'Notification Doc',
        'Movement Doc',
        'PIC Workflows',
        'Country',
        'Supporting Docs',
        'E-Waste',
        'Additional Ref',
        'Tools',
        'API',
        'Shell',
      ],
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: ['guide', 'reference', 'index', 'tool', 'landing', 'static'],
    },
    {
      name: 'priority',
      type: 'select',
      options: ['P1', 'P2'],
      defaultValue: 'P1',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
{      name: 'jsonLd',      type: 'textarea',      label: 'JSON-LD Schema',      admin: {        description: 'Paste valid JSON-LD structured data here. Rendered in <head> as application/ld+json.',        rows: 10,      },    },
    {
      name: 'wpPostId',
      type: 'number',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'wpUrl',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'redirectFrom',
      type: 'text',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
  timestamps: true,
  versions: {
    drafts: true,
  },
}
