# XNDR Design Engine — User Guide

The design engine turns **structured data (a JSON file)** into **branded,
print-ready PDFs** for XNDR Consulting. No AI required — you edit a file, run one
command, and get a PDF.

It produces two document types:

| Type | Command | Page | Output |
|------|---------|------|--------|
| **Fee proposal** | `npm run fees` | A4 portrait | a full branded fee proposal |
| **Drawing sheet** | `npm run sheet` | A3 landscape | an engineering title-block sheet |

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
npm run example:fees     # → ../designs/sample-fees-fees.pdf
npm run example:sheet    # → ../designs/sample-project.pdf
```

Open the PDFs from the git-ignored [`../designs/`](../designs/) folder.

---

## 3. The workflow (make a real document)

Three steps. **1) copy an example → 2) edit the JSON → 3) run the command.**

### Fee proposal

```bash
# 1. Copy the worked example as your starting point
cp examples/sample-fees.json examples/my-job.json

# 2. Edit examples/my-job.json — project details, addressee, stages, fees, etc.
#    (open it in any text editor; it's plain JSON)

# 3. Generate the PDF
npm run fees -- examples/my-job.json
#    → ../designs/my-job-fees.pdf
```

### Drawing sheet

```bash
cp examples/sample-project.json examples/my-sheet.json
# edit examples/my-sheet.json
npm run sheet -- examples/my-sheet.json
#    → ../designs/my-sheet.pdf
```

> **Tip:** add a second argument to choose the output path:
> `npm run fees -- examples/my-job.json /Users/you/Desktop/proposal.pdf`

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
| Output PDF not where expected | it's in `../designs/`, named after your input file |
| Fonts look wrong | rendering fetches Inter from Google Fonts — needs internet on first render |

---

## 7. Status & roadmap

The **fee proposal** is complete and matches XNDR brand. The **drawing sheet**
renders the branded title-block frame; placing real drawing artwork and
multi-sheet sets are upcoming phases. See the
[roadmap](../docs/design-engine/PLAN.md#8-roadmap) and
[open questions](../docs/design-engine/PLAN.md#9-open-questions).
