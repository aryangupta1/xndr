/**
 * Template: EngineeringReport → HTML (XNDR-branded inspection report, A4 portrait).
 *
 * Structure derived from a real sample — Partridge `2026R0204.1` (Remedial
 * Engineering Report, 17a Fort Street). The data-driven spine: a letter-style
 * header (Date / To / Attention + subject line), a branded running header/footer
 * carrying the reference + address, then numbered sections — Introduction,
 * Description, Observations (photo sub-sections), Discussion & Recommendations,
 * Conclusion — and a prepared-by / reviewed-by sign-off block.
 *
 * Pure function, no I/O. Preview by writing the output to `.html`, or pass to
 * `renderHtmlToPdf`. Brand mirrors STD-02 + the marketing site.
 */

import { palette, type, practice, getTheme } from "../brand.js";
import type { ThemeName } from "../brand.js";
import type {
  EngineeringReport,
  ReportObservation,
  ReportDiscussion,
  ReportPhoto,
  NestedPoint,
} from "../types.js";

export interface ReportContext {
  /** XNDR logo as a data URL (assets.ts) — sits on the header band. */
  logoDataUrl?: string;
  /** Document theme. Defaults to light. */
  theme?: ThemeName;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const paras = (items?: string[], cls = ""): string =>
  items && items.length ? items.map((p) => `<p${cls ? ` class="${cls}"` : ""}>${esc(p)}</p>`).join("") : "";

/** Roman numeral (lowercase) for nested-list markers: 0→i, 1→ii… */
function roman(n: number): string {
  const map: [number, string][] = [
    [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ];
  let v = n + 1;
  let s = "";
  for (const [val, sym] of map) while (v >= val) { s += sym; v -= val; }
  return s;
}

/** Nested (i)(ii) list with lettered (a)(b) sub-points — the inspection scope. */
function nestedList(points: NestedPoint[]): string {
  return `<ol class="nested">${points
    .map(
      (p, i) => `<li><span class="rn">(${roman(i)})</span><div class="ntext">${esc(p.text)}${
        p.sub && p.sub.length
          ? `<ol class="nsub">${p.sub
              .map((s, j) => `<li><span class="an">${String.fromCharCode(97 + j)}.</span>${esc(s)}</li>`)
              .join("")}</ol>`
          : ""
      }</div></li>`,
    )
    .join("")}</ol>`;
}

/** Two-up photo grid — image tile if supplied, else a branded placeholder. */
function photoGrid(photos?: ReportPhoto[]): string {
  if (!photos || !photos.length) return "";
  const tile = (p: ReportPhoto, n: number): string => {
    // Photos are auto-numbered per section; strip any "Photo N —" the caption
    // may already carry so the label isn't doubled up.
    const caption = p.caption.replace(/^\s*Photo\s+\d+\s*[—–-]?\s*/i, "");
    const inner = p.imagePath
      ? `<img src="${esc(p.imagePath)}" alt="">`
      : `<div class="ph-ph"><span>Photo ${n}</span></div>`;
    return `<figure class="photo">${inner}<figcaption><b>Photo ${n}</b> ${esc(caption)}</figcaption></figure>`;
  };
  return `<div class="photos">${photos.map((p, i) => tile(p, i + 1)).join("")}</div>`;
}

/** 3.x observation sub-section. */
function observation(o: ReportObservation): string {
  return `<section class="sub">
    <h3><span class="sref">${esc(o.ref)}</span>${esc(o.title)}</h3>
    ${o.points && o.points.length ? `<ul class="obs">${o.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
    ${photoGrid(o.photos)}
  </section>`;
}

/** 4.x discussion & recommendation sub-section. */
function discussion(d: ReportDiscussion): string {
  return `<section class="sub">
    <h3><span class="sref">${esc(d.ref)}</span>${esc(d.title)}</h3>
    ${paras(d.body)}
    ${d.figure ? `<figure class="photo wide">${d.figure.imagePath ? `<img src="${esc(d.figure.imagePath)}" alt="">` : `<div class="ph-ph"><span>Figure</span></div>`}<figcaption>${esc(d.figure.caption)}</figcaption></figure>` : ""}
    ${d.recommendation && d.recommendation.length ? `<div class="rec"><div class="rec-h">Recommendation</div>${paras(d.recommendation)}</div>` : ""}
  </section>`;
}

export function renderEngineeringReport(doc: EngineeringReport, ctx: ReportContext = {}): string {
  const t = getTheme(ctx.theme);
  const title = doc.title ?? "Remedial Engineering Report";
  const subject = `${esc(title)}${doc.reportNo ? ` ${esc(doc.reportNo)}` : ""}`;
  const addrLine = doc.property.address.join(", ");
  const footRef = doc.footerRef ?? doc.reference;

  const sig = doc.signatories
    .map(
      (s) => `<div class="sig">
        <div class="sig-role">${esc(s.role)}</div>
        <div class="sig-line"></div>
        <div class="sig-name">${esc(s.name)}</div>
        ${s.qualifications ? `<div class="sig-meta">${esc(s.qualifications)}</div>` : ""}
        ${s.title ? `<div class="sig-meta">${esc(s.title)}</div>` : ""}
      </div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: ${type.family}; color: ${t.text}; background: ${t.pageBg}; font-size: 10pt; line-height: 1.55; }

  /* Repeating header/footer via table thead/tfoot (see fees-report.ts). */
  table.layout { width: 100%; border-collapse: collapse; }
  thead td, tfoot td { padding: 0; }
  td.content { padding: 7mm 18mm; vertical-align: top; }
  tfoot { display: table-footer-group; }

  /* ── Header band ─────────────────────────────────────────────────── */
  .brandbar {
    position: relative; height: 14mm; background: ${t.bandBg}; color: ${t.bandText};
    border-bottom: 1.2pt solid ${palette.green};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 18mm; overflow: hidden;
  }
  .brandbar::after {
    content: ""; position: absolute; top: 0; bottom: 0; left: 44%; width: 8mm;
    background: ${palette.green}; transform: skewX(-20deg); opacity: 0.5;
  }
  .brandbar .doc-kind { font-size: 7pt; letter-spacing: 0.22em; text-transform: uppercase; color: ${t.accent}; font-weight: 700; z-index: 1; }
  .brandbar .ref { font-size: 6.5pt; color: ${t.bandMuted}; z-index: 1; max-width: 55%; text-align: right; }
  .brandbar img { height: 7mm; z-index: 1; }

  /* ── Footer band ─────────────────────────────────────────────────── */
  .footbar {
    height: 9mm; background: ${t.bandBg}; color: ${t.bandMuted};
    border-top: 1.2pt solid ${palette.green};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 18mm; font-size: 6.5pt; letter-spacing: 0.04em;
  }
  .footbar b { color: ${t.accent}; font-weight: 600; }

  /* ── Letter header ───────────────────────────────────────────────── */
  .kicker { color: ${t.accent}; text-transform: uppercase; letter-spacing: 0.24em; font-size: 8pt; font-weight: 700; margin-top: 4mm; }
  h1 { font-size: 20pt; font-weight: ${type.headingWeight}; line-height: 1.1; margin: 2mm 0 4mm; }
  .letter-meta { display: grid; grid-template-columns: 24mm 1fr; row-gap: 1mm; font-size: 9.5pt; margin-bottom: 5mm; }
  .letter-meta .k { color: ${t.muted}; }
  .subject {
    background: ${t.surface}; border-left: 3pt solid ${palette.green};
    padding: 3.5mm 4mm; margin-bottom: 5mm;
  }
  .subject .st { font-weight: 700; font-size: 12pt; }
  .subject .ss { font-size: 9.5pt; color: ${t.accent}; font-weight: 600; }
  .subject .sp { font-size: 9pt; color: ${t.muted}; }
  .salutation { margin-bottom: 3mm; }

  /* ── Sections ────────────────────────────────────────────────────── */
  h2 {
    font-size: 13pt; font-weight: 700; color: ${t.accent};
    margin: 8mm 0 3mm; padding-bottom: 1.5mm; border-bottom: 1.5pt solid ${palette.green};
    break-after: avoid;
  }
  h2 .snum { color: ${t.text}; }
  h3 { font-size: 10.5pt; font-weight: 700; margin: 5mm 0 2mm; break-after: avoid; }
  h3 .sref { color: ${t.accent}; margin-right: 2.5mm; }
  p { margin: 0 0 2.8mm; }
  /* Subsections flow across pages — keeping a tall photo grid on one page would
     leave big gaps. Individual photos and the recommendation callout avoid
     breaking (below); the h3 stays with its first content via break-after. */
  .sub { break-inside: auto; }

  ul.obs { list-style: none; margin: 1mm 0 3mm; }
  ul.obs li { position: relative; padding-left: 5mm; margin-bottom: 1.6mm; }
  ul.obs li::before { content: "▸"; position: absolute; left: 0; color: ${t.accent}; }

  ol.nested { list-style: none; margin: 1mm 0 3mm 2mm; }
  ol.nested > li { display: flex; gap: 2.5mm; margin-bottom: 1.4mm; }
  ol.nested > li > .rn { flex: 0 0 8mm; color: ${t.accent}; font-weight: 700; }
  ol.nsub { list-style: none; margin: 1mm 0 0 2mm; }
  ol.nsub li { display: flex; gap: 2.5mm; margin-bottom: 0.8mm; }
  ol.nsub .an { flex: 0 0 5mm; color: ${t.muted}; font-weight: 600; }

  ul.plain { margin: 1mm 0 3mm 6mm; }
  ul.plain li { margin-bottom: 1.4mm; }

  /* ── Recommendation callout ──────────────────────────────────────── */
  .rec { background: ${t.surface}; border-left: 3pt solid ${palette.green}; padding: 3mm 4mm; margin: 3mm 0 2mm; break-inside: avoid; }
  .rec-h { color: ${t.accent}; text-transform: uppercase; letter-spacing: 0.14em; font-size: 7.5pt; font-weight: 700; margin-bottom: 1.5mm; }
  .rec p:last-child { margin-bottom: 0; }

  /* ── Photo grid ──────────────────────────────────────────────────── */
  .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 3mm 0 4mm; }
  figure.photo { break-inside: avoid; }
  figure.photo.wide { grid-column: 1 / -1; }
  .photos + .photos { margin-top: 0; }
  figure.photo img, .ph-ph { width: 100%; border-radius: 1mm; }
  figure.photo img { border: 0.75pt solid ${t.line}; display: block; }
  .ph-ph {
    height: 46mm; background: ${t.surface}; border: 0.75pt dashed ${t.line};
    display: flex; align-items: center; justify-content: center;
  }
  figure.photo.wide .ph-ph { height: 70mm; }
  .ph-ph span { color: ${t.muted}; text-transform: uppercase; letter-spacing: 0.18em; font-size: 8pt; }
  figcaption { font-size: 8pt; color: ${t.muted}; margin-top: 1.5mm; line-height: 1.35; }
  figcaption b { color: ${t.accent}; font-weight: 700; }

  /* ── Sign-off ────────────────────────────────────────────────────── */
  .signoff { margin-top: 8mm; break-inside: avoid; }
  .signoff .faithfully { margin-bottom: 6mm; }
  .sigs { display: flex; gap: 14mm; }
  .sig { flex: 1; }
  .sig-role { font-size: 8pt; color: ${t.muted}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12mm; }
  .sig-line { border-top: 0.75pt solid ${t.text}; margin-bottom: 1.5mm; }
  .sig-name { font-weight: 700; font-size: 10.5pt; }
  .sig-meta { font-size: 8.5pt; color: ${t.muted}; }
  .behalf { margin-top: 5mm; font-size: 8.5pt; color: ${t.muted}; }
</style></head>
<body>
  <table class="layout">
  <thead><tr><td>
    <div class="brandbar">
      ${ctx.logoDataUrl ? `<img src="${ctx.logoDataUrl}" alt="XNDR">` : `<span style="font-weight:800">${esc(practice.name)}</span>`}
      <span class="doc-kind">${esc(title)}</span>
      <span class="ref">${esc(addrLine)} · ${esc(doc.reference)}</span>
    </div>
  </td></tr></thead>
  <tfoot><tr><td>
    <div class="footbar">
      <span><b>${esc(practice.name)}</b>&nbsp;&nbsp;·&nbsp;&nbsp;${esc(practice.email)}&nbsp;&nbsp;·&nbsp;&nbsp;${esc(practice.phone)}</span>
      <span>${esc(footRef)}</span>
    </div>
  </td></tr></tfoot>
  <tbody><tr><td class="content">
    <div class="kicker">${esc(title)}</div>
    <h1>${subject}</h1>

    <div class="letter-meta">
      <div class="k">Date</div><div>${esc(doc.date)}</div>
      <div class="k">To</div><div>${esc(doc.addressee.to)}</div>
      ${doc.addressee.attention ? `<div class="k">Attention</div><div>${esc(doc.addressee.attention)}</div>` : ""}
    </div>

    <div class="subject">
      <div class="st">${subject} at</div>
      <div class="ss">${esc(addrLine)}</div>
      ${doc.property.planNo ? `<div class="sp">${esc(doc.property.planNo)}</div>` : ""}
    </div>

    ${doc.salutation ? `<div class="salutation">${esc(doc.salutation)}</div>` : ""}

    <h2><span class="snum">1.0</span> Introduction</h2>
    ${paras(doc.introduction.body)}
    ${doc.introduction.scope && doc.introduction.scope.length ? nestedList(doc.introduction.scope) : ""}
    ${paras(doc.introduction.closing)}

    <h2><span class="snum">2.0</span> Description</h2>
    ${paras(doc.description.body)}
    ${doc.description.figure ? `<figure class="photo wide">${doc.description.figure.imagePath ? `<img src="${esc(doc.description.figure.imagePath)}" alt="">` : `<div class="ph-ph"><span>Figure</span></div>`}<figcaption>${esc(doc.description.figure.caption)}</figcaption></figure>` : ""}

    <h2><span class="snum">3.0</span> Observations</h2>
    ${doc.observations.map(observation).join("")}

    <h2><span class="snum">4.0</span> Discussion &amp; Recommendations</h2>
    ${doc.discussion.map(discussion).join("")}

    <h2><span class="snum">5.0</span> Conclusion</h2>
    ${paras(doc.conclusion.body)}
    ${doc.conclusion.items && doc.conclusion.items.length ? `<ul class="plain">${doc.conclusion.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
    ${paras(doc.conclusion.closing)}

    <div class="signoff">
      <div class="faithfully">Yours faithfully,</div>
      <div class="sigs">${sig}</div>
      <div class="behalf">For and on behalf of ${esc(practice.name)}</div>
    </div>
  </td></tr></tbody>
  </table>
</body></html>`;
}
