import { permanentRedirect } from 'next/navigation'

// Retired: was a per-engagement consulting page, pre-dating the 2026-06-29
// no-consulting business identity lock. Removed 2026-07-27 (Richard-directed).
export default function RetiredServicePage() {
  permanentRedirect('/services')
}
