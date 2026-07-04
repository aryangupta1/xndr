/**
 * ONE-OFF (ad hoc): XNDR — Capability Statement, Infrastructure Remediation.
 * A4 multi-page PDF. Not wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/capability-infrastructure.ts
 *
 * Full standard capability statement (cover → contents → narrative pages →
 * selected projects → contact) in XNDR branding with original copy. Shares the
 * standard front-matter pages with the remedial statement (Who We Are, How We
 * Work, One Team, What We Do, Assessment & Remediation, Concept to Completion),
 * adapted to infrastructure: bridges, tunnels, drainage pits and culverts,
 * kerbs, crash and operable barriers, underground tanks and aquatic structures.
 *
 * Project 1 uses a supplied photo (Sydney Harbour Bridge, git-ignored in
 * designs/reference/). Projects 2–6 use copyright-free Unsplash photos. Output
 * lands in the git-ignored designs/.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { palette, practice } from "../brand.js";
import { loadLogoOnDark } from "../assets.js";
import { renderHtmlToPdf } from "../render/pdf.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const DESIGNS_DIR = resolve(here, "../../../designs");
const REFERENCE_DIR = resolve(DESIGNS_DIR, "reference");

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
const WEB = "xndr.au";

/** Read an image from designs/reference/ (git-ignored) as a base64 data URL. */
const refImage = (file: string, mime = "image/png"): string =>
  `data:${mime};base64,${readFileSync(resolve(REFERENCE_DIR, file)).toString("base64")}`;

const harbourBridge = refImage("harbour-bridge-climb.png");

/** Unsplash image as a background with a brand fallback colour behind it. */
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
const expertise = (title: string, items: string[]): string =>
  `<div class="exp"><div class="exp-h">${esc(title)}</div>${items.map((i) => `<div class="exp-i">${esc(i)}</div>`).join("")}</div>`;
const footer = (n: number): string => `<div class="foot"><span>${WEB}</span><span>Page ${n}</span></div>`;

// ── Project data ───────────────────────────────────────────────────────────────
interface Project {
  name: string;
  client: string;
  location: string;
  scope: string[];
  photo: string; // Unsplash id, or the harbour-bridge data URL for project 1
}

// Unsplash ids for projects 2–6 (verified copyright-free); project 1 uses the
// supplied Harbour Bridge photo.
const projects: Project[] = [
  {
    name: "Sydney Harbour Bridge — Structural Condition Assessment",
    client: "Transport for NSW",
    location: "BridgeClimb, Sydney NSW",
    photo: harbourBridge,
    scope: [
      "Structural condition assessment of the BridgeClimb access ways on the arch",
      "Inspection of stairs, ladders, walkways and handrail systems at height",
      "Grading of steel members, connections and protective-coating condition",
      "Access over live rail and roadway under strict asset-owner protocols",
      "Prioritised remedial recommendations to keep the climb in safe service",
      "Heritage-sensitive work on an iconic listed structure",
    ],
  },
  {
    name: "M1 Eastern Distributor — Tunnel Pit, Grate & Kerb Remediation",
    client: "Ventia",
    location: "M1 tunnel, Sydney NSW",
    photo: "photo-1595066988978-c2686505d56f",
    scope: [
      "Remedial structural engineering for tunnel drainage pits, grates and kerbs",
      "Condition assessment of cracked and spalled concrete pit walls and surrounds",
      "Design of pit reconstruction, grate seating and kerb reinstatement",
      "Durable detailing for an aggressive, heavily trafficked tunnel environment",
      "Scope documented for delivery inside short overnight closures",
      "Coordination with the operator and maintenance contractor",
    ],
  },
  {
    name: "M1 Eastern Distributor — Crash & Operable Barrier",
    client: "Ventia",
    location: "Northbound portal, Sydney NSW",
    photo: "photo-1782000020706-6784c3e00dca",
    scope: [
      "Design and reconstruction of the vehicle crash barrier at the northbound portal",
      "Installation of an operable barrier outside the tunnel, northbound",
      "Structural design to the relevant road-safety barrier standards",
      "Foundation and anchorage design for the barrier system",
      "Buildability review for staged works alongside live traffic",
      "Documentation to support construction certification",
    ],
  },
  {
    name: "Tugun Tunnel — Underground OSD Tank Assessment",
    client: "Transport for NSW",
    location: "Tugun Bypass tunnel",
    photo: "photo-1768152378286-869497e5a287",
    scope: [
      "Structural condition assessment of the underground on-site detention (OSD) tank",
      "Inspection of a confined, below-ground reinforced-concrete water structure",
      "Assessment of concrete condition, reinforcement corrosion and water tightness",
      "Review of structural adequacy and remaining service life",
      "Confined-space access and inspection planning",
      "Prioritised remedial recommendations for the asset owner",
    ],
  },
  {
    name: "Ian Thorpe Aquatic Centre — Concrete Remediation",
    client: "MBM",
    location: "Ultimo, Sydney NSW",
    photo: "photo-1690615961058-1d695ff218bc",
    scope: [
      "Investigation and remediation of spalling concrete at the aquatic centre",
      "Assessment of reinforcement corrosion in a chlorinated, wet environment",
      "Concrete-repair methodology and remedial design",
      "Scope documented for pricing and staged delivery around operations",
      "Durable repair detailing to extend the structure's service life",
      "Site inspections through construction",
    ],
  },
  {
    name: "RAAF Base Williamtown — Jet Fuel Tank Lining",
    client: "Department of Defence",
    location: "RAAF Williamtown, NSW",
    photo: "photo-1780882899461-0b158f457b44",
    scope: [
      "Remedial lining and remediation of a jet fuel storage tank",
      "Structural and durability assessment of the tank",
      "Repair and re-lining design suited to a fuel-containment environment",
      "Works planned to Defence site security and safety requirements",
      "Confined-space and hazardous-environment access planning",
      "Documentation to support compliant delivery",
    ],
  },
];

/** Resolve a project's media style: data URL for project 1, else an Unsplash id. */
function projectMediaStyle(p: Project): string {
  if (p.photo.startsWith("data:")) return `background-image:url('${p.photo}');background-size:cover;background-position:center;`;
  return photo(p.photo, C.ink);
}

function projectCard(p: Project): string {
  return `
  <div class="pcard">
    <div class="pc-media" style="${projectMediaStyle(p)}"></div>
    <div class="pc-body">
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-client">${esc(p.client)}<span class="pc-dot"> · </span><span class="pc-loc">${esc(p.location)}</span></div>
      <div class="pc-scope-h">Project scope</div>
      <ul class="pc-scope">${p.scope.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
  </div>`;
}

const pages: string[] = [];

// 1 — Cover
pages.push(`
<section class="page cover">
  <div class="cover-photo" style="background-image:url('${harbourBridge}')"></div>
  <div class="cover-veil"></div>
  <img class="cover-logo" src="${logoLight}" alt="XNDR">
  <div class="cover-band">
    <div class="cover-kicker">Capability Statement</div>
    <h1 class="cover-title">Infrastructure<br>Remediation</h1>
    <div class="cover-sub">Bridges · Tunnels · Pits &amp; Culverts · Barriers · Kerbs · Tanks</div>
  </div>
</section>`);

// 2 — Contents
const toc: [string, string, string][] = [
  ["01", "Who We Are", "03"],
  ["02", "How We Work With You", "04"],
  ["03", "One Team, Every Discipline", "05"],
  ["04", "What We Do", "06"],
  ["", "Assessment & Remediation", "07"],
  ["", "From Concept to Completion", "08"],
  ["05", "Selected Projects", "09"],
  ["", "Selected Projects, continued", "10"],
  ["06", "Start the Conversation", "11"],
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
  <div class="imghead" style="${photo("photo-1541888946425-d81bb19240f5", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Who We Are</h2></div>
  </div>
  <div class="cols">
    <div class="col">
      <p class="lead">XNDR is a New South Wales engineering practice. We work on the structures that carry traffic, water and fuel, and we tell you the truth about their condition.</p>
    </div>
    <div class="col">
      <p>The practice grew out of years spent on site, on live infrastructure and inside the assets most people never see. We cover structural engineering, remedial engineering and project management ourselves, and we keep our advice clear enough that an asset owner or maintenance team can act on it straight away.</p>
      <p>We work with transport authorities, government and the contractors who maintain their networks across NSW, on bridges, tunnels, drainage structures, barriers, kerbs and tanks. The asset changes from job to job. The way we treat you does not.</p>
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
  ["We listen first", "We get to know your asset and the real problem before we recommend anything."],
  ["We design for value", "We design the most cost-effective, compliant fix for the problem in front of us, not the most expensive one."],
  ["We keep it plain", "No jargon for its own sake. You get clear options and a straight recommendation."],
  ["We check our own work", "Nothing leaves us until a second engineer has been over it."],
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
      <p>Most infrastructure problems do not fit neatly into one discipline. Because we hold all three in-house, we can assess a defect, design the repair, and run the works to completion without handing you off or losing the thread along the way.</p>
      <p>Our engineers are registered under the NSW Design and Building Practitioners Act 2020 as a Design Building Practitioner and a Professional Engineer, so the designs we issue carry the declarations your project needs. We work to the relevant codes and Australian Standards, and we write everything down so it holds up later.</p>
    </div>
  </div>
  ${expertise("What we cover", [
    "Remedial engineering, concrete repair and protective treatments",
    "Structural engineering for new and existing structures",
    "Condition assessment and asset inspection",
    "Project management and contract administration",
    "Access-constrained, at-height and confined-space works",
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

// 7 — Assessment & Remediation
pages.push(`
<section class="page content">
  <div class="imghead" style="${photo("photo-1504307651254-35680f356dfd", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Assessment &amp;<br>Remediation</h2></div>
  </div>
  <div class="cols-3">
    <div class="col">
      <p class="lead green">Most of our work is on assets that already exist and are showing their age. Remedial engineering is how we find out why, and put it right.</p>
    </div>
    <div class="col">
      <p>Chasing the real cause is the whole point. A repair aimed at a symptom buys you a year or two. A repair aimed at the cause is the one that holds.</p>
      <p>We inspect, investigate where it earns its keep, and write a scope a contractor can price and build to. Then we stay on through construction, because a sound design still has to be built the way it was drawn.</p>
    </div>
    <div class="col">
      ${expertise("What this involves", [
        "Condition assessment and grading of a structure",
        "Access-constrained, at-height and confined-space inspection",
        "Opening up the structure to find a hidden cause",
        "Designing the repair, from first sketch to full detail",
        "Writing a scope a contractor can actually price",
        "On-site checks while the work is built",
        "Remaining service life and durability reviews",
      ])}
    </div>
  </div>
  ${footer(7)}
</section>`);

// 8 — From Concept to Completion
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>From Concept to Completion</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Good structural engineering is mostly invisible. You tend to notice it only when it is missing.</p>
      <p>We design the structure for new work and alterations, and we work out what is going on when an existing one starts to misbehave. Whether it is a single footing or a major asset, the job is the same: make sure every load has a sensible path to the ground, and prove it.</p>
      ${expertise("Structural work", [
        "Checking whether an existing structure is up to the job",
        "Design for new work, alterations and strengthening",
        "Footings, slabs, steel and concrete",
        "Structural certification",
        "Working out why something has failed",
      ])}
    </div>
    <div class="col">
      <p class="lead green">Someone has to hold the whole job together. More often than not, that is us.</p>
      <p>We take remedial and construction projects from the first site walk through to final handover, keeping the program moving and the scope honest. Owners stay in the loop and always know what they are paying for and why.</p>
      ${expertise("Project work", [
        "Early planning and feasibility",
        "Pulling the scope together and documenting it",
        "Running the tender and comparing bids",
        "Contract administration and superintendent duties",
        "Approvals and stakeholder coordination",
        "Handover, commissioning and the defects period",
      ])}
    </div>
  </div>
  ${footer(8)}
</section>`);

// 9 — Selected Projects (1–3)
pages.push(`
<section class="page content plain projects">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2></div>
  <p class="proj-lead">A sample of the assets we have worked on, and the scope we delivered for the owners and contractors who run them.</p>
  ${projects.slice(0, 3).map(projectCard).join("")}
  ${footer(9)}
</section>`);

// 10 — Selected Projects (4–6)
pages.push(`
<section class="page content plain projects">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2><span class="sec-cont">continued</span></div>
  ${projects.slice(3, 6).map(projectCard).join("")}
  ${footer(10)}
</section>`);

// 11 — Contact
pages.push(`
<section class="page contact">
  <div class="contact-photo" style="${photo("photo-1431576901776-e539bd916ba2", C.ink)}"></div>
  <img class="contact-logo" src="${logoLight}" alt="XNDR">
  <div class="contact-band"><span class="bar"></span><h1>Start the Conversation</h1></div>
  <div class="contact-cards">
    <div class="ccard person">
      <div class="cc-name">Rinay Singh</div>
      <div class="cc-role">Director</div>
      <div class="cc-quals">
        <div>B.Eng (Hons), M.Eng (Structural), MIEAust</div>
        <div>DBPA Professional Engineer (PRE0002167), Design Practitioner (DEP0003540)</div>
      </div>
      <div class="cc-line">E&nbsp;&nbsp;${esc(practice.email)}</div>
      <div class="cc-line">M&nbsp;&nbsp;${esc(practice.phone)}</div>
    </div>
    <div class="ccard practice">
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

  .foot { position: absolute; bottom: 0; left: 0; right: 0; height: 12mm; background: ${C.ink}; color: ${C.muted}; display: flex; align-items: center; justify-content: space-between; padding: 0 16mm; font-size: 8pt; letter-spacing: 0.04em; }
  .foot span:first-child { color: ${C.greenBright}; font-weight: 600; }

  /* Cover */
  .cover-photo { position: absolute; inset: 0; background-size: cover; background-position: center; }
  .cover-veil { position: absolute; inset: 0; background: linear-gradient(115deg, ${C.ink} 0%, ${C.ink}cc 36%, ${C.ink}44 58%, transparent 78%); }
  .cover-logo { position: absolute; top: 16mm; right: 16mm; height: 16mm; }
  .cover-band { position: absolute; left: 0; top: 168mm; padding: 8mm 16mm; }
  .cover-band::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2mm; background: ${C.green}; }
  .cover-kicker { color: #fff; font-size: 20pt; font-weight: 700; opacity: 0.92; }
  .cover-title { color: ${C.greenBright}; font-size: 46pt; font-weight: 900; line-height: 1.04; margin: 2mm 0 4mm; }
  .cover-sub { color: ${C.text}; font-size: 9.5pt; letter-spacing: 0.05em; opacity: 0.9; }

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
  .imghead::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, ${C.ink}55 0%, transparent 30%, ${C.ink}aa 100%); }
  .head-logo { position: absolute; top: 12mm; right: 16mm; z-index: 2; }
  .imghead-title { position: absolute; left: 16mm; bottom: 8mm; z-index: 2; }
  .imghead-title h2 { display: inline; color: #fff; font-size: 26pt; font-weight: 800; }
  .imghead-title .bar { height: 1.1em; }
  .sec-title { margin-bottom: 6mm; }
  .sec-title h2 { display: inline; color: ${C.ink}; font-size: 26pt; font-weight: 800; }
  .sec-cont { font-size: 11pt; color: ${C.bodyMuted}; font-weight: 600; margin-left: 4mm; letter-spacing: 0.02em; }

  .cols, .cols-3 { display: grid; gap: 9mm; padding: 9mm 16mm 0; }
  .cols { grid-template-columns: 1fr 1fr; }
  .cols-3 { grid-template-columns: 1.05fr 0.9fr 1.05fr; gap: 7mm; }
  .plain .cols, .plain .cols-3 { padding: 0; }

  .stats { display: flex; gap: 6mm; padding: 10mm 16mm 0; }
  .stat { flex: 1; background: ${C.paper}; border-left: 2.4mm solid ${C.green}; padding: 5mm; }
  .stat-n { font-size: 26pt; font-weight: 900; color: ${C.ink}; line-height: 1; }
  .stat-l { font-size: 9pt; color: ${C.bodyMuted}; margin-top: 2mm; }

  .exp { background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 4mm 5mm; }
  .plain .exp { margin-top: 5mm; }
  .exp-h { font-weight: 800; font-size: 10pt; color: ${C.ink}; margin-bottom: 2mm; }
  .exp-i { font-size: 9pt; color: ${C.bodyInk}; padding: 2mm 0; border-top: 0.3mm solid ${C.line}; }
  .exp-i:first-of-type { border-top: none; }

  .commit { margin-top: 4mm; }
  .commit-row { display: grid; grid-template-columns: 48mm 1fr; gap: 6mm; padding: 5mm 0; border-top: 0.3mm solid ${C.line}; }
  .commit-h { font-weight: 800; font-size: 12pt; color: ${C.green}; }
  .commit-t { font-size: 10.5pt; line-height: 1.55; color: ${C.bodyInk}; }

  .divider { background: ${C.ink}; }
  .lineart { position: absolute; right: 0; bottom: 0; width: 150mm; height: 150mm; }
  .divider .head-logo { position: absolute; top: 16mm; right: 16mm; }
  .divider-title { position: absolute; left: 16mm; top: 120mm; }
  .divider-title h1 { display: inline; color: #fff; font-size: 46pt; font-weight: 900; }
  .divider-title .bar { width: 3mm; height: 1.05em; vertical-align: 0.02em; }

  /* Project cards */
  .proj-lead { font-size: 10pt; color: ${C.bodyMuted}; margin-bottom: 4mm; }
  .pcard { display: grid; grid-template-columns: 66mm 1fr; gap: 6mm; padding-top: 3.5mm; margin-bottom: 3.5mm; border-top: 0.5mm solid ${C.green}; }
  .pc-media { width: 66mm; height: 42mm; border-radius: 1mm; background-size: cover; background-position: center; background-color: ${C.surface}; overflow: hidden; }
  .pc-name { font-size: 12.5pt; font-weight: 800; color: ${C.ink}; line-height: 1.15; }
  .pc-client { font-size: 9.5pt; font-weight: 700; color: ${C.green}; margin: 1mm 0 2.5mm; }
  .pc-dot { color: ${C.line}; }
  .pc-loc { color: ${C.bodyMuted}; font-weight: 500; }
  .pc-scope-h { font-size: 8pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.bodyMuted}; margin-bottom: 1.5mm; }
  .pc-scope { list-style: none; }
  .pc-scope li { font-size: 8.8pt; line-height: 1.35; padding-left: 5mm; position: relative; margin-bottom: 1.1mm; color: ${C.bodyInk}; }
  .pc-scope li::before { content: "▸"; position: absolute; left: 0; color: ${C.green}; font-weight: 700; }

  /* Contact */
  .contact { background: ${C.ink}; }
  .contact-photo { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; }
  .contact-photo::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, ${C.ink}, ${C.ink}66 40%, transparent); }
  .contact-logo { position: absolute; top: 18mm; right: 16mm; height: 18mm; }
  .contact-band { position: absolute; left: 0; top: 64mm; padding-left: 16mm; }
  .contact-band h1 { display: inline; color: #fff; font-size: 34pt; font-weight: 900; }
  .contact-band .bar { width: 3mm; height: 1.05em; }
  .contact-cards { position: absolute; top: 90mm; left: 16mm; right: 16mm; display: flex; gap: 12mm; }
  .person { width: 106mm; flex: none; }
  .practice { width: 60mm; flex: none; }
  .cc-name { color: #fff; font-size: 16pt; font-weight: 800; }
  .cc-role { color: ${C.greenBright}; font-size: 10pt; margin: 1.5mm 0 3mm; font-weight: 600; }
  .cc-quals { font-size: 7.5pt; color: ${C.text}; opacity: 0.9; line-height: 1.6; margin-bottom: 4mm; letter-spacing: 0.01em; }
  .cc-quals div { white-space: nowrap; }
  .cc-line { color: ${C.text}; font-size: 10.5pt; line-height: 1.7; }
</style></head>
<body>
${pages.join("\n")}
</body></html>`;

const out = resolve(DESIGNS_DIR, "capability-statement-infrastructure-v2.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Capability Statement (Infrastructure Remediation) → ${out}`);
