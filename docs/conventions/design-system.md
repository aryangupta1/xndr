# Design system

All styling is plain CSS in [`app/globals.css`](../../app/globals.css) — no UI
library, no CSS-in-JS. One file, sectioned with comment banners. Components carry
semantic class names (`.service-card`, `.hero-stats`); they do not ship their own
stylesheets.

## Brand palette

Sampled directly from the supplied logo (`logo.jpeg`) — do not invent new brand
colours:

- **Background** `#1c2023` (charcoal)
- **Green** `#6b9243` (brand accent)
- **Text** near-white on dark / near-black on light

## Tokens

Everything themeable is a CSS custom property defined at the top of `globals.css`.
**Never hardcode a colour in a component or a rule** — reference a token. The
token set:

`--bg --surface --surface-2 --green --green-bright --text --text-2 --muted
--line --line-strong --nav-bg --logo`

Plus non-colour tokens: `--max --radius --radius-lg --section-y --font`.

If you need a new colour, add a token (defined in **both** themes) rather than a
literal.

## Theming (dark default, light opt-in)

- The active theme is the `data-theme` attribute on `<html>` (`"dark"` | `"light"`).
- `:root, [data-theme="dark"]` holds the dark values; `[data-theme="light"]`
  overrides them. Dark is the default.
- An inline no-flash script in [`app/layout.tsx`](../../app/layout.tsx) sets the
  attribute from `localStorage["xndr-theme"]` **before paint**. Default is dark.
- [`components/ThemeToggle.tsx`](../../components/ThemeToggle.tsx) flips the
  attribute and persists the choice. It's the only thing that writes the theme.
- `color-scheme` is set per theme so native UI (scrollbars, form controls) matches.

### The scoped-region rule (important)

Some regions must stay visually dark in **both** themes because they sit over
dark media — currently the **hero** (over the video) and **project cards** (over
a dark photo gradient). These re-declare the light-on-dark tokens locally, e.g.:

```css
.hero { --text: #f3f5f4; --muted: #c8cfd3; /* … */ color: var(--text); }
```

**You must set `color` too, not just `--text`.** Headings/inline text that only
*inherit* `color` (e.g. `.hero h1`, `.project-card h3`) otherwise pick up the
page's themed body colour and wash out in light mode. This exact bug shipped once
and was fixed by adding `color: var(--text)` to the scoped block — keep it.

## Logo assets

The source `logo.jpeg` has a baked-in dark background and white wordmark, so it
can't sit on a light surface as-is. We ship theme-specific transparent variants:

- `public/logo-dark.png` — green chevron + **white** wordmark (dark theme)
- `public/logo-light.png` — green chevron + **charcoal** wordmark (light theme)
- `public/logo-mark.png` — square mark for favicon / OG

The nav and footer render a `<span class="logo-img">` whose `background-image` is
the `--logo` token, so the logo swaps automatically with the theme. Don't add an
`<img>` logo that hardcodes one variant.

## Responsiveness

Mobile-first within a max width of `--max` (1200px). Use `clamp()` for fluid type
and spacing (see `--section-y`, the `.hero h1` size). Grids collapse via the
media queries at the bottom of `globals.css`. The nav has a hamburger under
880px. Test at ~390px (mobile), ~768px (tablet), desktop.
