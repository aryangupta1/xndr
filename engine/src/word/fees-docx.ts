/**
 * FeesReport → editable Word document (.docx), built natively with the `docx`
 * library. It mirrors the **light fee-proposal PDF** (the gold standard) as
 * closely as Word's layout engine allows: same structure, colours, fonts, sizes,
 * and styling. Word export is fee-proposals only.
 *
 * Cross-engine caveat: a Chromium-rendered PDF and a Word doc can't be byte-for-
 * byte identical. Two known differences are unavoidable in Word: the header/
 * footer brand strips sit within the page margins (not full-bleed to the paper
 * edge), and the header's green skew accent is omitted (no skewed shapes).
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
  TabStopType,
  ImageRun,
  Header,
  Footer,
  convertMillimetersToTwip as mm,
} from "docx";
import type { ISectionOptions } from "docx";

import { practice } from "../brand.js";
import { imageBytes, pngSize } from "../assets.js";
import type { FeesReport, FeeLineItem, FeeStage } from "../types.js";

// Light-theme brand colours (hex without #) — matches getTheme("light").
const GREEN = "6B9243";
const INK = "1C2023";
const MUTED = "5A6166";
const SURFACE = "F4F6F1";
const BAND = "F1F3EE";
const LINE = "E3E5E1";
const WHITE = "FFFFFF";
const FONT = "Inter";

// Border weights in eighths of a point.
const B = { hair: 4, rule: 10, head: 16, left: 24, grand: 12, sign: 6, h2: 12 };
const NONE = { style: BorderStyle.NONE, size: 0, color: WHITE } as const;
const HAIR = { style: BorderStyle.SINGLE, size: B.hair, color: LINE } as const;

const aud = (n: number): string =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function lineAmount(i: FeeLineItem): string {
  if (typeof i.amount === "number") return aud(i.amount);
  if (i.amountText) return i.amountText;
  return "—";
}

interface RunOpts {
  color?: string;
  size?: number;
  bold?: boolean;
  italics?: boolean;
  caps?: boolean;
  spacing?: number;
}
const run = (text: string, o: RunOpts = {}): TextRun =>
  new TextRun({ text, font: FONT, color: o.color ?? INK, size: o.size ?? 20, bold: o.bold, italics: o.italics, allCaps: o.caps, characterSpacing: o.spacing });

const para = (text: string, o: RunOpts & { after?: number } = {}): Paragraph =>
  new Paragraph({ spacing: { after: o.after ?? 120 }, children: [run(text, o)] });

function h2(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 90 },
    border: { bottom: { style: BorderStyle.SINGLE, size: B.h2, color: GREEN, space: 3 } },
    keepNext: true,
    children: [run(text, { color: GREEN, size: 26, bold: true })],
  });
}

const leadSm = (text: string): Paragraph => para(text, { color: MUTED, size: 18 });

/** A disc bullet (scope / exclusions / notes). */
const bullet = (text: string): Paragraph =>
  new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [run(text, { size: 19 })] });

/** A green ▸ tick (deliverables). */
const tick = (text: string): Paragraph =>
  new Paragraph({
    indent: { left: mm(6), hanging: mm(6) },
    spacing: { after: 40 },
    children: [run("▸  ", { color: GREEN, size: 19, bold: true }), run(text, { size: 19 })],
  });

// ── Table helpers ───────────────────────────────────────────────────────────
function cell(children: Paragraph[], o: { fill?: string; width?: number; widthDxa?: number; borders?: object } = {}): TableCell {
  return new TableCell({
    children,
    shading: o.fill ? { fill: o.fill } : undefined,
    width: o.widthDxa ? { size: o.widthDxa, type: WidthType.DXA } : o.width ? { size: o.width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    borders: o.borders as never,
  });
}

/** Fee line items table (description + basis | amount), hairline between rows. */
function feeTable(items: FeeLineItem[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: HAIR, bottom: NONE, left: NONE, right: NONE, insideHorizontal: HAIR, insideVertical: NONE },
    rows: items.map(
      (i) =>
        new TableRow({
          children: [
            cell(
              [
                new Paragraph({ children: [run(i.description, { size: 19 })] }),
                ...(i.basis ? [new Paragraph({ children: [run(i.basis, { color: MUTED, size: 16 })] })] : []),
              ],
              { width: 75 },
            ),
            cell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(lineAmount(i), { size: 19 })] })], { width: 25 }),
          ],
        }),
    ),
  });
}

/** Right-aligned totals table (~70mm), Total row bold with ink top border. */
function totalsTable(subtotal: number, gst: number, gstRate: number, total: number): Table {
  const row = (k: string, v: string, grand = false): TableRow =>
    new TableRow({
      children: [
        cell([new Paragraph({ children: [run(k, { size: grand ? 22 : 19, bold: grand })] })], {
          widthDxa: mm(45),
          borders: grand ? { top: { style: BorderStyle.SINGLE, size: B.grand, color: INK }, bottom: NONE, left: NONE, right: NONE } : { top: NONE, bottom: NONE, left: NONE, right: NONE },
        }),
        cell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(v, { size: grand ? 22 : 19, bold: grand })] })], {
          widthDxa: mm(25),
          borders: grand ? { top: { style: BorderStyle.SINGLE, size: B.grand, color: INK }, bottom: NONE, left: NONE, right: NONE } : { top: NONE, bottom: NONE, left: NONE, right: NONE },
        }),
      ],
    });
  return new Table({
    alignment: AlignmentType.RIGHT,
    width: { size: mm(70), type: WidthType.DXA },
    columnWidths: [mm(45), mm(25)],
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    rows: [row("Subtotal (ex GST)", aud(subtotal)), row(`GST (${(gstRate * 100).toFixed(0)}%)`, aud(gst)), row("Total (inc GST)", aud(total), true)],
  });
}

/** Hourly-rate table: dark header row + zebra body, amount right-aligned. */
function ratesTable(rows: [string, string][]): Table {
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell([new Paragraph({ children: [run("Role", { color: WHITE, size: 16, bold: true, caps: true, spacing: 16 })] })], { fill: INK, width: 70, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE } }),
      cell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [run("Rate (ex GST)", { color: WHITE, size: 16, bold: true, caps: true, spacing: 16 })] })], { fill: INK, width: 30, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE } }),
    ],
  });
  const body = rows.map(
    ([role, rate], idx) =>
      new TableRow({
        children: [
          cell([new Paragraph({ children: [run(role, { size: 19 })] })], { width: 70, fill: idx % 2 ? SURFACE : undefined, borders: { top: HAIR, bottom: NONE, left: NONE, right: NONE } }),
          cell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(rate, { size: 19 })] })], { width: 30, fill: idx % 2 ? SURFACE : undefined, borders: { top: HAIR, bottom: NONE, left: NONE, right: NONE } }),
        ],
      }),
  );
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows: [header, ...body] });
}

/** Account / key-value table, muted first column, zebra. */
function kvTable(rows: [string, string][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: HAIR, bottom: HAIR, left: NONE, right: NONE, insideHorizontal: HAIR, insideVertical: NONE },
    rows: rows.map(
      ([k, v], idx) =>
        new TableRow({
          children: [
            cell([new Paragraph({ children: [run(k, { color: MUTED, size: 19 })] })], { width: 35, fill: idx % 2 ? SURFACE : undefined }),
            cell([new Paragraph({ children: [run(v, { size: 19 })] })], { width: 65, fill: idx % 2 ? SURFACE : undefined }),
          ],
        }),
    ),
  });
}

// ── Stage card ──────────────────────────────────────────────────────────────
function stageBlocks(s: FeeStage): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  out.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      shading: { fill: INK },
      border: { bottom: { style: BorderStyle.SINGLE, size: B.head, color: GREEN, space: 1 } },
      keepNext: true,
      children: [run(s.name, { color: WHITE, size: 20, bold: true })],
    }),
  );
  for (const d of s.description ?? []) out.push(para(d));
  if (s.deliverables?.length) {
    out.push(new Paragraph({ spacing: { before: 60, after: 40 }, children: [run("Deliverables", { size: 19, bold: true })] }));
    for (const d of s.deliverables) out.push(tick(d));
  }
  if (s.items?.length) out.push(feeTable(s.items));
  return out;
}

// ── Header / footer (shaded brand strip) ────────────────────────────────────
function brandHeader(r: FeesReport): Header {
  const logo = imageBytes("logo-light.png");
  const { width: lw, height: lh } = pngSize(logo);
  const h = 30;
  const w = Math.round((h * lw) / lh);
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
        rows: [
          new TableRow({
            children: [
              cell(
                [
                  new Paragraph({
                    tabStops: [{ type: TabStopType.RIGHT, position: mm(174) }],
                    children: [
                      new ImageRun({ type: "png", data: logo, transformation: { width: w, height: h } }),
                      new TextRun({ text: `\t${r.project.name} · ${r.reference}`, font: FONT, color: MUTED, size: 14 }),
                    ],
                  }),
                ],
                { fill: BAND, borders: { top: NONE, left: NONE, right: NONE, bottom: { style: BorderStyle.SINGLE, size: B.rule, color: GREEN } } },
              ),
            ],
          }),
        ],
      }),
    ],
  });
}

function brandFooter(): Footer {
  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
        rows: [
          new TableRow({
            children: [
              cell(
                [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      run(practice.name, { color: GREEN, size: 14, bold: true }),
                      run(`   ·   ${practice.email}   ·   ${practice.phone}   ·   ${practice.region}`, { color: MUTED, size: 14 }),
                    ],
                  }),
                ],
                { fill: BAND, borders: { bottom: NONE, left: NONE, right: NONE, top: { style: BorderStyle.SINGLE, size: B.rule, color: GREEN } } },
              ),
            ],
          }),
        ],
      }),
    ],
  });
}

/** Build the .docx and return it as a Buffer. */
export async function feesReportToDocx(r: FeesReport): Promise<Buffer> {
  const gstRate = r.gstRate ?? 0.1;
  const allItems: FeeLineItem[] = [...(r.stages ?? []).flatMap((s) => s.items ?? []), ...(r.items ?? [])];
  const subtotal = allItems.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

  const body: (Paragraph | Table)[] = [];

  // Title — "Fee Proposal" green, remainder ink (matches the PDF accent).
  const title = r.title ?? "Fee Proposal";
  const m = title.match(/fee proposal/i);
  const titleRuns = m
    ? [run(m[0], { color: GREEN, size: 44, bold: true }), run(title.slice(m.index! + m[0].length), { size: 44, bold: true })]
    : [run(title, { size: 44, bold: true })];
  body.push(new Paragraph({ spacing: { after: 120 }, children: titleRuns }));

  // Meta — 3 columns, green label over value.
  const metaCol = (label: string, value: string): TableCell =>
    cell([new Paragraph({ children: [run(label, { color: GREEN, size: 14, bold: true, caps: true, spacing: 30 })] }), new Paragraph({ children: [run(value, { size: 18 })] })], {
      width: 33,
      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    });
  const metaCells = [metaCol("Date", r.date), metaCol("Reference", r.reference)];
  if (r.preparedBy) metaCells.push(metaCol("Prepared by", r.preparedBy));
  body.push(
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows: [new TableRow({ children: metaCells })] }),
  );
  body.push(para("", { after: 120 }));

  // Addressee — aligned key column.
  const addr = r.addressee;
  const addrLine = (k: string, v: string): Paragraph =>
    new Paragraph({ tabStops: [{ type: TabStopType.LEFT, position: mm(18) }], spacing: { after: 20 }, children: [run(k, { color: MUTED, size: 19 }), run(`\t${v}`, { size: 19 })] });
  body.push(addrLine("To", addr.client));
  if (addr.careOf) body.push(addrLine("C/o", addr.careOf));
  for (const l of addr.address ?? []) body.push(new Paragraph({ indent: { left: mm(18) }, spacing: { after: 20 }, children: [run(l, { size: 19 })] }));
  if (addr.attention) body.push(addrLine("Attention", addr.attention));
  body.push(para("", { after: 120 }));

  // Project highlight — surface box, green left border.
  body.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: NONE, bottom: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE, left: { style: BorderStyle.SINGLE, size: B.left, color: GREEN } },
      rows: [
        new TableRow({
          children: [
            cell(
              [
                new Paragraph({ children: [run(r.project.name, { size: 22, bold: true })] }),
                new Paragraph({ children: [run(r.project.siteAddress, { size: 19 })] }),
                ...(r.project.planNo ? [new Paragraph({ children: [run(r.project.planNo, { size: 19 })] })] : []),
                new Paragraph({ children: [run(`Job No. ${r.project.jobNo}`, { size: 19 })] }),
              ],
              { fill: SURFACE },
            ),
          ],
        }),
      ],
    }),
  );
  body.push(para("", { after: 120 }));

  for (const p of r.intro ?? []) body.push(para(p));

  if (r.scopeSummary?.length) {
    body.push(h2("Scope of Works"));
    body.push(leadSm("We understand that the scope of our work is as follows:"));
    for (const s of r.scopeSummary) body.push(bullet(s));
  }

  if (r.stages?.length) {
    body.push(h2("Scope & Fees"));
    for (const s of r.stages) body.push(...stageBlocks(s));
    if (subtotal > 0) {
      body.push(para("", { after: 60 }));
      body.push(totalsTable(subtotal, gst, gstRate, total));
    } else {
      body.push(para("Fees are quoted exclusive of GST. GST will be added.", { italics: true, color: MUTED }));
    }
    if (r.validityDays) body.push(leadSm(`This proposal is valid for ${r.validityDays} days.`));
  } else if (r.items?.length) {
    body.push(h2("Fees"));
    body.push(feeTable(r.items));
    if (subtotal > 0) body.push(totalsTable(subtotal, gst, gstRate, total));
  }

  if (r.hourlyRates?.length) {
    body.push(h2("Hourly Rates"));
    body.push(leadSm("Our current hourly rates (excluding GST):"));
    body.push(ratesTable(r.hourlyRates.map((rr) => [rr.role, typeof rr.rate === "number" ? aud(rr.rate) : rr.rate])));
  }

  if (r.exclusions?.length) {
    body.push(h2("Exclusions"));
    body.push(leadSm("The following items are not included in this fee proposal:"));
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
    body.push(para("Yours faithfully,", { after: 280 }));
    body.push(para(r.signatory.name, { bold: true, size: 22, after: 20 }));
    if (r.signatory.qualifications) body.push(para(r.signatory.qualifications, { color: MUTED, size: 17, after: 20 }));
    if (r.signatory.title) body.push(para(r.signatory.title, { color: MUTED, size: 17, after: 20 }));
    if (r.signatory.registrationNo) body.push(para(`DBP / PE No.: ${r.signatory.registrationNo}`, { color: MUTED, size: 17, after: 20 }));
    body.push(para(`For and on behalf of ${practice.name}`, { color: MUTED, size: 17 }));
  }
  body.push(para("Received and accepted, for the Client", { bold: true, after: 400 }));
  const signCell = (label: string): TableCell =>
    cell([new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: B.sign, color: INK, space: 2 } }, children: [run(label, { color: MUTED, size: 17 })] })], {
      width: 45,
      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    });
  body.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [mm(80), mm(18), mm(80)],
      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
      rows: [new TableRow({ children: [signCell("Signed"), cell([new Paragraph({})], { borders: { top: NONE, bottom: NONE, left: NONE, right: NONE } }), signCell("Date")] })],
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

  // ── Terms — own section, two columns, fresh page (matches the PDF) ─────────
  const termsChildren: Paragraph[] = [];
  if (r.terms?.length) {
    termsChildren.push(h2("Standard Terms & Conditions"));
    r.terms.forEach((t, i) => termsChildren.push(new Paragraph({ spacing: { after: 80 }, children: [run(`${i + 1}.  ${t}`, { color: MUTED, size: 15 })] })));
  }

  const header = brandHeader(r);
  const footer = brandFooter();
  const pageProps = {
    page: {
      size: { width: mm(210), height: mm(297) },
      margin: { top: mm(22), bottom: mm(16), left: mm(16), right: mm(16), header: mm(8), footer: mm(6) },
    },
  };

  const sections: ISectionOptions[] = [
    { properties: pageProps, headers: { default: header }, footers: { default: footer }, children: body },
  ];
  if (termsChildren.length) {
    sections.push({
      properties: { ...pageProps, column: { count: 2, space: mm(8) } },
      headers: { default: header },
      footers: { default: footer },
      children: termsChildren,
    });
  }

  const doc = new Document({
    creator: practice.name,
    title: r.title ?? "Fee Proposal",
    styles: { default: { document: { run: { font: FONT, color: INK } } } },
    sections,
  });

  return Packer.toBuffer(doc);
}
