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

**Site is LIVE-READY and pushed to `master`.** The landing page is fully built
(Next 14 App Router + TS), responsive, with a dark/light toggle and a hidden
`/questions-for-rizdawg` route. It's optimized for Vercel (auto URLs, security
headers, Node pinned). Last commit: light-mode contrast fix, verified by
screenshot in both themes.

**The site is blocked on CONTENT, not code.** All body copy is intentional
placeholder lorem ipsum. The real next step is populating
[`lib/content.ts`](../lib/content.ts) once Rizdawg / the owner answers
[`QUESTIONS.md`](../QUESTIONS.md) (sharable via the `/questions-for-rizdawg`
page). Don't invent marketing copy — wait for their answers. Keep the XNDR name,
the three services, and the Aryan G testimonial as-is.

**Likely real tasks when you're back (do only what's asked):**
- Drop answered copy into `lib/content.ts` (hero, about, services, projects, footer).
- Wire the CTA/contact to something real — right now it's a `mailto:` to the
  placeholder `footer.email`. A form (Formspree / Vercel form action) is the
  likely ask. Update `footer.email`/`footer.phone` with real details.
- Swap placeholder Unsplash photos for real project photography if supplied
  (see [`docs/conventions/content-and-assets.md`](conventions/content-and-assets.md)).

**Before any visual change:** read
[`docs/conventions/design-system.md`](conventions/design-system.md) — especially
the scoped-region rule (hero/project cards need `color`, not just `--text`).
**Verify visuals in a real browser/screenshot**, both themes — `npm run build`
won't catch contrast/layout regressions.
