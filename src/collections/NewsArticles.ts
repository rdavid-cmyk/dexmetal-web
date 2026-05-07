import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const NewsArticles: CollectionConfig = {
  slug: 'news-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'source', 'relevance_score', 'published_at'],
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
      name: 'url',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'relevance_score',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'published_at',
      type: 'date',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: [
            { label: 'Basel', value: 'basel' },
            { label: 'E-Waste', value: 'ewaste' },
            { label: 'Hazardous Waste', value: 'hazardous-waste' },
            { label: 'Compliance', value: 'compliance' },
            { label: 'Trade', value: 'trade' },
            { label: 'Recycling', value: 'recycling' },
            { label: 'Regulation', value: 'regulation' },
          ],
        },
      ],
    },
    {
      name: 'fetched_at',
      type: 'date',
    },
  ],
  timestamps: true,
}
