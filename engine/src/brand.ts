/**
 * XNDR brand — single source of truth for the design engine.
 *
 * Mirrors STD-02 ("Brand & Title-Block Specification") and STD-01 from
 * `designs/XNDR - Drawing Sheet Template.pdf`. These are the same brand values
 * the marketing site uses (`app/globals.css`); if the site palette moves, move
 * this too. See docs/design-engine/PLAN.md §5.
 */

/** STD-02 core palette. Do not invent new brand colours — add a token here. */
export const palette = {
  /** Ink / background — title block, footer. */
  ink: "#1C2023",
  /** Title-block panel surface. */
  surface: "#23282C",
  /** Brand green — border, labels, chips. */
  green: "#6B9243",
  /** Brighter green — accents. */
  greenBright: "#82AD55",
  /** Warm paper — the drawing field. */
  paper: "#F7F8F4",
  /** On-dark text. */
  text: "#EEF1F2",
  /** Muted on-dark text (placeholders, secondary metadata). */
  muted: "#9AA3A8",
} as const;

/** Typography. Inter / Helvetica Neue across the system (matches the site). */
export const type = {
  family: `"Inter", "Helvetica Neue", Arial, sans-serif`,
  /** Headings 700–800, tight tracking. */
  headingWeight: 800,
  /** Body & annotation 400–600. */
  bodyWeight: 400,
  /** Title-block labels: uppercase, brand green, this tracking. */
  labelTracking: "0.18em",
} as const;

/**
 * A3-landscape sheet geometry (STD-02 "Sheet anatomy"). Millimetres — CSS uses
 * mm units so these map 1:1 at print.
 */
export const sheet = {
  /** A3 landscape page. */
  page: { width: 420, height: 297, orientation: "landscape" as const },
  /** Brand-green outer border weight. */
  borderMm: 1.4,
  /** Right-hand dark title-block strip width. */
  titleBlockWidthMm: 75,
  /** Drawing-field setout grid pitch. */
  gridPitchMm: 14,
  /** Zone references in the drawing field. */
  zones: { rows: ["A", "B", "C", "D"], cols: [1, 2, 3, 4, 5, 6] },
} as const;

/** Practice identity — appears in every title block and footer. */
export const practice = {
  name: "XNDR Consulting",
  tagline: "Structural · Remedial · Project Management",
  email: "info@xndr.au",
  phone: "0423 322 772",
  region: "New South Wales, Australia",
  templateVersion: "v1.0",
} as const;
