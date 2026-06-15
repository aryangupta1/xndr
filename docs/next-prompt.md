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

**Still outstanding (Rinay hasn't supplied — don't invent these):**
- **Contact details** — business email, phone, office address, ABN, social links
  (`footer` still has placeholder email/phone + TODOs). The CTA + footer both
  read from `footer.email` / `footer.phone`. If a working contact form is wanted
  over the current `mailto:`, wire Formspree / Vercel form action — confirm which.
- **Project images** — `projects.items` now holds Rinay's 5 real residential
  projects, but the `image` ids are leftover stock from the old commercial
  placeholders and don't match (see the FOLLOW-UP comment in `lib/content.ts`).
  Source better-suited Unsplash photos per project, or ideally Rinay's own site
  photos → `public/` with `image` repointed at the local path.
- **Accreditations** — Rinay supplied DBP + Professional Engineer (DBPA); there's
  no field/component to show them yet (FOLLOW-UP comment in `about`). Consider an
  accreditations strip in the About section.
- **Project location + descriptions** — kept inline as comments in
  `projects.items`; wire into the card if/when it gains those fields.

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
