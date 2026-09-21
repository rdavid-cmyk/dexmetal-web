import { redirect } from 'next/navigation'

// SEO fix 2026-08-12: same leftover-template duplicate as /posts (see
// /posts/page.tsx). This was real, working pagination logic sitting on the
// wrong (legacy) route, indexable at /posts/page/2, /posts/page/3, etc.
// /blog currently shows all posts on one page (only 12 total), so there is
// nothing to paginate to -- redirect straight to /blog.
export default function Page() {
  redirect('/blog')
}
