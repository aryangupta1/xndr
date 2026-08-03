/**
 * ONE-OFF (ad hoc): XNDR — Curriculum Vitae, Rinay Singh (Director). A4 portrait,
 * multi-page PDF, XNDR-branded to match the capability statements.
 *
 * Takes the plain Word/PDF CV and re-skins + rewrites it in XNDR's house style:
 * dark cover + closing, light content pages, the green-bar accent, Inter type.
 * Copy is rewritten in plain, human English (no résumé boilerplate); the project
 * record is the focus. Title is set to Director at XNDR; phone only, no email.
 *
 * Not wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/cv-rinay-singh.ts
 * Output → git-ignored designs/cv-rinay-singh.pdf
 */

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { palette, practice } from "../brand.js";
import { loadLogoOnDark, loadLogoOnLight } from "../assets.js";
import { renderHtmlToPdf } from "../render/pdf.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const DESIGNS_DIR = resolve(here, "../../../designs");

const C = {
  ink: palette.ink,
  surface: palette.surface,
  green: palette.green,
  greenBright: palette.greenBright,
  paper: palette.paper,
  text: palette.text,
  muted: "#9AA3A8",
  bodyInk: "#22272A",
  bodyMuted: "#5A6166",
  line: "#E3E5E1",
};

const logoOnDark = loadLogoOnDark(); // white wordmark, for dark surfaces
const logoOnLight = loadLogoOnLight(); // charcoal wordmark, for light surfaces
const PHONE = "+61 423 322 772";

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const footer = (n: number): string =>
  `<div class="foot"><span>Rinay Singh — Director, XNDR Consulting</span><span>${n}</span></div>`;

/** Faint radiating line-art (SVG) for the dark cover / closing backgrounds. */
function lineArt(color: string, opacity = 0.16): string {
  const lines: string[] = [];
  for (let i = 0; i <= 14; i++) lines.push(`<line x1="1000" y1="1000" x2="${1000 - i * 78}" y2="0" stroke="${color}" stroke-width="1.1" opacity="${opacity}"/>`);
  for (let i = 1; i <= 10; i++) lines.push(`<line x1="1000" y1="1000" x2="0" y2="${1000 - i * 95}" stroke="${color}" stroke-width="1.1" opacity="${opacity}"/>`);
  return `<svg class="lineart" viewBox="0 0 1000 1000" preserveAspectRatio="none">${lines.join("")}</svg>`;
}

/** A compact two-column list block (Education / Registrations / strengths). */
const listBlock = (title: string, items: string[]): string =>
  `<div class="block"><div class="block-h">${esc(title)}</div>${items
    .map((i) => `<div class="block-i">${i}</div>`)
    .join("")}</div>`;

/** A full-width project card: title + place, description, and the role bullets. */
function projectCard(p: { title: string; place: string; scale?: string; body: string; role: string[] }): string {
  return `<div class="proj">
    <div class="proj-head">
      <div class="proj-t">${esc(p.title)}</div>
      <div class="proj-p">${esc(p.place)}</div>
    </div>
    ${p.scale ? `<div class="proj-scale">${esc(p.scale)}</div>` : ""}
    <p class="proj-b">${esc(p.body)}</p>
    <div class="proj-role"><span class="role-k">My part</span> ${p.role.map(esc).join(" &nbsp;·&nbsp; ")}</div>
  </div>`;
}

const chips = (items: string[]): string => `<div class="chips">${items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div>`;

const pages: string[] = [];

// ── 1 — Cover ────────────────────────────────────────────────────────────────
pages.push(`
<section class="page cover">
  ${lineArt(C.greenBright)}
  <img class="cover-logo" src="${logoOnDark}" alt="XNDR">
  <div class="cover-band">
    <div class="cover-kicker">Curriculum Vitae</div>
    <h1 class="cover-name">Rinay Singh</h1>
    <div class="cover-role">Director · XNDR Consulting</div>
    <div class="cover-tag">Structural · Remedial · Project Management</div>
  </div>
  <div class="cover-foot">
    <div><span class="cf-k">M</span> ${PHONE}</div>
    <div>${esc(practice.region)}</div>
  </div>
</section>`);

// ── 2 — Profile ──────────────────────────────────────────────────────────────
pages.push(`
<section class="page content">
  <img class="head-logo light" src="${logoOnLight}" alt="XNDR">
  <div class="sec-title"><span class="bar"></span><h2>Profile</h2></div>
  <p class="lead">I'm a structural and remedial engineer with more than a decade on Australian building sites, and the director of XNDR Consulting. My work runs from designing new structures — car parks, schools, apartment buildings — to working out why the ones already standing are failing and putting them right. Today I lead a team across New South Wales, working shoulder to shoulder with owners, strata committees and builders to see each job through.</p>
  <div class="stats">
    <div class="stat"><div class="stat-n">10+</div><div class="stat-l">Years across design and site</div></div>
    <div class="stat"><div class="stat-n">20+</div><div class="stat-l">Buildings delivered across NSW</div></div>
    <div class="stat"><div class="stat-n">DBP · PE</div><div class="stat-l">Registered practitioner</div></div>
  </div>
  <div class="two">
    ${listBlock("Education", [
      "<b>Master of Engineering (Structural)</b><br>The University of Melbourne, 2015",
      "<b>Bachelor of Engineering (Civil), Honours</b><br>The University of Melbourne, 2013",
      "Concrete, steel and timber design (AS&nbsp;3600 · HB&nbsp;48 · AS&nbsp;1170) and structural analysis",
    ])}
    ${listBlock("Registrations & Credentials", [
      "<b>Registered Professional Engineer</b> — DBP<br>PRE0002167",
      "<b>Registered Design Practitioner</b> — DBP<br>DEP0003540",
      "Member, Engineers Australia (MIEAust)",
    ])}
  </div>
  <div class="sec-sub"><span class="bar sm"></span><h3>Core Strengths</h3></div>
  <div class="two tight">
    ${listBlock("Engineering", [
      "Remedial engineering & defect diagnosis",
      "Structural design — concrete, steel & timber",
      "Post-tensioned & reinforced concrete",
      "Structural inspection & condition assessment",
      "Waterproofing, concrete & façade repair",
      "Corrosion protection & re-strengthening",
    ])}
    ${listBlock("Delivery & Leadership", [
      "Leading and mentoring engineering teams",
      "Tender & construction-phase management",
      "Contract administration, variations & EOTs",
      "Stakeholder management — owners, strata, trades",
      "Program, budget & fee control",
      "Design modelling & calculation checking",
    ])}
  </div>
  ${footer(2)}
</section>`);

// ── 3 — Experience ───────────────────────────────────────────────────────────
type Role = { org: string; place: string; dates: string; title: string; body: string; tags: string[]; awards?: string[] };
const roles: Role[] = [
  {
    org: "XNDR Consulting",
    place: "Sydney",
    dates: "Present",
    title: "Director",
    body: "I run XNDR's structural and remedial engineering. Week to week that means working out why a building is failing, designing the fix, and steering the job through to handover — with a team of engineers and drafters behind me, and owners, strata managers and trades alongside. The work spans waterproofing, spalling and concrete repair, façade remediation, corrosion protection, structural re-strengthening, and steel and concrete repair, from the first inspection through tender and into construction.",
    tags: ["Remedial", "Structural", "Project management"],
  },
  {
    org: "CORE Consulting",
    place: "Sydney",
    dates: "2022 – 2024",
    title: "Team Leader · Senior Remedial Engineer",
    body: "Led a remedial team across residential and commercial buildings around Sydney, from both the contractor and client side. Investigated defects, designed and documented the repairs, ran the tenders, and oversaw the works on site through to completion — managing a team of five engineers and drafters.",
    tags: ["Strata", "Contractor & client side", "Team of five"],
  },
  {
    org: "SCP Consulting",
    place: "Sydney",
    dates: "2012 – 2022",
    title: "Structural Design Engineer",
    body: "Designed and delivered structures on major education and mixed-use projects, from concept through to construction — checking conventional and post-tensioned reinforcement on site, holding workmanship to standard, and resolving engineering issues as they came up.",
    tags: ["Concept to construction", "PT & reinforced concrete"],
  },
  {
    org: "Cardno",
    place: "St Leonards, Sydney",
    dates: "2015 – 2021",
    title: "Site / Structural Engineer",
    body: "Delivered large public infrastructure — multi-level car parks and station upgrades — as both designer and site engineer, taking work from concept and tender through peer review and construction, and managing variations, extensions of time and billing along the way.",
    tags: ["Infrastructure", "Design & site"],
    awards: [
      "Winner — Cardno APAC Safety Award, 2020",
      "Nominated — Future Leader of the Year, 2020",
      "Nominated — ACSE Young Engineer of the Year, 2019",
    ],
  },
];
pages.push(`
<section class="page content">
  <img class="head-logo light" src="${logoOnLight}" alt="XNDR">
  <div class="sec-title"><span class="bar"></span><h2>Experience</h2></div>
  <div class="roles">
    ${roles
      .map(
        (r) => `<div class="role">
      <div class="role-top">
        <div class="role-org">${esc(r.org)}<span class="role-place"> · ${esc(r.place)}</span></div>
        <div class="role-dates">${esc(r.dates)}</div>
      </div>
      <div class="role-title">${esc(r.title)}</div>
      <p class="role-body">${esc(r.body)}</p>
      ${r.awards ? `<div class="awards">${r.awards.map((a) => `<div class="award">${esc(a)}</div>`).join("")}</div>` : ""}
      <div class="tags">${r.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </div>`,
      )
      .join("")}
  </div>
  ${footer(3)}
</section>`);

// ── 4 — Selected Projects · Structural & Infrastructure ──────────────────────
pages.push(`
<section class="page content">
  <img class="head-logo light" src="${logoOnLight}" alt="XNDR">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2></div>
  <div class="sec-eyebrow">Structural &amp; Infrastructure</div>
  ${projectCard({
    title: "Warrick Lane Precinct Redevelopment",
    place: "Blacktown, NSW",
    scale: "Four-level underground car park · ~485 spaces · rooftop park · two flanking buildings",
    body: "A four-level underground car park for around 485 vehicles, with a central park sitting on the car-park roof slab and three-storey buildings flanking each side.",
    role: ["Designed the structure from concept to tender", "Principal engineer / peer review for the client through construction", "Variations, extensions of time and billing"],
  })}
  ${projectCard({
    title: "Rooty Hill Car Park & Station Upgrade",
    place: "Rooty Hill, NSW",
    scale: "Six-storey car park · ~750 spaces · pedestrian links both sides of the station",
    body: "A six-storey car park for around 750 vehicles, with upgraded pedestrian links to both sides of the station.",
    role: ["Design and construction management", "Managed principal contractors on site", "Held the budget, ran variations and RFIs"],
  })}
  ${projectCard({
    title: "Cranbrook School Redevelopment",
    place: "Bellevue Hill, NSW",
    scale: "Aquatic & fitness centre (50 m pool) · theatre · assembly hall · chapel · 11 classrooms",
    body: "A major school redevelopment: a new aquatic and fitness centre with a 50 m pool, a theatre and performance rooms, an assembly hall, dining, a chapel and eleven new classrooms.",
    role: ["Design and construction management", "Inspection of conventional and post-tensioned reinforcement", "On-site engineering support and RFIs"],
  })}
  ${projectCard({
    title: "St Elias Church",
    place: "Guildford, NSW",
    scale: "Two-level church over a four-tier underground car park · conventional slab & beam",
    body: "A two-level Catholic church built over a four-tier underground car park, in conventionally reinforced slab and beam.",
    role: ["Design and construction management", "Workmanship and specification compliance", "Budget, variations and RFIs"],
  })}
  ${projectCard({
    title: "5 Skyline Place",
    place: "Frenchs Forest, NSW",
    scale: "Five-storey mixed-use apartments · cafés, medical & retail · two basement levels",
    body: "Five storeys of mixed-use apartments over cafés, medical suites and retail, with two levels of underground parking.",
    role: ["Design and construction management", "Reinforcement and post-tensioning inspection", "Workmanship checks and RFIs"],
  })}
  ${footer(4)}
</section>`);

// ── 5 — Selected Projects · Remedial ─────────────────────────────────────────
const residential = [
  "67 Ocean Street, Woollahra",
  "60 Walker Street, Rhodes",
  "49 Spencer Street, Rose Bay",
  "22 Hardy Street, North Bondi",
  "315 Bondi Road, Bondi Beach",
  "33–35 Kentwell Road, Allambie Heights",
  "25 Greenwich Road, Greenwich",
  "30 The Crescent, Vaucluse",
  "92 Hunter Street, Hornsby",
  "99 Alfred Street, Narraweena",
];
const commercial = ["4A Meridian Place, Bella Vista", "10 Norbrik Avenue, Bella Vista", "Heart of Willoughby"];
pages.push(`
<section class="page content">
  <img class="head-logo light" src="${logoOnLight}" alt="XNDR">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2></div>
  <div class="sec-eyebrow">Remedial &amp; Structural Repair</div>
  <p class="lead sm">Across NSW strata and commercial buildings: waterproofing, spalling and concrete repair, façade works, blast and paint, corrosion protection and structural re-strengthening — carried from the first inspection through tender and into construction.</p>
  <div class="feature">
    <div class="feat-card">
      <div class="feat-t">Sydney Harbour Bridge</div>
      <div class="feat-s">Structural Inspection</div>
      <p>Structural inspection and condition assessment on one of the country's most recognisable structures.</p>
    </div>
    <div class="feat-card">
      <div class="feat-t">Heart of Willoughby</div>
      <div class="feat-s">Commercial · Willoughby, NSW</div>
      <p>Remedial and structural repair works on a prominent commercial building, from investigation through construction.</p>
    </div>
  </div>
  <div class="two grids">
    <div class="grid-block">
      <div class="grid-h">Residential</div>
      <ul class="addr">${residential.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
    </div>
    <div class="grid-block">
      <div class="grid-h">Commercial & Industrial</div>
      <ul class="addr">${commercial.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
    </div>
  </div>
  ${footer(5)}
</section>`);

// ── 6 — Closing / Contact ────────────────────────────────────────────────────
pages.push(`
<section class="page closing">
  ${lineArt(C.greenBright)}
  <img class="close-logo" src="${logoOnDark}" alt="XNDR">
  <div class="close-band">
    <div class="close-name">Rinay Singh</div>
    <div class="close-role">Director · XNDR Consulting</div>
    <div class="close-line"><span class="cf-k">M</span> ${PHONE}</div>
    <div class="close-line dim">${esc(practice.region)}</div>
  </div>
  <div class="close-panels">
    <div class="close-panel">
      <div class="panel-h">Registrations</div>
      <div class="panel-i">Registered Professional Engineer (DBP) — PRE0002167</div>
      <div class="panel-i">Registered Design Practitioner (DBP) — DEP0003540</div>
      <div class="panel-i">Member, Engineers Australia (MIEAust)</div>
    </div>
    <div class="close-panel">
      <div class="panel-h">Site Licences</div>
      ${chips(["Construction White Card", "Confined Space & Rescue", "Elevated Work Platform (EWP)", "Working at Heights", "Rail Industry Worker (RIW)", "Australian Driver Licence"])}
    </div>
  </div>
</section>`);

// ── Document ─────────────────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: "Inter", Arial, sans-serif; color: ${C.bodyInk}; }
  .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; background: #fff; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .bar { display: inline-block; width: 2.6mm; height: 1em; background: ${C.green}; margin-right: 3.5mm; vertical-align: -0.08em; border-radius: 0.5mm; }
  .bar.sm { width: 2mm; margin-right: 3mm; }
  h1, h2, h3 { letter-spacing: -0.01em; line-height: 1.05; }
  p { font-size: 10.5pt; line-height: 1.6; color: ${C.bodyInk}; }

  .foot { position: absolute; bottom: 0; left: 0; right: 0; height: 12mm; background: ${C.ink}; color: ${C.muted}; display: flex; align-items: center; justify-content: space-between; padding: 0 18mm; font-size: 8pt; letter-spacing: 0.04em; }
  .foot span:first-child { color: ${C.greenBright}; font-weight: 600; }

  /* ── Content page shell ─────────────────────────────────────────────── */
  .content { padding: 22mm 18mm 16mm; }
  .head-logo.light { position: absolute; top: 15mm; right: 18mm; height: 8mm; }
  .sec-title h2 { display: inline; color: ${C.ink}; font-size: 25pt; font-weight: 800; vertical-align: middle; }
  .sec-title { margin-bottom: 6mm; }
  .sec-eyebrow { color: ${C.green}; font-weight: 800; font-size: 10pt; letter-spacing: 0.14em; text-transform: uppercase; margin: -3mm 0 5mm 6.1mm; }
  .sec-sub { margin: 9mm 0 4mm; }
  .sec-sub h3 { display: inline; color: ${C.ink}; font-size: 15pt; font-weight: 800; vertical-align: middle; }

  .lead { font-size: 12.5pt; font-weight: 600; line-height: 1.5; color: ${C.bodyInk}; margin-bottom: 6mm; }
  .lead.sm { font-size: 11pt; font-weight: 500; color: ${C.bodyMuted}; margin-bottom: 6mm; }

  /* Stats */
  .stats { display: flex; gap: 5mm; margin-bottom: 7mm; }
  .stat { flex: 1; background: ${C.paper}; border-left: 2.4mm solid ${C.green}; padding: 4.5mm 5mm; }
  .stat-n { font-size: 22pt; font-weight: 900; color: ${C.ink}; line-height: 1; }
  .stat-l { font-size: 8.5pt; color: ${C.bodyMuted}; margin-top: 2mm; }

  /* Two-column blocks (education / registrations / strengths) */
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
  .two.tight { gap: 6mm; }
  .block-h { font-weight: 800; font-size: 10pt; color: ${C.ink}; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 2mm; margin-bottom: 2.5mm; border-bottom: 0.4mm solid ${C.green}; }
  .block-i { font-size: 9.5pt; line-height: 1.5; color: ${C.bodyInk}; padding: 1.8mm 0; border-bottom: 0.3mm solid ${C.line}; }
  .block-i:last-child { border-bottom: none; }
  .block-i b { color: ${C.ink}; }
  .two.tight .block-i { padding-left: 5.5mm; position: relative; }
  .two.tight .block-i::before { content: ""; position: absolute; left: 0; top: 3.4mm; width: 2.2mm; height: 2.2mm; background: ${C.green}; border-radius: 0.4mm; }

  /* ── Experience ─────────────────────────────────────────────────────── */
  .role { padding: 5mm 0 5.5mm; border-top: 0.3mm solid ${C.line}; }
  .role:first-child { border-top: none; padding-top: 1mm; }
  .role-top { display: flex; justify-content: space-between; align-items: baseline; }
  .role-org { font-size: 13pt; font-weight: 800; color: ${C.ink}; }
  .role-place { color: ${C.bodyMuted}; font-weight: 500; font-size: 10.5pt; }
  .role-dates { color: ${C.green}; font-weight: 700; font-size: 10pt; letter-spacing: 0.04em; white-space: nowrap; }
  .role-title { color: ${C.green}; font-weight: 700; font-size: 10.5pt; margin: 0.6mm 0 2.4mm; }
  .role-body { font-size: 10pt; line-height: 1.55; }
  .awards { margin: 2.6mm 0 0; padding-left: 4mm; border-left: 2mm solid ${C.green}; }
  .award { font-size: 9.5pt; font-weight: 600; color: ${C.ink}; line-height: 1.5; }
  .tags { margin-top: 3mm; display: flex; flex-wrap: wrap; gap: 2mm; }
  .tag { font-size: 8pt; font-weight: 600; color: ${C.bodyMuted}; background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 1mm 2.6mm; letter-spacing: 0.02em; }

  /* ── Project cards ──────────────────────────────────────────────────── */
  .proj { background: ${C.paper}; border-left: 2.6mm solid ${C.green}; border-radius: 0 1mm 1mm 0; padding: 4mm 5mm 4.2mm; margin-bottom: 4mm; }
  .proj-head { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
  .proj-t { font-size: 12pt; font-weight: 800; color: ${C.ink}; }
  .proj-p { font-size: 9pt; font-weight: 600; color: ${C.green}; white-space: nowrap; }
  .proj-scale { font-size: 8.5pt; color: ${C.bodyMuted}; margin: 1mm 0 2.4mm; letter-spacing: 0.01em; }
  .proj-b { font-size: 9.8pt; line-height: 1.5; margin-bottom: 2.6mm; }
  .proj-role { font-size: 9pt; color: ${C.bodyInk}; line-height: 1.5; }
  .role-k { display: inline-block; font-size: 7.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${C.green}; margin-right: 2mm; }

  /* ── Remedial page ──────────────────────────────────────────────────── */
  .feature { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 7mm; }
  .feat-card { background: ${C.ink}; color: ${C.text}; border-radius: 1mm; padding: 4.5mm 5mm; }
  .feat-t { color: #fff; font-size: 13pt; font-weight: 800; }
  .feat-s { color: ${C.greenBright}; font-size: 8.5pt; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin: 1mm 0 2.5mm; }
  .feat-card p { color: ${C.text}; font-size: 9.3pt; line-height: 1.5; opacity: 0.92; }
  .grids .grid-h { font-weight: 800; font-size: 10pt; color: ${C.ink}; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 2mm; margin-bottom: 2.5mm; border-bottom: 0.4mm solid ${C.green}; }
  ul.addr { list-style: none; }
  ul.addr li { font-size: 9.5pt; line-height: 1.5; padding: 1.7mm 0 1.7mm 5.5mm; position: relative; border-bottom: 0.3mm solid ${C.line}; color: ${C.bodyInk}; }
  ul.addr li:last-child { border-bottom: none; }
  ul.addr li::before { content: ""; position: absolute; left: 0; top: 3.1mm; width: 2.2mm; height: 2.2mm; background: ${C.green}; border-radius: 0.4mm; }

  /* ── Cover ──────────────────────────────────────────────────────────── */
  .cover { background: ${C.ink}; }
  .cover .lineart { position: absolute; right: 0; bottom: 0; width: 165mm; height: 165mm; }
  .cover-logo { position: absolute; top: 20mm; left: 20mm; height: 15mm; }
  .cover-band { position: absolute; left: 20mm; top: 120mm; }
  .cover-band::before { content: ""; position: absolute; left: -20mm; top: 0; bottom: 0; width: 2.4mm; background: ${C.green}; }
  .cover-kicker { color: ${C.text}; font-size: 13pt; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.8; }
  .cover-name { color: #fff; font-size: 52pt; font-weight: 900; line-height: 1; margin: 4mm 0 4mm; letter-spacing: -0.015em; }
  .cover-role { color: ${C.greenBright}; font-size: 17pt; font-weight: 700; }
  .cover-tag { color: ${C.text}; font-size: 10pt; letter-spacing: 0.06em; opacity: 0.75; margin-top: 3mm; }
  .cover-foot { position: absolute; left: 20mm; right: 20mm; bottom: 20mm; display: flex; justify-content: space-between; align-items: center; color: ${C.text}; font-size: 10.5pt; border-top: 0.3mm solid #ffffff2a; padding-top: 5mm; }
  .cf-k { color: ${C.greenBright}; font-weight: 800; margin-right: 1.5mm; }

  /* ── Closing ────────────────────────────────────────────────────────── */
  .closing { background: ${C.ink}; }
  .closing .lineart { position: absolute; left: 0; top: 0; width: 160mm; height: 160mm; transform: rotate(180deg); }
  .close-logo { position: absolute; top: 22mm; right: 20mm; height: 16mm; }
  .close-band { position: absolute; left: 20mm; top: 78mm; }
  .close-band::before { content: ""; position: absolute; left: -20mm; top: 0; bottom: 0; width: 2.4mm; background: ${C.green}; }
  .close-name { color: #fff; font-size: 34pt; font-weight: 900; line-height: 1; }
  .close-role { color: ${C.greenBright}; font-size: 14pt; font-weight: 700; margin: 3mm 0 6mm; }
  .close-line { color: ${C.text}; font-size: 12pt; line-height: 1.7; }
  .close-line.dim { opacity: 0.7; font-size: 10.5pt; }
  .close-panels { position: absolute; left: 20mm; right: 20mm; bottom: 24mm; display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; border-top: 0.3mm solid #ffffff2a; padding-top: 7mm; }
  .panel-h { color: ${C.greenBright}; font-size: 9pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 3mm; }
  .panel-i { color: ${C.text}; font-size: 9.3pt; line-height: 1.45; padding: 1.4mm 0; opacity: 0.9; }
  .chips { display: flex; flex-wrap: wrap; gap: 2mm; }
  .chip { color: ${C.text}; font-size: 8.2pt; font-weight: 500; border: 0.3mm solid #ffffff33; border-radius: 1mm; padding: 1.2mm 2.6mm; }
</style></head>
<body>
${pages.join("\n")}
</body></html>`;

const out = resolve(DESIGNS_DIR, "cv-rinay-singh.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Curriculum Vitae — Rinay Singh (XNDR) → ${out}`);
