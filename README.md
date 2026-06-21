# XNDR — Landing Page

A responsive landing page for **XNDR** (Structural Engineering · Remedial
Engineering · Project Management), built with **Next.js (App Router) + TypeScript**
and ready for one-click deployment to Vercel.

> **Docs:** project conventions live in [`docs/conventions/`](docs/conventions/);
> cross-session handoff notes in [`docs/next-prompt.md`](docs/next-prompt.md).

## Tech
- **Next.js 14** (App Router) + **TypeScript** + **React 18**
- Plain CSS design system in `app/globals.css` (no UI dependency to maintain)
- `next/image` for optimized, responsive imagery
- Brand palette sampled directly from the supplied XNDR logo
  (background `#1c2023`, green `#6b9243`)

## Getting started
```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:
```bash
npm run build    # production build + type-check
npm run start    # serve the production build
```

## Project structure
```
app/
  layout.tsx        # html shell, fonts, metadata
  page.tsx          # composes the sections
  globals.css       # design tokens + all component styles
components/          # Nav, Hero, Services, About, Projects, Testimonials, CTA, Footer
lib/
  content.ts        # ← ALL site copy + image ids + hero video live here
public/
  logo.jpeg         # original supplied logo
  logo-nav.png      # cropped wordmark (nav + footer)
  logo-mark.png     # square mark (favicon / OG)
QUESTIONS.md        # questions for the business owner to populate real copy
```

## Editing content
All visible text is **placeholder (lorem ipsum)** on purpose. Edit
[`lib/content.ts`](lib/content.ts) to update copy, stats, services, projects,
testimonials and footer details. See [`QUESTIONS.md`](QUESTIONS.md) for the list
of details to collect from the business owner.

### Images
Project/about images are free **Unsplash** photos referenced by id in
`lib/content.ts`. To swap one, replace the `image` id with another Unsplash photo
id. The Unsplash host is already allow-listed in `next.config.mjs`. When real
project photography is available, drop files into `public/` and point the `image`
field at the local path instead.

### Hero video
The hero uses a free, hotlinkable stock construction clip from Pexels
(`HERO_VIDEO` in `lib/content.ts`). Replace the URL — or add the file to
`public/` and reference it locally — to use your own footage.

## To do
- [x] **Design-engine branch** — created (`design-engine`). Houses the PDF
  generation tooling in [`engine/`](engine/); see [Design engine](#design-engine-design-engine-branch) below.
- [ ] Think about converting to SAAS product? for the design engine

## Design engine (`design-engine` branch)

The **design engine** is a code-driven PDF generator for XNDR's documents —
**fee proposals** (A4) and **engineering drawing sheets** (A3) — built from
structured JSON and rendered HTML/CSS → PDF. It lives **only on the
`design-engine` branch** and is **never deployed**.

- **Where:** [`engine/`](engine/) (self-contained Node project, own
  `package.json`). Plan: [`docs/design-engine/PLAN.md`](docs/design-engine/PLAN.md).
  How to use it: [`engine/README.md`](engine/README.md).
- **Output:** the git-ignored [`designs/`](designs/) directory.

### Rules (keep these intact)

1. **Never deploys.** `master` is the only branch Vercel builds. Don't merge
   `engine/` onto `master`. The engine is isolated three ways: excluded from the
   site's [`tsconfig.json`](tsconfig.json), listed in
   [`.vercelignore`](.vercelignore), and kept in its own dependency tree.
2. **Separate dependencies.** The engine has its **own** `package.json`
   (Playwright + Chromium). Never add engine deps to the root `package.json` — it
   would bloat the deployed app.
3. **Brand stays in sync.** [`engine/src/brand.ts`](engine/src/brand.ts) mirrors
   the site's palette/type and STD-01/STD-02. If the site brand moves, move this
   too — don't let them diverge.
4. **Outputs and reference PDFs are git-ignored.** Generated PDFs and reference
   samples live in `designs/` and are **never committed** (they contain heavy
   assets and, for client samples, third-party PII). Keep reference material in
   [`designs/reference/`](designs/).
5. **Type-check before commit.** Run `npm run typecheck` in `engine/`. For
   anything visual, render the sample and eyeball the PDF — the type-check won't
   catch a layout regression.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aryangupta1/xndr)

This repo is preconfigured for zero-config deployment:

1. Push to GitHub (already wired to `github.com/aryangupta1/xndr`):
   ```bash
   git push -u origin master
   ```
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Vercel
   auto-detects Next.js. No build settings, no env vars required.
3. Deploy. (Or run `npx vercel` from this directory.)

### What's already optimized
- **Production URLs** resolve automatically via `VERCEL_PROJECT_PRODUCTION_URL`
  (Open Graph, canonical, `robots.txt`, `sitemap.xml`) — no hardcoded domain.
- **Security headers** (HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`) set in `next.config.mjs`.
- **Node version pinned** via `.nvmrc` + `engines` so builds are reproducible.
- **`next/image`** with a bounded cache TTL and the Unsplash host allow-listed.

### Custom domain
After connecting a domain in Vercel, set one environment variable so SEO tags
point at it (optional — see `.env.example`):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
