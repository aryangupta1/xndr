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

**State: on the `design-engine` branch.** The engine is well established and a lot
is shipped. Start by asking the user what they want next rather than charging in.

**Read first:** [`docs/design-engine/PLAN.md`](design-engine/PLAN.md),
[`engine/README.md`](../engine/README.md) (how to run it), and the two enhancement
roadmaps below. The engine is a self-contained Node project in
[`engine/`](../engine/); it **never deploys**.

**Branch discipline (important):** the engine lives ONLY on `design-engine`. Never
put `engine/` on `master` — `master` is the Next.js site that deploys to Vercel,
and the engine's Playwright/docx imports would break that build. Engine work →
commit/push to `design-engine`. Site work → `master`. No merging between them.
(Pushes need `gh auth switch --user aryangupta1` first, then switch back to
`claude-engagely` after — the active account reverts.)

**Done and shipped:**
- `data → template → render` pipeline; HTML/CSS → PDF via Playwright
  (`engine/src/render/pdf.ts`). CLI in `engine/src/index.ts`.
- **Fee proposal — complete, XNDR-branded, light + dark.**
  `engine/src/templates/fees-report.ts`, schema `FeesReport` in `types.ts`.
  Scripts: `example:fees[:dark]`. Derived from real samples in `designs/reference/`.
- **Fee proposal — editable Word (.docx) export.** `engine/src/word/fees-docx.ts`,
  flag `--docx` (+ `--light`/`--dark`, + `--body`). Bands match the stage/rate
  bars; `--body` puts the brand strips in the page body (full colour in Word's
  editing view) vs the default header/footer placement (which Word greys while
  editing). Scripts: `template:docx`, `template:docx-dark`, `template:docx-body`,
  `template:docx-dark-body`, `example:fees:docx[-dark]`.
- **Drawing sheet** (branded A3 frame, light/dark): `templates/drawing-sheet.ts`.
- **`npm run template`** renders blank `[ … ]` templates (both types, both themes).
- Brand single-source: `engine/src/brand.ts` (palette + `getTheme()` light/dark).
- **Capability Statement, Remedial (ad hoc one-off).**
  `engine/src/oneoff/capability-remedial.ts` → run `npx tsx src/oneoff/capability-remedial.ts`,
  output `designs/capability-statement-remedial.pdf` (17pp A4, XNDR-branded,
  original copy + XNDR's own section headings, Unsplash photos with brand
  fallbacks). The user may want more refinements (e.g. swap the "Putting
  Buildings Right" header photo; add real defect photos). Reference example that
  inspired the structure: `designs/reference/Capability Statement_Remedial_2025_QLD.pdf`
  (git-ignored). Keep it XNDR's own — no mention of any other firm.
- **On `master` (site):** the Testimonials section is hidden (`app/page.tsx`) and
  its nav link removed (`lib/content.ts`). Done + pushed.

**Key technical notes (don't re-litigate):**
- Repeating header/footer uses the table `thead`/`tfoot` technique, not
  `position: fixed`. Renderer lets the template `@page` own size+margins
  (`preferCSSPageSize: true`, no `format`). See PLAN.md §6.
- Word layout-table borders use `BorderStyle.NIL` (not NONE) so they don't paint
  stray boxes. Word docs keep a white page; only the bands go dark in dark mode.

**Possible next work** (pick with the user): refine the capability statement;
build a capability statement for other disciplines (structural / PM); or start the
deeper engine phases in the roadmaps:
- [`docs/design-engine/ENHANCE-fee-docs.md`](design-engine/ENHANCE-fee-docs.md) —
  e.g. extract `computeTotals()`, then a content/boilerplate library.
- [`docs/design-engine/ENHANCE-design-docs.md`](design-engine/ENHANCE-design-docs.md) —
  e.g. multi-sheet drawing sets (currently `index.ts` renders `sheets[0]` only).

**Blocked-on-user:** real XNDR values (ABN, bank, DBP/PE no., insurance limits —
currently placeholders), CAD export format for drawing geometry, and the
`F2026R0274.1` reference scheme. See open-questions in the enhance docs + PLAN.md §9.

**Work style:** small verifiable slices; keep `cd engine && npm run typecheck`
green and eyeball the rendered PDF after each change (type-check won't catch
layout). One-time setup if Chromium is missing: `cd engine && npm install`.
