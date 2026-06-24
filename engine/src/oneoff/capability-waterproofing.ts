/**
 * ONE-OFF (ad hoc): XNDR — Capability Statement, Waterproofing. A4 multi-page PDF.
 *
 * A standalone waterproofing capability statement in XNDR branding. The copy is
 * original and plain-English, with XNDR's own section headings — it takes the
 * subject matter from three reference sources (two competitor service pages and a
 * "systems we install" building diagram) but rewrites everything in XNDR's voice.
 * Built to sit alongside the remedial capability statement and share its styling.
 * Not wired into the CLI. Run:
 *   cd engine && npx tsx src/oneoff/capability-waterproofing.ts
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

/**
 * Building-section diagram for "Where Water Has to Stay Out". Green marks every
 * surface that relies on a membrane; numbered badges tie to the legend alongside.
 * Our own take on the kind of "systems we install" cutaway competitors publish.
 */
function buildingDiagram(): string {
  const g = C.green;
  const ink = C.ink;
  const badge = (cx: number, cy: number, n: number): string =>
    `<circle cx="${cx}" cy="${cy}" r="11" fill="${g}"/><circle cx="${cx}" cy="${cy}" r="11" fill="none" stroke="#fff" stroke-width="1.5"/><text x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">${n}</text>`;
  const floorLines = [128, 182, 236, 290, 344]
    .map((y) => `<line x1="172" y1="${y}" x2="318" y2="${y}" stroke="${ink}" stroke-width="0.8" opacity="0.25"/>`)
    .join("");
  return `
<svg class="bldg" viewBox="0 0 480 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <pattern id="soil" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="#C9CDC4" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- below-ground soil -->
  <rect x="0" y="392" width="480" height="208" fill="#EEF0EA"/>
  <rect x="0" y="392" width="480" height="208" fill="url(#soil)"/>
  <line x1="0" y1="392" x2="480" y2="392" stroke="${ink}" stroke-width="2"/>

  <!-- tower -->
  <rect x="172" y="74" width="146" height="318" fill="#fff" stroke="${ink}" stroke-width="2"/>
  ${floorLines}

  <!-- roof slab (1) -->
  <rect x="166" y="60" width="158" height="14" fill="${g}"/>
  <!-- green roof / planter (2) -->
  <rect x="262" y="40" width="56" height="20" fill="#fff" stroke="${ink}" stroke-width="1.5"/>
  <rect x="262" y="40" width="56" height="6" fill="${g}"/>
  <path d="M270 40 q4 -8 8 0 M284 40 q4 -9 8 0 M298 40 q4 -8 8 0" fill="none" stroke="${g}" stroke-width="2"/>

  <!-- balconies (3) -->
  <rect x="318" y="150" width="46" height="12" fill="#fff" stroke="${ink}" stroke-width="1.2"/><rect x="318" y="150" width="46" height="4" fill="${g}"/>
  <rect x="318" y="232" width="46" height="12" fill="#fff" stroke="${ink}" stroke-width="1.2"/><rect x="318" y="232" width="46" height="4" fill="${g}"/>

  <!-- wet area inside (5) -->
  <rect x="188" y="300" width="44" height="34" fill="${C.paper}" stroke="${ink}" stroke-width="1" stroke-dasharray="3 2"/>
  <rect x="188" y="330" width="44" height="4" fill="${g}"/>

  <!-- podium deck (4) -->
  <rect x="120" y="374" width="300" height="14" fill="#fff" stroke="${ink}" stroke-width="1.5"/>
  <rect x="120" y="374" width="300" height="5" fill="${g}"/>

  <!-- basement (6) -->
  <rect x="172" y="392" width="146" height="104" fill="#fff" stroke="${ink}" stroke-width="1.5"/>
  <rect x="172" y="392" width="6" height="104" fill="${g}"/>
  <rect x="312" y="392" width="6" height="104" fill="${g}"/>
  <rect x="172" y="490" width="146" height="6" fill="${g}"/>

  <!-- water tank (6) -->
  <rect x="64" y="420" width="58" height="70" rx="6" fill="#fff" stroke="${ink}" stroke-width="1.5"/>
  <rect x="64" y="420" width="58" height="70" rx="6" fill="none" stroke="${g}" stroke-width="3"/>
  <path d="M68 470 q14 -8 27 0 t27 0" fill="none" stroke="${g}" stroke-width="2" opacity="0.6"/>

  <!-- retaining wall (7) -->
  <rect x="398" y="392" width="16" height="128" fill="#fff" stroke="${ink}" stroke-width="1.5"/>
  <rect x="398" y="392" width="5" height="128" fill="${g}"/>

  <!-- movement joint (8) -->
  <line x1="245" y1="74" x2="245" y2="392" stroke="${g}" stroke-width="2" stroke-dasharray="6 5"/>

  ${badge(324, 67, 1)}
  ${badge(308, 30, 2)}
  ${badge(376, 156, 3)}
  ${badge(210, 317, 5)}
  ${badge(132, 381, 4)}
  ${badge(245, 444, 6)}
  ${badge(406, 384, 7)}
  ${badge(258, 92, 8)}
</svg>`;
}

const pages: string[] = [];

// 1 — Cover
pages.push(`
<section class="page cover">
  <div class="cover-photo" style="${photo("photo-1504307651254-35680f356dfd", C.ink)}"></div>
  <div class="cover-veil"></div>
  <img class="cover-logo" src="${logoLight}" alt="XNDR">
  <div class="cover-band">
    <div class="cover-kicker">Capability Statement</div>
    <h1 class="cover-title">Waterproofing</h1>
    <div class="cover-sub">Membranes · Roofs · Decks · Below Ground · New South Wales</div>
  </div>
</section>`);

// 2 — Contents
const toc: [string, string, string][] = [
  ["01", "Who We Are", "03"],
  ["02", "How We Go About It", "04"],
  ["03", "The Systems We Specify", "05"],
  ["04", "What We Waterproof", "06"],
  ["", "Where Water Has to Stay Out", "07"],
  ["", "Roofs and Plant Decks", "08"],
  ["", "Balconies, Podiums and Wet Areas", "09"],
  ["", "Below the Ground Line", "10"],
  ["05", "Where Membranes Let Go", "11"],
  ["", "When the Membrane Wears Out", "12"],
  ["", "Water That Will Not Drain", "13"],
  ["", "The Joints and the Edges", "14"],
  ["06", "Why Do It Properly", "15"],
  ["07", "Start the Conversation", "16"],
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
      <p class="lead">XNDR is a New South Wales engineering practice. Of every defect we are called to, water getting in is the one we see most.</p>
    </div>
    <div class="col">
      <p>We treat waterproofing as an engineering problem, not a coat of paint. A membrane is part of the structure it sits on, and it only works when the falls, the drainage and the junctions around it are right as well. So we look at the whole detail, not just the surface, and we say plainly what it will take to keep the water out.</p>
      <p>We work across the strata and construction sectors throughout NSW, from a single balcony repair to a full roof over an occupied building. The job changes every time. The way we treat you does not.</p>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-n">No.1</div><div class="stat-l">Water ingress is the defect we see most in NSW strata</div></div>
    <div class="stat"><div class="stat-n">15+</div><div class="stat-l">Years of combined experience on site</div></div>
    <div class="stat"><div class="stat-n">DBP · PE</div><div class="stat-l">Registered practitioners</div></div>
  </div>
  ${footer(3)}
</section>`);

// 4 — How We Go About It
const commitments: [string, string][] = [
  ["We find the leak first", "We trace where water is actually getting in before we specify a thing. A membrane laid over the wrong cause just hides it for a season."],
  ["We match the system to the surface", "A balcony, a flat roof and a basement wall all fail differently. We pick the membrane that suits the job, not the one that is easiest to roll on."],
  ["We design the hard bits", "Most leaks start at a penetration, an upstand or a joint. Those details get drawn properly, because that is where the work is won or lost."],
  ["We specify, we don't guess", "You get a scope a waterproofer can price and build to, written against the right Australian Standards."],
  ["We watch it go down", "We check the substrate, the falls and the membrane while it is being laid, when problems are still cheap to fix."],
  ["We stand behind the call", "From the first inspection to the last junction, the recommendation is ours to back."],
];
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>How We Go About It</h2></div>
  <p class="lead green">Keeping water out is mostly about getting the boring parts right. The falls, the drains, the edges and the joints decide whether a roof lasts five years or twenty-five.</p>
  <div class="commit">
    ${commitments.map(([h, t]) => `<div class="commit-row"><div class="commit-h">${esc(h)}</div><div class="commit-t">${esc(t)}</div></div>`).join("")}
  </div>
  ${footer(4)}
</section>`);

// 5 — The Systems We Specify
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>The Systems We Specify</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">There is no single membrane that suits every surface. The right one depends on the substrate, the traffic over it and how much movement it has to take.</p>
    </div>
    <div class="col">
      <p>We work across the full range of systems and pick to suit the job in front of us. A trafficable podium, an exposed metal roof and a tanked basement each call for something different, and the value is in choosing well rather than defaulting to whatever the last contractor used.</p>
      <p>We write the specification to the Building Code of Australia and the relevant Australian Standards, set out the substrate and detailing the system actually needs, and call up the warranty terms up front so there are no gaps later.</p>
    </div>
  </div>
  ${expertise("Systems we work with", [
    "Liquid-applied membranes for wet areas, balconies and decks",
    "Sheet and torch-on bituminous membranes for roofs and below ground",
    "Single-ply PVC and TPO systems for large roof areas",
    "Self-adhered peel-and-stick membranes",
    "Crack injection and negative-side sealing for below-ground structures",
    "Cut-to-fall insulation, flashings and expansion-joint detailing",
  ])}
  ${footer(5)}
</section>`);

// 6 — What We Waterproof (divider)
pages.push(`
<section class="page divider">
  ${lineArt(C.greenBright)}
  <img class="head-logo" src="${logoLight}" alt="XNDR">
  <div class="divider-title"><span class="bar"></span><h1>What We<br>Waterproof</h1></div>
  ${footer(6)}
</section>`);

// 7 — Where Water Has to Stay Out (building diagram)
const zones: [number, string, string][] = [
  [1, "Roofs & plant decks", "Flat roofs, cut-to-fall build-ups, metal overlay and standing seam."],
  [2, "Green roofs & planters", "Soil and water sitting directly on the structure below."],
  [3, "Balconies & terraces", "The slab edge where most strata leaks begin."],
  [4, "Podium decks", "Trafficable decks and car parks built over occupied space."],
  [5, "Wet areas", "Bathrooms, laundries and plant rooms inside the building."],
  [6, "Tanks & basements", "Water held in, and groundwater held back out."],
  [7, "Below ground & retaining", "Walls with soil and water pressing on the far side."],
  [8, "Movement joints", "Expansion joints that have to flex and still seal."],
];
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Where Water Has to Stay Out</h2></div>
  <p class="lead green tight2">Almost every horizontal surface and below-ground face in a building leans on a membrane you never see. Here is where it is doing the work.</p>
  <div class="diagram">
    <div class="diagram-art">${buildingDiagram()}</div>
    <div class="diagram-legend">
      ${zones
        .map(
          ([n, t, d]) =>
            `<div class="zone"><span class="zone-n">${n}</span><div class="zone-b"><div class="zone-t">${esc(t)}</div><div class="zone-d">${esc(d)}</div></div></div>`,
        )
        .join("")}
    </div>
  </div>
  ${footer(7)}
</section>`);

// 8 — Roofs and Plant Decks
pages.push(`
<section class="page content">
  <div class="imghead" style="${photo("photo-1581092160562-40aa08e78837", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Roofs and<br>Plant Decks</h2></div>
  </div>
  <div class="cols-3">
    <div class="col">
      <p class="lead green">A roof is the largest surface a building owns and the one most exposed. On big roofs the trouble is rarely one hole, it is wear spread across the whole area.</p>
      <p>We work on commercial, industrial and multi-level residential roofs, including the awkward ones: high-traffic decks, large open spans, plant decks crowded with services, and ageing build-ups that have been patched a few times too many.</p>
    </div>
    <div class="col">
      <p>Most roof leaks come down to the same handful of causes: a membrane past its life, water that has nowhere to drain, or detailing that was never right around penetrations and flashings. We work out which it is before anyone reaches for a bucket of sealant.</p>
      <p>Where a roof is sound but tired, an overlay or a cut-to-fall upgrade can buy it another couple of decades for far less than a strip-and-replace. Where it is gone, we say so.</p>
    </div>
    <div class="col">
      ${expertise("What we do up top", [
        "Roof condition audits and leak tracing",
        "New membranes and full re-roofs over existing buildings",
        "Metal roof overlay systems",
        "Cut-to-fall insulation to kill ponding",
        "Flashing, penetration and plant-deck detailing",
        "Maintenance plans that catch the small stuff early",
      ])}
    </div>
  </div>
  ${footer(8)}
</section>`);

// 9 — Balconies, Podiums and Wet Areas
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Balconies, Podiums and Wet Areas</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Balconies and podium decks are where strata buildings leak the most, and the repair always reaches further than the tiles.</p>
      <p>A balcony has to shed water away from the door, off the edge and down a drain, with a membrane under the tiles doing the real work. When the fall is wrong or the membrane has failed at the threshold, water tracks back inside and into the slab. By the time it shows on the ceiling below, it has usually been at it for a while.</p>
      ${expertise("Balconies & podiums", [
        "Tiled balconies, terraces and walkways",
        "Trafficable podium decks over habitable space",
        "Thresholds, drainage falls and edge detailing",
        "Tile-over-membrane and exposed-membrane build-ups",
      ])}
    </div>
    <div class="col">
      <p class="lead green">Inside, the wet areas are small but unforgiving. A bathroom or laundry that was not tanked properly will find the room next door.</p>
      <p>Internal waterproofing has the least room for error and the highest cost when it goes wrong, because the damage lands in finished, occupied rooms. We specify wet-area systems to the standard, pay attention to the floor wastes, hobs and wall junctions, and check the work before it gets tiled over and forgotten.</p>
      ${expertise("Wet areas & plant rooms", [
        "Bathrooms, ensuites and laundries",
        "Plant-room and plumbing-cupboard floors",
        "Floor wastes, hobs and shower recesses",
        "Wall-to-floor junctions and penetrations",
      ])}
    </div>
  </div>
  ${footer(9)}
</section>`);

// 10 — Below the Ground Line
pages.push(`
<section class="page content plain">
  <div class="sec-title"><span class="bar"></span><h2>Below the Ground Line</h2></div>
  <div class="cols">
    <div class="col">
      <p class="lead green">Below ground the pressure runs the other way. Instead of shedding rain, the structure is holding back soil and the water sitting in it.</p>
      <p>Basements, lift pits and tanks are the hardest places to fix once they leak, because you cannot always get to the side the water is coming from. That makes getting it right the first time worth far more here than anywhere else, and it makes good diagnosis essential before a cent is spent.</p>
      ${expertise("Below-ground work", [
        "Basement and lift-pit waterproofing",
        "Water tanks and retention structures",
        "Crack injection and negative-side sealing",
        "Liquid damp coursing to rising-damp walls",
      ])}
    </div>
    <div class="col">
      <p class="lead green">Planter boxes and retaining walls hold wet soil against the building, day in and day out, and they are easy to overlook until they stain a wall.</p>
      <p>A planter is a small tank with a garden on top: permanently wet, often built tight against a habitable wall, and unforgiving if the lining or the drainage was skimped. Retaining walls add a real structural load to the mix, so drainage and waterproofing have to be solved together rather than one after the other.</p>
      ${expertise("Planters & retaining", [
        "Planter-box linings, drainage and repairs",
        "Subsoil drainage behind retaining walls",
        "Waterproofing to retained and shared boundary walls",
        "Efflorescence and salt-damp investigation",
      ])}
    </div>
  </div>
  ${footer(10)}
</section>`);

// 11 — Where Membranes Let Go (divider)
pages.push(`
<section class="page divider">
  ${lineArt(C.greenBright)}
  <img class="head-logo" src="${logoLight}" alt="XNDR">
  <div class="divider-title"><span class="bar"></span><h1>Where<br>Membranes<br>Let Go</h1></div>
  ${footer(11)}
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

// 12 — When the Membrane Wears Out
pages.push(
  defectPage({
    title: "When the Membrane Wears Out",
    n: 12,
    intro: "Every membrane has a working life. Sun, heat, foot traffic and the slow grind of the building moving all chip away at it until, one wet week, it stops keeping water out.",
    body: [
      "Exposed membranes take the worst of it. The sun bakes them brittle, they crack, and the first heavy rain finds the gap. Membranes under tiles last longer but fail out of sight, so the first you hear of it is a stain on the ceiling below.",
      "Patching buys a little time, but a membrane that has reached the end is at the end across the whole area. Spot repairs on an old roof tend to just move the leak along.",
    ],
    listTitle: "What gives it away",
    list: ["Blistered, lifting or cracked membrane on show", "Drummy or loose tiles on a balcony or deck", "A fresh stain on the ceiling underneath", "Old repairs layered one over the other", "Paint or render lifting at the edges"],
    helpTitle: "How we sort it",
    help: [
      "We assess how much life is left in the membrane and whether the problem is one detail or the whole field. If it is localised, we say so and keep the scope small.",
      "When it has genuinely had it, we specify the replacement system and the substrate prep it needs, then check it goes down right.",
    ],
    did: "An exposed membrane in the Australian sun can lose years off its rated life if it was laid over the wrong primer or left without protection. The product is rarely the problem; the install usually is.",
  }),
);

// 13 — Water That Will Not Drain
pages.push(
  defectPage({
    title: "Water That Will Not Drain",
    n: 13,
    intro: "A membrane is meant to move water somewhere safe, not hold it. When a roof or deck cannot drain, water sits, and standing water finds every weakness it can.",
    body: [
      "Ponding comes from falls that were too flat to begin with, a slab that has deflected over time, or drains that have silted up and given up. Whatever the cause, water that lingers works on the membrane day and night and gets into any join that is less than perfect.",
      "It is one of the most common things we find on flat roofs and podium decks, and one of the most overlooked, because a dry day hides it completely.",
    ],
    listTitle: "What gives it away",
    list: ["Pools or dark tide-marks left after rain", "Silt, debris or growth around the drains", "Drains sitting above the surface, not below it", "A deck that drains slowly or not at all", "Staining that spreads from a low spot"],
    helpTitle: "How we sort it",
    help: [
      "We check the falls and the drainage before we touch the membrane, because a new membrane over a flat that still ponds is money wasted.",
      "The fix is usually cut-to-fall insulation to build the falls back in, sorting the drainage, or both, then the right membrane over the top.",
    ],
    did: "Standing water is also dead weight. A deck that ponds is carrying load it was never meant to hold, on top of the wear it does to the membrane.",
  }),
);

// 14 — The Joints and the Edges
pages.push(
  defectPage({
    title: "The Joints and the Edges",
    n: 14,
    intro: "A membrane rarely fails in the middle of a flat, open run. It fails where it has to turn a corner, wrap a pipe, meet a wall or bridge a moving joint.",
    body: [
      "Penetrations, upstands, flashings and expansion joints are the busy parts of any waterproofing job, and they are where shortcuts hide. A roof can look spotless across the field and still leak steadily at a single badly detailed pipe.",
      "Movement joints are their own challenge. They have to flex as the building expands and contracts, and still seal. A rigid patch over one just tears open the next time it moves.",
    ],
    listTitle: "What gives it away",
    list: ["Cracking or splitting at corners and upstands", "Sealant that has gone hard, pulled away or dropped out", "Lifting or rusting flashings", "Leaks tracking back to a pipe or drain", "An expansion joint that has been rigidly patched over"],
    helpTitle: "How we sort it",
    help: [
      "We go over the details one by one, because this is where the leak almost always is. Where the entry point is not obvious, we flood-test and trace the water back.",
      "Then we draw the junctions properly: the right termination, the right flashing, the right joint that can still move, so the repair holds at the points that matter.",
    ],
  }),
);

// 15 — Why Do It Properly (benefits)
const benefits: [string, string][] = [
  ["The leak is actually found", "We trace the water to its real source first, so the system you pay for fixes the problem instead of hiding it for a season."],
  ["The system suits the surface", "We match the membrane to the substrate, the traffic and the movement, not whatever the last contractor happened to have on the truck."],
  ["The structure lasts longer", "Keep water off the steel and out of the concrete and you head off spalling, corrosion and the far bigger repairs that follow."],
  ["The building stays healthier", "Dry walls and slabs mean less mould and damp, which matters to everyone who lives or works in the place."],
  ["You hear it straight", "We work for the building, not the applicator, so the advice is not bent to suit whoever ends up doing the work."],
  ["It is all on the record", "Specified, inspected and documented, so warranties stick and the next owner or insurer can see exactly what was done."],
];
pages.push(`
<section class="page content">
  <div class="imghead tall" style="${photo("photo-1521737604893-d14cc237f11d", C.ink)}">
    <img class="head-logo" src="${logoLight}" alt="XNDR">
    <div class="imghead-title"><span class="bar"></span><h2>Why Do It<br>Properly</h2></div>
  </div>
  <p class="lead green tight">Waterproofing is cheap to get right and expensive to get wrong. The membrane is a small part of the bill; the damage behind a failed one is the rest.</p>
  <div class="benefits">
    ${benefits.map(([h, t]) => `<div class="ben"><div class="ben-h">${esc(h)}</div><div class="ben-t">${esc(t)}</div></div>`).join("")}
  </div>
  ${footer(15)}
</section>`);

// 16 — Start the Conversation (Contact)
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
  .lead.tight { margin: 6mm 16mm 2mm; }
  .lead.tight2 { margin: 0 0 5mm; }
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

  .exp { background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1mm; padding: 4mm 5mm; margin-top: 4mm; }
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

  /* Building diagram */
  .diagram { display: grid; grid-template-columns: 1.12fr 0.88fr; gap: 10mm; padding-top: 2mm; align-items: center; }
  .diagram-art { background: ${C.paper}; border: 0.3mm solid ${C.line}; border-radius: 1.5mm; padding: 5mm; }
  .diagram-art svg { width: 100%; height: auto; display: block; }
  .zone { display: grid; grid-template-columns: 9mm 1fr; gap: 4mm; padding: 3.4mm 0; border-top: 0.3mm solid ${C.line}; align-items: start; }
  .zone:first-child { border-top: none; }
  .zone-n { width: 7mm; height: 7mm; border-radius: 50%; background: ${C.green}; color: #fff; font-weight: 800; font-size: 9.5pt; display: flex; align-items: center; justify-content: center; }
  .zone-t { font-weight: 800; font-size: 11pt; color: ${C.ink}; }
  .zone-d { font-size: 9pt; color: ${C.bodyMuted}; line-height: 1.45; margin-top: 0.6mm; }

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

const out = resolve(DESIGNS_DIR, "capability-statement-waterproofing-v5.pdf");
await renderHtmlToPdf(html, out);
console.log(`✓ Capability Statement (Waterproofing) → ${out}`);
