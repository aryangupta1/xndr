# XNDR — Design Engine (`design-engine` branch)

> **You are on the `design-engine` branch.** This branch is **only** the design
> engine — a code-driven PDF generator for XNDR's documents. It **never deploys**.
>
> **Looking for the marketing site?** That lives on **`master`** (Next.js on
> Vercel). See its README there:
> [github.com/aryangupta1/xndr/blob/master/README.md](https://github.com/aryangupta1/xndr/blob/master/README.md)
> — or locally: `git show master:README.md`.

The design engine turns **structured JSON** into **branded, print-ready PDFs**:

- **Fee proposals** (A4) — full branded proposal: addressee, staged fees with
  auto totals, hourly rates, exclusions, acceptance/signature, payment, T&Cs.
- **Drawing sheets** (A3) — engineering title-block sheets matching the XNDR
  drawing-sheet template.

Both come in **light and dark** themes. Output is HTML/CSS → PDF via Playwright.

## Quick start

```bash
cd engine
npm install                 # installs deps + downloads Chromium
npm run example:fees        # → designs/sample-fees-fees-light-<timestamp>.pdf
npm run example:sheet       # → designs/sample-project-dark-<timestamp>.pdf
npm run template            # blank templates, both types, both themes
```

Full how-to (the JSON workflow, theme flags, troubleshooting):
[`engine/README.md`](engine/README.md).

## Layout

```
engine/                 # the engine — self-contained Node project (own package.json)
  src/                  # brand.ts, types.ts, templates/, render/, index.ts (CLI)
  examples/             # worked inputs + blank templates (copy → fill → run)
  README.md             # user guide
docs/design-engine/
  PLAN.md               # architecture + the high-level plan
  ENHANCE-design-docs.md  # deep roadmap: drawing sheets
  ENHANCE-fee-docs.md     # deep roadmap: fee proposals
designs/                # OUTPUT (git-ignored) + reference PDFs (designs/reference/)
docs/next-prompt.md     # cross-session handoff
```

## Rules (keep these intact)

1. **Never deploys.** `master` is the only branch Vercel builds. Don't merge
   `engine/` onto `master`. The engine is isolated three ways: excluded from the
   site's [`tsconfig.json`](tsconfig.json), listed in
   [`.vercelignore`](.vercelignore), and kept in its own dependency tree.
2. **Separate dependencies.** The engine has its **own** `package.json`
   (Playwright + Chromium). Never add engine deps to a root/site `package.json`.
3. **Brand stays in sync.** [`engine/src/brand.ts`](engine/src/brand.ts) mirrors
   the site's palette/type and STD-01/STD-02. If the site brand moves, move this
   too — don't let them diverge.
4. **Outputs and reference PDFs are git-ignored.** Generated PDFs and reference
   samples live in `designs/` and are **never committed** (heavy assets, and
   client samples carry third-party PII). Reference material → `designs/reference/`.
5. **Type-check before commit.** Run `npm run typecheck` in `engine/`. For
   anything visual, render the sample and eyeball the PDF — the type-check won't
   catch a layout regression.

## Status

Foundation built; fee proposal complete and XNDR-branded; drawing sheet renders
the branded title-block frame. See [`docs/design-engine/PLAN.md`](docs/design-engine/PLAN.md)
for the roadmap and the two `ENHANCE-*.md` docs for where each side goes next.
The longer-term idea (converting the engine into a SAAS product) is noted in
those plans.
