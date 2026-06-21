/**
 * Template: DrawingSheet → HTML (the A3-landscape sheet).
 *
 * Pure function, no I/O — preview by writing the output to a `.html` and opening
 * it in a browser, or pass to `renderHtmlToPdf`. Reproduces the anatomy of
 * `designs/XNDR - Drawing Sheet Template.pdf` (STD-02 §"Sheet anatomy").
 *
 * FOUNDATION: structure + brand are in place (border, dark title block, header
 * chip, setout grid, footer). Pixel-matching the reference and placing real
 * drawing content is Phase 1 / Phase 4 — see PLAN.md §8.
 */

import { palette, type, sheet, practice } from "../brand.js";
import type { DrawingSheet, ProjectMeta, Certification } from "../types.js";

export interface SheetContext {
  project: ProjectMeta;
  certification: Certification;
  /** Light XNDR logo as a data URL (see assets.ts). Omit to render text-only. */
  logoDataUrl?: string;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Title-block "PROJECT" rows. */
function projectBlock(p: ProjectMeta): string {
  const lines = [p.name, p.siteAddress, p.client, p.planNo].filter(Boolean) as string[];
  return lines.map((l) => `<div class="tb-line">${esc(l)}</div>`).join("");
}

/** Title-block metadata rows (label · value). */
function metaBlock(s: DrawingSheet, p: ProjectMeta): string {
  const rows: [string, string][] = [
    ["Designed", s.meta.designed],
    ["Drawn", s.meta.drawn],
    ["Job No.", p.jobNo],
    ["Scale @ A3", s.meta.scale],
    ["Date", s.meta.date],
    ["Revision", s.meta.revision],
  ];
  return rows
    .map(
      ([k, v]) =>
        `<div class="tb-meta-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`,
    )
    .join("");
}

/** The setout grid + zone references that fill the drawing field. */
function drawingField(s: DrawingSheet): string {
  const cols = sheet.zones.cols.map((c) => `<span>${c}</span>`).join("");
  const rows = sheet.zones.rows.map((r) => `<span>${r}</span>`).join("");
  const placeholder =
    s.content && s.content.kind !== "placeholder"
      ? "" // real content will be injected here in Phase 4
      : `<div class="field-placeholder">DRAWING AREA<br><small>PLACE PLAN · SECTION · DETAIL HERE</small></div>`;
  return `
    <div class="field">
      <div class="zone-cols">${cols}</div>
      <div class="zone-rows">${rows}</div>
      <div class="field-grid"></div>
      ${placeholder}
    </div>`;
}

export function renderDrawingSheet(s: DrawingSheet, ctx: SheetContext): string {
  const { project, certification, logoDataUrl } = ctx;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: ${sheet.page.width}mm ${sheet.page.height}mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: ${type.family}; color: ${palette.text}; }
  .sheet {
    width: ${sheet.page.width}mm; height: ${sheet.page.height}mm;
    background: ${palette.ink};
    border: ${sheet.borderMm}mm solid ${palette.green};
    display: grid; grid-template-columns: 1fr ${sheet.titleBlockWidthMm}mm;
    overflow: hidden;
  }

  /* ── Left: header + drawing field ───────────────────────────────── */
  .main { display: flex; flex-direction: column; background: ${palette.ink}; padding: 6mm; gap: 4mm; }
  .header { display: flex; justify-content: space-between; align-items: baseline; }
  .chip {
    background: ${palette.green}; color: ${palette.ink};
    font-weight: ${type.headingWeight}; padding: 1mm 2.5mm; border-radius: 1mm;
    font-size: 3.2mm; letter-spacing: 0.05em;
  }
  .header h1 { font-size: 4.2mm; font-weight: ${type.headingWeight}; margin-left: 3mm; display: inline; }
  .header .scale { color: ${palette.muted}; font-size: 3mm; }

  .field {
    position: relative; flex: 1; background: ${palette.paper};
    border-radius: 1mm; overflow: hidden;
  }
  .field-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(28,32,35,.07) 0.2mm, transparent 0.2mm),
      linear-gradient(to bottom, rgba(28,32,35,.07) 0.2mm, transparent 0.2mm);
    background-size: ${sheet.gridPitchMm}mm ${sheet.gridPitchMm}mm;
  }
  .zone-cols, .zone-rows { position: absolute; color: ${palette.muted}; font-size: 2.4mm; }
  .zone-cols { top: 1mm; left: 0; right: 0; display: flex; justify-content: space-around; }
  .zone-rows { left: 1mm; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: space-around; }
  .field-placeholder {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    color: rgba(28,32,35,.28); letter-spacing: 0.3em; font-size: 5mm; font-weight: 700;
  }
  .field-placeholder small { font-size: 2.6mm; letter-spacing: 0.2em; }

  /* ── Right: dark title block ────────────────────────────────────── */
  .tb { background: ${palette.ink}; padding: 6mm 5mm; display: flex; flex-direction: column; gap: 4mm; border-left: 0.3mm solid ${palette.surface}; }
  .tb-group { background: ${palette.surface}; border-radius: 1mm; padding: 3mm; }
  .tb-logo { height: 9mm; margin-bottom: 2.5mm; display: block; }
  .tb-label { color: ${palette.green}; text-transform: uppercase; letter-spacing: ${type.labelTracking}; font-size: 2.3mm; font-weight: 700; margin-bottom: 1.5mm; }
  .tb-name { font-weight: 700; font-size: 3.4mm; }
  .tb-line { font-size: 2.6mm; color: ${palette.text}; line-height: 1.5; }
  .tb-sub { font-size: 2.3mm; color: ${palette.muted}; line-height: 1.5; }
  .tb-drawing-no { font-size: 6mm; font-weight: ${type.headingWeight}; }
  .tb-drawing-title { font-size: 2.6mm; color: ${palette.muted}; text-transform: uppercase; letter-spacing: 0.1em; }
  .tb-meta-row { display: flex; justify-content: space-between; font-size: 2.5mm; color: ${palette.text}; padding: 0.6mm 0; }
  .tb-meta-row span:first-child { color: ${palette.muted}; }
  .tb-cert { margin-top: auto; }
  .tb-cert p { font-size: 2.1mm; color: ${palette.muted}; line-height: 1.5; }
  .tb-cert .who { color: ${palette.text}; margin-top: 1.5mm; }

  .footer { grid-column: 1 / -1; background: ${palette.ink}; color: ${palette.muted}; font-size: 2.1mm; text-align: center; padding: 1.5mm; }
</style></head>
<body>
  <div class="sheet">
    <div class="main">
      <div class="header">
        <div><span class="chip">${esc(s.number)}</span><h1>${esc(s.title)}</h1></div>
        <div class="scale">Scale ${esc(s.meta.scale)} @ A3</div>
      </div>
      ${drawingField(s)}
    </div>

    <aside class="tb">
      <div class="tb-group">
        ${logoDataUrl ? `<img class="tb-logo" src="${logoDataUrl}" alt="XNDR">` : ""}
        <div class="tb-label">Practice</div>
        <div class="tb-name">${esc(practice.name)}</div>
        <div class="tb-sub">${esc(practice.tagline)}</div>
        <div class="tb-sub">${esc(practice.email)} · ${esc(practice.phone)}</div>
        <div class="tb-sub">${esc(practice.region)}</div>
      </div>

      <div class="tb-group">
        <div class="tb-label">Project</div>
        ${projectBlock(project)}
      </div>

      <div class="tb-group">
        <div class="tb-label">Drawing</div>
        <div class="tb-drawing-no">${esc(s.number)}</div>
        <div class="tb-drawing-title">${esc(s.title)}</div>
      </div>

      <div>${metaBlock(s, project)}</div>

      <div class="tb-cert tb-group">
        <div class="tb-label">Certification</div>
        <p>The presence of the registered practitioner's signature signifies that this is the certified design issued for construction.</p>
        <p class="who">Designed: ${esc(certification.name)} · DBP / PE No.: ${esc(certification.registrationNo)}</p>
      </div>
    </aside>

    <div class="footer">${esc(practice.name.toUpperCase())} · Drawing sheet template ${practice.templateVersion} · A3 landscape · ${esc(practice.tagline)} · ${esc(practice.email)}</div>
  </div>
</body></html>`;
}
