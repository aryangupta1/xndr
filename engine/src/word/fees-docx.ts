/**
 * FeesReport → editable Word document (.docx), built natively with the `docx`
 * library so the output is genuinely editable in Word (real headings, tables and
 * lists — not an HTML-to-Word conversion). Word export is fee-proposals only.
 *
 * Styling is light/brand (Word documents are light by nature) — it mirrors the
 * brand rather than pixel-matching the PDF.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  TabStopType,
  convertMillimetersToTwip as mm,
} from "docx";

import { practice } from "../brand.js";
import { imageBytes, pngSize } from "../assets.js";
import type { FeesReport, FeeLineItem, FeeStage } from "../types.js";

// Brand colours (hex without #).
const GREEN = "6B9243";
const INK = "1C2023";
const MUTED = "5A6166";
const SURFACE = "F4F6F1";
const LINE = "E3E5E1";
const WHITE = "FFFFFF";
const FONT = "Inter";

const aud = (n: number): string =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function lineAmount(i: FeeLineItem): string {
  if (typeof i.amount === "number") return aud(i.amount);
  if (i.amountText) return i.amountText;
  return "—";
}

// ── Paragraph builders ──────────────────────────────────────────────────────
function para(text: string, opts: { color?: string; size?: number; bold?: boolean; italics?: boolean; after?: number } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    children: [new TextRun({ text, font: FONT, color: opts.color ?? INK, size: opts.size ?? 20, bold: opts.bold, italics: opts.italics })],
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GREEN, space: 2 } },
    keepNext: true,
    children: [new TextRun({ text, font: FONT, color: GREEN, size: 26, bold: true })],
  });
}

function label(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, color: GREEN, size: 15, bold: true, characterSpacing: 30 })],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, font: FONT, color: INK, size: 19 })],
  });
}

// ── Table helpers ───────────────────────────────────────────────────────────
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: WHITE } as const;
const HAIR = { style: BorderStyle.SINGLE, size: 2, color: LINE } as const;

function cell(children: Paragraph[], opts: { fill?: string; width?: number; borders?: object } = {}): TableCell {
  return new TableCell({
    children,
    shading: opts.fill ? { fill: opts.fill } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    borders: opts.borders as never,
  });
}

function textCell(text: string, opts: { color?: string; size?: number; bold?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; fill?: string; width?: number } = {}): TableCell {
  return cell(
    [new Paragraph({ alignment: opts.align, children: [new TextRun({ text, font: FONT, color: opts.color ?? INK, size: opts.size ?? 19, bold: opts.bold })] })],
    { fill: opts.fill, width: opts.width },
  );
}

/** Fee line items as a 2-column table (description | amount). */
function feeTable(items: FeeLineItem[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: HAIR, bottom: HAIR, left: NO_BORDER, right: NO_BORDER, insideHorizontal: HAIR, insideVertical: NO_BORDER },
    rows: items.map(
      (i) =>
        new TableRow({
          children: [
            cell(
              [
                new Paragraph({ children: [new TextRun({ text: i.description, font: FONT, color: INK, size: 19 })] }),
                ...(i.basis ? [new Paragraph({ children: [new TextRun({ text: i.basis, font: FONT, color: MUTED, size: 15 })] })] : []),
              ],
              { width: 75 },
            ),
            textCell(lineAmount(i), { align: AlignmentType.RIGHT, width: 25 }),
          ],
        }),
    ),
  });
}

/** Generic 2-column key/value table (account details). */
function kvTable(rows: [string, string][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: HAIR, bottom: HAIR, left: NO_BORDER, right: NO_BORDER, insideHorizontal: HAIR, insideVertical: NO_BORDER },
    rows: rows.map(
      ([k, v], idx) =>
        new TableRow({
          children: [
            textCell(k, { color: MUTED, width: 35, fill: idx % 2 ? SURFACE : undefined }),
            textCell(v, { width: 65, fill: idx % 2 ? SURFACE : undefined }),
          ],
        }),
    ),
  });
}

// ── Section builders ────────────────────────────────────────────────────────
function stageBlocks(s: FeeStage): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  out.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      shading: { fill: INK },
      keepNext: true,
      children: [new TextRun({ text: s.name, font: FONT, color: WHITE, size: 20, bold: true })],
    }),
  );
  for (const d of s.description ?? []) out.push(para(d));
  if (s.deliverables?.length) {
    out.push(new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: "Deliverables", font: FONT, color: INK, size: 19, bold: true })] }));
    for (const d of s.deliverables) out.push(bullet(d));
  }
  if (s.items?.length) out.push(feeTable(s.items));
  return out;
}

/** Build the .docx and return it as a Buffer. */
export async function feesReportToDocx(r: FeesReport): Promise<Buffer> {
  const gstRate = r.gstRate ?? 0.1;
  const allItems: FeeLineItem[] = [...(r.stages ?? []).flatMap((s) => s.items ?? []), ...(r.items ?? [])];
  const subtotal = allItems.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

  const body: (Paragraph | Table)[] = [];

  // Title
  body.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: r.title ?? "Fee Proposal", font: FONT, color: INK, size: 40, bold: true })],
    }),
  );

  // Meta
  body.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({ text: "Date ", font: FONT, color: GREEN, size: 15, bold: true }),
        new TextRun({ text: `${r.date}     `, font: FONT, color: MUTED, size: 18 }),
        new TextRun({ text: "Reference ", font: FONT, color: GREEN, size: 15, bold: true }),
        new TextRun({ text: `${r.reference}     `, font: FONT, color: MUTED, size: 18 }),
        ...(r.preparedBy ? [new TextRun({ text: "Prepared by ", font: FONT, color: GREEN, size: 15, bold: true }), new TextRun({ text: r.preparedBy, font: FONT, color: MUTED, size: 18 })] : []),
      ],
    }),
  );

  // Addressee
  const addr = r.addressee;
  body.push(para(`To: ${addr.client}`, { after: 20 }));
  if (addr.careOf) body.push(para(`C/o: ${addr.careOf}`, { after: 20 }));
  for (const l of addr.address ?? []) body.push(para(l, { color: MUTED, after: 20 }));
  if (addr.attention) body.push(para(`Attention: ${addr.attention}`, { after: 160 }));

  // Project highlight (1-cell shaded table with green left border)
  body.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: NO_BORDER, bottom: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER, left: { style: BorderStyle.SINGLE, size: 18, color: GREEN } },
      rows: [
        new TableRow({
          children: [
            cell(
              [
                new Paragraph({ children: [new TextRun({ text: r.project.name, font: FONT, color: INK, size: 22, bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: r.project.siteAddress, font: FONT, color: INK, size: 19 })] }),
                ...(r.project.planNo ? [new Paragraph({ children: [new TextRun({ text: r.project.planNo, font: FONT, color: INK, size: 19 })] })] : []),
                new Paragraph({ children: [new TextRun({ text: `Job No. ${r.project.jobNo}`, font: FONT, color: INK, size: 19 })] }),
              ],
              { fill: SURFACE },
            ),
          ],
        }),
      ],
    }),
  );
  body.push(para("", { after: 80 }));

  for (const p of r.intro ?? []) body.push(para(p));

  if (r.scopeSummary?.length) {
    body.push(h2("Scope of Works"));
    body.push(para("We understand that the scope of our work is as follows:", { color: MUTED, size: 18 }));
    for (const s of r.scopeSummary) body.push(bullet(s));
  }

  if (r.stages?.length) {
    body.push(h2("Scope & Fees"));
    for (const s of r.stages) body.push(...stageBlocks(s));
    if (subtotal > 0) {
      body.push(para("", { after: 40 }));
      body.push(kvTable([["Subtotal (ex GST)", aud(subtotal)], [`GST (${(gstRate * 100).toFixed(0)}%)`, aud(gst)], ["Total (inc GST)", aud(total)]]));
    } else {
      body.push(para("Fees are quoted exclusive of GST. GST will be added.", { italics: true, color: MUTED }));
    }
    if (r.validityDays) body.push(para(`This proposal is valid for ${r.validityDays} days.`, { color: MUTED, size: 18 }));
  } else if (r.items?.length) {
    body.push(h2("Fees"));
    body.push(feeTable(r.items));
  }

  if (r.hourlyRates?.length) {
    body.push(h2("Hourly Rates"));
    body.push(para("Our current hourly rates (excluding GST):", { color: MUTED, size: 18 }));
    body.push(kvTable(r.hourlyRates.map((rr) => [rr.role, typeof rr.rate === "number" ? aud(rr.rate) : rr.rate])));
  }

  if (r.exclusions?.length) {
    body.push(h2("Exclusions"));
    body.push(para("The following items are not included in this fee proposal:", { color: MUTED, size: 18 }));
    for (const e of r.exclusions) body.push(bullet(e));
  }

  if (r.notes?.length) {
    body.push(h2("Notes"));
    for (const n of r.notes) body.push(bullet(n));
  }

  // Acceptance
  body.push(h2("Acceptance of Proposal"));
  body.push(para(`Please sign and return this page so that we can commence work for you.${r.validityDays ? ` This fee proposal is valid for acceptance within ${r.validityDays} days.` : ""} By signing below you authorise ${practice.name} to proceed with the work as detailed, for the fee outlined above.`));
  if (r.signatory) {
    body.push(para("Yours faithfully,", { after: 240 }));
    body.push(para(r.signatory.name, { bold: true, size: 22, after: 20 }));
    if (r.signatory.qualifications) body.push(para(r.signatory.qualifications, { color: MUTED, size: 17, after: 20 }));
    if (r.signatory.title) body.push(para(r.signatory.title, { color: MUTED, size: 17, after: 20 }));
    if (r.signatory.registrationNo) body.push(para(`DBP / PE No.: ${r.signatory.registrationNo}`, { color: MUTED, size: 17, after: 20 }));
    body.push(para(`For and on behalf of ${practice.name}`, { color: MUTED, size: 17 }));
  }
  body.push(para("Received and accepted, for the Client", { bold: true, after: 360 }));
  body.push(
    new Paragraph({
      tabStops: [{ type: TabStopType.LEFT, position: mm(95) }],
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: INK, space: 2 } },
      children: [new TextRun({ text: "Signed\tDate", font: FONT, color: MUTED, size: 17 })],
    }),
  );

  // Payment
  if (r.payment && (r.payment.terms?.length || r.payment.accountName || r.payment.bsb)) {
    body.push(h2("Payment Details"));
    for (const p of r.payment.terms ?? []) body.push(para(p));
    const acct: [string, string][] = [];
    if (r.payment.accountName) acct.push(["Account Name", r.payment.accountName]);
    if (r.payment.bank) acct.push(["Bank", r.payment.bank]);
    if (r.payment.bsb) acct.push(["BSB", r.payment.bsb]);
    if (r.payment.accountNumber) acct.push(["Account Number", r.payment.accountNumber]);
    if (acct.length) body.push(kvTable(acct));
  }

  // Terms (numbered manually, on a fresh page)
  if (r.terms?.length) {
    body.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    body.push(h2("Standard Terms & Conditions"));
    r.terms.forEach((t, i) =>
      body.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${i + 1}.  ${t}`, font: FONT, color: MUTED, size: 16 })],
        }),
      ),
    );
  }

  // ── Header / footer ─────────────────────────────────────────────────────
  const logo = imageBytes("logo-light.png");
  const { width: lw, height: lh } = pngSize(logo);
  const logoH = 30;
  const logoW = Math.round((logoH * lw) / lh);

  const header = new Header({
    children: [
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN, space: 4 } },
        tabStops: [{ type: TabStopType.RIGHT, position: mm(174) }],
        children: [
          new ImageRun({ type: "png", data: logo, transformation: { width: logoW, height: logoH } }),
          new TextRun({ text: `\t${r.project.name} · ${r.reference}`, font: FONT, color: MUTED, size: 14 }),
        ],
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 4 } },
        children: [
          new TextRun({ text: practice.name, font: FONT, color: GREEN, size: 14, bold: true }),
          new TextRun({ text: `   ·   ${practice.email}   ·   ${practice.phone}   ·   ${practice.region}`, font: FONT, color: MUTED, size: 14 }),
        ],
      }),
    ],
  });

  const doc = new Document({
    creator: practice.name,
    title: r.title ?? "Fee Proposal",
    styles: { default: { document: { run: { font: FONT, color: INK } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: mm(210), height: mm(297) },
            margin: { top: mm(24), bottom: mm(20), left: mm(18), right: mm(18), header: mm(10), footer: mm(8) },
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children: body,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
