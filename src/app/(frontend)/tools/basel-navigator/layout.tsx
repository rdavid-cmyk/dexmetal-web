import type { Metadata } from 'next'

// SEO fix 2026-08-12: page.tsx here is a 'use client' component, which
// cannot export its own `metadata` (Next.js only allows that in Server
// Components) -- so this route had no metadata of its own and fell through
// to the homepage's title/description, a real duplicate-title match. A
// layout.tsx wrapping a client page is the standard supported way to give
// a client-component route its own metadata.
export const metadata: Metadata = {
  title: 'Basel Notification & Movement Form Assistant',
  description:
    'Prepare Basel Convention notification and movement documents with guided supporting-document checklists and block-by-block form assistance.',
}

export default function BaselNavigatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
