#!/usr/bin/env -S npx tsx
/**
 * Design engine CLI.
 *
 *   npm run sheet -- <input.json> [out.pdf] [--light|--dark]   render a drawing set
 *   npm run fees  -- <input.json> [out.pdf] [--light|--dark]   render a fees report
 *   npm run template                                            blank templates, both themes
 *
 * Theme flag: `--light` / `--dark` (or `--theme light|dark`). Defaults: fees →
 * light, sheet → dark. Input JSON shapes match `DrawingSet` / `FeesReport` in
 * `types.ts`. Output defaults into the git-ignored `designs/`. See PLAN.md §3–4.
 */

import { readFileSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { loadLogoOnDark, loadLogoOnLight } from "./assets.js";
import { renderHtmlToPdf } from "./render/pdf.js";
import { renderDrawingSheet } from "./templates/drawing-sheet.js";
import { renderFeesReport } from "./templates/fees-report.js";
import type { ThemeName } from "./brand.js";
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

/** Default output path: `<input-stem><suffix>-<theme>-<timestamp>.pdf` in designs/. */
function defaultOut(input: string, suffix: string, theme: ThemeName): string {
  const stem = basename(input).replace(/\.json$/i, "");
  return join(DESIGNS_DIR, `${stem}${suffix}-${theme}-${timestamp()}.pdf`);
}

/** Pull a `--light` / `--dark` / `--theme <x>` flag out of the args. */
function parseTheme(args: string[]): { theme?: ThemeName; rest: string[] } {
  const rest: string[] = [];
  let theme: ThemeName | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--light") theme = "light";
    else if (a === "--dark") theme = "dark";
    else if (a === "--theme") {
      const v = args[++i];
      if (v === "light" || v === "dark") theme = v;
    } else if (a.startsWith("--theme=")) {
      const v = a.slice("--theme=".length);
      if (v === "light" || v === "dark") theme = v;
    } else rest.push(a);
  }
  return { theme, rest };
}

/** Render a drawing set (first sheet for now) from a JSON file to a PDF. */
async function renderSheet(input: string, outPath: string, theme: ThemeName): Promise<void> {
  const set = loadJson<DrawingSet>(input);
  // Foundation: render the first sheet only. Multi-sheet sets (one PDF, N pages)
  // come in Phase 2 — see PLAN.md §8.
  const sheet = set.sheets[0];
  if (!sheet) throw new Error("Drawing set has no sheets.");
  // Title block is dark in the dark theme (light logo), light in the light theme.
  const html = renderDrawingSheet(sheet, {
    project: set.project,
    certification: set.certification,
    logoDataUrl: theme === "dark" ? loadLogoOnDark() : loadLogoOnLight(),
    theme,
  });
  await renderHtmlToPdf(html, outPath);
}

/** Render a fee proposal from a JSON file to a PDF. */
async function renderFees(input: string, outPath: string, theme: ThemeName): Promise<void> {
  const report = loadJson<FeesReport>(input);
  // The header/footer bands are dark in both themes, so the light logo always
  // suits them. Page size + margins come from the template's @page rule.
  const html = renderFeesReport(report, { logoDataUrl: loadLogoOnDark(), theme });
  await renderHtmlToPdf(html, outPath);
}

async function cmdSheet(input: string, out: string | undefined, theme: ThemeName = "dark"): Promise<void> {
  const outPath = out ?? defaultOut(input, "", theme);
  await renderSheet(input, outPath, theme);
  console.log(`✓ Drawing sheet (${theme}) → ${outPath}`);
}

async function cmdFees(input: string, out: string | undefined, theme: ThemeName = "light"): Promise<void> {
  const outPath = out ?? defaultOut(input, "-fees", theme);
  await renderFees(input, outPath, theme);
  console.log(`✓ Fees report (${theme}) → ${outPath}`);
}

/** Render the blank, fill-in templates for both document types, both themes. */
async function cmdTemplate(): Promise<void> {
  const sheetTemplate = resolve(EXAMPLES_DIR, "template-sheet.json");
  const feesTemplate = resolve(EXAMPLES_DIR, "template-fees.json");
  for (const theme of ["light", "dark"] as ThemeName[]) {
    const sheetOut = join(DESIGNS_DIR, `drawing-sheet-template-${theme}-${timestamp()}.pdf`);
    const feesOut = join(DESIGNS_DIR, `fees-template-${theme}-${timestamp()}.pdf`);
    await renderSheet(sheetTemplate, sheetOut, theme);
    console.log(`✓ Drawing sheet template (${theme}) → ${sheetOut}`);
    await renderFees(feesTemplate, feesOut, theme);
    console.log(`✓ Fees template (${theme}) → ${feesOut}`);
  }
}

async function main(): Promise<void> {
  const [cmd, ...rawArgs] = process.argv.slice(2);
  if (cmd === "template") return cmdTemplate();
  const { theme, rest } = parseTheme(rawArgs);
  const [input, out] = rest;
  if (!cmd || !input) {
    console.error("Usage: <sheet|fees> <input.json> [out.pdf] [--light|--dark]  |  template");
    process.exit(1);
  }
  switch (cmd) {
    case "sheet":
      return cmdSheet(input, out, theme ?? "dark");
    case "fees":
      return cmdFees(input, out, theme ?? "light");
    default:
      console.error(`Unknown command: ${cmd}. Use "sheet", "fees" or "template".`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
