/**
 * ONE-OFF (ad hoc) v2: XNDR — Scope of Works in the "engineering table" style of
 * the source tender (scope-example.pdf). A4 LANDSCAPE, fully ruled. v2 fixes the
 * pagination faults in v1: the two-column specification body is now a full-width
 * *block* multicol (Chromium does NOT fragment flex containers across pages —
 * that caused the empty voids, label duplication and unbalanced columns in v1),
 * introduced by a full-width sub-bar instead of a side label. Light + dark. Not
 * wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/scope-adhoc-v2.ts
 * Reuses examples/sample-scope.json as its data. Output → git-ignored designs/
 * as adhoc-scope-v2-light.pdf / adhoc-scope-v2-dark.pdf.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { palette, type, practice, getTheme } from "../brand.js";
import type { ThemeName } from "../brand.js";
import { loadLogoOnDark, loadLogoOnLight } from "../assets.js";
import { renderHtmlToPdf } from "../render/pdf.js";
import type { ScopeOfWorks, ScopeItem, ScopeBlock, ScopeFigure } from "../types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const DESIGNS_DIR = resolve(here, "../../../designs");
const DATA = resolve(here, "../../examples/sample-scope.json");

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const paras = (items?: string[], cls = ""): string =>
  items && items.length ? items.map((p) => `<p${cls ? ` class="${cls}"` : ""}>${esc(p)}</p>`).join("") : "";

/** Alphabetic sub-point label: 0→a, 1→b … 25→z, 26→aa. */
function alpha(i: number): string {
  let s = "";
  i += 1;
  while (i > 0) {
    i -= 1;
    s = String.fromCharCode(97 + (i % 26)) + s;
    i = Math.floor(i / 26);
  }
  return s;
}

/** One specification block: heading + notes + numbered clauses (lettered subs). */
function specBlock(b: ScopeBlock, startNo: number): { html: string; nextNo: number } {
  let n = b.continueNumbering ? startNo : 1;
  const clauseHtml = (b.clauses ?? [])
    .map((c) => {
      const no = n++;
      const subs =
        c.sub && c.sub.length
          ? `<ol class="subs">${c.sub.map((s, i) => `<li><span class="sn">${alpha(i)})</span>${esc(s)}</li>`).join("")}</ol>`
          : "";
      return `<li class="clause"><span class="cn">${no})</span><div class="ctext">${esc(c.text)}${subs}</div></li>`;
    })
    .join("");
  const html = `<div class="block">
    ${b.heading ? `<div class="block-h">${esc(b.heading)}</div>` : ""}
    ${paras(b.paras, "note")}
    ${clauseHtml ? `<ol class="clauses">${clauseHtml}</ol>` : ""}
  </div>`;
  return { html, nextNo: n };
}

/** One work Item as a ruled table: ITEM bar + label/value rows + two-col spec. */
function itemSection(item: ScopeItem): string {
  const rows: string[] = [];
  if (item.location)
    rows.push(`<div class="drow"><div class="lbl">Location</div><div class="val">${esc(item.location)}</div></div>`);
  if (item.scopeIntent && item.scopeIntent.length)
    rows.push(`<div class="drow"><div class="lbl">Scope Intent</div><div class="val">${paras(item.scopeIntent)}</div></div>`);
  if (item.extentOfWorks && item.extentOfWorks.length)
    rows.push(`<div class="drow"><div class="lbl">Extent of Works</div><div class="val">${paras(item.extentOfWorks)}</div></div>`);

  let running = 1;
  const body = (item.specification ?? [])
    .map((b) => {
      const { html, nextNo } = specBlock(b, running);
      running = nextNo;
      return html;
    })
    .join("");

  return `<section class="item">
    <div class="ihead"><span class="ino">Item ${item.number}.</span>${esc(item.title).toUpperCase()}</div>
    <div class="deftop">${rows.join("")}</div>
    ${body ? `<div class="specbar">Scope of Works &amp; Specification</div><div class="cols">${body}</div>` : ""}
  </section>`;
}

/** Cover figure — image if supplied, else a branded placeholder tile. */
function figureTile(f: ScopeFigure): string {
  return f.imagePath
    ? `<img src="${esc(f.imagePath)}" alt="">`
    : `<div class="fig-ph"><span>Aerial imagery</span></div>`;
}

function renderHtml(doc: ScopeOfWorks, theme: ThemeName, logoDataUrl: string): string {
  const t = getTheme(theme);
  // Crisp ruled-grid hairline — the "table" look. Green-tinted grey in light,
  // cool grey in dark.
  const rule = theme === "dark" ? "#454D52" : "#C3C9BD";
  const title = doc.title ?? "Scope of Works";

  const contents = doc.items
    .map((i) => `<li><span class="c-no">Item ${i.number}.</span><span class="c-t">${esc(i.title)}</span></li>`)
    .join("");
  const appendices = (doc.appendices ?? [])
    .map((a) => `<li><span class="c-no">Appendix</span><span class="c-t">${esc(a)}</span></li>`)
    .join("");

  const cover = `<section class="cover">
    <div class="cov-head">
      <div class="cov-hc left">${esc(title)}</div>
      <div class="cov-hc right">${esc(doc.property.address)}</div>
    </div>
    <div class="cov-body">
      <div class="cov-toc">
        ${paras(doc.summary, "cov-lead")}
        <ol class="toc">${contents}${appendices}</ol>
      </div>
      <div class="cov-fig">
        ${doc.figure ? figureTile(doc.figure) : ""}
        <div class="cov-cap">${doc.figure ? esc(doc.figure.caption) : ""}</div>
      </div>
    </div>
  </section>`;

  const items = doc.items.map(itemSection).join("");

  const titleblock = `<div class="tblock">
    <div class="tb-id">
      <div class="tb-name">${esc(practice.name)}</div>
      <div class="tb-sub">${esc(practice.tagline)} · ${esc(practice.region)}</div>
      ${doc.notice ? `<div class="tb-note"><b>Note:</b> ${esc(doc.notice)}</div>` : ""}
      ${doc.copyright ? `<div class="tb-note">${esc(doc.copyright)}</div>` : ""}
    </div>
    <div class="tb-mid">
      <img src="${logoDataUrl}" alt="XNDR">
      <div class="tb-status">${esc(title)}<br><b>${esc(doc.status ?? "For Tender Purposes Only")}</b></div>
    </div>
    <div class="tb-meta">
      <div class="mrow"><div class="mk">Job Title</div><div class="mv">${esc(doc.jobTitle)}</div></div>
      <div class="mrow"><div class="mk">Property Address</div><div class="mv">${esc(doc.property.address)}</div></div>
      <div class="mrow"><div class="mk">Reference</div><div class="mv">${esc(doc.reference)}</div></div>
      <div class="mrow"><div class="mk">Date</div><div class="mv">${esc(doc.date)}</div></div>
      <div class="mrow"><div class="mk">Status</div><div class="mv">${esc(doc.status ?? "For Tender Purposes Only")}</div></div>
    </div>
  </div>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: ${type.family}; color: ${t.text}; background: ${t.pageBg}; font-size: 7.3pt; line-height: 1.34; }

  /* Repeating title-block footer via table tfoot (Chromium reserves its space
     + repaints it on every printed page — see fees-report.ts). */
  table.layout { width: 100%; border-collapse: collapse; }
  tfoot td { padding: 0; }
  td.content { padding: 5mm 6mm 2.5mm; vertical-align: top; }
  tfoot { display: table-footer-group; }

  p { margin: 0 0 1.4mm; }
  p:last-child { margin-bottom: 0; }

  /* ── Cover ───────────────────────────────────────────────────────── */
  .cover { break-after: page; border: 0.75pt solid ${rule}; }
  .cov-head { display: flex; border-bottom: 0.75pt solid ${rule}; }
  .cov-hc { padding: 2mm 4mm; font-weight: 800; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.08em; background: ${t.surface}; text-align: center; }
  .cov-hc.left { flex: 1; border-right: 0.75pt solid ${rule}; color: ${t.accent}; }
  .cov-hc.right { flex: 1; }
  .cov-body { display: flex; height: 148mm; }
  .cov-toc { flex: 1; padding: 5mm 6mm; border-right: 0.75pt solid ${rule}; }
  .cov-fig { flex: 1; padding: 5mm; display: flex; flex-direction: column; }
  .cov-lead { color: ${t.muted}; margin-bottom: 3mm; font-size: 8pt; }
  ol.toc { list-style: none; }
  ol.toc li { display: flex; gap: 4mm; align-items: baseline; padding: 1.3mm 0; border-bottom: 0.5pt dotted ${rule}; font-size: 8pt; }
  .c-no { color: ${t.accent}; font-weight: 700; min-width: 15mm; text-transform: uppercase; letter-spacing: 0.04em; font-size: 7.5pt; }
  .c-t { font-weight: 500; }
  .cov-fig img { width: 100%; flex: 1; object-fit: cover; border: 0.75pt solid ${rule}; }
  .fig-ph { flex: 1; background: ${t.surface}; border: 0.75pt dashed ${rule}; display: flex; align-items: center; justify-content: center; }
  .fig-ph span { color: ${t.muted}; text-transform: uppercase; letter-spacing: 0.2em; font-size: 8pt; }
  .cov-cap { text-align: center; font-style: italic; color: ${t.muted}; font-size: 7.5pt; margin-top: 2mm; }

  /* ── Item table ──────────────────────────────────────────────────── */
  .item { border: 0.75pt solid ${rule}; border-top: none; break-inside: auto; }
  .item:first-of-type { border-top: 0.75pt solid ${rule}; }
  .ihead {
    background: ${t.barBg}; color: ${t.barText}; font-weight: 800; font-size: 8.5pt;
    text-transform: uppercase; letter-spacing: 0.05em; padding: 1.6mm 4mm;
    border-bottom: 1.5pt solid ${palette.green}; break-after: avoid;
  }
  .ihead .ino { color: ${t.accent}; margin-right: 2.5mm; }

  /* Location / Scope Intent / Extent rows — short, kept together as a group. */
  .deftop { break-inside: avoid; }
  .drow { display: flex; border-top: 0.75pt solid ${rule}; }
  .deftop .drow:first-child { border-top: none; }
  .lbl {
    flex: 0 0 29mm; border-right: 0.75pt solid ${rule}; padding: 1.7mm 3mm;
    color: ${t.accent}; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; font-size: 6.6pt; background: ${t.surface};
  }
  .val { flex: 1; padding: 1.7mm 4mm; }

  /* Full-width sub-bar heading for the specification (was a side label in v1 —
     a side label beside a page-spanning body left an empty gutter / duplicated). */
  .specbar {
    border-top: 0.75pt solid ${rule}; background: ${t.surface}; color: ${t.accent};
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    font-size: 6.6pt; padding: 1.5mm 4mm; break-after: avoid;
  }

  /* Two-column specification body — a full-width BLOCK multicol (NOT inside a
     flex row). Block multicol fragments across pages reliably; flex does not. */
  .cols { columns: 2; column-gap: 8mm; column-rule: 0.5pt solid ${rule}; padding: 2mm 4mm; }
  /* Let blocks break so their clauses distribute across the two columns and
     across pages (a single unbreakable block would collapse to one column). The
     heading stays with its first clause; individual clauses never split. */
  .block { break-inside: auto; margin-bottom: 2mm; }
  .block:last-child { margin-bottom: 0; }
  .block-h { font-weight: 700; text-decoration: underline; font-size: 7.4pt; margin: 1.3mm 0 1mm; break-after: avoid; break-inside: avoid; }
  .note { color: ${t.muted}; font-style: italic; break-inside: avoid; }

  ol.clauses { list-style: none; }
  li.clause { display: flex; gap: 1.8mm; margin-bottom: 1mm; break-inside: avoid; }
  li.clause > .cn { flex: 0 0 4.6mm; color: ${t.accent}; font-weight: 700; }
  li.clause > .ctext { flex: 1; }
  ol.subs { list-style: none; margin: 0.6mm 0 0 1.2mm; }
  ol.subs li { display: flex; gap: 1.8mm; margin-bottom: 0.5mm; }
  ol.subs .sn { flex: 0 0 4.2mm; color: ${t.muted}; font-weight: 600; }

  /* ── Title-block footer strip ────────────────────────────────────── */
  .tblock { display: flex; border: 0.75pt solid ${rule}; border-top: 1.2pt solid ${palette.green}; background: ${t.bandBg}; }
  .tb-id { flex: 1.5; padding: 2mm 3mm; border-right: 0.75pt solid ${rule}; }
  .tb-name { font-weight: 800; font-size: 8pt; }
  .tb-sub { color: ${t.accent}; font-size: 5.8pt; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.3mm; }
  .tb-note { font-size: 5pt; line-height: 1.32; color: ${t.bandMuted}; margin-top: 0.9mm; }
  .tb-note b { color: ${t.accent}; }
  .tb-mid { flex: 1; padding: 2mm 3mm; border-right: 0.75pt solid ${rule}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.8mm; }
  .tb-mid img { height: 8mm; }
  .tb-status { text-align: center; font-size: 6.5pt; color: ${t.bandMuted}; text-transform: uppercase; letter-spacing: 0.12em; line-height: 1.5; }
  .tb-status b { color: ${t.accent}; }
  .tb-meta { flex: 1.4; display: flex; flex-direction: column; }
  .mrow { display: flex; flex: 1; border-bottom: 0.5pt solid ${rule}; }
  .mrow:last-child { border-bottom: none; }
  .mk { flex: 0 0 24mm; padding: 1mm 2.5mm; border-right: 0.75pt solid ${rule}; color: ${t.accent}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 5.8pt; display: flex; align-items: center; }
  .mv { flex: 1; padding: 1mm 2.5mm; font-size: 6.6pt; display: flex; align-items: center; }
</style></head>
<body>
  <table class="layout">
  <tfoot><tr><td>${titleblock}</td></tr></tfoot>
  <tbody><tr><td class="content">
    ${cover}
    ${items}
  </td></tr></tbody>
  </table>
</body></html>`;
}

async function main(): Promise<void> {
  const doc = JSON.parse(readFileSync(DATA, "utf8")) as ScopeOfWorks;
  for (const theme of ["light", "dark"] as ThemeName[]) {
    const logo = theme === "dark" ? loadLogoOnDark() : loadLogoOnLight();
    const html = renderHtml(doc, theme, logo);
    const out = resolve(DESIGNS_DIR, `adhoc-scope-v2-${theme}.pdf`);
    await renderHtmlToPdf(html, out);
    console.log(`✓ Ad-hoc Scope of Works v2 (${theme}) → ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
