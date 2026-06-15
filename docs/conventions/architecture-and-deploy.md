# Architecture & deploy

## Stack

Next.js 14 (App Router) · TypeScript · React 18. Plain CSS. No state manager, no
data layer — it's a static marketing site. Deployed on Vercel (zero-config).

## Layout

```
app/
  layout.tsx        # html shell, Inter font, metadata, no-flash theme script
  page.tsx          # composes the section components in order
  globals.css       # design tokens + every component's styles
  robots.ts         # /robots.txt (App Router metadata route)
  sitemap.ts        # /sitemap.xml
  questions-for-rizdawg/page.tsx   # hidden client-questionnaire route
components/          # one component per section (Nav, Hero, …, Footer) + ThemeToggle
lib/
  content.ts        # ALL copy + image ids + hero video (see content doc)
  site.ts           # canonical site URL resolver
public/             # logo variants, favicon/OG mark
docs/               # this folder + next-prompt.md
```

One component per page section. `page.tsx` is the running order of the page.

## Server vs client components

Default to **server components**. Only mark `"use client"` when a component needs
the browser:

- `components/Nav.tsx` — mobile menu state.
- `components/ThemeToggle.tsx` — reads/writes `localStorage`, mutates `<html>`.

Everything else (Hero, Services, About, Projects, Testimonials, CTA, Footer) is a
server component. The questions route reads `QUESTIONS.md` from disk at **build
time** (server component) and renders it with `react-markdown` — 0 client JS.

## Canonical URL

Never hardcode the production domain. [`lib/site.ts`](../../lib/site.ts) resolves
`siteUrl` in order: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL`
(set by Vercel at build) → `http://localhost:3000`. `layout.tsx`, `robots.ts` and
`sitemap.ts` all use it, so OG/canonical/sitemap are correct per environment.

## Hidden routes

`/questions-for-rizdawg` is unlisted-by-convention, not access-controlled. The
pattern for any "hidden" page:

1. `export const metadata = { robots: { index: false, follow: false } }`.
2. Add a `Disallow` for it in [`app/robots.ts`](../../app/robots.ts).
3. Don't link it from nav/footer/sitemap.

It still returns 200 to anyone with the link — if a page needs real protection,
that's auth/Vercel password protection, not this pattern.

## Security headers

Set framework-natively in [`next.config.mjs`](../../next.config.mjs) `headers()`:
HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`; `poweredByHeader: false`. Add new headers there so they
apply identically locally and on Vercel.

## Deploy

- Push to `master` → Vercel auto-builds and deploys (`github.com/aryangupta1/xndr`).
- Node is pinned via `.nvmrc` + `engines` for reproducible builds.
- Zero env vars required. Optional: `NEXT_PUBLIC_SITE_URL` once a custom domain
  is connected (see `.env.example`).
- `npm run build` must pass (it type-checks) before pushing. Verify visually with
  a real browser/screenshot for anything visual — the build won't catch a
  contrast or layout regression.
