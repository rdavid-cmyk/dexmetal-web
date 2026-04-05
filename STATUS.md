# STATUS.md — DexMetal Web Project Status
Last updated: 2026-04-05

## PAGES
| Page | Status | Notes |
|---|---|---|
| Homepage | DONE | Rebuilt from live WP structure with blog feed + CTA |
| Knowledge Hub index | DONE | 106 cards + search |
| Knowledge Hub content pages (108) | PENDING | URLs need remapping |
| /blog | DONE | Payload post cards with image/category/date/excerpt |
| /tools | BUILT | Needs real content |
| /about | DONE | Rebuilt from live WordPress content |
| /basel-ca-api | DONE | Rebuilt marketing page, updated to 182 countries |
| /checklist | DONE | New root page with signup form + API route |
| /contact | BUILT | Needs real WordPress content |

## COMPONENTS
| Component | Status | Notes |
|---|---|---|
| KhContentEnhancer | DONE | All patterns rendering |
| globals.css .kh-* styles | DONE | |
| 301 redirects | PENDING | Awaiting URL remap |

## BLOCKERS
- URLs not yet remapped to locked structure
- Real WordPress content not yet loaded into /contact /tools
- Local build blocked without PostgreSQL available for Payload static path generation
- DNS not moved

## NEXT ACTIONS (in order)
1. Remap 108 page slugs to locked URL structure
2. Build /contact from real WordPress content
3. Build /tools from real content
4. Verify all rebuilt pages on staging server after deploy
5. DNS move — after Richard approves all pages

## SESSION UPDATE 2026-04-05
### COMPLETED THIS SESSION
- [...slug] catch-all route live for /knowledge-hub/
- 82 DB slugs updated with section prefixes
- 7 section index pages built and sorted
- Internal content links remapped (82 rows)
- Prev/next nav built on leaf pages
- 120 redirects built in redirects.ts
- Knowledge Hub index rebuilt to match WordPress 7-card design
- Homepage built from live WordPress content
- /about built from live WordPress content
- /basel-ca-api built, updated to 182 countries
- /checklist built with email capture form
- /blog built pulling from Payload posts collection
- Navigation updated: Home, Blog, Services, Resources, About, Contact
- 8 WordPress blog posts imported into Payload with images
- Build clean: 142 static pages, 0 errors, PM2 online

### KNOWN ISSUES
- Blog hero images not all imported correctly
- /contact needs real WordPress content
- /tools needs real content
- DNS not moved yet

### NEXT SESSION (in order)
1. Fix blog hero images
2. Build /contact from real WordPress content
3. Build /tools from real content
4. Richard approves all pages
5. DNS move

