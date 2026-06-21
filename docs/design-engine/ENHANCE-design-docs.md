# Enhancing the Design-Document Engine (drawing sheets)

> Companion to [`PLAN.md`](PLAN.md). This is the deep roadmap for taking the
> **drawing-sheet** side of the engine from "branded title-block frame" to a real
> production drawing-set generator. Fee docs are covered separately in
> [`ENHANCE-fee-docs.md`](ENHANCE-fee-docs.md).

## Where we are

Implemented today ([`engine/src/templates/drawing-sheet.ts`](../../engine/src/templates/drawing-sheet.ts)):
A3-landscape sheet reproducing the brand frame from
`designs/XNDR - Drawing Sheet Template.pdf` — green border, right-hand dark
title block (practice → project → drawing → metadata → certification), header
chip, warm-paper drawing field with a 14 mm setout grid + A–D / 1–6 zones, and
footer. **The drawing field is a placeholder** — no real plan/section/detail
content goes in yet. One sheet per run, no set.

The reference deliverable to match is the 30-page A3 set
`designs/2025R0318 - 22 Battery Street - Preliminary.pdf` (and its
`watermarked-version.pdf`).

## The north star

A structural/remedial engineer authors structured input (or imports CAD output)
and the engine emits a **complete, certified, revision-controlled drawing set** —
cover/index, standard sheets, and detail sheets — that is brand-perfect, true to
scale at A3, and ready to issue. Nothing hand-styled per sheet.

---

## Enhancement themes (priority order)

### 1. Drawing-content pipeline — *the gating decision*

Right now the field is empty. How real artwork (plans, sections, details) lands
in it is the single biggest unknown and blocks most else. Options, with a
recommendation:

| Approach | How | Pros | Cons |
|----------|-----|------|------|
| **Vector import (recommended)** | Place an SVG/PDF export from CAD (Revit/AutoCAD/ArchiCAD) into the field, scaled to fit a zone | True vector, crisp at any zoom, real line weights | Needs a clean export step; PDF→placement plumbing |
| Raster placement | Drop a high-DPI PNG/JPG crop (like the site's project photos) | Trivial | Not scalable, blurry at print, no true scale |
| Native SVG primitives | Author details as engine SVG (lines, hatches, dims) | Full control, scriptable typical details | Re-implements CAD; only viable for *typical* details, not project geometry |
| Hybrid (likely real answer) | Vector import for project geometry **+** native SVG for typical details & annotations layered on top | Best of both | Most build effort |

**Recommendation:** build around **vector placement** first (an `image`/`svg`
`DrawingContent` that fits a target zone with a declared scale), then add a
**native-SVG typical-detail library** (theme 6). Decide the CAD export format with
Rinay before building — it shapes the whole `DrawingContent` model. See
[PLAN.md §9 Q1](PLAN.md#9-open-questions).

**Data-model impact:** extend `DrawingContent` in
[`engine/src/types.ts`](../../engine/src/types.ts) from the current
`{kind, source}` to support placement: `viewport`/zone target, `scale`
(e.g. `1:50`), `fit` mode, and multiple placed views per sheet.

### 2. Multi-sheet drawing sets

A deliverable is a *set*, not a sheet. Build:

- **One PDF, N pages** — render every `DrawingSheet` in a `DrawingSet` into a
  single document (the CLI currently renders `sheets[0]` only — see
  [`engine/src/index.ts`](../../engine/src/index.ts)).
- **Sheet numbering & ordering** — discipline like `S-001` cover, `S-101…` plans,
  `S-301…` sections, `S-501…` details; auto-sequence with manual override.
- **Cover / drawing index sheet** — title, project block, and a contents table
  (sheet no. → title → rev) generated from the set.
- **Sheet cross-references** — "see detail 3/S-501"; resolve references so a
  retitled/renumbered sheet updates its callers.

### 3. Title-block completeness

The frame exists; production sheets need more in it:

- **Revision history table** — rev, date, description, by/checked — the most
  important missing piece for issued drawings.
- **North point** and **graphic scale bar** (true to the sheet scale).
- **Key/location plan** thumbnail.
- **Amendment clouds + revision triangles** keyed to the rev table.

### 4. Scale & dimension system

- Map the 14 mm setout grid to real-world mm at the sheet scale so placed content
  is *actually* 1:50/1:100 at A3.
- **Scale bar** that recomputes from the declared scale.
- **Dimension annotations** (native SVG): witness lines, arrows, figured
  dimensions in mm — honouring "do not scale, use figured dimensions" (STD-01).

### 5. CAD standards enforcement (STD-01 as code)

`designs/XNDR - Drawing Sheet Template.pdf` STD-01 defines material fills, line
types, abbreviations and standard notes. Encode these as engine primitives:

- **Line-type/weight tokens** (object/cut, existing, membrane, setout/centreline,
  dimension) in [`brand.ts`](../../engine/src/brand.ts).
- **Material-fill hatch library** (existing concrete, new concrete, screed,
  WPM, tile, render, flashing, bond breaker, sealant) as reusable SVG patterns.
- **Standard general notes + abbreviations** as data, droppable on any sheet.

### 6. Standard & typical-detail sheets

- Generate **STD-01 / STD-02** as real engine sheets (legend + brand spec) so
  they ship with every set and stay in sync with the tokens.
- A **typical-detail library** — parametric, reusable details (e.g. balcony
  waterproofing upstand, control joint) authored once as native SVG and placed
  by reference. This is where the engine starts to *save real drafting time*.

### 7. Issue status, watermarking & the issue register

- **Watermark layer** — `DRAFT` / `PRELIMINARY` / `FOR CONSTRUCTION` driven by
  `DrawingSet.issueStatus` (cf. `designs/watermarked-version.pdf`).
- **Issue register** — who got which revision when.

### 8. Certification & signatures (DBP Act 2020)

- Place the registered practitioner's **signature image** + DBP/PE number in the
  certification block at render time; unsigned vs certified states.
- Integrate the **Regulated Design Declaration** workflow (the fee samples
  reference DBPA documentation) — a declaration sheet generated for the set.

### 9. Output fidelity & QA

- **Print fidelity at A3** — verify line weights/hairlines hold at true size
  (Chromium hairlines can render thin); calibrate `mm`/`pt` weights.
- **Visual regression** — pixel-diff rendered sheets against the reference
  template so brand drift is caught.
- **Crop/bleed marks** if a print bureau needs them.

### 10. Productisation (later)

Detail-library marketplace, project-from-template scaffolding, and eventually a
web authoring surface (ties into the SAAS idea in the root README).

---

## Suggested phasing

1. **Sets first** (theme 2 minus content): multi-page render, numbering, cover/
   index, revision table (theme 3) — high value, no CAD dependency.
2. **Decide + build the content pipeline** (theme 1) — unblocks real sheets.
3. **Scale/dimension + CAD standards** (themes 4, 5) once content places.
4. **Typical-detail library + standard sheets** (themes 5, 6).
5. **Issue/cert/QA** (themes 7, 8, 9) to make output truly issuable.

## Open questions (resolve before the dependent theme)

1. **CAD export format** for project geometry — PDF? SVG? DXF? (gates theme 1).
2. **Source of typical details** — trace existing, or author fresh in-engine?
3. **Signature handling** — image asset placed by engine, or manual post-step?
4. **True scale requirement** — must placed content be metrically exact at A3, or
   is "fits the zone, labelled with scale" enough for early issues?
5. **Set scope** — does a set always include STD-01/STD-02 + a cover, or opt-in?
