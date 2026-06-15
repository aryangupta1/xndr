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
- [ ] **2 more project photos** — got Kellyville, Woy Woy and Newport (thanks!). Still need **Granny Flat & Garage (Guildford)** and **Retaining Wall (Box Hill)** — those two are on placeholders.
- [ ] **Project detail** — each project now has its own page; a few more lines on each fills them out (see §5).
- [ ] **Naming permission** — OK to name/locate the 5 projects publicly as listed?

## ⚑ Follow-ups on our side (no action needed from you)

- [x] **Photos wired in** — Kellyville, Woy Woy and Newport are live on their pages; Guildford + Box Hill stay on placeholders until those land.
- [ ] **Accreditations strip** — you gave us *Design Building Practitioner (DBP)* and *Professional Engineer (under the DBPA)*; we still need to add a spot on the About section to display them.
- [x] **Standalone project pages built** — each project is a clickable page (`/projects/<name>`); the landing grid shows name + location.

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

## 5. Projects / portfolio — ✅ Basics + photos in · ⚑ detail needed
- [x] 4–6 real projects (name, location, category, year). — *5 projects received.*
- [x] A one-line description for each. — *received; shown on the cards + page intro.*
- [x] Project photos — *received for Kellyville, Woy Woy, Newport.* ⚑ *still need Guildford + Box Hill.*
- [ ] Do any projects have client permission to be named publicly? — **please confirm**.

**Each project now has its own page** — the grid shows name + location, the rest
lives on the detail page. A line or two each fills them out; no essays needed:

- [ ] **A fuller description** — 2–4 sentences: the build + the engineering challenge.
- [ ] **Scope of works** — 3–5 bullets of what you did on the job.
- [ ] **Which service(s) applied** — Structural / Remedial / Project Management.
- [ ] **Photos for the last two** — Granny Flat & Garage (Guildford), Retaining Wall (Box Hill).
- [ ] **(Optional) client name** — only if they're happy to be named.

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
