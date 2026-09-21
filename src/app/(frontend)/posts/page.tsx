import { redirect } from 'next/navigation'

// SEO fix 2026-08-12: this route was an unmodified leftover from the Payload
// starter template, duplicating /blog's content under a second indexable URL
// (title was literally "Payload Website Template Posts"). Individual post
// pages (/posts/[slug]) already redirect to /blog/[slug] -- this applies the
// same fix to the listing page itself, which had been missed.
export default function Page() {
  redirect('/blog')
}
