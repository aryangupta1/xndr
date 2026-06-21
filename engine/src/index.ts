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

async function cmdSheet(input: string, out?: string): Promise<void> {
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
  const outPath = out ?? defaultOut(input, "");
  await renderHtmlToPdf(html, outPath);
  console.log(`✓ Drawing sheet → ${outPath}`);
}

async function cmdFees(input: string, out?: string): Promise<void> {
  const report = loadJson<FeesReport>(input);
  // The light logo sits on the dark running header band.
  const html = renderFeesReport(report, { logoDataUrl: loadLogoOnDark() });
  const outPath = out ?? defaultOut(input, "-fees");
  // Page size + margins (the header/footer reserve) come from the template's
  // @page rule — see render/pdf.ts.
  await renderHtmlToPdf(html, outPath);
  console.log(`✓ Fees report → ${outPath}`);
}

async function main(): Promise<void> {
  const [cmd, input, out] = process.argv.slice(2);
  if (!cmd || !input) {
    console.error("Usage: <sheet|fees> <input.json> [out.pdf]");
    process.exit(1);
  }
  switch (cmd) {
    case "sheet":
      return cmdSheet(input, out);
    case "fees":
      return cmdFees(input, out);
    default:
      console.error(`Unknown command: ${cmd}. Use "sheet" or "fees".`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
