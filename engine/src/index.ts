#!/usr/bin/env -S npx tsx
/**
 * Design engine CLI.
 *
 *   npm run sheet -- <input.json> [out.pdf]   render a drawing set
 *   npm run fees  -- <input.json> [out.pdf]   render a fees report
 *
 * Input JSON shapes match `DrawingSet` / `FeesReport` in `types.ts`. Output
 * defaults into the git-ignored `designs/` directory. See PLAN.md §3–4.
 */

import { readFileSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { loadLogoOnDark, loadLogoOnLight } from "./assets.js";
import { renderHtmlToPdf } from "./render/pdf.js";
import { renderDrawingSheet } from "./templates/drawing-sheet.js";
import { renderFeesReport } from "./templates/fees-report.js";
import type { DrawingSet, FeesReport } from "./types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const DESIGNS_DIR = resolve(here, "../../designs");
const EXAMPLES_DIR = resolve(here, "../examples");

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as T;
}

/** Local timestamp `YYYYMMDD-HHMMSS` — makes every generation a unique file. */
function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

/** Default output path: `<input-stem><suffix>-<timestamp>.pdf` in designs/. */
function defaultOut(input: string, suffix: string): string {
  const stem = basename(input).replace(/\.json$/i, "");
  return join(DESIGNS_DIR, `${stem}${suffix}-${timestamp()}.pdf`);
}

/** Render a drawing set (first sheet for now) from a JSON file to a PDF. */
async function renderSheet(input: string, outPath: string): Promise<void> {
  const set = loadJson<DrawingSet>(input);
  // Foundation: render the first sheet only. Multi-sheet sets (one PDF, N pages)
  // come in Phase 2 — see PLAN.md §8.
  const sheet = set.sheets[0];
  if (!sheet) throw new Error("Drawing set has no sheets.");
  const html = renderDrawingSheet(sheet, {
    project: set.project,
    certification: set.certification,
    logoDataUrl: loadLogoOnDark(),
  });
  await renderHtmlToPdf(html, outPath);
}

/** Render a fee proposal from a JSON file to a PDF. */
async function renderFees(input: string, outPath: string): Promise<void> {
  const report = loadJson<FeesReport>(input);
  // The light logo sits on the dark running header band. Page size + margins
  // come from the template's @page rule — see render/pdf.ts.
  const html = renderFeesReport(report, { logoDataUrl: loadLogoOnDark() });
  await renderHtmlToPdf(html, outPath);
}

async function cmdSheet(input: string, out?: string): Promise<void> {
  const outPath = out ?? defaultOut(input, "");
  await renderSheet(input, outPath);
  console.log(`✓ Drawing sheet → ${outPath}`);
}

async function cmdFees(input: string, out?: string): Promise<void> {
  const outPath = out ?? defaultOut(input, "-fees");
  await renderFees(input, outPath);
  console.log(`✓ Fees report → ${outPath}`);
}

/** Render the blank, fill-in templates for both document types. */
async function cmdTemplate(): Promise<void> {
  const sheetTemplate = resolve(EXAMPLES_DIR, "template-sheet.json");
  const feesTemplate = resolve(EXAMPLES_DIR, "template-fees.json");
  const sheetOut = join(DESIGNS_DIR, `drawing-sheet-template-${timestamp()}.pdf`);
  const feesOut = join(DESIGNS_DIR, `fees-template-${timestamp()}.pdf`);
  await renderSheet(sheetTemplate, sheetOut);
  console.log(`✓ Drawing sheet template → ${sheetOut}`);
  await renderFees(feesTemplate, feesOut);
  console.log(`✓ Fees template → ${feesOut}`);
}

async function main(): Promise<void> {
  const [cmd, input, out] = process.argv.slice(2);
  if (cmd === "template") return cmdTemplate();
  if (!cmd || !input) {
    console.error("Usage: <sheet|fees> <input.json> [out.pdf]  |  template");
    process.exit(1);
  }
  switch (cmd) {
    case "sheet":
      return cmdSheet(input, out);
    case "fees":
      return cmdFees(input, out);
    default:
      console.error(`Unknown command: ${cmd}. Use "sheet", "fees" or "template".`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
