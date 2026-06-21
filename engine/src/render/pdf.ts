/**
 * Render stage: HTML string → PDF file.
 *
 * Uses Playwright (Chromium `page.pdf()`). Chosen because the brand templates
 * are HTML/CSS and Chromium gives pixel-exact print control. See PLAN.md §3.
 *
 * The template's CSS `@page` rule is the single source of truth for page size,
 * orientation AND margins. We set `preferCSSPageSize: true` and deliberately do
 * NOT pass `format`/`landscape`/`margin` — passing `format` makes Chromium take
 * margins from the format default and ignore `@page`, which let flowing content
 * slide under fixed header/footer bands. So: declare everything in `@page`.
 *
 * NOTE: requires `cd engine && npm install && npx playwright install chromium`.
 */

import { chromium } from "playwright";

export interface RenderOptions {
  /** Print background colours/images — always on (the brand fills depend on it). */
  printBackground?: boolean;
}

/** Render an HTML document (with a CSS `@page` rule) to a PDF on disk. */
export async function renderHtmlToPdf(
  html: string,
  outPath: string,
  options: RenderOptions = {},
): Promise<void> {
  const { printBackground = true } = options;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({
      path: outPath,
      printBackground,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}
