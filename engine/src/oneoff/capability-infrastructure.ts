/**
 * ONE-OFF (ad hoc): XNDR — Capability Statement, Infrastructure Remediation.
 * A4 multi-page PDF. Not wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/capability-infrastructure.ts
 *
 * Project-showcase format (cover → capabilities → selected projects → contact),
 * modelled on a competitor "transport infrastructure" statement but rebuilt in
 * XNDR branding with fully original copy. Focus: bridge remedial engineering,
 * tunnels, drainage pits and culverts, kerbs, crash and operable barriers,
 * underground tanks and aquatic structures.
 *
 * Project 1 uses a supplied photo (Sydney Harbour Bridge, git-ignored in
 * designs/reference/). Projects 2–6 use original XNDR line-art scenes drawn here.
 * Output lands in the git-ignored designs/.
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

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const footer = (n: number): string => `<div class="foot"><span>${WEB}</span><span>Page ${n}</span></div>`;

// ── SVG project scenes (ink background, light line-art, green accents) ──────────
// Shared palette for the illustrations.
const S = { bg: "#1C2023", panel: "#23282C", stroke: "#C7CDD0", faint: "#454D52", accent: palette.greenBright, water: "#4E7C4A" };

/** Wrap illustration guts in a consistent 400×260 ink frame with a corner label. */
function scene(label: string, guts: string): string {
  return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" class="scene-svg">
    <rect width="400" height="260" fill="${S.bg}"/>
    ${guts}
    <rect x="0" y="232" width="400" height="28" fill="#000000" opacity="0.28"/>
    <rect x="18" y="243" width="3" height="9" fill="${S.accent}"/>
    <text x="27" y="251" fill="${S.accent}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1.4">${label}</text>
  </svg>`;
}

// 2 — Tunnel drainage pit, grate & kerb (tunnel cross-section)
const sceneTunnelPit = scene(
  "DRAINAGE PIT · GRATE · KERB",
  `<path d="M32 224 L32 118 Q32 46 200 46 Q368 46 368 118 L368 224" fill="none" stroke="${S.stroke}" stroke-width="2.4" opacity="0.55"/>
   <path d="M52 210 L52 122 Q52 66 200 66 Q348 66 348 122 L348 210" fill="none" stroke="${S.faint}" stroke-width="1.4"/>
   <rect x="32" y="196" width="336" height="28" fill="${S.panel}"/>
   <line x1="120" y1="210" x2="160" y2="210" stroke="${S.accent}" stroke-width="2.5" stroke-dasharray="14 12"/>
   <line x1="200" y1="210" x2="240" y2="210" stroke="${S.accent}" stroke-width="2.5" stroke-dasharray="14 12"/>
   <!-- kerb + pit at right haunch -->
   <path d="M300 196 L300 182 L360 182 L360 196 Z" fill="${S.faint}" stroke="${S.stroke}" stroke-width="1.4"/>
   <rect x="300" y="196" width="52" height="20" fill="${S.bg}" stroke="${S.stroke}" stroke-width="1.6"/>
   ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${306 + i * 8}" y1="198" x2="${306 + i * 8}" y2="214" stroke="${S.accent}" stroke-width="2.2"/>`).join("")}
   <!-- pit chamber below grate -->
   <path d="M300 216 L300 230 L352 230 L352 216" fill="none" stroke="${S.faint}" stroke-width="1.4" stroke-dasharray="4 4"/>`,
);

// 3 — Crash barrier + operable barrier at tunnel portal
const sceneBarrier = scene(
  "CRASH & OPERABLE BARRIER",
  `<!-- portal -->
   <path d="M250 210 L250 120 Q250 78 312 78 Q374 78 374 120 L374 210 Z" fill="${S.panel}" stroke="${S.stroke}" stroke-width="2"/>
   <path d="M266 210 L266 124 Q266 96 312 96 Q358 96 358 124 L358 210" fill="#14181A" stroke="${S.faint}" stroke-width="1.4"/>
   <!-- road -->
   <path d="M20 210 L374 210 L374 232 L20 232 Z" fill="${S.panel}"/>
   <line x1="40" y1="221" x2="240" y2="221" stroke="${S.accent}" stroke-width="2.4" stroke-dasharray="16 14"/>
   <!-- guardrail posts + rail (left approach) -->
   ${[0, 1, 2, 3].map((i) => `<line x1="${40 + i * 40}" y1="196" x2="${40 + i * 40}" y2="210" stroke="${S.stroke}" stroke-width="2.2"/>`).join("")}
   <path d="M34 190 L166 190" stroke="${S.stroke}" stroke-width="3"/>
   <!-- operable boom barrier -->
   <rect x="196" y="150" width="10" height="60" fill="${S.faint}" stroke="${S.stroke}" stroke-width="1.4"/>
   <g transform="rotate(-18 201 156)">
     <rect x="201" y="150" width="120" height="10" rx="2" fill="${S.accent}"/>
     ${[0, 1, 2, 3].map((i) => `<rect x="${213 + i * 28}" y="150" width="14" height="10" fill="#14181A"/>`).join("")}
   </g>`,
);

// 4 — Underground OSD (on-site detention) stormwater tank
const sceneTank = scene(
  "UNDERGROUND OSD TANK",
  `<!-- ground surface -->
   <rect x="0" y="60" width="400" height="18" fill="${S.panel}"/>
   <line x1="0" y1="60" x2="400" y2="60" stroke="${S.stroke}" stroke-width="1.6"/>
   ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="${20 + i * 50}" y1="60" x2="${8 + i * 50}" y2="52" stroke="${S.faint}" stroke-width="1.4"/>`).join("")}
   <!-- access hatch -->
   <rect x="176" y="52" width="34" height="8" fill="${S.accent}"/>
   <!-- buried tank (cutaway) -->
   <rect x="70" y="96" width="260" height="118" fill="none" stroke="${S.stroke}" stroke-width="2.4"/>
   <rect x="70" y="96" width="260" height="118" fill="#14181A" opacity="0.5"/>
   <!-- water body -->
   <rect x="78" y="150" width="244" height="56" fill="${S.water}" opacity="0.7"/>
   <path d="M78 150 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="${S.accent}" stroke-width="1.8"/>
   <!-- internal baffle walls -->
   <line x1="158" y1="96" x2="158" y2="180" stroke="${S.faint}" stroke-width="1.6"/>
   <line x1="242" y1="130" x2="242" y2="214" stroke="${S.faint}" stroke-width="1.6"/>
   <!-- inlet + outlet pipes -->
   <rect x="40" y="120" width="30" height="14" fill="${S.panel}" stroke="${S.stroke}" stroke-width="1.4"/>
   <rect x="330" y="176" width="30" height="14" fill="${S.panel}" stroke="${S.stroke}" stroke-width="1.4"/>`,
);

// 5 — Aquatic centre pool: spalling concrete & remediation
const scenePool = scene(
  "POOL CONCRETE REMEDIATION",
  `<!-- deck -->
   <rect x="0" y="0" width="400" height="260" fill="${S.bg}"/>
   <rect x="24" y="70" width="352" height="120" rx="4" fill="none" stroke="${S.stroke}" stroke-width="2.4"/>
   <!-- water -->
   <rect x="34" y="80" width="332" height="100" fill="${S.water}" opacity="0.68"/>
   <!-- lane lines -->
   ${[0, 1, 2, 3].map((i) => `<line x1="44" y1="${98 + i * 22}" x2="356" y2="${98 + i * 22}" stroke="${S.accent}" stroke-width="2" stroke-dasharray="10 8" opacity="0.85"/>`).join("")}
   <!-- spalled / repair patch on the edge beam -->
   <rect x="24" y="190" width="352" height="20" fill="${S.panel}"/>
   <g>
     <rect x="150" y="190" width="70" height="20" fill="none" stroke="${S.accent}" stroke-width="2" stroke-dasharray="5 4"/>
     ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${152 + i * 12}" y1="208" x2="${162 + i * 12}" y2="192" stroke="${S.accent}" stroke-width="1.3" opacity="0.7"/>`).join("")}
   </g>
   <!-- exposed reinforcement bar hint -->
   <line x1="150" y1="200" x2="220" y2="200" stroke="${S.stroke}" stroke-width="1.6" stroke-dasharray="3 3"/>`,
);

// 6 — Jet fuel tank: remedial lining & remediation
const sceneFuelTank = scene(
  "JET FUEL TANK LINING",
  `<!-- tank body -->
   <rect x="120" y="66" width="160" height="150" fill="${S.panel}" stroke="${S.stroke}" stroke-width="2.4"/>
   <ellipse cx="200" cy="66" rx="80" ry="18" fill="#14181A" stroke="${S.stroke}" stroke-width="2.4"/>
   <ellipse cx="200" cy="216" rx="80" ry="16" fill="${S.panel}" stroke="${S.stroke}" stroke-width="2.4"/>
   <!-- new lining highlight (inner face) -->
   <rect x="130" y="70" width="140" height="142" fill="none" stroke="${S.accent}" stroke-width="2.4" stroke-dasharray="7 5"/>
   <!-- product level -->
   <ellipse cx="200" cy="150" rx="70" ry="14" fill="${S.water}" opacity="0.5"/>
   <line x1="130" y1="150" x2="270" y2="150" stroke="${S.accent}" stroke-width="1.6"/>
   <!-- ladder -->
   <line x1="286" y1="80" x2="286" y2="212" stroke="${S.stroke}" stroke-width="1.8"/>
   <line x1="296" y1="80" x2="296" y2="212" stroke="${S.stroke}" stroke-width="1.8"/>
   ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="286" y1="${92 + i * 18}" x2="296" y2="${92 + i * 18}" stroke="${S.stroke}" stroke-width="1.6"/>`).join("")}
   <!-- fuel drop mark -->
   <path d="M104 116 q10 12 10 20 a10 10 0 1 1 -20 0 q0 -8 10 -20 Z" fill="${S.accent}" opacity="0.9"/>`,
);

// ── Project data ───────────────────────────────────────────────────────────────
interface Project {
  name: string;
  client: string;
  location: string;
  scope: string[];
  media: { kind: "photo"; url: string } | { kind: "svg"; svg: string };
}

const projects: Project[] = [
  {
    name: "Sydney Harbour Bridge — Structural Condition Assessment",
    client: "Transport for NSW",
    location: "BridgeClimb, Sydney NSW",
    media: { kind: "photo", url: harbourBridge },
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
    media: { kind: "svg", svg: sceneTunnelPit },
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
    media: { kind: "svg", svg: sceneBarrier },
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
    media: { kind: "svg", svg: sceneTank },
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
    media: { kind: "svg", svg: scenePool },
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
    media: { kind: "svg", svg: sceneFuelTank },
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

function projectCard(p: Project): string {
  const media =
    p.media.kind === "photo"
      ? `<div class="pc-media" style="background-image:url('${p.media.url}')"></div>`
      : `<div class="pc-media pc-svg">${p.media.svg}</div>`;
  return `
  <div class="pcard">
    ${media}
    <div class="pc-body">
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-client">${esc(p.client)}<span class="pc-dot"> · </span><span class="pc-loc">${esc(p.location)}</span></div>
      <div class="pc-scope-h">Project scope</div>
      <ul class="pc-scope">${p.scope.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
  </div>`;
}

// ── Capability tiles (page 2) ──────────────────────────────────────────────────
const capabilities: [string, string][] = [
  ["Bridge remedial engineering", "Condition assessment, access-constrained inspection and repair design for road, rail and pedestrian bridges."],
  ["Tunnels & motorway assets", "Remedial works to tunnel linings, drainage pits, grates and kerbs, delivered inside live-traffic closures."],
  ["Barriers & road safety", "Design and reconstruction of crash barriers and operable barrier systems, with foundations and anchorage."],
  ["Culverts, pits & drainage", "Structural assessment and repair of culverts, stormwater pits and buried drainage structures."],
  ["Tanks & water structures", "Assessment, repair and re-lining of underground detention tanks, fuel tanks and other containment structures."],
  ["Aquatic & concrete repair", "Spalling and corrosion remediation for pools, decks and reinforced concrete in aggressive environments."],
];

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

// 2 — Who We Are + What We Do
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Protecting Critical Assets</h2></div>
  <p class="lead green">As infrastructure ages, someone has to keep it safe, serviceable and worth the cost of maintaining. That is the work we do.</p>
  <p class="intro">XNDR is a New South Wales engineering practice working on the assets that carry traffic, water and fuel every day. We assess what is really going on inside a structure, design the repair that fixes the cause rather than the symptom, and see the work through on site. Much of it happens on live infrastructure, under closures, at height or in confined spaces, alongside asset owners and the contractors who maintain their networks.</p>
  <div class="cap-h"><span class="bar"></span>What we do</div>
  <div class="cap-grid">
    ${capabilities.map(([h, t]) => `<div class="cap"><div class="cap-t">${esc(h)}</div><div class="cap-d">${esc(t)}</div></div>`).join("")}
  </div>
  <div class="assure">
    <div class="assure-h">How we work</div>
    <div class="assure-b">Registered practitioners under the NSW Design and Building Practitioners Act 2020. Work to the Building Code of Australia and the relevant Australian Standards. Every design is checked by a second engineer before it leaves us, and we stay on through construction so the fix is built the way it was drawn.</div>
  </div>
  ${footer(2)}
</section>`);

// 3 — Selected Projects (1–3)
pages.push(`
<section class="page content plain projects">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2></div>
  <p class="proj-lead">A sample of the assets we have worked on, and the scope we delivered for the owners and contractors who run them.</p>
  ${projects.slice(0, 3).map(projectCard).join("")}
  ${footer(3)}
</section>`);

// 4 — Selected Projects (4–6)
pages.push(`
<section class="page content plain projects">
  <div class="sec-title"><span class="bar"></span><h2>Selected Projects</h2><span class="sec-cont">continued</span></div>
  ${projects.slice(3, 6).map(projectCard).join("")}
  ${footer(4)}
</section>`);

// 5 — Contact
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

  .plain { padding: 22mm 16mm 12mm; }
  .sec-title { margin-bottom: 6mm; }
  .sec-title h2 { display: inline; color: ${C.ink}; font-size: 26pt; font-weight: 800; }
  .sec-cont { font-size: 11pt; color: ${C.bodyMuted}; font-weight: 600; margin-left: 4mm; letter-spacing: 0.02em; }

  /* Cover */
  .cover-photo { position: absolute; inset: 0; background-size: cover; background-position: center; }
  .cover-veil { position: absolute; inset: 0; background: linear-gradient(115deg, ${C.ink} 0%, ${C.ink}cc 36%, ${C.ink}44 58%, transparent 78%); }
  .cover-logo { position: absolute; top: 16mm; right: 16mm; height: 16mm; }
  .cover-band { position: absolute; left: 0; top: 168mm; padding: 8mm 16mm; }
  .cover-band::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2mm; background: ${C.green}; }
  .cover-kicker { color: #fff; font-size: 20pt; font-weight: 700; opacity: 0.92; }
  .cover-title { color: ${C.greenBright}; font-size: 46pt; font-weight: 900; line-height: 1.04; margin: 2mm 0 4mm; }
  .cover-sub { color: ${C.text}; font-size: 9.5pt; letter-spacing: 0.05em; opacity: 0.9; }

  /* Page 2 — capabilities */
  .intro { font-size: 10.5pt; line-height: 1.65; margin-bottom: 7mm; }
  .cap-h { color: ${C.ink}; font-size: 13pt; font-weight: 800; margin-bottom: 5mm; }
  .cap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
  .cap { background: ${C.paper}; border-left: 2.4mm solid ${C.green}; padding: 4.5mm 5mm; }
  .cap-t { font-weight: 800; font-size: 11pt; color: ${C.ink}; margin-bottom: 1.5mm; }
  .cap-d { font-size: 9pt; line-height: 1.5; color: ${C.bodyMuted}; }
  .assure { background: ${C.ink}; border-radius: 1mm; padding: 5mm 6mm; margin-top: 7mm; }
  .assure-h { color: ${C.greenBright}; font-weight: 800; font-size: 9pt; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 2.5mm; }
  .assure-b { color: ${C.text}; font-size: 9.5pt; line-height: 1.6; }

  /* Project cards */
  .proj-lead { font-size: 10pt; color: ${C.bodyMuted}; margin-bottom: 4mm; }
  .pcard { display: grid; grid-template-columns: 66mm 1fr; gap: 6mm; padding-top: 3.5mm; margin-bottom: 3.5mm; border-top: 0.5mm solid ${C.green}; }
  .pc-media { width: 66mm; height: 42mm; border-radius: 1mm; background-size: cover; background-position: center; background-color: ${C.surface}; overflow: hidden; }
  .pc-svg { padding: 0; }
  .scene-svg { width: 100%; height: 100%; display: block; }
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
  .contact-photo { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; background-size: cover; background-position: center; }
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

const out = resolve(DESIGNS_DIR, "capability-statement-infrastructure-v1.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Capability Statement (Infrastructure Remediation) → ${out}`);
