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
  // "More branded green": the muted olive brand green (#6B9243) read as grey in
  // print, so the primary accent here is the site's vivid green-bright (#82AD55),
  // with an extra-bright variant reserved for text on the dark surfaces.
  green: "#82AD55",
  greenBright: "#93C267",
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
  `<div class="foot"><span>XNDR Consulting</span><span>${n}</span></div>`;

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
function projectCard(p: { title: string; place: string; scale?: string; body: string; role: string[]; value?: string }): string {
  return `<div class="proj">
    <div class="proj-head">
      <div class="proj-t">${esc(p.title)}</div>
      <div class="proj-meta">
        <div class="proj-p">${esc(p.place)}</div>
        ${p.value ? `<div class="proj-val">${esc(p.value)}</div>` : ""}
      </div>
    </div>
    ${p.scale ? `<div class="proj-scale">${esc(p.scale)}</div>` : ""}
    <p class="proj-b">${esc(p.body)}</p>
    <div class="proj-scope">${p.role.map(esc).join('<span class="pmid">·</span>')}</div>
  </div>`;
}

/** Light-page licence chips (dark ink on paper). */
const licChips = (items: string[]): string =>
  `<div class="lic-chips">${items.map((i) => `<span class="lchip">${esc(i)}</span>`).join("")}</div>`;

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
  <div class="two">
    ${listBlock("Education", [
      "<b>Master of Engineering (Structural)</b><br>The University of Melbourne, 2015",
      "<b>Bachelor of Engineering (Civil), Honours</b><br>The University of Melbourne, 2013",
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
  ${footer(pages.length + 1)}
</section>`);

// ── 3 — Experience ───────────────────────────────────────────────────────────
type Role = { org: string; place: string; dates: string; title: string; body: string; tags: string[]; awards?: string[] };
const roles: Role[] = [
  {
    org: "XNDR Consulting",
    place: "Sydney",
    dates: "Present",
    title: "Director",
    body: "As Director of Structural and Remedial Engineering at XNDR, my core focus is solving complex building issues—figuring out why a structure is failing, designing the fix, and seeing the project through to handover. I work side-by-side with owners, strata managers, and trades from first inspection through tender and construction. Our work covers everything from concrete spalling, waterproofing, and corrosion protection to façade remediation and structural re-strengthening.",
    tags: ["Remedial", "Structural", "Project management"],
  },
  {
    org: "Partridge Engineers",
    place: "Sydney",
    dates: "2024 – 2026",
    title: "Associate / Team Leader · Senior Remedial Engineer",
    body: "As Associate and team leader, I ran the remedial group across residential and commercial buildings in Sydney — scoping and pricing the repairs, managing tenders, and leading the works on site through to handover. Much of it was strata: waterproofing, spalling and concrete repair, façades and corrosion protection.",
    tags: ["Remedial", "Strata", "Team leadership"],
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
    dates: "2021 – 2022",
    title: "Structural Design Engineer",
    body: "Designed and delivered structures on major education and mixed-use projects, from concept through to construction — checking conventional and post-tensioned reinforcement on site, holding workmanship to standard, and resolving engineering issues as they came up.",
    tags: ["Concept to construction", "PT & reinforced concrete"],
  },
  {
    org: "Cardno",
    place: "St Leonards, Sydney",
    dates: "2014 – 2021",
    title: "Structural Engineer",
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
  ${footer(pages.length + 1)}
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
    title: "5 Skyline Place",
    place: "Frenchs Forest, NSW",
    scale: "Five-storey mixed-use apartments · cafés, medical & retail · two basement levels",
    body: "Five storeys of mixed-use apartments over cafés, medical suites and retail, with two levels of underground parking.",
    role: ["Design and construction management", "Reinforcement and post-tensioning inspection", "Workmanship checks and RFIs"],
  })}
  ${footer(pages.length + 1)}
</section>`);

// ── 4b — Selected Projects · Remedial detail (added after 5 Skyline Place) ────
// Detailed remedial project cards. Paginated 3 then 4 per page — the header and
// intro on the first page leave room for three; continuation pages hold four.
type RProj = { title: string; place: string; scale: string; body: string; role: string[]; value?: string };
const remedialDetail: RProj[] = [
  {
    title: "1 Boronia Street",
    place: "Kensington, NSW",
    value: "approx $4M",
    scale: "Multi-storey residential complex · Structural roof reconstruction & envelope remediation",
    body: "A comprehensive structural and waterproofing overhaul featuring full design and construction of new timber and steel roof structures, structural timber framing, and complete roof replacement. Works also encompassed extensive balcony and courtyard membrane replacements, cavity flashing upgrades, wall capping details, and concrete spalling repairs across the building envelope.",
    role: ["Design and construction management", "New roof structural design & framing", "Waterproofing & cavity flashing specifications", "Site inspections & contractor superintendent"],
  },
  {
    title: "60 Walker Street",
    place: "Rhodes, NSW",
    value: "approx $2M",
    scale: "High-density residential development · Structural remediation & podium waterproofing",
    body: "Full-scale remedial investigation and rectification addressing systemic water ingress and structural deterioration. Major works included balcony membrane replacements, elevated courtyard slab waterproofing, perimeter cavity flashing reinstatement, and parapet coping capping upgrades across all elevations.",
    role: ["Diagnostic site investigations", "Remedial design package & scope of works", "Contractor tender management", "Quality assurance & handover"],
  },
  {
    title: "49 Spencer Street",
    place: "Rose Bay, NSW",
    value: "approx $200k",
    scale: "Luxury harbourfront residential apartments · Coastal concrete repair & façade protection",
    body: "Targeted façade and waterproofing renewal in an aggressive coastal environment. Included concrete spalling repairs, installation of high-durability liquid membrane systems to exposed balconies, replacement of damaged cavity flashings, and custom aluminium parapet capping works.",
    role: ["Concrete repair methodology & durability design", "Waterproofing inspection & sign-off", "Strata committee liaison", "Superintendent duties"],
  },
  {
    title: "22 Hardy Street",
    place: "North Bondi, NSW",
    value: "approx $200k",
    scale: "Multi-level strata block · Courtyard renewal & building envelope waterproofing",
    body: "Extensive building envelope remediation focused on resolving persistent damp and water penetration. Scope covered deep-slab courtyard waterproofing, complete balcony floor re-sheeting and tile re-laying, sub-floor drainage installation, retrofitting lost cavity flashings, and wall capping repairs.",
    role: ["Forensic water ingress assessment", "Detailed design & specification", "Site engineering oversight", "Trade management & progress certifications"],
  },
  {
    title: "315 Bondi Road",
    place: "Bondi Beach, NSW",
    value: "approx $2.5M",
    scale: "Mixed-use commercial & residential block · Façade remediation & structural repair",
    body: "Complex urban remedial scheme involving major concrete patch repairs to exposed cantilevered balconies, re-waterproofing of private outdoor courtyards, replacement of compromised masonry cavity flashings, and parapet capping installation.",
    role: ["Structural defect diagnostics", "Full tender documentation", "Contractor superintendency", "Managing variations, RFIs and final handovers"],
  },
  {
    title: "33–35 Kentwell Road",
    place: "Allambie Heights, NSW",
    value: "approx $2.4M",
    scale: "Residential strata community · Comprehensive waterproofing & masonry rectification",
    body: "Site-wide remedial upgrade across multiple residential blocks. Rectification works included multi-balcony membrane replacements, common-area courtyard waterproofing, brickwork cavity flashing integration, parapet wall capping works, and structural steel corrosion treatment.",
    role: ["Remedial engineering superintendency", "Quality control inspections", "Budget management & payment milestone sign-offs"],
  },
  {
    title: "570 Liverpool Road",
    place: "Strathfield, NSW",
    value: "approx $3M",
    scale: "Multi-storey residential development · Structural strengthening & façade waterproofing",
    body: "Integrated structural repair and waterproofing campaign. Scope included concrete spalling treatment on structural beams and slab edges, balcony re-waterproofing, installation of new perimeter cavity flashings, and coping capping sheet replacement.",
    role: ["Structural design & strengthening details", "Remedial scope preparation", "On-site engineering support & RFIs"],
  },
  {
    title: "557 Mowbray Road",
    place: "Lane Cove, NSW",
    value: "approx $1.5M",
    scale: "Established residential apartment complex · Courtyard, balcony & parapet remediation",
    body: "Major remediation addressing extensive water leakage into lower-level garages and living areas. Key works involved complete removal and re-installation of courtyard and balcony waterproofing systems, replacement of defective cavity flashings, and custom metal parapet capping installation.",
    role: ["Leak investigation & water testing", "Technical specification & detail drawings", "Superintendency & progress management"],
  },
  {
    title: "15 Denham Street",
    place: "Bondi, NSW",
    value: "approx $2.4M",
    scale: "Coastal apartment building · Magnesite removal, concrete spalling repair & balcony remediation",
    body: "Extensive structural and building envelope remediation focused on severe magnesite attack and coastal concrete deterioration. Works included full stripping and removal of corrosive magnesite flooring, concrete slab repairs, structural spalling treatment, complete balcony membrane waterproofing and retiling, cavity flashing replacement, and parapet wall capping works.",
    role: ["Structural & spalling defect diagnostics", "Magnesite repair methodology & design", "Contract administration", "Quality control inspections & handover sign-off"],
  },
  {
    title: "92 Hunter Street",
    place: "Hornsby, NSW",
    value: "approx $500k",
    scale: "Commercial / residential multi-unit site · Podium & courtyard remediation",
    body: "Large-scale remedial project covering elevated podium and courtyard waterproofing over basements, balcony membrane re-application, masonry cavity flashing upgrades, coping capping works, and structural steel protective coating application.",
    role: ["Lead remedial design engineer", "Construction administration & superintendent", "RFI management & compliance sign-offs"],
  },
  {
    title: "99 Alfred Street",
    place: "Narraweena, NSW",
    value: "approx $800k",
    scale: "Residential apartment block · Balcony & envelope structural remediation",
    body: "Comprehensive waterproofing and structural repair program. Works included balcony waterproofing membrane overhaul, installation of new cavity flashings, wall capping works, and concrete spalling repairs across all building elevations.",
    role: ["Design & engineering management", "Waterproofing & flashing details", "Site superintendent & client reporting"],
  },
];
const rpChunks: RProj[][] = [remedialDetail.slice(0, 3)];
for (let i = 3; i < remedialDetail.length; i += 4) rpChunks.push(remedialDetail.slice(i, i + 4));
rpChunks.forEach((chunk, pi) => {
  const head =
    pi === 0
      ? `<div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2></div>
  <div class="sec-eyebrow">Remedial &amp; Structural Repair</div>
  <p class="lead sm">Across NSW strata and commercial buildings: structural repair, waterproofing and membrane renewal, concrete spalling, cavity flashings, parapet capping and façade protection — carried from first inspection through tender and into construction.</p>`
      : `<div class="cont-head"><span class="bar sm"></span><span class="cont-t">Remedial &amp; Structural Repair</span></div>`;
  pages.push(`
<section class="page content">
  <img class="head-logo light" src="${logoOnLight}" alt="XNDR">
  ${head}
  ${chunk.map(projectCard).join("")}
  ${footer(pages.length + 1)}
</section>`);
});

// ── 5 — Remedial portfolio at a glance ───────────────────────────────────────
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
  <div class="sec-title"><span class="bar"></span><h2>Remedial Portfolio</h2></div>
  <div class="sec-eyebrow">At a Glance</div>
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
  <div class="licences">
    <div class="grid-h">Site Licences</div>
    ${licChips(["Construction White Card", "Confined Space & Rescue", "Elevated Work Platform (EWP)", "Working at Heights", "Rail Industry Worker (RIW)", "Australian Driver Licence"])}
  </div>
  ${footer(pages.length + 1)}
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
  /* logo-light.png's left chevron is a dark olive; lift it to the vivid brand
     green. The charcoal wordmark/right chevron are near-desaturated so saturate()
     barely touches them, and the brightness bump leaves them a legible dark. */
  .head-logo.light { position: absolute; top: 15mm; right: 18mm; height: 8mm; filter: saturate(2) brightness(1.5); }
  .sec-title h2 { display: inline; color: ${C.ink}; font-size: 25pt; font-weight: 800; vertical-align: middle; }
  .sec-title { margin-bottom: 6mm; }
  .sec-eyebrow { color: ${C.green}; font-weight: 800; font-size: 10pt; letter-spacing: 0.14em; text-transform: uppercase; margin: -3mm 0 5mm 6.1mm; }
  /* Continuation header for multi-page project sections */
  .cont-head { display: flex; align-items: center; gap: 3mm; font-size: 11pt; margin-bottom: 6mm; padding-bottom: 3mm; border-bottom: 0.4mm solid ${C.line}; }
  .cont-t { color: ${C.green}; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .sec-sub { margin: 9mm 0 4mm; }
  .sec-sub h3 { display: inline; color: ${C.ink}; font-size: 15pt; font-weight: 800; vertical-align: middle; }

  .lead { font-size: 12.5pt; font-weight: 600; line-height: 1.5; color: ${C.bodyInk}; margin-bottom: 6mm; }
  .lead.sm { font-size: 11pt; font-weight: 500; color: ${C.bodyMuted}; margin-bottom: 6mm; }

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
  .role { padding: 3.6mm 0 3.8mm; border-top: 0.3mm solid ${C.line}; }
  .role:first-child { border-top: none; padding-top: 0.5mm; }
  .role-top { display: flex; justify-content: space-between; align-items: baseline; }
  .role-org { font-size: 12.5pt; font-weight: 800; color: ${C.ink}; }
  .role-place { color: ${C.bodyMuted}; font-weight: 500; font-size: 10.5pt; }
  .role-dates { color: ${C.green}; font-weight: 700; font-size: 10pt; letter-spacing: 0.04em; white-space: nowrap; }
  .role-title { color: ${C.green}; font-weight: 700; font-size: 10.5pt; margin: 0.4mm 0 1.8mm; }
  .role-body { font-size: 9.6pt; line-height: 1.48; }
  .awards { margin: 2.2mm 0 0; padding-left: 4mm; border-left: 2mm solid ${C.green}; }
  .award { font-size: 9.2pt; font-weight: 600; color: ${C.ink}; line-height: 1.45; }
  .tags { margin-top: 2.4mm; display: flex; flex-wrap: wrap; gap: 2mm; }
  .tag { font-size: 8pt; font-weight: 600; color: ${C.bodyMuted}; background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 1mm 2.6mm; letter-spacing: 0.02em; }

  /* ── Project cards ──────────────────────────────────────────────────── */
  .proj { background: ${C.paper}; border-left: 2.6mm solid ${C.green}; border-radius: 0 1mm 1mm 0; padding: 4mm 5mm 4.2mm; margin-bottom: 4mm; }
  .proj-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 4mm; }
  .proj-t { font-size: 12pt; font-weight: 800; color: ${C.ink}; }
  .proj-meta { text-align: right; flex: none; }
  .proj-p { font-size: 9pt; font-weight: 600; color: ${C.green}; white-space: nowrap; }
  .proj-val { font-size: 9.5pt; font-weight: 800; color: ${C.ink}; white-space: nowrap; margin-top: 0.8mm; }
  .proj-scale { font-size: 8.5pt; color: ${C.bodyMuted}; margin: 1mm 0 2.4mm; letter-spacing: 0.01em; }
  .proj-b { font-size: 9.8pt; line-height: 1.5; margin-bottom: 2.6mm; }
  /* Engagement scope — an integrated services line (no label), a hairline off the
     description with brand-green separators between the services. */
  .proj-scope { margin-top: 2.6mm; padding-top: 2.4mm; border-top: 0.3mm solid ${C.line}; font-size: 8.9pt; color: ${C.bodyMuted}; line-height: 1.55; }
  .pmid { color: ${C.green}; margin: 0 1.5mm; font-weight: 700; }

  /* ── Remedial page ──────────────────────────────────────────────────── */
  .feature { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 7mm; }
  .feat-card { background: ${C.ink}; color: ${C.text}; border-radius: 1mm; padding: 4.5mm 5mm; }
  .feat-t { color: #fff; font-size: 13pt; font-weight: 800; }
  .feat-s { color: ${C.greenBright}; font-size: 8.5pt; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin: 1mm 0 2.5mm; }
  .feat-card p { color: ${C.text}; font-size: 9.3pt; line-height: 1.5; opacity: 0.92; }
  .grid-h { font-weight: 800; font-size: 10pt; color: ${C.ink}; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 2mm; margin-bottom: 2.5mm; border-bottom: 0.4mm solid ${C.green}; }
  ul.addr { list-style: none; }
  ul.addr li { font-size: 9.5pt; line-height: 1.5; padding: 1.7mm 0 1.7mm 5.5mm; position: relative; border-bottom: 0.3mm solid ${C.line}; color: ${C.bodyInk}; }
  ul.addr li:last-child { border-bottom: none; }
  ul.addr li::before { content: ""; position: absolute; left: 0; top: 3.1mm; width: 2.2mm; height: 2.2mm; background: ${C.green}; border-radius: 0.4mm; }
  .licences { margin-top: 9mm; }
  .lic-chips { display: flex; flex-wrap: wrap; gap: 2mm; margin-top: 3mm; }
  .lchip { font-size: 8.5pt; font-weight: 600; color: ${C.bodyInk}; background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 1.4mm 3mm; }

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
</style></head>
<body>
${pages.join("\n")}
</body></html>`;

const out = resolve(DESIGNS_DIR, "cv-rinay-singh.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Curriculum Vitae — Rinay Singh (XNDR) → ${out}`);
