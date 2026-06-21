/**
 * Data model for the design engine. Data → template → render (see
 * docs/design-engine/PLAN.md §3). These are the typed inputs; hand-authored as
 * JSON in `engine/examples/` for now, form/DB-driven later.
 *
 * The drawing-sheet types track the template PDF closely. `FeesReport` is a
 * first sketch and WILL change once a real sample arrives (PLAN.md §6, §9).
 */

/** Project identity — fills the title-block "PROJECT" group; reused by reports. */
export interface ProjectMeta {
  /** Job number, e.g. "2025R0318". */
  jobNo: string;
  /** Project name. */
  name: string;
  /** Site address. */
  siteAddress: string;
  /** Client or Owners Corporation. */
  client: string;
  /** Strata Plan / Deposited Plan number, e.g. "SP 12345". */
  planNo?: string;
}

/** Title-block metadata block (Designed/Drawn/Job No./Scale/Date/Revision). */
export interface SheetMeta {
  /** Designer initials/name. */
  designed: string;
  /** Drafter initials/name. */
  drawn: string;
  /** Scale at A3, e.g. "1:50". */
  scale: string;
  /** Issue date, e.g. "Jun 2026". */
  date: string;
  /** Revision marker, e.g. "P1" or "A". */
  revision: string;
}

/** Registered-practitioner certification line in the title block. */
export interface Certification {
  /** Practitioner name. */
  name: string;
  /** DBP / PE registration number. */
  registrationNo: string;
  /**
   * Optional signature image (path/data-URL) placed at render time. If absent,
   * the sheet is unsigned/uncertified. See PLAN.md §9 (signature).
   */
  signatureImage?: string;
}

/** One A3 drawing sheet. */
export interface DrawingSheet {
  /** Drawing number, e.g. "S-101" or "STD-01". */
  number: string;
  /** Drawing title, e.g. "Roof Plan — Waterproofing". */
  title: string;
  meta: SheetMeta;
  /**
   * Drawing content for the field. Source/representation is an OPEN QUESTION
   * (PLAN.md §9, Phase 4) — kept loose until decided. e.g. an image to place,
   * an SVG string, or structured primitives.
   */
  content?: DrawingContent;
}

/** Placeholder for drawing-field artwork until the source is decided (PLAN §9). */
export interface DrawingContent {
  /** "image" = place a raster/vector export; "svg" = inline SVG; etc. */
  kind: "image" | "svg" | "placeholder";
  /** Path or data-URL for image; raw markup for svg. */
  source?: string;
}

/** A multi-sheet drawing set (the deliverable — cf. the 30-page reference). */
export interface DrawingSet {
  project: ProjectMeta;
  certification: Certification;
  /** "Preliminary" | "For Construction" | "DRAFT" etc. — drives watermark too. */
  issueStatus: string;
  sheets: DrawingSheet[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fees report (fee proposal). Structure derived from two real samples:
// Partridge `F2026R0274.1` (letter-style) and CORE `AS6374` (brochure-style).
// See docs/design-engine/PLAN.md §6.
// ─────────────────────────────────────────────────────────────────────────────

/** Who the proposal is addressed to (the "To / C/o / Attention" block). */
export interface Addressee {
  /** Client / Owners Corporation, e.g. "The Owners — Strata Plan 8910". */
  client: string;
  /** "C/o" line, e.g. "Lamb and Walters Strata Management". */
  careOf?: string;
  /** Postal address lines. */
  address?: string[];
  /** "Attention" name, e.g. "Ms Ella Donohoe". */
  attention?: string;
}

/**
 * One billable line. Either a numeric `amount` (rolls into totals) OR a textual
 * basis like "Hourly rates" / "8% of final contract sum" via `amountText`.
 */
export interface FeeLineItem {
  /** What the fee covers. */
  description: string;
  /** Basis, e.g. "Lump sum", "Hourly". */
  basis?: string;
  /** Fixed amount in AUD, ex-GST. Omit for non-fixed items (use amountText). */
  amount?: number;
  /** Display when there is no fixed amount, e.g. "Hourly rates", "POA". */
  amountText?: string;
}

/** A stage of work: narrative + deliverables + its fee line items. */
export interface FeeStage {
  /** e.g. "Stage 1 — Inspection & Scope of Works". */
  name: string;
  /** Narrative description paragraph(s). */
  description?: string[];
  /** Deliverable bullets. */
  deliverables?: string[];
  /** Fee line items for this stage. */
  items?: FeeLineItem[];
}

/** A role → hourly-rate row. */
export interface RateRow {
  role: string;
  /** Numeric AUD/hr, or text like "Rate × 1.5". */
  rate: number | string;
}

/** The signing engineer (acceptance block). */
export interface Signatory {
  name: string;
  /** e.g. "BEng (Hons) MEng (Structural)". */
  qualifications?: string;
  /** e.g. "Team Leader — Senior Remedial Engineer". */
  title?: string;
  /** DBP / PE registration number. */
  registrationNo?: string;
}

/** Bank/payment details (Payment Details section). */
export interface PaymentDetails {
  /** Payment-terms paragraph(s). */
  terms?: string[];
  accountName?: string;
  bank?: string;
  bsb?: string;
  accountNumber?: string;
}

/** A fees report / fee proposal for a project. */
export interface FeesReport {
  project: ProjectMeta;
  /** Report/quote reference, e.g. "F2026R0274.1". */
  reference: string;
  /** Issue date, e.g. "21 Jun 2026". */
  date: string;
  /** Document title, e.g. "Fee Proposal for Remedial Engineering Services". */
  title?: string;
  /** Who prepared it (representative). */
  preparedBy?: string;
  /** Addressee block (To / C/o / Attention). */
  addressee: Addressee;
  /** Intro paragraph(s) after the salutation. */
  intro?: string[];
  /** "We understand the scope is…" summary bullets. */
  scopeSummary?: string[];
  /** Staged work + fees. */
  stages: FeeStage[];
  /** Flat (non-staged) fee items, if a job isn't staged. */
  items?: FeeLineItem[];
  /** Proposal validity, e.g. 90 (days). */
  validityDays?: number;
  /** GST rate as a fraction, e.g. 0.1 for 10%. Default 0.1. */
  gstRate?: number;
  /** Hourly-rate card rows. */
  hourlyRates?: RateRow[];
  /** Exclusions bullets ("not included in our fee proposal"). */
  exclusions?: string[];
  /** General notes / assumptions. */
  notes?: string[];
  /** Signing engineer. */
  signatory?: Signatory;
  /** Payment details + bank account. */
  payment?: PaymentDetails;
  /** Standard terms & conditions (numbered clauses, rendered in columns). */
  terms?: string[];
}

/** Anything the engine can render to a PDF. */
export type Document = DrawingSet | FeesReport;
