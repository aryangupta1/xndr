# Design Engine — Plan

> **Status:** foundation / groundwork. This is the high-level design. Detail is
> filled in as real sample inputs/outputs arrive. Open decisions are tracked in
> [§9 Open questions](#9-open-questions) — don't silently resolve them in code.
>
> **Deep enhancement roadmaps** (how each side grows from here):
> [`ENHANCE-design-docs.md`](ENHANCE-design-docs.md) (drawing sheets) ·
> [`ENHANCE-fee-docs.md`](ENHANCE-fee-docs.md) (fee proposals).

## 1. What it is

The **design engine** is a code-driven document generator for XNDR Consulting. It
takes structured project data and produces branded, print-ready PDFs. It is *not*
part of the deployed marketing site — it lives on the `design-engine` branch,
which **never deploys** (see [§7](#7-isolation-from-the-deployed-site)).

It produces two families of document today, with room for more:

1. **Drawing sheets** — A3 landscape engineering sheets matching
   [`designs/XNDR - Drawing Sheet Template.pdf`](../../designs/XNDR%20-%20Drawing%20Sheet%20Template.pdf):
   the green-bordered sheet with the right-hand dark title block, warm-paper
   drawing field, header chip, and footer. These compose into a multi-sheet
   drawing set (the reference set,
   `designs/2025R0318 - 22 Battery Street - Preliminary.pdf`, is 30 A3 pages).
2. **Fees report** — a branded report/proposal that itemises fees for a job.
   (No reference sample yet — see [§9](#9-open-questions).)

Both share one brand system, one rendering pipeline, and one data-in → PDF-out
shape. Adding a third document type later should mean: a data schema + a template,
nothing else.

## 2. Why it exists / goals

- **Consistency** — every sheet and report is identical in brand, layout, and
  title-block discipline because they come from one template, not hand-styling.
- **Speed** — generate a 30-sheet set or a fees report from structured data in
  seconds; re-issue on data change (a revision) without re-laying-out.
- **Single source of brand truth** — palette, type, and title-block anatomy are
  defined once (mirrors STD-01/STD-02 in the template PDF) and reused.
- **SAAS-ready** — the README floats turning this into a product. The engine is
  therefore structured as `data → template → render`, with no hard dependency on
  one person's machine or a desktop CAD tool, so it can later sit behind an API.

### Non-goals (for now)

- Not a CAD tool. The engine **places** drawing content into a sheet; it does not
  draft the structural geometry. How drawing content (plans/sections/details)
  enters a sheet is an open question — see [§9](#9-open-questions).
- Not a deployed web feature. No public route, no Vercel build.

## 3. Architecture

A small, three-stage pipeline. Each stage is replaceable.

```
  ┌──────────┐     ┌────────────┐     ┌──────────┐     ┌─────────────┐
  │  DATA    │ ──▶ │  TEMPLATE  │ ──▶ │  RENDER  │ ──▶ │  PDF OUTPUT │
  │ (typed)  │     │ (data→HTML)│     │(HTML→PDF)│     │  designs/   │
  └──────────┘     └────────────┘     └──────────┘     └─────────────┘
       ▲                  ▲
       │                  │
   examples/          brand.ts  (palette · type · sheet anatomy = STD-01/02)
```

- **Data** — typed inputs ([`engine/src/types.ts`](../../engine/src/types.ts)):
  `ProjectMeta`, `DrawingSheet`/`DrawingSet`, `FeesReport`. Hand-authored JSON in
  `engine/examples/` now; sourced from a form/DB later.
- **Template** — pure functions `(data) => htmlString`, one per document type
  ([`engine/src/templates/`](../../engine/src/templates/)). They emit semantic
  HTML + CSS that reproduces the template PDF. No side effects, no I/O — easy to
  unit-test and to preview in a browser.
- **Render** — [`engine/src/render/pdf.ts`](../../engine/src/render/pdf.ts):
  HTML → PDF via a headless browser (recommended: **Playwright**, Chromium
  `page.pdf()`). Chosen because the existing template is plainly HTML/CSS, it
  reuses the team's web/CSS skills and the site's brand tokens, gives pixel-exact
  A3 control, and ports cleanly to a server later. Alternatives weighed in
  [§9](#9-open-questions).
- **Output** — written to [`designs/`](../../designs/), which is **git-ignored**.
  Source (engine + templates) is versioned; heavy generated PDFs are not.

### Why HTML/CSS → PDF (not React-PDF / Typst / LaTeX / SVG)

The reference template is unmistakably HTML/CSS (Inter, CSS grid, the same
`#1C2023`/`#6B9243` brand palette as the site). Staying in HTML/CSS means one
brand language across site and documents, full CSS layout power for the title
block and setout grid, and trivial visual preview (open the HTML in a browser).
React-PDF/Typst/LaTeX would each be a second styling language to maintain.

## 4. Repository layout (on this branch)

```
engine/
  README.md             # how to run the engine
  package.json          # engine's own deps (Playwright, tsx) — separate from the site
  tsconfig.json         # engine TS config (Node, not Next)
  src/
    index.ts            # CLI entry: `sheet` | `fees` subcommands
    brand.ts            # palette, type, sheet geometry — STD-01/STD-02 in code
    types.ts            # data model for all document types
    render/
      pdf.ts            # HTML string → PDF file (Playwright)
    templates/
      drawing-sheet.ts  # DrawingSheet → HTML (the A3 sheet)
      fees-report.ts    # FeesReport → HTML
  examples/
    sample-project.json # a project + a couple of sheets, to render end-to-end
    sample-fees.json    # a fees report
docs/design-engine/
  PLAN.md               # this file
designs/                # OUTPUT (git-ignored) + the reference template/sample PDFs
```

The engine is a **self-contained Node project** under `engine/` with its own
`package.json`. It does not share the site's dependency tree, so heavy deps
(Playwright + a browser download) never touch the deployed app.

## 5. The drawing sheet (what we're reproducing)

From the template PDF (STD-02 "Sheet anatomy"):

- **Format** — A3 landscape, 420 × 297 mm. 1.4 mm brand-green border + inner
  hairline.
- **Title block** — right-hand dark strip, top→bottom: **practice** (logo +
  XNDR Consulting + contact) → **project** (name, site address, client/OC, SP/DP
  no.) → **drawing** (number chip + title) → **metadata** (Designed, Drawn, Job
  No., Scale @ A3, Date, Revision) → **certification** (registered-practitioner
  statement + name + DBP/PE no.).
- **Header** — drawing-number chip + drawing title (left), scale (right).
- **Drawing field** — warm-paper panel (`#F7F8F4`) with a 14 mm setout grid and
  A–D (rows) / 1–6 (cols) zone references.
- **Footer** — practice line: contact + template version.

Standard sheets to carry forward from the template:

- **STD-01** — CAD standards: material fills, line types, abbreviations, standard
  general notes.
- **STD-02** — brand & title-block spec (the brand source of truth; mirrored in
  `brand.ts`).

### Brand tokens (STD-02 core palette) — mirrored in `brand.ts`

| Token | Hex | Use |
|-------|-----|-----|
| Ink / background | `#1C2023` | title block, footer |
| Surface | `#23282C` | title-block panels |
| Brand green | `#6B9243` | border, labels, chips |
| Green bright | `#82AD55` | accents |
| Paper (drawing field) | `#F7F8F4` | drawing area |
| Text | `#EEF1F2` | on-dark text |

Type: **Inter / Helvetica Neue**. Headings 700–800, tight tracking. Body 400–600.
Title-block labels uppercase, 0.18em tracking, brand green. (Same brand as the
site — keep them aligned; if the site palette moves, move this too.)

## 6. The fees report (built)

Structure derived from two real samples (in `designs/reference/`): Partridge
`F2026R0274.1` (letter style) and CORE `AS6374` (designed brochure). The
data-driven spine they share is what the engine renders, in XNDR brand:

- **A4 portrait**, repeating brand header (logo + green skew + project ref) and
  footer (practice contact) on every page — implemented with the table
  `thead`/`tfoot` technique (see [§3 render note](#renderer-note-repeating-headerfooter)).
- **Addressee** block (To / C/o / Attention) + **project highlight**.
- **Intro** + **Scope of Works** bullets.
- **Scope & Fees** — staged cards (`FeeStage`): name, description, deliverables,
  and fee line items. A line is a fixed `amount` (rolled into the computed
  Subtotal / GST / Total) or an `amountText` ("Hourly rates", "8% of contract").
- **Hourly rates** table, **exclusions**, **notes**.
- **Acceptance** + signatory block, **payment details** + bank account, and
  **Standard Terms & Conditions** (two-column, on a fresh page).

Implemented in [`engine/src/templates/fees-report.ts`](../../engine/src/templates/fees-report.ts);
schema in [`engine/src/types.ts`](../../engine/src/types.ts) (`FeesReport`);
worked example in `engine/examples/sample-fees.json`.

### Renderer note: repeating header/footer

`page.pdf()` does **not** reliably reserve space for `position: fixed` bands —
flowing content slides under them on continuation pages, and passing `format`
makes Chromium ignore CSS `@page` margins. The fix used here: the document body
is a single `<table>` whose `<thead>`/`<tfoot>` carry the brand bands; the browser
repeats them on every page **and** reserves their space, with backgrounds intact.
The renderer therefore lets the template's `@page` rule own size + margins
(`preferCSSPageSize: true`, no `format`/`margin` passed).

## 7. Isolation from the deployed site

The engine must never affect the marketing site or its Vercel deploy.

- It lives only on `design-engine`; `master` deploys, this branch does not.
- `engine/` is added to [`.vercelignore`](../../.vercelignore) so it isn't
  uploaded even if the branch is ever built.
- `engine/` is excluded from the **root** [`tsconfig.json`](../../tsconfig.json)
  so `npm run build` (the site) never type-checks engine code; the engine has its
  own `tsconfig.json`.
- `engine/node_modules` and all generated PDFs (`designs/`) are git-ignored.
- The engine has **its own `package.json`** — the site's dependency tree is
  untouched, so no Playwright/Chromium in the deployed bundle.

## 8. Roadmap

- [x] **Phase 0 — Groundwork (this change).** Branch, this plan, the `engine/`
      scaffold (types, brand, template + render stubs, examples), isolation wiring.
- [ ] **Phase 1 — Drawing sheet, end to end.** Flesh out `drawing-sheet.ts` to
      pixel-match the template (border, title block, header, setout grid, footer);
      wire Playwright in `pdf.ts`; render `sample-project.json` → A3 PDF and
      diff against the template. Add STD-01/STD-02 as generated standard sheets.
- [ ] **Phase 2 — Drawing set.** Multi-sheet sets, sheet ordering/numbering,
      revisions, a contents/index sheet. Reproduce the 30-page reference set.
- [x] **Phase 3 — Fees report.** `FeesReport` defined from two real samples;
      XNDR-branded A4 template built; renders end to end
      (`npm run fees -- examples/sample-fees.json`). See [§6](#6-the-fees-report-built).
- [ ] **Phase 4 — Drawing content.** Resolve how plan/section/detail artwork
      enters the drawing field (see [§9](#9-open-questions)).
- [ ] **Phase 5 (maybe) — Productise.** Form/DB-driven data, an API around the
      pipeline, watermarking (cf. `designs/watermarked-version.pdf`).

## 9. Open questions

Resolve with the user before building past the relevant phase — don't guess in
code.

1. **Drawing content source.** How does plan/section/detail artwork get into the
   sheet's drawing field — placed raster/vector exports from CAD, traced SVG,
   cropped images (as the site's project photos were), or drawn in-engine? This
   gates Phase 4 and shapes the `DrawingSheet` data model.
2. **Fees report sample.** ~~Need a real sample.~~ **Resolved** — built from
   Partridge `F2026R0274.1` + CORE `AS6374` (`designs/reference/`). Remaining
   polish: real ABN / bank details / DBP no. (currently placeholders in the
   example), and whether to add a CORE-style cover page + contents.
3. **Renderer confirmation.** Plan assumes Playwright (Chromium `page.pdf()`).
   Confirm — vs. an existing build tool the practice already uses.
4. **Watermarking.** `designs/watermarked-version.pdf` exists. Is a watermark
   (DRAFT/PRELIMINARY/issued-for-construction) a render-time concern? Drives a
   render option.
5. **Data origin.** Hand-authored JSON forever, or eventually a form/DB
   (questionnaire-style, like the site's `/questions-for-rizdawg`)?
6. **Signature / certification.** The title block certifies via the registered
   practitioner's signature. Is that an image asset placed at render time, a
   manual post-step, or out of scope for the engine?
```

