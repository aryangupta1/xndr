/**
 * ONE-OFF (ad hoc): XNDR — Capability Statement, Remedial. A4 multi-page PDF.
 *
 * A multi-section capability statement in XNDR branding with original,
 * plain-English copy and XNDR's own section headings. Not wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/capability-remedial.ts
 * Output lands in the git-ignored designs/. Photos are Unsplash (copyright-free)
 * with brand-colour fallbacks so nothing looks broken if an image doesn't load.
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

const logoLight = loadLogoOnDark(); // white wordmark, for dark surfaces
void loadLogoOnLight; // charcoal variant available if needed
const WEB = "xndr.au";

/** Unsplash image as a cover background with a brand fallback colour behind it. */
const photo = (id: string, fallback: string = C.surface, w = 1400): string =>
  `background-color:${fallback};background-image:url('https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80');background-size:cover;background-position:center;`;

/** Faint radiating line-art (SVG) for dark divider/section backgrounds. */
function lineArt(color: string, opacity = 0.18): string {
  const lines: string[] = [];
  for (let i = 0; i <= 14; i++) lines.push(`<line x1="1000" y1="1000" x2="${1000 - i * 78}" y2="0" stroke="${color}" stroke-width="1.1" opacity="${opacity}"/>`);
  for (let i = 1; i <= 10; i++) lines.push(`<line x1="1000" y1="1000" x2="0" y2="${1000 - i * 95}" stroke="${color}" stroke-width="1.1" opacity="${opacity}"/>`);
  return `<svg class="lineart" viewBox="0 0 1000 1000" preserveAspectRatio="none">${lines.join("")}</svg>`;
}

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const bullets = (items: string[], cls = "blist"): string => `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const expertise = (title: string, items: string[]): string =>
  `<div class="exp"><div class="exp-h">${esc(title)}</div>${items.map((i) => `<div class="exp-i">${esc(i)}</div>`).join("")}</div>`;
const footer = (n: number): string => `<div class="foot"><span>${WEB}</span><span>Page ${n}</span></div>`;

const pages: string[] = [];

// 1 — Cover
pages.push(`
<section class="page cover">
  <div class="cover-photo" style="${photo("photo-1504307651254-35680f356dfd", C.ink)}"></div>
  <div class="cover-veil"></div>
  <img class="cover-logo" src="${logoLight}" alt="XNDR">
  <div class="cover-band">
    <div class="cover-kicker">Capability Statement</div>
    <h1 class="cover-title">Remedial</h1>
    <div class="cover-sub">Structural · Remedial · Project Management · New South Wales</div>
  </div>
</section>`);

// 2 — Contents
const toc: [string, string, string][] = [
  ["01", "Who We Are", "03"],
  ["02", "How We Work With You", "04"],
  ["03", "One Team, Every Discipline", "05"],
  ["04", "What We Do", "06"],
  ["", "Putting Buildings Right", "07"],
  ["", "From Design to Done", "08"],
  ["", "Built for Strata", "09"],
  ["05", "Where Buildings Fail", "10"],
  ["", "Water Finds a Way", "11"],
  ["", "When Concrete Lets Go", "12"],
  ["", "Reading the Cracks", "13"],
  ["", "Trouble Beneath the Surface", "14"],
  ["", "Walls Under Pressure", "15"],
  ["06", "Why Bring Us in Early", "16"],
  ["07", "Start the Conversation", "17"],
];
pages.push(`
<section class="page contents">
  <div class="contents-photo" style="${photo("photo-1486406146926-c627a92ad1ab", C.ink)}"></div>
  <div class="contents-panel">
    <img class="panel-logo" src="${logoLight}" alt="XNDR">
    <h2 class="contents-h"><span class="bar"></span>What's Inside</h2>
    <div class="toc">
      ${toc
        .map(
          ([n, t, p]) =>
            `<div class="toc-row ${n ? "toc-main" : "toc-sub"}"><span class="toc-n">${n}</span><span class="toc-t">${esc(t)}</span><span class="toc-p">${p}</span></div>`,
        )
        .join("")}
    </div>
  </div>
  ${footer(2)}
</section>`);

// 3 — Who We Are
pages.push(`
<section class="page content">
  <div class="imghead" style="${photo("photo-1503387762-592deb58ef4e", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Who We Are</h2></div>
  </div>
  <div class="cols">
    <div class="col">
      <p class="lead">XNDR is a New South Wales engineering practice. We solve building problems, and we tell you the truth about them.</p>
    </div>
    <div class="col">
      <p>The practice grew out of years spent on site, watching building owners get handed reports they could not read and bills they did not see coming. We started XNDR to do it differently. We cover structural engineering, remedial engineering and project management ourselves, and we keep our advice clear enough that any owner or committee can act on it.</p>
      <p>We work across the strata and construction sectors throughout NSW, on everything from a single home to a multi-unit residential block. The building changes from job to job. The way we treat you does not.</p>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-n">20+</div><div class="stat-l">Projects delivered across NSW</div></div>
    <div class="stat"><div class="stat-n">15+</div><div class="stat-l">Years of combined experience</div></div>
    <div class="stat"><div class="stat-n">DBP · PE</div><div class="stat-l">Registered practitioners</div></div>
  </div>
  ${footer(3)}
</section>`);

// 4 — How We Work With You
const commitments: [string, string][] = [
  ["We listen first", "We get to know your building and the real problem before we recommend anything."],
  ["We keep it plain", "No jargon for its own sake. You get clear options and a straight recommendation."],
  ["We check our own work", "Every report is reviewed by a second engineer before it reaches you."],
  ["We stay in reach", "You deal with the same people the whole way through, and we keep you in the loop."],
  ["We back what we say", "From the first inspection to the final sign-off, our advice is ours to stand behind."],
];
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>How We Work With You</h2></div>
  <p class="lead green">We are in this for the long run. Most of our work comes from clients who call us back, and that only happens when you do right by people.</p>
  <div class="commit">
    ${commitments.map(([h, t]) => `<div class="commit-row"><div class="commit-h">${esc(h)}</div><div class="commit-t">${esc(t)}</div></div>`).join("")}
  </div>
  ${footer(4)}
</section>`);

// 5 — One Team, Every Discipline
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>One Team, Every Discipline</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Structural, remedial and project management, handled by the same people.</p>
    </div>
    <div class="col">
      <p>Most building problems do not fit neatly into one discipline. Because we hold all three in-house, we can investigate a defect, design the repair, and run the works to completion without handing you off or losing the thread along the way.</p>
      <p>Our engineers are registered under the NSW Design and Building Practitioners Act 2020 as a Design Building Practitioner and a Professional Engineer, so the designs we issue carry the declarations your project needs. We work to the Building Code of Australia and the relevant Australian Standards, and we write everything down so it holds up later.</p>
    </div>
  </div>
  ${expertise("What we cover", [
    "Remedial engineering and defect repair",
    "Structural engineering for new and existing buildings",
    "Project management and contract administration",
    "Support for strata committees and owners corporations",
    "Regulated design declarations under the DBP Act 2020",
  ])}
  ${footer(5)}
</section>`);

// 6 — What We Do (divider)
pages.push(`
<section class="page divider">
  ${lineArt(C.greenBright)}
  <img class="head-logo" src="${logoLight}" alt="XNDR">
  <div class="divider-title"><span class="bar"></span><h1>What<br>We Do</h1></div>
  ${footer(6)}
</section>`);

// 7 — Putting Buildings Right (Remedial)
pages.push(`
<section class="page content">
  <div class="imghead" style="${photo("photo-1581092160562-40aa08e78837", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Putting Buildings Right</h2></div>
  </div>
  <div class="cols-3">
    <div class="col">
      <p class="lead green">Remedial engineering is the work of finding out what has gone wrong in a building and putting it right.</p>
    </div>
    <div class="col">
      <p>Existing buildings are our specialty. We chase the cause, not the symptom, because a patch over a hidden problem just means paying for the same repair twice.</p>
      <p>We inspect, test where it is justified, and write a scope of works a builder can actually price and build to. Then we stay on through construction so what gets built matches what we designed.</p>
    </div>
    <div class="col">
      ${expertise("What this involves", [
        "Condition assessments of buildings and structures",
        "Site investigations and invasive testing",
        "Concept and detailed remedial design",
        "Specifications and scopes of work for tender",
        "Running the tender and reviewing the bids",
        "Inspections and quality checks on site",
        "Due diligence and gap analysis reports",
      ])}
    </div>
  </div>
  ${footer(7)}
</section>`);

// 8 — From Design to Done (Structural & PM)
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>From Design to Done</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Structural advice you can build on, for new work and old.</p>
      <p>From a single footing to a full assessment of an ageing structure, we design, certify, and investigate why something is not holding up the way it should.</p>
      ${expertise("Structural work", [
        "Assessment of existing structures",
        "Design for new work and alterations",
        "Footings, slabs, steel and concrete",
        "Structural certification",
        "Failure and defect investigation",
      ])}
    </div>
    <div class="col">
      <p class="lead green">We run remedial and construction projects from the first idea to the final handover.</p>
      <p>Our project work keeps the program moving and the scope honest, so owners always know what they are paying for and why.</p>
      ${expertise("Project work", [
        "Planning and feasibility",
        "Scope development and documentation",
        "Tender management and assessment",
        "Contract administration and superintendent duties",
        "Council and approval pathways",
        "Commissioning and the defects period",
      ])}
    </div>
  </div>
  ${footer(8)}
</section>`);

// 9 — Built for Strata
pages.push(`
<section class="page content">
  <div class="imghead" style="${photo("photo-1545324418-cc1a3fa10c00", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Built for Strata</h2></div>
  </div>
  <div class="cols">
    <div class="col">
      <p class="lead green">We know what lands on a strata manager's desk.</p>
    </div>
    <div class="col">
      <p>Keeping a building right for every owner is a hard job, usually with a budget and a deadline attached. We make it easier by giving committees and managers advice that is clear and ranked, so the urgent work is obvious and the rest can be planned for.</p>
      <p>Everything is documented, so decisions are easy to explain at a meeting and easy to defend later. We work with your strata manager, not over the top of them. The payoff is fewer surprises, levies that go further, and buildings that stay safe and usable.</p>
    </div>
  </div>
  ${footer(9)}
</section>`);

// 10 — Where Buildings Fail (divider)
pages.push(`
<section class="page divider">
  ${lineArt(C.greenBright)}
  <img class="head-logo" src="${logoLight}" alt="XNDR">
  <div class="divider-title"><span class="bar"></span><h1>Where<br>Buildings Fail</h1></div>
  ${footer(10)}
</section>`);

function defectPage(opts: { title: string; n: number; intro: string; body: string[]; listTitle: string; list: string[]; helpTitle: string; help: string[]; did?: string }): string {
  return `
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>${esc(opts.title)}</h2></div>
  <div class="cols-3">
    <div class="col">
      <p class="lead green">${esc(opts.intro)}</p>
      ${opts.body.map((b) => `<p>${esc(b)}</p>`).join("")}
    </div>
    <div class="col">
      <div class="signs-h">${esc(opts.listTitle)}</div>
      ${bullets(opts.list, "glist")}
    </div>
    <div class="col">
      <div class="callout"><div class="callout-h">${esc(opts.helpTitle)}</div>${opts.help.map((h) => `<p>${esc(h)}</p>`).join("")}</div>
      ${opts.did ? `<div class="didbox"><div class="did-h">Worth knowing</div><p>${esc(opts.did)}</p></div>` : ""}
    </div>
  </div>
  ${footer(opts.n)}
</section>`;
}

// 11 — Water Finds a Way
pages.push(
  defectPage({
    title: "Water Finds a Way",
    n: 11,
    intro: "Waterproofing is the barrier that keeps water out of the structure. When it gives way, water gets in quietly and the damage builds before anyone notices.",
    body: [
      "Membranes protect wet areas, balconies, planter boxes, retaining walls, podium slabs, lift pits and roofs. A good system also drains water away instead of letting it sit.",
      "By the time a stain shows up on a ceiling, water has usually been getting in for a while.",
    ],
    listTitle: "Signs it has failed",
    list: ["Water staining or pooling", "Efflorescence, the white salt residue", "Damp that will not dry out", "Mould and a musty smell"],
    helpTitle: "How we sort it",
    help: [
      "We inspect the affected areas, read any old drawings and past repairs, and where the source is not obvious we run targeted water testing to track it down.",
      "Then we write a scope that fixes the cause, not just the mark it left behind.",
    ],
    did: "Water getting in is one of the most common and most costly defects reported across NSW strata buildings.",
  }),
);

// 12 — When Concrete Lets Go
pages.push(
  defectPage({
    title: "When Concrete Lets Go",
    n: 12,
    intro: "Spalling is what happens when the face of the concrete breaks away and exposes the steel reinforcement inside.",
    body: [
      "Once that steel starts to rust it swells, sometimes to several times its original size. The pressure cracks and pushes off the surrounding concrete, which lets in more water and makes the whole thing accelerate.",
      "Ignored long enough, a rust stain turns into a structural repair.",
    ],
    listTitle: "What to watch for",
    list: ["Concrete flaking or cracking", "Rust stains bleeding through", "Pieces that have come away", "Leaks showing up in roofs or walls"],
    helpTitle: "How we sort it",
    help: [
      "We assess the affected areas, decide whether deeper investigation is needed, and work out how far the repair really goes.",
      "From there we set a repair method, take the scope to tender and manage the works to the end.",
    ],
  }),
);

// 13 — Reading the Cracks
pages.push(
  defectPage({
    title: "Reading the Cracks",
    n: 13,
    intro: "Every building moves. A crack appears when something cannot move with it.",
    body: [
      "A bit of cracking is normal, and we actually design concrete to crack within limits. The real question is always the same: is this crack structural or not.",
      "Structural cracks can affect safety and durability and need to be dealt with. Non-structural cracks are usually cosmetic, but leave them open and they let in the water that corrodes the steel over time.",
    ],
    listTitle: "Types we see",
    list: ["Drying shrinkage and crazing", "Restraint and thermal cracking", "Plastic shrinkage and settlement", "Movement and overload cracking", "Settlement cracking"],
    helpTitle: "How we sort it",
    help: [
      "Only a site inspection by a qualified engineer can tell you which kind of crack you have. We record where it is, how wide and long, which way it runs and what it passes through.",
      "Then we work out what it means for the structure and recommend the fix. The earlier a crack is dealt with, the cheaper it stays.",
    ],
  }),
);

// 14 — Trouble Beneath the Surface (Cladding & Magnesite)
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Trouble Beneath the Surface</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">A cladding job is almost never just about the cladding.</p>
      <p>In our experience the real trouble sits behind it, in how the wall was put together. Cladding does a structural job and a weatherproofing job, and when we open up a failure we nearly always find problems in the substrate and the detailing too.</p>
      ${expertise("What we find behind cladding", [
        "Not enough structural capacity",
        "Weatherproofing and flashing failures",
        "Combustible materials",
        "Concrete spalling and substrate damage",
        "Failures where cladding meets the facade",
      ])}
    </div>
    <div class="col">
      <p class="lead green">Magnesite is the problem hiding under older floors.</p>
      <p>It was laid through the 1960s and 1970s to level slabs and quieten the floors between units. Magnesite carries a lot of chloride, and the moment it gets wet that chloride soaks into the slab and goes straight for the steel.</p>
      <p>The corrosion is slow and out of sight, so by the time the tiles sound hollow or the floor feels uneven, the damage is usually well along. It tends to turn up near balcony doors and wet areas where the waterproofing has already failed. It is not something to leave alone.</p>
    </div>
  </div>
  ${footer(14)}
</section>`);

// 15 — Walls Under Pressure (Masonry & Retaining)
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Walls Under Pressure</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Brickwork is strong when it is squeezed and weak when it is pulled, so over time it cracks and wears.</p>
      <p>Brick and block show up in loadbearing walls, facades, retaining walls and outbuildings. They are tough and fire resistant, but they do not like movement, and they do not like the salts that travel in air and groundwater.</p>
      ${expertise("Common masonry faults", ["Settlement, restraint and thermal cracking", "Water getting in", "Fretting and delamination", "Efflorescence"])}
      <p class="note">We fix these with repointing, crack stitching, and pinning or rebuilding.</p>
    </div>
    <div class="col">
      <p class="lead green">A retaining wall holds back soil between two levels, and that is real load.</p>
      <p>When the drainage stops working, or the wall was never built for the job it is doing, you get movement, leaning and sometimes collapse. Boundary walls are often a shared responsibility, which is exactly why early advice pays off.</p>
      ${expertise("Where they go wrong", ["Built without adequate design", "Water pressure from blocked drainage", "Tree roots and growth"])}
      <p class="note">We fix these with back-of-wall drainage, strengthening, deloading, or rebuilding to a wall that complies.</p>
    </div>
  </div>
  ${footer(15)}
</section>`);

// 16 — Why Bring Us in Early (Benefits)
const benefits: [string, string][] = [
  ["Advice that is actually independent", "We work for the building and its owners, never the contractor, so the advice you get is honest."],
  ["We fix the cause", "Treating the root of a defect means a repair that lasts, not one you pay for again next year."],
  ["Clear priorities", "We tell you what has to happen now and what can wait, and we say why."],
  ["Records you can rely on", "Clear, honest documentation that keeps its value if a question or dispute comes up later."],
  ["Value over the long run", "Maintenance planning, inspections and repair advice that protect the building for years, not months."],
];
pages.push(`
<section class="page content">
  <div class="imghead tall" style="${photo("photo-1521737604893-d14cc237f11d", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Why Bring Us<br>in Early</h2></div>
  </div>
  <p class="lead green tight">The earlier you bring an engineer in, the more time, money and stress you save. That holds for owners, committees and strata managers alike.</p>
  <div class="benefits">
    ${benefits.map(([h, t]) => `<div class="ben"><div class="ben-h">${esc(h)}</div><div class="ben-t">${esc(t)}</div></div>`).join("")}
  </div>
  ${footer(16)}
</section>`);

// 17 — Start the Conversation (Contact)
pages.push(`
<section class="page contact">
  <div class="contact-photo" style="${photo("photo-1431576901776-e539bd916ba2", C.ink)}"></div>
  <img class="contact-logo" src="${logoLight}" alt="XNDR">
  <div class="contact-band"><span class="bar"></span><h1>Start the Conversation</h1></div>
  <div class="contact-cards">
    <div class="ccard">
      <div class="cc-name">Rinay Singh</div>
      <div class="cc-role">Senior Remedial Engineer</div>
      <div class="cc-line">E&nbsp;&nbsp;${esc(practice.email)}</div>
      <div class="cc-line">M&nbsp;&nbsp;${esc(practice.phone)}</div>
    </div>
    <div class="ccard">
      <div class="cc-name">${esc(practice.name)}</div>
      <div class="cc-role">${esc(practice.tagline)}</div>
      <div class="cc-line">${esc(practice.region)}</div>
      <div class="cc-line">${WEB}</div>
    </div>
  </div>
</section>`);

// ── Document ───────────────────────────────────────────────────────────────────
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
  h1, h2 { letter-spacing: -0.01em; line-height: 1.05; }
  p { font-size: 10.5pt; line-height: 1.6; color: ${C.bodyInk}; margin-bottom: 3mm; }
  .lead { font-size: 15pt; font-weight: 700; line-height: 1.3; color: ${C.bodyInk}; margin-bottom: 4mm; }
  .lead.green { color: ${C.green}; }
  .lead.tight { margin: 6mm 16mm 2mm; }
  .note { font-size: 9.5pt; color: ${C.bodyMuted}; }

  .foot { position: absolute; bottom: 0; left: 0; right: 0; height: 12mm; background: ${C.ink}; color: ${C.muted}; display: flex; align-items: center; justify-content: space-between; padding: 0 16mm; font-size: 8pt; letter-spacing: 0.04em; }
  .foot span:first-child { color: ${C.greenBright}; font-weight: 600; }

  /* Cover */
  .cover-photo { position: absolute; inset: 0; }
  .cover-veil { position: absolute; inset: 0; background: linear-gradient(115deg, ${C.ink} 0%, ${C.ink}cc 38%, ${C.ink}33 60%, transparent 78%); }
  .cover-logo { position: absolute; top: 16mm; right: 16mm; height: 16mm; }
  .cover-band { position: absolute; left: 0; top: 92mm; padding: 8mm 16mm; }
  .cover-band::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2mm; background: ${C.green}; }
  .cover-kicker { color: #fff; font-size: 20pt; font-weight: 700; opacity: 0.92; }
  .cover-title { color: ${C.greenBright}; font-size: 52pt; font-weight: 900; margin: 1mm 0 4mm; }
  .cover-sub { color: ${C.text}; font-size: 9.5pt; letter-spacing: 0.06em; opacity: 0.85; }

  /* Contents */
  .contents { background: ${C.ink}; }
  .contents-photo { position: absolute; left: 0; top: 0; bottom: 0; width: 40%; opacity: 0.5; }
  .contents-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, ${C.ink}); }
  .contents-panel { position: absolute; right: 0; top: 0; width: 60%; height: 100%; padding: 28mm 16mm; }
  .panel-logo, .head-logo { height: 11mm; }
  .contents-h { color: #fff; font-size: 30pt; font-weight: 800; margin: 14mm 0 8mm; }
  .toc-row { display: flex; align-items: baseline; padding: 2.6mm 0; border-bottom: 0.3mm solid #ffffff1f; }
  .toc-n { color: ${C.greenBright}; font-weight: 800; width: 12mm; font-size: 11pt; }
  .toc-t { color: ${C.text}; flex: 1; font-size: 11pt; }
  .toc-p { color: ${C.muted}; font-size: 9pt; }
  .toc-main .toc-t { font-weight: 700; }
  .toc-sub .toc-t { color: ${C.muted}; font-size: 9.5pt; padding-left: 12mm; }
  .toc-sub { border-bottom: 0.3mm solid #ffffff12; padding: 1.6mm 0; }

  /* Content pages */
  .content, .plain { padding-bottom: 12mm; }
  .plain { padding: 22mm 16mm 12mm; }
  .imghead { position: relative; height: 92mm; }
  .imghead.tall { height: 86mm; }
  .imghead::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, ${C.ink}55 0%, transparent 30%, ${C.ink}aa 100%); }
  .head-logo { position: absolute; top: 12mm; right: 16mm; z-index: 2; }
  .imghead-title { position: absolute; left: 16mm; bottom: 8mm; z-index: 2; }
  .imghead-title h2 { display: inline; color: #fff; font-size: 26pt; font-weight: 800; }
  .imghead-title .bar { height: 1.1em; }
  .sec-title { margin-bottom: 7mm; }
  .sec-title h2 { display: inline; color: ${C.ink}; font-size: 26pt; font-weight: 800; }

  .cols, .cols-3 { display: grid; gap: 9mm; padding: 9mm 16mm 0; }
  .cols { grid-template-columns: 1fr 1fr; }
  .cols-3 { grid-template-columns: 1.05fr 0.9fr 1.05fr; gap: 7mm; }
  .plain .cols, .plain .cols-3 { padding: 0; }

  .stats { display: flex; gap: 6mm; padding: 10mm 16mm 0; }
  .stat { flex: 1; background: ${C.paper}; border-left: 2.4mm solid ${C.green}; padding: 5mm; }
  .stat-n { font-size: 26pt; font-weight: 900; color: ${C.ink}; line-height: 1; }
  .stat-l { font-size: 9pt; color: ${C.bodyMuted}; margin-top: 2mm; }

  .exp { background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 4mm 5mm; }
  .exp-h { font-weight: 800; font-size: 10pt; color: ${C.ink}; margin-bottom: 2mm; }
  .exp-i { font-size: 9pt; color: ${C.bodyInk}; padding: 2mm 0; border-top: 0.3mm solid ${C.line}; }
  .exp-i:first-of-type { border-top: none; }

  .blist, .glist { list-style: none; }
  .blist li, .glist li { font-size: 9.5pt; line-height: 1.5; padding-left: 6mm; position: relative; margin-bottom: 2.4mm; color: ${C.bodyInk}; }
  .blist li::before { content: "▸"; position: absolute; left: 0; color: ${C.green}; font-weight: 700; }
  .glist li::before { content: ""; position: absolute; left: 0; top: 2mm; width: 2.4mm; height: 2.4mm; background: ${C.green}; border-radius: 0.4mm; }
  .signs-h { color: ${C.green}; font-weight: 800; font-size: 13pt; margin-bottom: 4mm; line-height: 1.2; }

  .callout { background: ${C.ink}; color: ${C.text}; border-radius: 1mm; padding: 4mm 5mm; margin-bottom: 5mm; }
  .callout-h { color: #fff; font-weight: 800; font-size: 11pt; margin-bottom: 2mm; }
  .callout p { color: ${C.text}; font-size: 9pt; line-height: 1.5; margin-bottom: 2mm; }
  .didbox { background: ${C.paper}; border-left: 2.4mm solid ${C.green}; padding: 4mm 5mm; }
  .did-h { color: ${C.green}; font-weight: 800; font-size: 8.5pt; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2mm; }
  .didbox p { font-size: 9.5pt; font-weight: 600; color: ${C.ink}; margin: 0; }

  .commit { margin-top: 4mm; }
  .commit-row { display: grid; grid-template-columns: 48mm 1fr; gap: 6mm; padding: 5mm 0; border-top: 0.3mm solid ${C.line}; }
  .commit-h { font-weight: 800; font-size: 12pt; color: ${C.green}; }
  .commit-t { font-size: 10.5pt; line-height: 1.55; color: ${C.bodyInk}; }

  .benefits { padding: 4mm 16mm 0; }
  .ben { display: grid; grid-template-columns: 60mm 1fr; gap: 6mm; padding: 4.5mm 0; border-top: 0.3mm solid ${C.line}; }
  .ben-h { font-weight: 800; font-size: 11.5pt; color: ${C.green}; }
  .ben-t { font-size: 10pt; line-height: 1.55; color: ${C.bodyInk}; }

  .divider { background: ${C.ink}; }
  .lineart { position: absolute; right: 0; bottom: 0; width: 150mm; height: 150mm; }
  .divider .head-logo { position: absolute; top: 16mm; right: 16mm; }
  .divider-title { position: absolute; left: 16mm; top: 120mm; }
  .divider-title h1 { display: inline; color: #fff; font-size: 46pt; font-weight: 900; }
  .divider-title .bar { width: 3mm; height: 1.05em; vertical-align: 0.02em; }

  .contact { background: ${C.ink}; }
  .contact-photo { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; }
  .contact-photo::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, ${C.ink}, ${C.ink}66 40%, transparent); }
  .contact-logo { position: absolute; top: 18mm; right: 16mm; height: 18mm; }
  .contact-band { position: absolute; left: 0; top: 64mm; padding-left: 16mm; }
  .contact-band h1 { display: inline; color: #fff; font-size: 34pt; font-weight: 900; }
  .contact-band .bar { width: 3mm; height: 1.05em; }
  .contact-cards { position: absolute; top: 92mm; left: 16mm; right: 16mm; display: flex; gap: 14mm; }
  .cc-name { color: #fff; font-size: 16pt; font-weight: 800; }
  .cc-role { color: ${C.greenBright}; font-size: 10pt; margin: 1.5mm 0 4mm; font-weight: 600; }
  .cc-line { color: ${C.text}; font-size: 10.5pt; line-height: 1.7; }
</style></head>
<body>
${pages.join("\n")}
</body></html>`;

const out = resolve(DESIGNS_DIR, "capability-statement-remedial.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Capability Statement (Remedial) → ${out}`);
