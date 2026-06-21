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

**State: on the `design-engine` branch (NOT `master`).** Foundation for the
design engine is built and pushed. Next session = **refining + foundation work**.
The user is doing a dry run first to confirm everything works — so start by asking
how the dry run went / what broke, rather than charging ahead.

**Read first:** [`docs/design-engine/PLAN.md`](design-engine/PLAN.md) (the plan),
[`engine/README.md`](../engine/README.md) (how to run it). The engine is a
self-contained Node project in [`engine/`](../engine/); it **never deploys**
(see the "Design engine" rules in the root [`README.md`](../README.md)).

**Branch discipline:** stay on `design-engine`. Do **not** merge `engine/` onto
`master`. `master` is the deployed marketing site only.

**Done so far (Phase 0 + Phase 3):**
- `data → template → render` pipeline. HTML/CSS → PDF via Playwright/Chromium
  (`engine/src/render/pdf.ts`).
- **Fee proposal — complete & XNDR-branded.** `engine/src/templates/fees-report.ts`,
  schema `FeesReport` in `engine/src/types.ts`, worked example
  `engine/examples/sample-fees.json`. Run: `npm run fees -- examples/sample-fees.json`
  (or `npm run example:fees`). Derived from two real samples in
  `designs/reference/` (Partridge `F2026R0274.1` + CORE `AS6374`).
- **Drawing sheet — branded frame only.** `engine/src/templates/drawing-sheet.ts`
  reproduces the A3 title-block/border/setout-grid from
  `designs/XNDR - Drawing Sheet Template.pdf`. Run: `npm run example:sheet`.
- Brand single-source: `engine/src/brand.ts` (mirrors STD-01/STD-02 + the site).
- Outputs land in git-ignored `designs/`.

**Key technical note (don't re-litigate):** repeating header/footer uses the
**table `thead`/`tfoot`** technique, NOT `position: fixed` (which lets content
slide under the bands in Chromium print). The renderer lets the template's
`@page` rule own size + margins (`preferCSSPageSize: true`, no `format` passed).
See PLAN.md §6 "Renderer note".

**This session = START IMPLEMENTING the enhancements.** Two deep roadmaps were
just written — read them first, they define the work and its order:
- [`docs/design-engine/ENHANCE-fee-docs.md`](design-engine/ENHANCE-fee-docs.md)
- [`docs/design-engine/ENHANCE-design-docs.md`](design-engine/ENHANCE-design-docs.md)

Each ends with a **"Suggested phasing"** section and **open questions**. Don't
resolve an open question in code — ask the user. Recommended first slices (high
value, low/no external dependency — pick with the user):

- **Fee docs, Phase 1 — extract `computeTotals()`** out of `fees-report.ts` into a
  tested helper, add per-stage subtotals + an optional stage fee-estimate badge.
  Then **Phase 2 — the content/boilerplate library** (standard T&Cs, exclusions,
  rate cards, payment terms referenced by id) — the biggest time-saver.
- **Design docs, Phase 1 — multi-sheet sets** (no CAD dependency): render all
  `sheets[]` into one N-page PDF (`index.ts` currently renders `sheets[0]` only),
  sheet numbering/ordering, a cover/index sheet, and a revision-history table in
  the title block. The drawing-content pipeline (the gating CAD decision) comes
  after — confirm the export format with Rinay first.

**Blocked-on-user before building the dependent theme:** real XNDR values (ABN,
bank, DBP/PE no., insurance limits — currently placeholders), CAD export format
for drawing geometry, brochure-vs-lean default for fee front matter, the service
lines XNDR quotes, and the `F2026R0274.1` reference scheme. See the open-questions
sections in both enhance docs + PLAN.md §9.

**Work style:** small, verifiable slices; keep `npm run typecheck` green and
eyeball the rendered PDF after each change (type-check won't catch layout). Pure
template functions stay pure — keep I/O in `index.ts`/`assets.ts`. Don't
re-litigate the `thead`/`tfoot` header/footer technique (PLAN.md §6).

**Verify:** `cd engine && npm run typecheck` must pass. Render samples and eyeball
the PDFs in `designs/`. One-time setup if Chromium is missing:
`cd engine && npm install` (runs `playwright install chromium`).
