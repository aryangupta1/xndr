# XNDR — Content questions for the business owner

Thanks Rinay — your answers (email, 15 Jun 2026) are now live on the site. The
sections below are marked **✅ Done** where your reply covered them. A few things
are **still outstanding** — listed first so they're easy to find.

> Everything visible on the site lives in one file — `lib/content.ts` — so your
> answers map straight onto the page.

---

## ⚑ Still need from you (priority)

These are the gaps blocking a fully real site — we won't invent them:

- [ ] **Contact email** — required; CTA + footer both point here (currently a placeholder).
- [ ] **Phone number** — currently a placeholder.
- [ ] **Office address** — only if you want it shown publicly.
- [ ] **ABN / business registration number** — for the footer.
- [ ] **Social links** — LinkedIn / Instagram / Facebook / other (or "none").
- [ ] **Preferred call-to-action** — "Book a consultation" is live; confirm or change (Request a quote / Email us…).
- [ ] **Contact method** — keep the simple `mailto:` link, or do you want a proper contact form?
- [ ] **Project photos** — your own jobsite/render photos are strongly preferred over stock for the 5 portfolio projects. Can you supply them? (See follow-up below.)
- [ ] **Naming permission** — do the 5 projects have client permission to be named/located publicly as listed?
- [ ] **Higher-res logo** — SVG or transparent PNG; current logo is cropped from the supplied JPEG.
- [ ] **Hero video** — happy with the stock construction clip, or do you have your own?
- [ ] **Brand colours** — anything beyond the logo green/charcoal?

## ⚑ Follow-ups on our side (no action needed from you)

- [ ] **Project images don't match yet** — the 5 projects are now your real residential jobs, but the stock images are leftover from the old commercial placeholders. We'll swap in better-suited photos (ideally yours — see above).
- [ ] **Accreditations strip** — you gave us *Design Building Practitioner (DBP)* and *Professional Engineer (under the DBPA)*; we still need to add a spot on the About section to display them.
- [ ] **Project locations + descriptions** — captured from your email (Guildford, Kellyville, Box Hill, Woy Woy, Newport) and ready to show once the project cards support those fields.

---

## 1. Brand & positioning — ✅ Done
- [x] In one sentence, how would you describe XNDR to a new client? — *elevator pitch received.*
- [x] What's your tagline / hero headline? — *"Built on trust, delivered with transparency."*
- [x] Which markets/regions do you serve? — *All of New South Wales.*
- [x] Who is your ideal client? — *Strata Managers (90%), then Owners Corporations & Builders.*

## 2. Hero stats (3 numbers shown under the headline) — ✅ Done
- [x] Number of projects delivered? — *20+ across NSW.*
- [x] Years in operation / combined experience? — *15+ years combined.*
- [x] A third proof point? — *100% compliance focus (Registered Design & Building Practitioner).*

## 3. About section — ✅ Mostly done
- [x] Short company story / background. — *received (founder Rinay Singh, UoM B.Eng / M.Eng).*
- [x] Your **vision**, **approach**, and **standards** — one line each. — *received.*
- [x] Any accreditations to display? — *DBP + Professional Engineer (DBPA) received* — see follow-up above re: where to show them.

## 4. The three services — ✅ Done
- [x] A one–two sentence description of each. — *received.*
- [x] The 3 most important sub-services under each. — *received.*
- [x] A 4th service, or are these the three? — *three core offerings confirmed.*

## 5. Projects / portfolio — ✅ Copy done, photos outstanding
- [x] 4–6 real projects (name, location, category, year). — *5 projects received.*
- [x] A one-line description for each. — *received (kept for the cards).*
- [ ] Can you supply your own project photos? — **outstanding** (see priority list).
- [ ] Do any projects have client permission to be named publicly? — **please confirm**.

## 6. Testimonials — ✅ Done
- [x] Keep the one showing — **Aryan G — "Rinay is an exceptional mind."**? — *kept as-is.*
- [ ] Any additional testimonials? — optional; send any time (name, role/company, quote).

## 7. Contact & footer — ❌ Outstanding
- [ ] Business email address?
- [ ] Phone number?
- [ ] Office address (if you want it shown)?
- [ ] Social media links — LinkedIn / Instagram / Facebook / other?
- [ ] ABN / business registration number for the footer?
- [ ] Preferred primary call-to-action? (Book a call, Request a quote, Email us…)

## 8. Assets — ❌ Outstanding
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
