# Content & assets

## Single source of truth

**All visible copy lives in [`lib/content.ts`](../../lib/content.ts).** Components
import typed objects (`hero`, `services`, `projects`, `footer`, …) and render
them — they contain no hardcoded marketing text. To change wording, edit
`content.ts`, not a component.

Each content group has an exported TypeScript interface. Keep them in sync: if a
component needs a new field, add it to the interface and the data object.

## Placeholder policy

Body copy is intentionally **lorem ipsum** until the business owner supplies real
text. Do not write plausible-sounding fake marketing copy — that risks it being
mistaken for approved content. The questions needed to replace placeholders live
in [`QUESTIONS.md`](../../QUESTIONS.md) (rendered for the client at the hidden
`/questions-for-rizdawg` route — see architecture doc).

Real, non-placeholder facts that ARE correct and must stay:
- Brand name **XNDR** and the three services (Structural / Remedial / Project
  Management) — from the logo.
- The single testimonial: **Aryan G — "Rinay is an exceptional mind."**

## Images (Unsplash)

Project/about images are free Unsplash photos referenced **by id** in
`content.ts`, built into URLs by the `unsplash(id, w)` helper. To swap an image,
change the `image` id (the `photo-…` slug from the Unsplash URL).

- The Unsplash host is allow-listed in
  [`next.config.mjs`](../../next.config.mjs) (`images.remotePatterns`). A new
  image host needs an entry there or `next/image` will throw.
- Pick on-theme photography (engineering, construction, structures). When the
  client supplies real project photos, drop them in `public/` and point `image`
  at the local path instead.

## Hero video

The hero background is a free, hotlinkable Pexels clip (construction crew),
`HERO_VIDEO` in `content.ts`. To change it, replace the URL or add a file to
`public/` and reference it locally. Keep it `muted autoplay loop playsInline`
(required for mobile autoplay) and keep a poster image for first paint.

## Don't break these

- New copy → `content.ts`. New section → new component reading from `content.ts`.
- Keep contact details (`footer.email`, `footer.phone`) as the one place those
  appear; the CTA and footer both read from there.
