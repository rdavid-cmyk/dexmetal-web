# CLAUDE.md — DexMetal Web Project Context
Auto-loaded every session. Read before writing any code.

## STACK
- Hetzner CAX41 · 204.168.231.188 · Ubuntu 24.04
- Next.js 15 (App Router) · Payload CMS 3 · PostgreSQL · PM2
- Local: /Users/rdavid.tt/dexmetal-web
- GitHub: rdavid-cmyk/dexmetal-web
- WordPress: live at dexmetal.com — DO NOT TOUCH
- DNS: not moved — Hetzner is staging until Richard approves

## DESIGN SYSTEM — LOCKED
- Background: #1C1B18
- Primary teal: #1D9E75
- Accent orange: #FF5C00
- Display/headings: Play Bold + Play Regular
- Body/UI: DM Sans 400 + 500

## URL STRUCTURE — LOCKED 2026-04-04

### KNOWLEDGE HUB
/knowledge-hub/notification-app/[slug]
/knowledge-hub/movement-doc/[slug]
/knowledge-hub/supporting-docs/[slug]
/knowledge-hub/pic/[slug]
/knowledge-hub/country/[slug]
/knowledge-hub/ewaste/[slug]
/knowledge-hub/reference/[slug]
/knowledge-hub/reference/glossary/

### TOOLS
/tools/checklist/
/tools/quick-code-lookup/
/tools/notification-quick-view/
/tools/movement-quick-view/
/tools/basel-ca-api/

### MAPPING RULES
- Block-X prefix always dropped from slugs
- /data-library/ always maps to /knowledge-hub/
- All old WordPress URLs get 301 redirects
- Never build a page without real WordPress source content
- DNS moves only after Richard approves every page

## MIGRATION SSOT
dexmetal_migration_manifest.csv — 108 entries — ground truth for all page work

## DEPLOY PATTERN
git push → SSH to 204.168.231.188 → git pull → pm2 restart dexmetal

## STANDING RULES
- Never create a file without checking if one exists
- Never build a page with placeholder content
- Never assume a file path — verify first
- Read MIGRATION.md and STATUS.md before every session
- Update STATUS.md at end of every session

## PAYLOAD CONTENT RULE — NO EXCEPTIONS
Never write to posts/pages via psql or raw DB.
Always use Payload local API via Node.js script placed inside
/var/www/dexmetal-web/scripts/ and run from that directory.
Direct DB writes corrupt Lexical JSON and break the admin editor.

Run pattern:
  cd /var/www/dexmetal-web && node_modules/.bin/dotenv -e .env -- node_modules/.bin/tsx scripts/<script>.ts

Note: revalidatePath error in afterChange hook is expected when running outside Next.js context.
The DB write commits before the hook fires -- data is saved. Ignore that error.

## Blog Post Template (canonical — locked May 2026)
Structure: Hero → Intro (2-3 para) → At a Glance → H2 sections (2-4) →
Mid CTA → FAQ (4-6) → End CTA
Visuals: 1 hero + 1 inline max. No duplicate images.
Word count: 1,200–1,800 words. Over 2,000 = split into two posts.
CTAs: Mid-post → /playbook. End → /tools or consulting.
Never write post content directly via psql. Always use Payload local API.

### Payload local API pattern for content updates (required)
All scripts must use:
1. `context: { disableRevalidate: true }` — prevents Next.js revalidatePath from crashing outside Next.js context
2. `normalizeContent()` — strips populated media objects back to raw IDs in mediaBlock nodes before update
   (Payload populate= fetches media as objects; passing them back to update() fails validation)
3. `overrideAccess: true` — needed for local API scripts
See: scripts/normalize-blog-ctas.ts and scripts/split-howto-post.ts for canonical patterns.
