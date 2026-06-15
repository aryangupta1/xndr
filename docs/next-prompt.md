# Next prompt

Scratch space for the prompt to start the **next** Claude Code session. Carries
context across session boundaries when this conversation ends.

## How to use this file

- When wrapping up, draft a short prompt here describing what to do next.
- When starting the next session, paste this file in (or say "read
  `docs/next-prompt.md` and continue").
- **Claude: the handoff below is an instruction, not a status report.** If it
  holds real work, *act on it* — don't greet, re-summarise, and ask "what would
  you like to do?". Only ask when it's genuinely ambiguous or empty.
- After picking the work up, **reset this file to the template.** A stale prompt
  is worse than none.

## Good prompts include

- **Where to start** — a file path or the relevant convention doc.
- **What state we're in** — what's done, what was last touched, what's blocked.
- **Decisions made between sessions** — so they're not re-litigated.
- **Anything NOT to touch.**

## Bad prompts (avoid)

- "Continue." — no context.
- Restating the whole project — the convention docs already cover it; link them.
- Several unrelated tasks at once — split them into separate sessions.

---

## Prompt for the next session

<!-- Replace everything below with the actual prompt. Keep this fence so the section is easy to find. -->

**Goal this session: finish the content pass.** Rinay's answers (email, 15 Jun
2026, `~/Downloads/answers.pdf`) are now implemented in
[`lib/content.ts`](../lib/content.ts) — `hero`, `about`, `services`, `projects`,
`cta`, `footer.blurb` all carry real copy. `npm run build` passes. This is a
CONTENT pass, not a rebuild.

**Done so far:** contact email (info@xndr.au) + phone (0423 322 772) are live in
`footer`. Newport + Woy Woy have full write-ups (`scope`/`services`/`details`) and
their landing/hero images are the cover renders extracted from the DA plan PDFs
(`~/Downloads/newport-info.pdf`, `woy-woy-info.pdf`) via `pdfimages`/`pdftoppm`.
Projects render as masonry (natural aspect ratios) on the landing + detail pages.

**Still outstanding (don't invent these):**
- **Contact extras** — office address, ABN, social links, and a confirmed CTA
  label are still missing (QUESTIONS.md §7). If a working contact form is wanted
  over the current `mailto:`/`tel:`, wire Formspree / Vercel form action.
- **Detail for the other 3 projects** — Granny Flat (Guildford), New Build
  (Kellyville), Retaining Wall (Box Hill) have no `scope`/`services`/`details`
  yet, so their pages show the "coming soon" note. Populate the `Project` objects
  in `lib/content.ts` when Rinay sends a few lines each. Newport + Woy Woy are the
  reference: the detail page (`components/ProjectDetail.tsx`, a client component
  using **anime.js** for scroll-reveal + an interactive level explorer) renders
  `facts`, `floors` (clickable plan tabs), `materialsImage`/`materialsNote`,
  `services`, `scope`, `details` and `gallery` — each section hides if absent.
  Floor-plan + materials images were cropped from the DA PDFs (address-free) with
  `pdftoppm`/`pdfimages` and live in `public/projects/`.
- **Project images** — Guildford + Box Hill are still PLACEHOLDER Unsplash ids
  (marked TODO in `projects.items`); drop real photos in `public/projects/` and
  repoint `image` (static-import them like the others). Note: phone photos may
  need rotating (the Kellyville set had no EXIF orientation; rotated 270° via `sips`).
- **"Suburbs only" rule** — show the suburb only on projects, never the street
  address or owner name (per Rinay). Keep this in mind for any new project content.
- **Accreditations** — Rinay supplied DBP + Professional Engineer (DBPA); there's
  no field/component to show them yet (FOLLOW-UP comment in `about`). Consider an
  accreditations strip in the About section.

**Keep what's correct:** the XNDR name, the three services, and the
Aryan G — "Rinay is an exceptional mind." testimonial.

**Verify & ship.** `npm run build` must pass. For anything visual, screenshot
**both themes** in a real browser (build won't catch contrast/layout
regressions). Before touching styles, re-read
[`docs/conventions/design-system.md`](conventions/design-system.md) — the
scoped-region rule (hero/project cards need `color`, not just `--text`). Commit
per logical chunk and push to `master` (auto-deploys).

**When real copy fully lands** (contact details + project images in particular),
drop the placeholder-policy caveat from
[`docs/conventions/content-and-assets.md`](conventions/content-and-assets.md) and
reset this file to the template above.
