# XNDR — Landing Page

A responsive landing page for **XNDR** (Structural Engineering · Remedial
Engineering · Project Management), built with **Next.js (App Router) + TypeScript**
and ready for one-click deployment to Vercel.

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

## Deploy to Vercel
1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects
   Next.js; no configuration needed.
3. Deploy. (Or run `npx vercel` from this directory.)
