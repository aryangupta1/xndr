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

/**
 * Document themes — light and dark, mirroring the marketing site's theming.
 * Brand green is constant across both; only the document *surface* tokens flip.
 * Solid green fills (chip, band rules, stage-head accent) keep `palette.green`;
 * green used as text/accents uses `theme.accent` (brighter on dark for contrast).
 */
export type ThemeName = "light" | "dark";

export interface Theme {
  name: ThemeName;
  /** Page background. */
  pageBg: string;
  /** Body text. */
  text: string;
  /** Secondary text. */
  muted: string;
  /** Panels, highlights, table zebra, stage bodies. */
  surface: string;
  /** Hairlines / borders. */
  line: string;
  /** Header/footer band background. */
  bandBg: string;
  /** Text on the band. */
  bandText: string;
  /** Secondary text on the band. */
  bandMuted: string;
  /** Stage-head bar / table-header background. */
  barBg: string;
  /** Text on those bars. */
  barText: string;
  /** Green used for text accents + rules (heading, labels). */
  accent: string;
}

const THEMES: Record<ThemeName, Theme> = {
  light: {
    name: "light",
    pageBg: "#FFFFFF",
    text: "#1C2023",
    muted: "#5A6166",
    surface: "#F4F6F1",
    line: "#E3E5E1",
    bandBg: palette.ink,
    bandText: "#EEF1F2",
    bandMuted: "#9AA3A8",
    barBg: palette.ink,
    barText: "#EEF1F2",
    accent: palette.green,
  },
  dark: {
    name: "dark",
    pageBg: palette.ink,
    text: "#EEF1F2",
    muted: "#9AA3A8",
    surface: palette.surface,
    line: "#333A3E",
    bandBg: "#14181A",
    bandText: "#EEF1F2",
    bandMuted: "#9AA3A8",
    barBg: "#2C3236",
    barText: "#EEF1F2",
    accent: palette.greenBright,
  },
};

/** Resolve a theme by name (defaults to light). */
export function getTheme(name: ThemeName = "light"): Theme {
  return THEMES[name];
}

/** Practice identity — appears in every title block and footer. */
export const practice = {
  name: "XNDR Consulting",
  tagline: "Structural · Remedial · Project Management",
  email: "info@xndr.au",
  phone: "0423 322 772",
  region: "New South Wales, Australia",
  templateVersion: "v1.0",
} as const;
