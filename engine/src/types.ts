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

// ─────────────────────────────────────────────────────────────────────────────
// Scope of Works (tender specification). Structure derived from a real sample:
// Partridge `2025R0318` — "Scope of Works, 22 Battery Street, Coogee". A cover
// with an item contents list, then one section per work Item, each with a
// LOCATION / SCOPE INTENT / EXTENT OF WORKS header and a numbered specification
// body (clauses + lettered sub-clauses + interleaved sub-headings).
// ─────────────────────────────────────────────────────────────────────────────

/** One numbered clause in a specification body, with optional lettered sub-points. */
export interface ScopeClause {
  /** Clause text (auto-numbered 1, 2, 3…). */
  text: string;
  /** Lettered sub-points a) b) c)… under the clause. */
  sub?: string[];
}

/**
 * A run of the specification body: an optional bold sub-heading (e.g.
 * "Demolition", "WARRANTIES"), then either free paragraphs (notes) and/or a
 * numbered clause list. Clause numbering restarts at each block by default.
 */
export interface ScopeBlock {
  /** Bold sub-heading introducing the block. */
  heading?: string;
  /** Free note paragraph(s) above the clauses. */
  paras?: string[];
  /** Numbered clauses. */
  clauses?: ScopeClause[];
  /**
   * Continue clause numbering from the previous block instead of restarting at
   * 1 — for a heading that interrupts a single running list.
   */
  continueNumbering?: boolean;
}

/** A captioned figure (cover aerial, detail). Image optional — caption always shows. */
export interface ScopeFigure {
  caption: string;
  /** Path/data-URL of the image; a branded placeholder is drawn if absent. */
  imagePath?: string;
}

/** One work Item — a section of the specification. */
export interface ScopeItem {
  /** Item number (auto-prefixed "ITEM n."). */
  number: number;
  /** Item title, e.g. "Balcony, Courtyard and Walkway Waterproofing". */
  title: string;
  /** "LOCATION" row. */
  location?: string;
  /** "SCOPE INTENT" row — paragraph(s). */
  scopeIntent?: string[];
  /** "EXTENT OF WORKS" row — paragraph(s). */
  extentOfWorks?: string[];
  /** "SCOPE OF WORKS & SPECIFICATION" — the numbered body. */
  specification?: ScopeBlock[];
}

/** A tender Scope of Works / Specification document. */
export interface ScopeOfWorks {
  /** Document title. Default "Scope of Works". */
  title?: string;
  /** Job title, e.g. "Remedial Building Works — Waterproofing & Other Works". */
  jobTitle: string;
  /** Subject property address. */
  property: { address: string };
  /** Document reference, e.g. "2025R0318". */
  reference: string;
  /** Issue date, e.g. "11 June 2026". */
  date: string;
  /** Issue purpose, e.g. "For Tender Purposes Only". */
  status?: string;
  /** Cover intro line(s) summarising the specification. */
  summary?: string[];
  /** Cover figure (aerial view). */
  figure?: ScopeFigure;
  /** The work items. */
  items: ScopeItem[];
  /** Repeating-footer notice to the Contractor. */
  notice?: string;
  /** Copyright line for the footer. */
  copyright?: string;
  /** Appendix titles listed after the contents. */
  appendices?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Remedial Engineering Report. Structure derived from a real sample: Partridge
// `2026R0204.1` — "Remedial Engineering Report, 17a Fort Street, Petersham".
// A letter-style header, then numbered sections: Introduction, Description,
// Observations (photo sub-sections), Discussion & Recommendations, Conclusion,
// and a prepared-by / reviewed-by signature block.
// ─────────────────────────────────────────────────────────────────────────────

/** A point in a nested inspection/scope list — text with optional sub-points. */
export interface NestedPoint {
  text: string;
  sub?: string[];
}

/** A captioned photo placeholder in an observations grid. */
export interface ReportPhoto {
  /** Caption, e.g. "General view of common entry stairs". */
  caption: string;
  /** Path/data-URL; a branded placeholder tile is drawn if absent. */
  imagePath?: string;
}

/** An observation sub-section (3.1, 3.2…): bullet findings + a photo grid. */
export interface ReportObservation {
  /** Sub-section ref, e.g. "3.1". */
  ref: string;
  /** Sub-section title, e.g. "Common Entry Stairs". */
  title: string;
  /** Bullet observations. */
  points: string[];
  /** Photos, laid out two-up. */
  photos?: ReportPhoto[];
}

/** A discussion & recommendation sub-section (4.1, 4.2…). */
export interface ReportDiscussion {
  /** Sub-section ref, e.g. "4.1". */
  ref: string;
  /** Sub-section title, e.g. "Fire Stair Condition". */
  title: string;
  /** Discussion paragraph(s). */
  body: string[];
  /** "Recommendation:" paragraph(s). */
  recommendation?: string[];
  /** Optional inline figure. */
  figure?: { caption: string; imagePath?: string };
}

/** A signatory in the sign-off block (prepared by / reviewed by). */
export interface ReportSignatory {
  /** Column role, e.g. "Prepared by" / "Reviewed by". */
  role: string;
  name: string;
  /** e.g. "BEng (Hons) GradIEAust". */
  qualifications?: string;
  /** e.g. "Engineer, XNDR Consulting". */
  title?: string;
}

/** A remedial engineering inspection report. */
export interface EngineeringReport {
  /** Document title. Default "Remedial Engineering Report". */
  title?: string;
  /** Report number/suffix, e.g. "#1". */
  reportNo?: string;
  /** Issue date, e.g. "15.07.2026". */
  date: string;
  /** Letter addressee. */
  addressee: { to: string; attention?: string };
  /** Subject property (address lines + plan number). */
  property: { address: string[]; planNo?: string };
  /** Document reference, e.g. "2026R0204.1". */
  reference: string;
  /** Footer reference line, e.g. "2026R0204.1 — ENGINEERING REPORT". */
  footerRef?: string;
  /** Salutation, e.g. "Dear Owners,". */
  salutation?: string;
  /** 1.0 Introduction. */
  introduction: {
    body: string[];
    /** The inspection scope list (i, ii… with lettered sub-points). */
    scope?: NestedPoint[];
    /** Closing note(s), e.g. access limitations. */
    closing?: string[];
  };
  /** 2.0 Description. */
  description: { body: string[]; figure?: { caption: string; imagePath?: string } };
  /** 3.x Observations. */
  observations: ReportObservation[];
  /** 4.x Discussion & Recommendations. */
  discussion: ReportDiscussion[];
  /** 5.0 Conclusion. */
  conclusion: { body: string[]; items?: string[]; closing?: string[] };
  /** Sign-off block. */
  signatories: ReportSignatory[];
}

/** Anything the engine can render to a PDF. */
export type Document = DrawingSet | FeesReport | ScopeOfWorks | EngineeringReport;
