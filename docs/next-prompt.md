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

**Likely next work (refine + foundation):**
- **Real XNDR values** — example uses placeholders: ABN, bank BSB/account, DBP/PE
  number (`0000`). Drop real values into `brand.ts` / the example when supplied.
- **Optional CORE-style cover page + table of contents** for the fee proposal
  (user flagged interest). Current template is the lean Partridge-style spine.
- **Drawing sheet — Phase 1/2:** pixel-match the reference, then multi-sheet sets
  (one PDF, N pages), sheet numbering, revisions, STD-01/STD-02 as generated
  standard sheets.
- **Open questions (resolve with user before building):** how drawing artwork
  enters the sheet field (CAD export / SVG / cropped image?), watermarking
  (`designs/watermarked-version.pdf`), signature/certification asset, data origin
  (JSON vs form/DB). See PLAN.md §9.

**Verify:** `cd engine && npm run typecheck` must pass. For anything visual,
render the sample and eyeball the PDF in `designs/` — type-check won't catch a
layout regression. One-time setup if Chromium is missing:
`cd engine && npm install` (runs `playwright install chromium`).
