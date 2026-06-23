# XNDR Design Engine — User Guide

The design engine turns **structured data (a JSON file)** into **branded,
print-ready PDFs** for XNDR Consulting. No AI required — you edit a file, run one
command, and get a PDF.

It produces two document types:

| Type | Command | Page | Output |
|------|---------|------|--------|
| **Fee proposal** | `npm run fees` | A4 portrait | a full branded fee proposal |
| **Drawing sheet** | `npm run sheet` | A3 landscape | an engineering title-block sheet |
| **Blank templates** | `npm run template` | both | empty `[ … ]` templates for both types, in **both themes** |

Both document types come in a **light** and a **dark** theme — see
[Light or dark](#light-or-dark) below. The **fee proposal** can also be exported
as an **editable Word (.docx)** — see [Editable Word](#editable-word-docx).

> Lives on the `design-engine` branch and **never deploys**. Full design notes:
> [`../docs/design-engine/PLAN.md`](../docs/design-engine/PLAN.md).

---

## 1. One-time setup

You need [Node.js 20+](https://nodejs.org). Then, from the repo root:

```bash
cd engine
npm install          # installs deps + downloads the Chromium it renders with
```

(`npm install` runs `playwright install chromium` automatically. If that step is
skipped in your environment, run `npx playwright install chromium` once.)

---

## 2. Quick check — render the bundled examples

Confirm everything works end to end:

```bash
npm run example:fees           # default theme (light) fee proposal
npm run example:fees:dark      # dark fee proposal
npm run example:sheet          # default theme (dark) drawing sheet
npm run example:sheet:light    # light drawing sheet
npm run example:fees:docx      # editable Word (.docx) fee proposal (light)
npm run template               # both types, both themes (PDF)
npm run template:docx          # editable Word (.docx) fees template (light)
npm run template:docx-dark     # editable Word (.docx) fees template (dark)
```

(There are `:light` and `:dark` variants of both example scripts.) Outputs land
in the git-ignored [`../designs/`](../designs/), named
`…-<theme>-<timestamp>.pdf`.

Open the PDFs from the git-ignored [`../designs/`](../designs/) folder. Each run
is stamped `YYYYMMDD-HHMMSS`, so every generation is a unique file (nothing is
overwritten).

`npm run template` renders the **blank templates** — every field shown as a
`[ … ]` placeholder — straight from
[`examples/template-fees.json`](examples/template-fees.json) and
[`examples/template-sheet.json`](examples/template-sheet.json). Those two files
are the canonical "fill-me-in" starting points (see the workflow below).

---

## 3. The workflow (make a real document)

Three steps. **1) copy an example → 2) edit the JSON → 3) run the command.**

### Fee proposal

```bash
# 1. Copy a starting point. Use the blank template, or the worked example
#    (examples/sample-fees.json) if you'd rather edit a filled-in one.
cp examples/template-fees.json examples/my-job.json

# 2. Edit examples/my-job.json — replace the [ … ] placeholders with project
#    details, addressee, stages, fees, etc. (plain JSON, any text editor)

# 3. Generate the PDF
npm run fees -- examples/my-job.json
#    → ../designs/my-job-fees-<timestamp>.pdf
```

### Drawing sheet

```bash
cp examples/template-sheet.json examples/my-sheet.json   # or sample-project.json
# edit examples/my-sheet.json
npm run sheet -- examples/my-sheet.json
#    → ../designs/my-sheet-<timestamp>.pdf
```

> **Tip:** add a second argument to choose an exact output path (no timestamp is
> added when you specify one):
> `npm run fees -- examples/my-job.json /Users/you/Desktop/proposal.pdf`

### Light or dark

Every document renders in a **light** or **dark** theme. Add a flag:

```bash
npm run fees  -- examples/my-job.json --dark    # dark fee proposal
npm run sheet -- examples/my-sheet.json --light  # light drawing sheet
# also accepts: --theme light  /  --theme dark
```

Defaults if you pass no flag: **fee proposals → light**, **drawing sheets →
dark** (the reference-template look). The theme is part of the output filename
(`…-light-…` / `…-dark-…`), so the two never collide. `npm run template` always
emits both themes for both types. Brand green is identical in both themes — only
the surfaces flip (defined in [`src/brand.ts`](src/brand.ts)).

### Editable Word (.docx)

**Fee proposals only** can be exported as a native, editable Word document —
real Word headings, tables and lists you can edit, not an HTML import. It clones
the fee-proposal PDF (header/footer bands, stage containers, totals, rate table)
and comes in **light and dark**:

```bash
npm run template:docx                          # blank fees template, light
npm run template:docx-dark                     # blank fees template, dark
npm run example:fees:docx                      # worked example, light
npm run example:fees:docx-dark                 # worked example, dark
npm run fees -- examples/my-job.json --docx          # a real job, light
npm run fees -- examples/my-job.json --docx --dark   # a real job, dark
```

The flag is `--docx` (alias `--word`), combinable with `--light`/`--dark`
(default light). It's fee-proposals only — `--docx` on a drawing sheet is
rejected. Built with the [`docx`](https://www.npmjs.com/package/docx) library in
[`src/word/fees-docx.ts`](src/word/fees-docx.ts).

> **Light vs dark Word:** both export a **white, print-clean page** with a light,
> editable body — the only difference is the header/footer brand strips: **light**
> (soft strip + charcoal logo) or **dark** (charcoal strip + white logo). All
> shading is table-based, so both print reliably.

Every output lands in [`../designs/`](../designs/) (git-ignored — the heavy PDFs
are never committed).

---

## 4. What goes in the JSON

The JSON shape is defined and documented field-by-field in
[`src/types.ts`](src/types.ts) — that file is the source of truth. The fastest
way to learn it is to read the worked examples alongside it:

- **Fee proposal** → [`examples/sample-fees.json`](examples/sample-fees.json)
  (`FeesReport` type). Key parts:
  - `project` / `addressee` — who it's for.
  - `intro`, `scopeSummary` — the narrative.
  - `stages[]` — each stage has a `name`, `description`, `deliverables`, and
    `items[]` (fee lines). A line is either a fixed `amount` (rolls into the
    computed Subtotal / GST / Total) **or** an `amountText` like `"Hourly rates"`
    or `"8% of final contract sum"` for non-fixed lines.
  - `hourlyRates`, `exclusions`, `notes`, `signatory`, `payment`, `terms` — all
    optional; any section you omit simply doesn't render.
- **Drawing sheet** → [`examples/sample-project.json`](examples/sample-project.json)
  (`DrawingSet` type): `project`, `certification`, and `sheets[]`.

Totals are calculated for you — never hand-add Subtotal/GST/Total.

---

## 5. Branding

Brand is centralised in [`src/brand.ts`](src/brand.ts) (palette, type, practice
details — mirrors STD-01/STD-02 and the marketing site). The XNDR logo is pulled
from the site's `../public/`. You should not need to touch styling for everyday
documents — just the data.

---

## 6. Troubleshooting

| Problem | Fix |
|---------|-----|
| `Executable doesn't exist … chromium` | `npx playwright install chromium` |
| `Cannot find module` / TS errors | `npm install` in `engine/`; check with `npm run typecheck` |
| Output PDF not where expected | it's in `../designs/`, named `<input>-<timestamp>.pdf` |
| Fonts look wrong | rendering fetches Inter from Google Fonts — needs internet on first render |

---

## 7. Status & roadmap

The **fee proposal** is complete and matches XNDR brand. The **drawing sheet**
renders the branded title-block frame; placing real drawing artwork and
multi-sheet sets are upcoming phases. See the
[roadmap](../docs/design-engine/PLAN.md#8-roadmap) and
[open questions](../docs/design-engine/PLAN.md#9-open-questions).
