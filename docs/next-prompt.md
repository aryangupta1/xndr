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

**Goal this session: collect Rizdawg's answers to [`QUESTIONS.md`](../QUESTIONS.md)
and implement them into the site.** The build is done and live-ready on `master`
— this is a CONTENT pass, not a rebuild.

**Step 1 — get the answers.** The questions are served for Rizdawg at the hidden
`/questions-for-rizdawg` route (renders `QUESTIONS.md`). Ask the human (aryan) for
Rizdawg's responses — pasted inline, a file, or a link. **If they're not here
yet, that's the blocker: ask for them and don't start guessing copy.** Don't
invent plausible marketing text to fill gaps.

**Step 2 — implement them.** All answered copy goes into
[`lib/content.ts`](../lib/content.ts) (the single source of truth) — `hero`,
`about`, `services`, `projects`, `footer`. As you go:
- Replace lorem ipsum only where there's a real answer; leave the rest as
  placeholder and note what's still outstanding.
- Real contact details → `footer.email` / `footer.phone` (the CTA + footer both
  read from there). If they want a working contact form instead of the current
  `mailto:`, wire one (Formspree / Vercel form action) — confirm which.
- Real project photos, if supplied, go in `public/` with `image` repointed at the
  local path; otherwise keep the curated Unsplash ids.
- Keep what's already correct: the XNDR name, the three services, and the
  Aryan G — "Rinay is an exceptional mind." testimonial.

**Step 3 — verify & ship.** `npm run build` must pass. For anything visual,
screenshot **both themes** in a real browser (build won't catch contrast/layout
regressions). Before touching styles, re-read
[`docs/conventions/design-system.md`](conventions/design-system.md) — the
scoped-region rule (hero/project cards need `color`, not just `--text`). Commit
per logical chunk and push to `master` (auto-deploys).

**When real copy fully lands,** drop the placeholder-policy caveat from
[`docs/conventions/content-and-assets.md`](conventions/content-and-assets.md) and
reset this file to the template above.
