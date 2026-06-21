# Enhancing the Fee-Document Engine (fee proposals)

> Companion to [`PLAN.md`](PLAN.md). This is the deep roadmap for taking the
> **fee-proposal** side of the engine from "complete branded proposal" to a
> fully-featured, assemble-from-snippets proposal generator. Drawing sheets are
> covered separately in [`ENHANCE-design-docs.md`](ENHANCE-design-docs.md).

## Where we are

Implemented today ([`engine/src/templates/fees-report.ts`](../../engine/src/templates/fees-report.ts),
schema `FeesReport` in [`engine/src/types.ts`](../../engine/src/types.ts)):
a complete, XNDR-branded A4 proposal — slim repeating header/footer, addressee
block, project highlight, intro, scope, **staged fee cards** with deliverables,
auto Subtotal/GST/Total, hourly-rate table, exclusions, notes, acceptance +
signature, payment details, and two-column T&Cs. Derived from two real samples in
`designs/reference/` (Partridge `F2026R0274.1`, CORE `AS6374`).

## The north star

Win-ready proposals assembled in minutes from **reusable building blocks** —
standard scopes, exclusions, rate cards and T&Cs — personalised per client, with
correct fee maths, optional premium front matter, versioned and signable. The
engineer supplies what's *different* about this job; the engine supplies the rest.

---

## Enhancement themes (priority order)

### 1. Content library / boilerplate — *highest leverage*

Most of a proposal is reused. Today every field is authored per job. Build a
**defaults/snippet library** so a proposal references blocks instead of inlining
them:

- **Standard T&Cs**, **standard exclusions**, **standard payment terms**,
  **hourly-rate cards** — defined once (e.g. `engine/src/library/*.ts` or JSON),
  referenced by id, overridable per job.
- **Standard scope/stage blocks** by service line (see theme 5).
- A job's JSON shrinks to: project + addressee + which blocks + the deltas.

**Data-model impact:** allow `terms`, `exclusions`, `hourlyRates`, `payment` to be
either inline (as now) **or** a library reference (`"@standard-remedial"`),
resolved at render. Keep current inline support for one-offs.

### 2. Fee modelling & calculation engine

The current line item is `amount` *or* `amountText`. Real proposals need more:

- **Per-stage subtotals** and an optional **stage fee-estimate badge** (CORE
  shows "Fee estimate: $37,000 (exc GST)" per stage).
- **% of contract sum** with a stated estimate basis; **provisional sums**;
  **disbursements**; **hourly with a not-to-exceed cap**; **fee ranges**
  ($X–$Y); **optional/excluded** line styling.
- **Rounding rules**, GST per-line vs on-total, and a single robust
  `computeTotals()` that handles mixed fixed/textual lines (extract the maths out
  of the template into a tested helper).
- **Contingency / escalation** lines.

### 3. Premium front matter (CORE-style, optional)

Make the brochure treatment opt-in via flags so simple jobs stay lean:

- **Cover page** — title, ref, prepared-by, client + project, hero treatment.
- **Table of contents** with page numbers.
- **About XNDR** + **stat callouts** (years, projects, etc.) + **credentials**
  (DBP / PE / NER) + **insurances table** (PI / PL / workers comp).
- **Key personnel table** (role → name), **"our approach"** narrative.
- **Page numbers** in the footer (currently absent).

### 4. Service-line variants

Remedial, structural, and project-management proposals differ in scope, stages
and rate cards. Provide **per-service templates/presets** that pre-load the right
library blocks (theme 1) and default stages.

### 5. Personalisation & dynamic content

- Proper **salutation** ("Dear Ms Donohoe,") derived from the addressee.
- **Conditional sections** — show/hide based on data (e.g. construction-stage %
  note only when that stage exists).
- **Merge fields** so boilerplate references the client/project without manual
  edits.

### 6. Acceptance, e-sign & client capture

- Richer **acceptance page**: sign-and-return, signed Works Order, or PO — with
  return instructions (Partridge & CORE both do this).
- **Client-details capture form** (name, phone, billing address, invoice email)
  like the Partridge sample.
- Hook for **e-signature** later (the engine emits the signable fields).

### 7. Versioning, references & validity

- **Proposal revisions** (`R1`, `R2`) with a supersede note; the reference scheme
  (`F2026R0274.1`) auto-incremented.
- **Auto job/fee reference** generation from a register.
- **Validity** computed from issue date (e.g. "valid until DD MMM YYYY") rather
  than a bare day count.

### 8. Data origin & workflow

- A **questionnaire → JSON** path (cf. the site's `/questions-for-rizdawg`) so a
  non-engineer can fill a form and get a draft proposal.
- A **job register** (CSV/JSON/DB) that feeds project + reference + addressee.
- **Batch generation** for multiple recipients.

### 9. Output & QA

- **Page numbers** + "Page X of Y".
- **Multi-page integrity** checks (the `thead`/`tfoot` technique is solid — keep
  regression coverage as content grows).
- **PDF/A or tagged PDF** if accessibility/archival is needed.
- **Visual regression** against an approved reference render.

### 10. Productisation (later)

Web form → instant branded proposal; saved client/job profiles; template
marketplace — the SAAS direction from the root README.

---

## Suggested phasing

1. **Extract `computeTotals()`** + per-stage subtotals/estimate badges (theme 2) —
   small, high-confidence, removes maths from the template.
2. **Content library** (theme 1) — the biggest time-saver; lets real proposals be
   assembled fast.
3. **Service-line presets** (theme 4) on top of the library.
4. **Premium front matter** (theme 3) — cover + TOC + credentials, opt-in.
5. **Acceptance/personalisation/versioning** (themes 5–7) to make it client-ready.
6. **Workflow + QA** (themes 8, 9) for scale.

## Open questions (resolve before the dependent theme)

1. **Real XNDR values** — ABN, bank BSB/account, DBP/PE number, PI/PL insurance
   limits, NER/credentials (currently placeholders). Needed for theme 3 & a real
   `brand.ts`.
2. **Front matter default** — lean Partridge-style by default with brochure as
   opt-in, or brochure-by-default? (gates theme 3 defaults).
3. **Service lines** — confirm the set (remedial / structural / PM / inspection)
   and each one's standard stages (gates theme 4).
4. **Fee bases in use** — which of lump-sum / hourly / %-of-contract / provisional
   / capped does XNDR actually quote? (gates theme 2 scope).
5. **Reference scheme** — the rule behind `F2026R0274.1` (job, type, rev) so it
   can be auto-generated (theme 7).
