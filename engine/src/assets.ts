/**
 * Brand assets loaded from disk and inlined as data URLs.
 *
 * Templates are pure (no I/O) and rendered via `page.setContent`, so relative
 * asset paths don't resolve. We read brand images here and pass them in as
 * data URLs. The light logo (`public/logo-dark.png`) sits on the dark title
 * block per STD-02 "Logo usage".
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = resolve(here, "../../public");

/** Read an image from the site's `public/` dir as a base64 data URL. */
export function imageDataUrl(file: string, mime = "image/png"): string {
  const bytes = readFileSync(resolve(PUBLIC_DIR, file));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

/** Light XNDR logo (white wordmark) — for DARK surfaces, e.g. the title block. */
export function loadLogoOnDark(): string {
  return imageDataUrl("logo-dark.png");
}

/** Dark XNDR logo (charcoal wordmark) — for LIGHT surfaces, e.g. report header. */
export function loadLogoOnLight(): string {
  return imageDataUrl("logo-light.png");
}

/** Raw bytes of an image in `public/` (e.g. for embedding in a .docx). */
export function imageBytes(file: string): Buffer {
  return readFileSync(resolve(PUBLIC_DIR, file));
}

/** Intrinsic pixel size of a PNG, read from its IHDR chunk. */
export function pngSize(bytes: Buffer): { width: number; height: number } {
  // PNG: 8-byte signature, then IHDR length(4)+type(4); width/height are the
  // next two big-endian uint32s at offsets 16 and 20.
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}
