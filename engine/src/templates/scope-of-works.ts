/**
 * Template: ScopeOfWorks → HTML (XNDR-branded tender specification, A4 portrait).
 *
 * Structure derived from a real sample — Partridge `2025R0318` (Scope of Works,
 * 22 Battery Street). The data-driven spine: a cover with an item contents list
 * and aerial figure, a branded running header/footer carrying the job/reference
 * metadata + Contractor notice, then one section per work Item with a
 * LOCATION / SCOPE INTENT / EXTENT OF WORKS header and a numbered specification
 * body (clauses + lettered sub-clauses + interleaved sub-headings).
 *
 * Pure function, no I/O. Preview by writing the output to `.html`, or pass to
 * `renderHtmlToPdf`. Brand mirrors STD-02 + the marketing site.
 */

import { palette, type, practice, getTheme } from "../brand.js";
import type { ThemeName } from "../brand.js";
import type { ScopeOfWorks, ScopeItem, ScopeBlock, ScopeFigure } from "../types.js";

export interface ScopeContext {
  /** XNDR logo as a data URL (assets.ts) — sits on the header band. */
  logoDataUrl?: string;
  /** Document theme. Defaults to light. */
  theme?: ThemeName;
}

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

/** A captioned figure — image if supplied, otherwise a branded placeholder. */
function figure(f: ScopeFigure, t: ReturnType<typeof getTheme>): string {
  const inner = f.imagePath
    ? `<img src="${esc(f.imagePath)}" alt="">`
    : `<div class="fig-ph"><span>Figure</span></div>`;
  return `<figure class="fig">${inner}<figcaption>${esc(f.caption)}</figcaption></figure>`;
}

/** One specification block: heading + notes + numbered clauses (lettered subs). */
function specBlock(b: ScopeBlock, startNo: number): { html: string; nextNo: number } {
  let n = b.continueNumbering ? startNo : 1;
  const clauseHtml = (b.clauses ?? [])
    .map((c) => {
      const no = n++;
      const subs = c.sub && c.sub.length
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

/** One work Item: header bar + definition rows + specification body. */
function itemSection(item: ScopeItem, t: ReturnType<typeof getTheme>): string {
  const rows: string[] = [];
  if (item.location) rows.push(`<div class="drow"><div class="dk">Location</div><div class="dv">${esc(item.location)}</div></div>`);
  if (item.scopeIntent && item.scopeIntent.length)
    rows.push(`<div class="drow"><div class="dk">Scope Intent</div><div class="dv">${paras(item.scopeIntent)}</div></div>`);
  if (item.extentOfWorks && item.extentOfWorks.length)
    rows.push(`<div class="drow"><div class="dk">Extent of Works</div><div class="dv">${paras(item.extentOfWorks)}</div></div>`);

  let running = 1;
  const body = (item.specification ?? [])
    .map((b) => {
      const { html, nextNo } = specBlock(b, running);
      running = nextNo;
      return html;
    })
    .join("");

  return `<section class="item">
    <div class="item-head"><span class="item-no">Item ${item.number}</span><span class="item-title">${esc(item.title)}</span></div>
    ${rows.length ? `<div class="defs">${rows.join("")}</div>` : ""}
    ${body ? `<div class="drow spec"><div class="dk">Scope of Works &amp; Specification</div><div class="dv">${body}</div></div>` : ""}
  </section>`;
}

export function renderScopeOfWorks(doc: ScopeOfWorks, ctx: ScopeContext = {}): string {
  const t = getTheme(ctx.theme);
  const title = doc.title ?? "Scope of Works";
  const metaRef = `${esc(doc.property.address)} · ${esc(doc.reference)}`;

  const contents = doc.items
    .map((i) => `<li><span class="toc-no">Item ${i.number}</span><span class="toc-t">${esc(i.title)}</span></li>`)
    .join("");
  const appendices = (doc.appendices ?? [])
    .map((a) => `<li><span class="toc-no">Appendix</span><span class="toc-t">${esc(a)}</span></li>`)
    .join("");

  const cover = `<section class="cover">
    <div class="kicker">${doc.status ? esc(doc.status) : "Specification"}</div>
    <h1>${esc(title)}</h1>
    <div class="cover-addr">${esc(doc.property.address)}</div>
    <div class="cover-meta">
      <div><b>Job</b>${esc(doc.jobTitle)}</div>
      <div><b>Reference</b>${esc(doc.reference)}</div>
      <div><b>Date</b>${esc(doc.date)}</div>
    </div>
    ${paras(doc.summary, "lead")}
    <div class="toc-h">Contents</div>
    <ol class="toc">${contents}${appendices}</ol>
    ${doc.figure ? figure(doc.figure, t) : ""}
  </section>`;

  const items = doc.items.map((i) => itemSection(i, t)).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: ${type.family}; color: ${t.text}; background: ${t.pageBg}; font-size: 9.5pt; line-height: 1.5; }

  /* Repeating header/footer via table thead/tfoot (see fees-report.ts). */
  table.layout { width: 100%; border-collapse: collapse; }
  thead td, tfoot td { padding: 0; }
  td.content { padding: 6mm 16mm 4mm; vertical-align: top; }
  tfoot { display: table-footer-group; }

  /* ── Header band ─────────────────────────────────────────────────── */
  .brandbar {
    position: relative; height: 14mm; background: ${t.bandBg}; color: ${t.bandText};
    border-bottom: 1.2pt solid ${palette.green};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16mm; overflow: hidden;
  }
  .brandbar::after {
    content: ""; position: absolute; top: 0; bottom: 0; left: 44%; width: 8mm;
    background: ${palette.green}; transform: skewX(-20deg); opacity: 0.5;
  }
  .brandbar .doc-kind { font-size: 7pt; letter-spacing: 0.22em; text-transform: uppercase; color: ${t.accent}; font-weight: 700; z-index: 1; }
  .brandbar .ref { font-size: 6.5pt; color: ${t.bandMuted}; z-index: 1; max-width: 55%; text-align: right; }
  .brandbar img { height: 7mm; z-index: 1; }

  /* ── Footer band — job/reference strip + Contractor notice ───────── */
  .footwrap { border-top: 1.2pt solid ${palette.green}; background: ${t.bandBg}; }
  .footmeta {
    display: flex; gap: 6mm; justify-content: space-between; align-items: baseline;
    padding: 1.6mm 16mm 0; font-size: 6pt; color: ${t.bandMuted};
  }
  .footmeta b { color: ${t.accent}; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; display: block; }
  .footnotice { padding: 1mm 16mm 1.8mm; font-size: 5.3pt; line-height: 1.35; color: ${t.bandMuted}; }
  .footnotice b { color: ${t.accent}; }

  /* ── Cover ───────────────────────────────────────────────────────── */
  .cover { break-after: page; }
  .kicker { color: ${t.accent}; text-transform: uppercase; letter-spacing: 0.24em; font-size: 8pt; font-weight: 700; margin-top: 8mm; }
  h1 { font-size: 30pt; font-weight: ${type.headingWeight}; line-height: 1.05; margin: 2mm 0 2mm; }
  .cover-addr { font-size: 13pt; font-weight: 600; color: ${t.accent}; margin-bottom: 6mm; }
  .cover-meta { display: flex; gap: 10mm; flex-wrap: wrap; padding: 4mm 0; border-top: 0.75pt solid ${t.line}; border-bottom: 0.75pt solid ${t.line}; margin-bottom: 5mm; }
  .cover-meta b { display: block; color: ${t.accent}; text-transform: uppercase; letter-spacing: ${type.labelTracking}; font-size: 6.5pt; margin-bottom: 0.5mm; }
  .cover-meta > div { font-size: 9.5pt; max-width: 70mm; }
  .lead { color: ${t.muted}; font-size: 9.5pt; margin-bottom: 2mm; }

  .toc-h { color: ${t.accent}; text-transform: uppercase; letter-spacing: ${type.labelTracking}; font-size: 8pt; font-weight: 700; margin: 6mm 0 2.5mm; }
  ol.toc { list-style: none; }
  ol.toc li { display: flex; gap: 4mm; align-items: baseline; padding: 1.6mm 0; border-bottom: 0.5pt dotted ${t.line}; font-size: 9.5pt; }
  .toc-no { color: ${t.accent}; font-weight: 700; min-width: 20mm; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.06em; }
  .toc-t { font-weight: 500; }

  /* ── Item sections ───────────────────────────────────────────────── */
  .item { margin-top: 6mm; break-inside: avoid; }
  .item:first-of-type { margin-top: 2mm; }
  .item-head {
    background: ${t.barBg}; color: ${t.barText}; border-bottom: 2pt solid ${palette.green};
    padding: 2.4mm 4mm; display: flex; align-items: baseline; gap: 3mm; break-after: avoid;
  }
  .item-no { color: ${t.accent}; font-weight: 800; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.14em; white-space: nowrap; }
  .item-title { font-weight: 700; font-size: 11pt; }

  .defs, .drow { break-inside: avoid; }
  .drow { display: flex; border-bottom: 0.5pt solid ${t.line}; }
  .drow .dk {
    flex: 0 0 34mm; background: ${t.surface}; color: ${t.accent}; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; font-size: 7pt; padding: 2.5mm 3mm;
  }
  .drow .dv { flex: 1; padding: 2.5mm 4mm; }
  .drow.spec { break-inside: auto; }
  .drow.spec .dv { padding-top: 3mm; }
  .dv p { margin: 0 0 1.8mm; }
  .dv p:last-child { margin-bottom: 0; }

  .block { margin-bottom: 3mm; break-inside: avoid; }
  .block:last-child { margin-bottom: 0; }
  .block-h { font-weight: 700; font-size: 9pt; color: ${t.text}; margin: 2mm 0 1.5mm; }
  .note { color: ${t.muted}; font-style: italic; margin-bottom: 2mm; }

  ol.clauses { list-style: none; }
  li.clause { display: flex; gap: 2.5mm; margin-bottom: 1.6mm; break-inside: avoid; }
  li.clause > .cn { flex: 0 0 6mm; color: ${t.accent}; font-weight: 700; }
  li.clause > .ctext { flex: 1; }
  ol.subs { list-style: none; margin: 1mm 0 0 2mm; }
  ol.subs li { display: flex; gap: 2.5mm; margin-bottom: 1mm; }
  ol.subs .sn { flex: 0 0 5mm; color: ${t.muted}; font-weight: 600; }

  /* ── Figure ──────────────────────────────────────────────────────── */
  .fig { margin: 6mm 0 0; break-inside: avoid; }
  .fig img { width: 100%; border: 0.75pt solid ${t.line}; border-radius: 1mm; }
  .fig-ph {
    width: 100%; height: 80mm; background: ${t.surface}; border: 0.75pt dashed ${t.line};
    border-radius: 1mm; display: flex; align-items: center; justify-content: center;
  }
  .fig-ph span { color: ${t.muted}; text-transform: uppercase; letter-spacing: 0.2em; font-size: 8pt; }
  figcaption { text-align: center; color: ${t.muted}; font-size: 8pt; font-style: italic; margin-top: 2mm; }
</style></head>
<body>
  <table class="layout">
  <thead><tr><td>
    <div class="brandbar">
      ${ctx.logoDataUrl ? `<img src="${ctx.logoDataUrl}" alt="XNDR">` : `<span style="font-weight:800">${esc(practice.name)}</span>`}
      <span class="doc-kind">${esc((doc.title ?? "Scope of Works"))}</span>
      <span class="ref">${metaRef}</span>
    </div>
  </td></tr></thead>
  <tfoot><tr><td>
    <div class="footwrap">
      <div class="footmeta">
        <div><b>Job Title</b>${esc(doc.jobTitle)}</div>
        <div><b>Property</b>${esc(doc.property.address)}</div>
        <div><b>Reference</b>${esc(doc.reference)}</div>
        <div><b>Date</b>${esc(doc.date)}</div>
      </div>
      ${doc.notice ? `<div class="footnotice"><b>Note:</b> ${esc(doc.notice)}</div>` : ""}
      ${doc.copyright ? `<div class="footnotice">${esc(doc.copyright)}</div>` : ""}
    </div>
  </td></tr></tfoot>
  <tbody><tr><td class="content">
    ${cover}
    ${items}
  </td></tr></tbody>
  </table>
</body></html>`;
}
