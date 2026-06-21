/**
 * Template: FeesReport → HTML (XNDR-branded fee proposal, A4 portrait).
 *
 * Structure derived from two real samples — Partridge `F2026R0274.1` (letter
 * style) and CORE `AS6374` (designed brochure). The data-driven spine they
 * share: branded running header/footer, addressee block, brief/intro, scope +
 * staged fees, hourly-rate table, exclusions, acceptance/signature, payment
 * details, terms. See docs/design-engine/PLAN.md §6.
 *
 * Pure function, no I/O. Preview by writing the output to `.html`, or pass to
 * `renderHtmlToPdf`. Brand mirrors STD-02 + the marketing site.
 */

import { palette, type, practice, getTheme } from "../brand.js";
import type { ThemeName } from "../brand.js";
import type { FeesReport, FeeLineItem, FeeStage } from "../types.js";

export interface FeesContext {
  /** Light XNDR logo as a data URL (assets.ts) — sits on the dark header band. */
  logoDataUrl?: string;
  /** Document theme. Defaults to light. */
  theme?: ThemeName;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const aud = (n: number): string =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

const bullets = (items?: string[], cls = ""): string =>
  items && items.length
    ? `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
    : "";

const paras = (items?: string[]): string =>
  items && items.length ? items.map((p) => `<p>${esc(p)}</p>`).join("") : "";

/** Display value for a fee line: fixed amount, explicit text, or em dash. */
function lineAmount(i: FeeLineItem): string {
  if (typeof i.amount === "number") return aud(i.amount);
  if (i.amountText) return esc(i.amountText);
  return "—";
}

/** A stage's fee table rows. */
function stageItems(items?: FeeLineItem[]): string {
  if (!items || !items.length) return "";
  return `<table class="fees">${items
    .map(
      (i) => `<tr>
        <td>${esc(i.description)}${i.basis ? `<span class="basis">${esc(i.basis)}</span>` : ""}</td>
        <td class="num">${lineAmount(i)}</td>
      </tr>`,
    )
    .join("")}</table>`;
}

/** A stage card: dark header bar + narrative + deliverables + fee table. */
function stageCard(s: FeeStage): string {
  return `<section class="stage">
    <div class="stage-head">${esc(s.name)}</div>
    <div class="stage-body">
      ${paras(s.description)}
      ${s.deliverables && s.deliverables.length ? `<div class="sub-label">Deliverables</div>${bullets(s.deliverables, "ticks")}` : ""}
      ${stageItems(s.items)}
    </div>
  </section>`;
}

export function renderFeesReport(r: FeesReport, ctx: FeesContext = {}): string {
  const t = getTheme(ctx.theme);
  const gstRate = r.gstRate ?? 0.1;
  const allItems: FeeLineItem[] = [
    ...(r.stages ?? []).flatMap((s) => s.items ?? []),
    ...(r.items ?? []),
  ];
  const subtotal = allItems.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const gst = subtotal * gstRate;
  const total = subtotal + gst;
  const hasFixed = subtotal > 0;

  const title = r.title ?? "Fee Proposal";
  const projectRef = `${esc(r.project.name)} · ${esc(r.reference)}`;

  // ── Sections ────────────────────────────────────────────────────────────
  const addressee = `<div class="addressee">
    <div><span class="k">To</span> ${esc(r.addressee.client)}</div>
    ${r.addressee.careOf ? `<div><span class="k">C/o</span> ${esc(r.addressee.careOf)}</div>` : ""}
    ${(r.addressee.address ?? []).map((l) => `<div class="addr-line">${esc(l)}</div>`).join("")}
    ${r.addressee.attention ? `<div><span class="k">Attention</span> ${esc(r.addressee.attention)}</div>` : ""}
  </div>`;

  const feesSummary = hasFixed
    ? `<table class="totals">
        <tr><td>Subtotal (ex GST)</td><td class="num">${aud(subtotal)}</td></tr>
        <tr><td>GST (${(gstRate * 100).toFixed(0)}%)</td><td class="num">${aud(gst)}</td></tr>
        <tr class="grand"><td>Total (inc GST)</td><td class="num">${aud(total)}</td></tr>
      </table>`
    : `<p class="gst-note">Fees are quoted exclusive of GST. GST will be added.</p>`;

  const hourlyRates =
    r.hourlyRates && r.hourlyRates.length
      ? `<h2>Hourly Rates</h2>
         <p class="lead-sm">Our current hourly rates (excluding GST):</p>
         <table class="rates">
           <thead><tr><th>Role</th><th class="num">Rate (ex GST)</th></tr></thead>
           <tbody>${r.hourlyRates
             .map(
               (rr) =>
                 `<tr><td>${esc(rr.role)}</td><td class="num">${typeof rr.rate === "number" ? aud(rr.rate) : esc(rr.rate)}</td></tr>`,
             )
             .join("")}</tbody>
         </table>`
      : "";

  const acceptance = `<section class="accept">
    <h2>Acceptance of Proposal</h2>
    <p>Please sign and return this page so that we can commence work for you.${
      r.validityDays ? ` This fee proposal is valid for acceptance within ${r.validityDays} days.` : ""
    } By signing below you authorise ${esc(practice.name)} to proceed with the work as detailed, for the fee outlined above.</p>
    ${
      r.signatory
        ? `<div class="sign-from">
            <div>Yours faithfully,</div>
            <div class="sig-name">${esc(r.signatory.name)}</div>
            ${r.signatory.qualifications ? `<div class="sig-meta">${esc(r.signatory.qualifications)}</div>` : ""}
            ${r.signatory.title ? `<div class="sig-meta">${esc(r.signatory.title)}</div>` : ""}
            ${r.signatory.registrationNo ? `<div class="sig-meta">DBP / PE No.: ${esc(r.signatory.registrationNo)}</div>` : ""}
            <div class="sig-meta">For and on behalf of ${esc(practice.name)}</div>
          </div>`
        : ""
    }
    <div class="accept-client">Received and accepted, for the Client</div>
    <div class="sign-row"><div class="sign-field">Signed</div><div class="sign-field">Date</div></div>
  </section>`;

  const payment =
    r.payment &&
    (r.payment.terms?.length || r.payment.accountName || r.payment.bsb)
      ? `<section class="payment">
          <h2>Payment Details</h2>
          ${paras(r.payment.terms)}
          ${
            r.payment.accountName || r.payment.bsb
              ? `<table class="account">
                  ${r.payment.accountName ? `<tr><td>Account Name</td><td>${esc(r.payment.accountName)}</td></tr>` : ""}
                  ${r.payment.bank ? `<tr><td>Bank</td><td>${esc(r.payment.bank)}</td></tr>` : ""}
                  ${r.payment.bsb ? `<tr><td>BSB</td><td>${esc(r.payment.bsb)}</td></tr>` : ""}
                  ${r.payment.accountNumber ? `<tr><td>Account Number</td><td>${esc(r.payment.accountNumber)}</td></tr>` : ""}
                </table>`
              : ""
          }
        </section>`
      : "";

  const terms =
    r.terms && r.terms.length
      ? `<section class="terms">
          <h2>Standard Terms &amp; Conditions</h2>
          <ol>${r.terms.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
        </section>`
      : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: ${type.family}; color: ${t.text}; background: ${t.pageBg}; font-size: 10pt; line-height: 1.55; }

  /* Repeating header/footer via table thead/tfoot — Chromium repaints these on
     every printed page and (unlike position:fixed) reserves their space, so
     flowing content never slides underneath. Backgrounds print normally. */
  table.layout { width: 100%; border-collapse: collapse; }
  thead td, tfoot td { padding: 0; }
  td.content { padding: 7mm 16mm; vertical-align: top; }
  /* tfoot must clear the page bottom edge for its band height. */
  tfoot { display: table-footer-group; }

  /* ── Brand header band — slim, so it frames rather than overpowers ──── */
  .brandbar {
    position: relative; height: 15mm; background: ${t.bandBg}; color: ${t.bandText};
    border-bottom: 1.2pt solid ${palette.green};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16mm; overflow: hidden;
  }
  .brandbar::after {
    content: ""; position: absolute; top: 0; bottom: 0; left: 42%; width: 9mm;
    background: ${palette.green}; transform: skewX(-20deg); opacity: 0.55;
  }
  .brandbar .ref { font-size: 6.5pt; color: ${t.bandMuted}; z-index: 1; max-width: 60%; text-align: right; }
  .brandbar img { height: 7.5mm; z-index: 1; }

  /* ── Footer band — slim hairline strip ───────────────────────────── */
  .footbar {
    height: 8mm; background: ${t.bandBg}; color: ${t.bandMuted};
    border-top: 1.2pt solid ${palette.green};
    display: flex; align-items: center; justify-content: center;
    font-size: 6.5pt; letter-spacing: 0.04em;
  }
  .footbar b { color: ${t.accent}; font-weight: 600; }

  h1 { font-size: 22pt; font-weight: ${type.headingWeight}; line-height: 1.1; margin-top: 6mm; }
  h1 .accent { color: ${t.accent}; }
  h2 {
    font-size: 13pt; font-weight: 700; color: ${t.accent};
    margin: 9mm 0 3mm; padding-bottom: 1.5mm; border-bottom: 1.5pt solid ${palette.green};
    break-after: avoid;
  }
  p { margin: 0 0 2.5mm; }
  .lead-sm { color: ${t.muted}; font-size: 9pt; }
  .label { color: ${t.accent}; text-transform: uppercase; letter-spacing: ${type.labelTracking}; font-size: 8pt; font-weight: 700; margin: 7mm 0 2mm; }
  .sub-label { font-weight: 700; font-size: 9pt; margin: 3mm 0 1.5mm; }

  /* Meta row under the title */
  .meta { display: flex; gap: 8mm; margin: 4mm 0 6mm; font-size: 9pt; color: ${t.muted}; }
  .meta b { display: block; color: ${t.accent}; text-transform: uppercase; letter-spacing: ${type.labelTracking}; font-size: 7pt; }

  /* Addressee */
  .addressee { font-size: 9.5pt; margin-bottom: 5mm; }
  .addressee .k { display: inline-block; min-width: 18mm; color: ${t.muted}; }
  .addressee .addr-line { padding-left: 18mm; }

  /* Project highlight */
  .project-hl {
    background: ${t.surface}; border-left: 3pt solid ${palette.green};
    padding: 4mm 5mm; margin: 4mm 0 6mm;
  }
  .project-hl .name { font-weight: 700; font-size: 11pt; }
  .project-hl div { font-size: 9.5pt; }

  /* Stage cards */
  .stage { margin: 4mm 0; border: 0.5pt solid ${t.line}; border-radius: 1mm; }
  .stage-head { background: ${t.barBg}; color: ${t.barText}; font-weight: 700; font-size: 10pt; padding: 2.5mm 4mm; border-bottom: 2pt solid ${palette.green}; break-after: avoid; }
  .stage-body { padding: 3mm 4mm; }
  .ticks { list-style: none; }
  .ticks li { position: relative; padding-left: 5mm; margin-bottom: 1mm; font-size: 9.5pt; }
  .ticks li::before { content: "▸"; position: absolute; left: 0; color: ${t.accent}; }

  ul { margin: 1mm 0 3mm 5mm; font-size: 9.5pt; }
  li { margin-bottom: 1mm; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; }
  table.fees { margin-top: 2mm; }
  table.fees td { padding: 2mm 1mm; border-top: 0.5pt solid ${t.line}; font-size: 9.5pt; vertical-align: top; }
  .basis { display: block; font-size: 8pt; color: ${t.muted}; }
  td.num, th.num { text-align: right; white-space: nowrap; }

  table.totals { width: 70mm; margin: 4mm 0 0 auto; }
  table.totals td { padding: 1.5mm 2mm; font-size: 9.5pt; }
  table.totals .grand td { border-top: 1.5pt solid ${t.text}; font-weight: ${type.headingWeight}; font-size: 11pt; }
  .gst-note { font-style: italic; color: ${t.muted}; margin-top: 3mm; }

  table.rates, table.account { margin-top: 2mm; }
  table.rates th { background: ${t.barBg}; color: ${t.barText}; text-align: left; padding: 2mm 3mm; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.08em; }
  table.rates td, table.account td { padding: 1.8mm 3mm; font-size: 9.5pt; border-bottom: 0.5pt solid ${t.line}; }
  table.rates tbody tr:nth-child(even), table.account tr:nth-child(even) { background: ${t.surface}; }
  table.account td:first-child { color: ${t.muted}; width: 40mm; }

  /* Acceptance */
  .accept { break-inside: avoid; }
  .sign-from { margin: 5mm 0; }
  .sig-name { font-weight: 700; margin-top: 8mm; font-size: 11pt; }
  .sig-meta { font-size: 8.5pt; color: ${t.muted}; }
  .accept-client { font-weight: 700; margin-top: 6mm; }
  .sign-row { display: flex; gap: 12mm; margin-top: 10mm; }
  .sign-field { flex: 1; border-top: 0.75pt solid ${t.text}; padding-top: 1.5mm; font-size: 8.5pt; color: ${t.muted}; }

  /* Terms — two columns, fresh page */
  .terms { break-before: page; }
  .terms ol { columns: 2; column-gap: 10mm; font-size: 7.5pt; line-height: 1.45; margin-left: 4mm; color: ${t.muted}; }
  .terms li { margin-bottom: 2mm; break-inside: avoid; }
</style></head>
<body>
  <table class="layout">
  <thead><tr><td>
    <div class="brandbar">
      ${ctx.logoDataUrl ? `<img src="${ctx.logoDataUrl}" alt="XNDR">` : `<span style="font-weight:800">${esc(practice.name)}</span>`}
      <span class="ref">${projectRef}</span>
    </div>
  </td></tr></thead>
  <tfoot><tr><td>
    <div class="footbar"><b>${esc(practice.name)}</b>&nbsp;&nbsp;·&nbsp;&nbsp;${esc(practice.email)}&nbsp;&nbsp;·&nbsp;&nbsp;${esc(practice.phone)}&nbsp;&nbsp;·&nbsp;&nbsp;${esc(practice.region)}</div>
  </td></tr></tfoot>
  <tbody><tr><td class="content">
    <h1>${esc(title).replace(/Fee Proposal/i, '<span class="accent">Fee Proposal</span>')}</h1>

    <div class="meta">
      <div><b>Date</b>${esc(r.date)}</div>
      <div><b>Reference</b>${esc(r.reference)}</div>
      ${r.preparedBy ? `<div><b>Prepared by</b>${esc(r.preparedBy)}</div>` : ""}
    </div>

    ${addressee}

    <div class="project-hl">
      <div class="name">${esc(r.project.name)}</div>
      <div>${esc(r.project.siteAddress)}</div>
      ${r.project.planNo ? `<div>${esc(r.project.planNo)}</div>` : ""}
      <div>Job No. ${esc(r.project.jobNo)}</div>
    </div>

    ${paras(r.intro)}

    ${
      r.scopeSummary && r.scopeSummary.length
        ? `<h2>Scope of Works</h2><p class="lead-sm">We understand that the scope of our work is as follows:</p>${bullets(r.scopeSummary)}`
        : ""
    }

    ${
      r.stages && r.stages.length
        ? `<h2>Scope &amp; Fees</h2>${r.stages.map(stageCard).join("")}${feesSummary}${
            r.validityDays ? `<p class="lead-sm">This proposal is valid for ${r.validityDays} days.</p>` : ""
          }`
        : r.items && r.items.length
          ? `<h2>Fees</h2>${stageItems(r.items)}${feesSummary}`
          : ""
    }

    ${hourlyRates}

    ${r.exclusions && r.exclusions.length ? `<h2>Exclusions</h2><p class="lead-sm">The following items are not included in this fee proposal:</p>${bullets(r.exclusions)}` : ""}

    ${r.notes && r.notes.length ? `<h2>Notes</h2>${bullets(r.notes)}` : ""}

    ${acceptance}

    ${payment}

    ${terms}
  </td></tr></tbody>
  </table>
</body></html>`;
}
