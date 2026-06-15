# Conventions

Project-wide rules for the XNDR landing site. These span the whole codebase —
read them before changing structure, styling, or content so changes stay
consistent.

| Doc | Covers |
|-----|--------|
| [`design-system.md`](design-system.md) | Brand palette, CSS tokens, dark/light theming, the logo assets |
| [`content-and-assets.md`](content-and-assets.md) | Where copy lives, the placeholder policy, Unsplash images, the hero video |
| [`architecture-and-deploy.md`](architecture-and-deploy.md) | Stack, file layout, server/client components, SEO, security headers, Vercel deploy |

**The rule:** if you find yourself inventing a pattern that contradicts one of
these, update the doc in the same change — don't quietly diverge. A convention
nobody can find is not a convention.

See also [`../next-prompt.md`](../next-prompt.md) for the cross-session handoff
scratch (what to do next), and the repo root [`README.md`](../../README.md) +
[`QUESTIONS.md`](../../QUESTIONS.md).
