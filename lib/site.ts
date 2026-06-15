// Canonical site URL, resolved in priority order:
//   1. NEXT_PUBLIC_SITE_URL          — set this once you have a custom domain
//   2. VERCEL_PROJECT_PRODUCTION_URL — provided automatically by Vercel (prod domain)
//   3. http://localhost:3000         — local development fallback
//
// This keeps Open Graph tags, canonical URLs and the sitemap correct on every
// environment without any manual configuration.
export const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
