# XNDR — Content questions for the business owner

All visible text on the site is currently **placeholder (lorem ipsum)**. Please
answer the questions below so we can replace it with real copy. Everything lives
in one file — `lib/content.ts` — so answers map directly to the site.

## 1. Brand & positioning
- [ ] In one sentence, how would you describe XNDR to a new client?
- [ ] What's your tagline / hero headline? (currently *"Engineering certainty into every structure"*)
- [ ] Which markets/regions do you serve? (city, state, national?)
- [ ] Who is your ideal client? (builders, strata managers, councils, developers, homeowners?)

## 2. Hero stats (3 numbers shown under the headline)
- [ ] Number of projects delivered?
- [ ] Years in operation / combined experience?
- [ ] A third proof point? (e.g. compliance record, value of work delivered, repeat-client rate)

## 3. About section
- [ ] Short company story / background (2–3 sentences).
- [ ] Your **vision**, your **approach**, and your **standards** — one line each.
- [ ] Any accreditations, registrations or professional memberships to display? (e.g. CPEng, NER, RPEng, licence numbers)

## 4. The three services
For **Structural Engineering**, **Remedial Engineering** and **Project Management**:
- [ ] A one–two sentence description of each.
- [ ] The 3 most important sub-services / deliverables to list under each.
- [ ] Is there a 4th service we should add, or are these the three core offerings?

## 5. Projects / portfolio
- [ ] 4–6 real projects we can feature: **name, location, category, year**.
- [ ] A one-line description for each (optional).
- [ ] Can you supply your own project photos? (preferred over stock) If not, we keep curated stock images.
- [ ] Do any projects have client permission to be named publicly?

## 6. Testimonials
- [ ] Currently showing one: **Aryan G — "Rinay is an exceptional mind."** Keep as-is?
- [ ] Any additional testimonials? (name, role/company, quote)

## 7. Contact & footer
- [ ] Business email address?
- [ ] Phone number?
- [ ] Office address (if you want it shown)?
- [ ] Social media links — LinkedIn / Instagram / Facebook / other?
- [ ] ABN / business registration number for the footer?
- [ ] Preferred primary call-to-action? (Book a call, Request a quote, Email us…)

## 8. Assets
- [ ] A higher-resolution logo file (SVG or transparent PNG preferred) — current logo is cropped from the supplied JPEG.
- [ ] Brand colours beyond the logo green/charcoal, if any.
- [ ] Do you have your own hero video? (currently using a free stock construction clip)

---

### Where each answer goes
| Question group | File | What to edit |
|---|---|---|
| Hero headline / stats | `lib/content.ts` | `hero` |
| About | `lib/content.ts` | `about` |
| Services | `lib/content.ts` | `services` |
| Projects | `lib/content.ts` | `projects` (and image ids) |
| Testimonials | `lib/content.ts` | `testimonials` |
| Email / phone / socials | `lib/content.ts` | `footer` |
| Logo / favicon | `public/` | `logo-nav.png`, `logo-mark.png`, `logo.jpeg` |
| Hero video | `lib/content.ts` | `HERO_VIDEO` |
