// ─────────────────────────────────────────────────────────────────────────────
// XNDR — Site content
//
// Copy populated from Rinay Singh's answers (email, 15 Jun 2026). Outstanding
// gaps are flagged with TODO inline — chiefly contact details and footer/socials,
// which Rinay has not supplied yet. See QUESTIONS.md for the full list.
//
// Images are sourced from Unsplash (free to use). To swap an image, replace the
// `photo` id with another Unsplash photo id (the slug after `/photos/...`).
//
// Real project photos are imported statically from `public/projects/…` so Next
// carries their intrinsic dimensions — that lets the page shape each container to
// the photo's real aspect ratio instead of cropping it.
// ─────────────────────────────────────────────────────────────────────────────

import type { StaticImageData } from "next/image";
import kellyville1 from "@/public/projects/kellyville-1.jpeg";
import kellyville2 from "@/public/projects/kellyville-2.jpeg";
import kellyville3 from "@/public/projects/kellyville-3.jpeg";
import newport from "@/public/projects/newport.jpeg";
import newportPlanEntry from "@/public/projects/newport-plan-entry.png";
import newportPlanLiving from "@/public/projects/newport-plan-living.png";
import newportPlanLower from "@/public/projects/newport-plan-lower.png";
import newportMaterials from "@/public/projects/newport-materials.jpeg";
import woyWoy from "@/public/projects/woy-woy.jpeg";
import woyWoyPlanGarage from "@/public/projects/woy-woy-plan-garage.png";
import woyWoyPlanLiving from "@/public/projects/woy-woy-plan-living.png";
import woyWoyPlanUpper from "@/public/projects/woy-woy-plan-upper.png";
import grannyFlat from "@/public/projects/granny-flat-guildford.jpeg";
import retainingWall from "@/public/projects/retaining-wall-box-hill.jpeg";
import harbourBridge from "@/public/projects/sydney-harbour-bridge.jpeg";
import m1CrashBarrier from "@/public/projects/m1-crash-barrier.jpeg";
import tugunTunnel from "@/public/projects/tugun-tunnel.jpeg";
import kentwellRoad from "@/public/projects/kentwell-road.jpeg";
import walkerStreet from "@/public/projects/walker-street.jpeg";
import liverpoolRoad from "@/public/projects/liverpool-road.jpeg";
import bondiRoad from "@/public/projects/bondi-road.jpeg";
import denhamStreet from "@/public/projects/denham-street.jpeg";

// A project image is either a statically-imported local photo (with known
// dimensions) or an Unsplash photo id string used as a placeholder.
export type ProjectImage = StaticImageData | string;
export const isPlaceholderImage = (img: ProjectImage): img is string =>
  typeof img === "string";

// ── Types ────────────────────────────────────────────────────────────────────
export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Pillar {
  title: string;
  text: string;
}

export interface Service {
  number: string;
  title: string;
  text: string;
  points: string[];
}

// A labelled level shown in the interactive floor-plan explorer.
export interface ProjectFloor {
  label: string; // tab label, e.g. "Living level"
  caption: string; // one line describing what's on this level
  image: ProjectImage; // the floor-plan drawing (address-free crop)
}

export interface Project {
  slug: string; // URL segment for the standalone page: /projects/<slug>
  title: string;
  location: string;
  category: string;
  year: string;
  image: ProjectImage; // imported local photo, else a placeholder Unsplash id
  gallery?: ProjectImage[]; // extra photos shown on the detail page
  summary: string; // one-liner shown on the card + intro of the detail page
  // ── Detail-page fields — OUTSTANDING for the 3 projects without a plan set ──
  // The detail page degrades gracefully and shows a "coming soon" note for any
  // project without these populated.
  client?: string; // named only with client permission
  scope?: string[]; // bullet list of the works carried out
  services?: string[]; // which of the three disciplines applied
  details?: string[]; // longer write-up paragraphs (challenge → solution)
  facts?: Stat[]; // extra at-a-glance figures (levels, floor area, …)
  floors?: ProjectFloor[]; // interactive level-by-level plan explorer
  materialsImage?: ProjectImage; // finishes/materials board (suburb-safe crop)
  materialsNote?: string; // one line summarising the palette
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FooterColumn {
  title: string;
  links: Link[];
}

// Helper: build an optimized Unsplash URL for a given photo id.
export const unsplash = (id: string, w = 1200): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Helper: resolve a project image to something <Image> can consume. Local
// imports pass straight through (Next keeps their dimensions); placeholder
// Unsplash ids are expanded to an optimized URL.
export const projectImage = (image: ProjectImage, w = 1200): ProjectImage =>
  isPlaceholderImage(image) ? unsplash(image, w) : image;

// Free, hotlinkable hero background video (Pexels — breaking out failed concrete
// with a demolition hammer; on-theme for the practice's structural and remedial
// work). Uses the 1080p/60fps rendition to keep the hero light.
// Source: https://www.pexels.com/download/video/15959642/
export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/15959642/15959642-hd_1920_1080_60fps.mp4";

// Nav hrefs are root-absolute (`/#about`) so they also work from sub-pages such
// as the standalone project pages, not just the landing page.
export const nav: { links: Link[]; cta: Link } = {
  links: [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/#contact" },
  ],
  cta: { label: "Start a project", href: "/#contact" },
};

export const hero: {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCta: Link;
  secondaryCta: Link;
  stats: Stat[];
} = {
  eyebrow: "Structural · Remedial · Project Management",
  heading: "Built on trust, delivered with transparency",
  subheading:
    "XNDR delivers structural and remedial engineering solutions defined by technical rigor, absolute transparency, and a commitment to resolving complex building challenges for the strata and construction sectors across New South Wales.",
  primaryCta: { label: "Book a consultation", href: "#contact" },
  secondaryCta: { label: "Our services", href: "#services" },
  stats: [
    { value: "20+", label: "Projects delivered across NSW" },
    { value: "15+", label: "Years of combined experience" },
    { value: "100%", label: "Compliance focus" },
  ],
};

export const about: {
  eyebrow: string;
  heading: string;
  body: string[];
  image: string;
  pillars: Pillar[];
} = {
  eyebrow: "About XNDR",
  heading: "Precision engineering, grounded in real-world delivery",
  body: [
    "XNDR was built upon years of experience in the construction industry. A passion to engineer and genuinely help people build or remediate their dream homes was the foundation of its creation.",
    "Our practice was established to bridge the gap between complex engineering requirements and the clear, honest communication that building owners deserve.",
  ],
  image: "/about-engineer.jpg", // engineer reviewing blueprints (Unsplash 1503387762, shirt logo retouched to XNDR)
  pillars: [
    {
      title: "Our vision",
      text: "To set the industry standard for clarity and reliability in structural and remedial engineering.",
    },
    {
      title: "Our approach",
      text: "Proactive, hands-on problem solving that anticipates issues before they impact the client.",
    },
    {
      title: "Our standards",
      text: "Unwavering honesty and transparency throughout every stage of the project lifecycle.",
    },
  ],
  // FOLLOW-UP: Rinay supplied accreditations — Design Building Practitioner (DBP)
  // and Professional Engineer (under the DBPA) — but there's no field/component to
  // display them yet. Add an accreditations strip to the About section.
};

export const services: {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Service[];
} = {
  eyebrow: "What we do",
  heading: "Three disciplines, one accountable team",
  subheading:
    "Structural, remedial and project management expertise — delivered end to end for the strata and construction sectors across NSW.",
  items: [
    {
      number: "01",
      title: "Structural Engineering",
      text: "Delivering robust structural designs that ensure safety, compliance, and efficiency for new builds and renovations.",
      points: [
        "Residential framing & foundation design",
        "Retaining wall & support systems",
        "Structural certification & compliance",
      ],
    },
    {
      number: "02",
      title: "Remedial Engineering",
      text: "Specialist assessment and repair strategies to restore building performance, longevity, and structural safety.",
      points: [
        "Defects inspections & reporting (2–6 year statutory periods)",
        "Scope of works documentation for rectification",
        "Concrete cancer & waterproofing remediation",
      ],
    },
    {
      number: "03",
      title: "Project Management",
      text: "Coordinating the entire engineering process to ensure projects are delivered on time, within budget, and to the highest technical standard.",
      points: [
        "Tender management & contractor coordination",
        "Site supervision & quality assurance",
        "Defect rectification planning",
      ],
    },
  ],
};

export const projects: {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Project[];
} = {
  eyebrow: "Featured work",
  heading: "Bringing engineering visions to life with precision",
  subheading:
    "A selection of recent infrastructure, structural and residential projects — from major transport assets to bespoke homes across New South Wales and Queensland.",
  // Each item links to a standalone page at /projects/<slug>. Images live in
  // `public/projects/…` (real photos as static imports) or fall back to a
  // placeholder Unsplash id where a photo is not available yet. The six
  // infrastructure projects mirror the Infrastructure Remediation capability
  // statement; the four structural projects that follow them come from the
  // director's CV (see the comment above them).
  items: [
    {
      slug: "sydney-harbour-bridge-condition-assessment",
      title: "Sydney Harbour Bridge",
      location: "Sydney, NSW",
      category: "Infrastructure",
      year: "2026",
      image: harbourBridge,
      summary:
        "Structural condition assessment of the BridgeClimb access ways on the arch.",
      services: ["Remedial Engineering", "Structural Engineering"],
      scope: [
        "Structural condition assessment of the BridgeClimb access ways on the arch",
        "Inspection of stairs, ladders, walkways and handrail systems at height",
        "Grading of steel members, connections and protective-coating condition",
        "Access over live rail and roadway under strict asset-owner protocols",
        "Prioritised remedial recommendations to keep the climb in safe service",
        "Heritage-sensitive work on an iconic listed structure",
      ],
      details: [
        "A structural condition assessment of the climb access ways that run up the arch of the Sydney Harbour Bridge. Working at height over live rail and roadway, our engineers inspected the stairs, ladders, walkways and handrail systems that carry climbers along one of the most recognisable structures in the country.",
        "Every steel member, connection and protective coating was graded for condition, and the findings were distilled into a prioritised set of remedial recommendations. The work was carried out under the asset owner's strict access protocols and with the care a heritage-listed landmark demands, so the climb stays safely in service.",
      ],
    },
    {
      slug: "m1-eastern-distributor-pit-grate-kerb",
      title: "M1 Eastern Distributor — Pit, Grate & Kerb",
      location: "Sydney, NSW",
      category: "Infrastructure",
      year: "2026",
      image: "photo-1595066988978-c2686505d56f", // on-theme tunnel placeholder
      summary:
        "Remedial design for tunnel drainage pits, grates and kerbs in a live motorway tunnel.",
      services: ["Structural Engineering", "Remedial Engineering"],
      scope: [
        "Remedial structural engineering for tunnel drainage pits, grates and kerbs",
        "Condition assessment of cracked and spalled concrete pit walls and surrounds",
        "Design of pit reconstruction, grate seating and kerb reinstatement",
        "Durable detailing for an aggressive, heavily trafficked tunnel environment",
        "Scope documented for delivery inside short overnight closures",
        "Coordination with the operator and maintenance contractor",
      ],
      details: [
        "Remedial structural engineering for the drainage pits, grates and kerbs inside the M1 Eastern Distributor tunnel. Years of heavy traffic and an aggressive tunnel environment had left concrete pit walls and surrounds cracked and spalled, and the grate seatings and kerbs needing reinstatement.",
        "We assessed the condition of each element and designed the pit reconstruction, grate seating and kerb repairs with durable detailing suited to the tunnel. The scope was written so it could be priced and built inside short overnight closures, coordinated closely with the operator and the maintenance contractor to keep disruption to the motorway to a minimum.",
      ],
    },
    {
      slug: "m1-eastern-distributor-crash-barrier",
      title: "M1 Eastern Distributor — Crash & Operable Barrier",
      location: "Sydney, NSW",
      category: "Infrastructure",
      year: "2026",
      image: m1CrashBarrier,
      summary:
        "Design and reconstruction of the vehicle crash barrier and an operable barrier at the northbound portal.",
      services: ["Structural Engineering"],
      scope: [
        "Design and reconstruction of the vehicle crash barrier at the northbound portal",
        "Installation of an operable barrier outside the tunnel, northbound",
        "Structural design to the relevant road-safety barrier standards",
        "Foundation and anchorage design for the barrier system",
        "Buildability review for staged works alongside live traffic",
        "Documentation to support construction certification",
      ],
      details: [
        "Structural design and reconstruction of the vehicle crash barrier at the northbound portal of the M1 Eastern Distributor, together with a new operable barrier outside the tunnel. Both had to meet the relevant road-safety barrier standards while fitting the constraints of a busy portal.",
        "We designed the barrier system, its foundations and anchorage, and reviewed buildability for works staged alongside live traffic. The documentation was prepared to support construction certification, so the finished barriers could be built, verified and signed off with confidence.",
      ],
    },
    {
      slug: "tugun-tunnel-osd-tank",
      title: "Tugun Tunnel",
      location: "Tugun, QLD",
      category: "Infrastructure",
      year: "2026",
      image: tugunTunnel,
      summary:
        "Structural condition assessment of a confined, below-ground on-site detention tank.",
      services: ["Remedial Engineering", "Structural Engineering"],
      scope: [
        "Structural condition assessment of the underground on-site detention (OSD) tank",
        "Inspection of a confined, below-ground reinforced-concrete water structure",
        "Assessment of concrete condition, reinforcement corrosion and water tightness",
        "Review of structural adequacy and remaining service life",
        "Confined-space access and inspection planning",
        "Prioritised remedial recommendations for the asset owner",
      ],
      details: [
        "A structural condition assessment of the underground on-site detention (OSD) tank at the Tugun Bypass tunnel — a confined, below-ground reinforced-concrete water structure that is rarely seen and easily overlooked until it starts to fail.",
        "Our engineers planned confined-space access, then assessed the concrete condition, reinforcement corrosion and water tightness of the tank, and reviewed its structural adequacy and remaining service life. The result was a prioritised set of remedial recommendations the asset owner could act on to keep the structure performing.",
      ],
    },
    {
      slug: "ian-thorpe-aquatic-centre-remediation",
      title: "Ian Thorpe Aquatic Centre",
      location: "Ultimo, Sydney NSW",
      category: "Infrastructure",
      year: "2026",
      image: "photo-1690615961058-1d695ff218bc", // on-theme aquatic-centre placeholder
      summary:
        "Investigation and remediation of spalling concrete in a chlorinated, wet environment.",
      services: ["Remedial Engineering", "Structural Engineering"],
      scope: [
        "Investigation and remediation of spalling concrete at the aquatic centre",
        "Assessment of reinforcement corrosion in a chlorinated, wet environment",
        "Concrete-repair methodology and remedial design",
        "Scope documented for pricing and staged delivery around operations",
        "Durable repair detailing to extend the structure's service life",
        "Site inspections through construction",
      ],
      details: [
        "Investigation and remediation of spalling concrete at the Ian Thorpe Aquatic Centre. A chlorinated, constantly wet environment is unforgiving on reinforced concrete, and the corrosion driving the spalling had to be understood before any repair could hold.",
        "We assessed the reinforcement corrosion, developed a concrete-repair methodology and remedial design, and documented a scope that could be priced and delivered in stages around the centre's operations. Durable repair detailing was specified to extend the structure's service life, and we stayed on for site inspections through construction.",
      ],
    },
    {
      slug: "raaf-williamtown-fuel-tank-lining",
      title: "RAAF Base Williamtown — Jet Fuel Tank Lining",
      location: "Williamtown, NSW",
      category: "Infrastructure",
      year: "2026",
      image: "photo-1780882899461-0b158f457b44", // on-theme storage-tank placeholder
      summary:
        "Remedial lining and structural assessment of a jet fuel storage tank on a Defence base.",
      services: ["Remedial Engineering", "Structural Engineering"],
      scope: [
        "Remedial lining and remediation of a jet fuel storage tank",
        "Structural and durability assessment of the tank",
        "Repair and re-lining design suited to a fuel-containment environment",
        "Works planned to Defence site security and safety requirements",
        "Confined-space and hazardous-environment access planning",
        "Documentation to support compliant delivery",
      ],
      details: [
        "Remedial lining and remediation of a jet fuel storage tank at RAAF Base Williamtown. A fuel-containment structure on an operating Defence base sets a high bar: the repair has to restore the tank while meeting strict security, safety and environmental requirements.",
        "We carried out a structural and durability assessment of the tank and designed a repair and re-lining solution suited to a fuel-containment environment. Access was planned for a confined, hazardous space and around the base's security requirements, with documentation prepared to support compliant delivery.",
      ],
    },
    // ── Structural & infrastructure — earlier career, carried across from the
    // director's CVs (the supplied "Curriculum Vitae of Rinay Singh (2).pdf" and
    // designs/cv-rinay-singh.pdf on `design-engine`). St Elias Church was struck
    // out of the DESIGNED CV in the client's markup but is in the original CV and
    // was added on the client's later instruction to list every CV project — drop
    // it if they object. `year` is blank (the CVs give none).
    {
      slug: "warrick-lane-precinct-blacktown",
      title: "Warrick Lane Precinct Redevelopment",
      location: "Blacktown, NSW",
      category: "Structural",
      year: "",
      image: "photo-1506521781263-d8422e82f27a", // on-theme car-park placeholder
      summary:
        "Four-level underground car park for around 485 vehicles, with a rooftop park and two flanking buildings.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural design of a four-level underground car park for approximately 485 vehicles",
        "Central public park carried on the car-park roof slab",
        "Three-storey buildings flanking the car park to the east and west",
        "Design taken from concept stage through to tender documentation",
        "Principal structural engineer and peer review for the client during construction",
        "Variations, extensions of time and billing through the construction phase",
      ],
      details: [
        "A four-level underground car park for around 485 vehicles beneath a new central park, with three-storey buildings flanking the car park on its eastern and western sides. The park sits directly on the car-park roof slab, so the structure had to carry landscaping, public open space and the buildings either side while keeping the levels below clear and efficient.",
        "The structure was designed from concept stage through to tender, and the role continued through construction as principal structural engineer and peer reviewer for the client. That included checking the works against the specification and standards, resolving engineering issues as they arose on site, and managing variations, extensions of time and billing across the job.",
      ],
      facts: [
        { value: "4", label: "Underground levels" },
        { value: "~485", label: "Car spaces" },
        { value: "3", label: "Storeys either side" },
      ],
    },
    {
      slug: "rooty-hill-car-park-station-upgrade",
      title: "Rooty Hill Car Park & Station Upgrade",
      location: "Rooty Hill, NSW",
      category: "Infrastructure",
      year: "",
      image: "photo-1470224114660-3f6686c562eb", // on-theme multi-storey car-park placeholder
      summary:
        "Six-storey commuter car park for around 750 vehicles, with upgraded pedestrian links to both sides of the station.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural design and construction management of a six-storey car park for approximately 750 vehicles",
        "Upgraded pedestrian links to both sides of the railway station",
        "Management of the principal contractor on site",
        "Budget control, variations and extensions of time",
        "Engineering support and RFI responses through construction",
        "Compliance of the finished works with the specification and standards",
      ],
      details: [
        "A six-storey commuter car park for around 750 vehicles at Rooty Hill station, together with upgraded pedestrian links connecting both sides of the station. A car park of this scale next to a live rail corridor has to be staged carefully, and the pedestrian links had to keep commuters moving throughout.",
        "The role ran across design and construction: managing the principal contractor on site, holding the budget, running variations and RFIs, and making sure the works were built to the specification and the relevant standards.",
      ],
      facts: [
        { value: "6", label: "Storeys" },
        { value: "~750", label: "Car spaces" },
        { value: "2", label: "Station-side pedestrian links" },
      ],
    },
    {
      slug: "cranbrook-school-redevelopment-bellevue-hill",
      title: "Cranbrook School Redevelopment",
      location: "Bellevue Hill, NSW",
      category: "Structural",
      year: "",
      image: "photo-1530549387789-4c1017266635", // on-theme aquatic-centre placeholder
      summary:
        "Major school redevelopment: a new aquatic and fitness centre with a 50 m pool, theatre, assembly hall, chapel and eleven classrooms.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural design and construction management across the redevelopment",
        "New aquatic and fitness centre with a 50 m swimming pool",
        "Theatre, performance rooms, assembly hall and dining",
        "Chapel and eleven new classrooms",
        "Inspection of conventional reinforcement and post-tensioned (PT) ducts",
        "On-site engineering support, workmanship checks and RFI responses",
      ],
      details: [
        "A major redevelopment of the Cranbrook School campus: a new aquatic and fitness centre built around a 50 m swimming pool, a theatre and performance rooms, an assembly hall and dining, a chapel and eleven new classrooms. Long-span, post-tensioned concrete carried much of the structure.",
        "The work covered design and construction management, with the principal contractor managed on site. Conventional reinforcement and post-tensioned ducts were inspected before every pour, workmanship was held to a high standard, and engineering issues and RFIs were resolved as construction progressed.",
      ],
      facts: [
        { value: "50 m", label: "Swimming pool" },
        { value: "11", label: "New classrooms" },
        { value: "PT", label: "Post-tensioned concrete" },
      ],
    },
    {
      slug: "st-elias-church-guildford",
      title: "St Elias Church",
      location: "Guildford, NSW",
      category: "Structural",
      year: "",
      image: "photo-1473177104440-ffee2f376098", // on-theme church placeholder
      summary:
        "Two-level church built over a four-tier underground car park, in conventionally reinforced slab and beam.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural design and construction management of a two-level church over a four-tier underground car park",
        "Conventionally reinforced concrete slabs and beams throughout",
        "Management of the principal contractor on site",
        "Workmanship held to a high standard and checked against the specification and standards",
        "Budget control, variations and extensions of time",
        "Engineering support and RFI responses through construction",
      ],
      details: [
        "A large two-level Catholic church built over a four-tier underground car park. All slabs and beams were conventionally reinforced, and the church structure above had to be carried down through the car park levels without compromising the parking layout.",
        "The role covered design and construction management, managing the principal contractor on site, holding the budget and running variations and extensions of time, and making sure the works were built to the specification and the relevant standards.",
      ],
      facts: [
        { value: "2", label: "Church levels" },
        { value: "4", label: "Car-park tiers below" },
        { value: "RC", label: "Conventionally reinforced" },
      ],
    },
    {
      slug: "skyline-place-frenchs-forest",
      title: "Skyline Place",
      location: "Frenchs Forest, NSW",
      category: "Structural",
      year: "",
      image: "photo-1545324418-cc1a3fa10c00", // on-theme apartment placeholder
      summary:
        "Five-storey mixed-use apartments over cafés, medical suites and retail, with two levels of basement parking.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural design and construction management of a five-storey mixed-use building",
        "Apartments over ground-floor cafés, medical suites and retail",
        "Two levels of underground parking",
        "Inspection of conventional reinforcement and post-tensioned (PT) ducts",
        "Management of the principal contractor and workmanship checks on site",
        "Engineering support and RFI responses through construction",
      ],
      details: [
        "Five storeys of apartments over a mixed-use ground floor of cafés, medical suites and retail, with two levels of underground parking beneath. The change in use from level to level, and the transfer of loads down through the basement, drove the structural scheme.",
        "The role covered design and construction management, managing the principal contractor on site, inspecting conventional and post-tensioned reinforcement, checking workmanship and resolving RFIs so the finished building matched the specification and the standards.",
      ],
      facts: [
        { value: "5", label: "Storeys" },
        { value: "2", label: "Basement levels" },
        { value: "Mixed", label: "Residential over retail & medical" },
      ],
    },
    {
      slug: "granny-flat-garage-guildford",
      title: "Granny Flat & Garage",
      location: "Guildford, NSW",
      category: "Residential",
      year: "2026",
      image: grannyFlat,
      summary: "Custom design featuring an integrated car hoist system.",
    },
    {
      slug: "new-residential-build-kellyville",
      title: "New Residential Build",
      location: "Kellyville, NSW",
      category: "Residential",
      year: "2026",
      image: kellyville1,
      gallery: [kellyville2, kellyville3],
      summary: "Structural design for a modern standalone home.",
    },
    {
      slug: "retaining-wall-box-hill",
      title: "Retaining Wall Project",
      location: "Box Hill, NSW",
      category: "Civil / Structural",
      year: "2026",
      image: retainingWall,
      summary: "Engineered support systems for residential site works.",
    },
    {
      slug: "high-end-residence-woy-woy",
      title: "High-End Residence",
      location: "Woy Woy, NSW",
      category: "Residential",
      year: "2026",
      image: woyWoy,
      summary: "Structural design for a premium residential dwelling.",
      services: ["Structural Engineering"],
      scope: [
        "Structural design for a three-level dwelling on a steep bushland site",
        "Concrete-block lower level and garage anchoring the build into the slope",
        "Suspended floors with timber-framed upper levels and a metal roof",
        "Columns, retaining and right-of-carriageway constraints to engineer's details",
      ],
      details: [
        "Structural design for a three-level home of roughly 245 m² on a steeply sloping, heavily treed block of nearly 2,000 m². The dwelling steps up the hill — garage and entry at the base, open-plan living, kitchen and bedrooms on the main floor, and a private master suite above.",
        "A concrete-block lower level carries suspended floors and lightweight timber-framed upper storeys beneath a corrugated metal roof. The structure was engineered around a height-restriction zone and a 3.5 m right-of-carriageway, with columns and retaining detailed to suit the fall of the land.",
      ],
      facts: [
        { value: "3", label: "Levels" },
        { value: "244 m²", label: "Total floor area" },
        { value: "1,993 m²", label: "Site area" },
        { value: "0.12:1", label: "Floor space ratio" },
      ],
      floors: [
        {
          label: "Garage & entry",
          caption: "Garage and entry stair anchored into the slope.",
          image: woyWoyPlanGarage,
        },
        {
          label: "Living level",
          caption:
            "Kitchen, living and dining with two bedrooms and a bathroom.",
          image: woyWoyPlanLiving,
        },
        {
          label: "Master level",
          caption: "A private master suite with ensuite and walk-in robe above.",
          image: woyWoyPlanUpper,
        },
      ],
    },
    {
      slug: "high-end-residence-newport",
      title: "High-End Residence",
      location: "Newport, NSW",
      category: "Residential",
      year: "2026",
      image: newport,
      summary: "Engineering oversight for a luxury residential build.",
      services: ["Structural Engineering", "Project Management"],
      scope: [
        "Structural review across three split levels and a central lift shaft",
        "Stepped footings and retaining to suit the slope and geotechnical constraints",
        "Suspended concrete and timber-framed floor systems",
        "Coordination of structural detailing with the architectural design",
      ],
      details: [
        "Engineering oversight for a 320 m² split-level home stepping down a steep, vegetated Northern Beaches block. Three levels — garage and entry up top, open-plan living opening to a waterproofed entertaining deck, and a private bedroom level — are organised around a central lift.",
        "The site's flood-risk and geotechnical constraints, a strict 8.5 m height limit and significant fall across the block drove the structural approach: stepped footings and retaining, suspended concrete and timber-framed floors, and a lightweight Spandek metal roof.",
      ],
      facts: [
        { value: "3", label: "Split levels" },
        { value: "320 m²", label: "Gross floor area" },
        { value: "8.5 m", label: "Height limit" },
        { value: "C4", label: "Environmental living zone" },
      ],
      floors: [
        {
          label: "Entry & garage",
          caption:
            "Lounge, entry foyer and balcony beside a double garage at street level.",
          image: newportPlanEntry,
        },
        {
          label: "Living level",
          caption:
            "Open-plan kitchen, living and dining opening to a 44.5 m² waterproofed deck.",
          image: newportPlanLiving,
        },
        {
          label: "Bedroom level",
          caption:
            "Master suite, rumpus and three further bedrooms on the lower level.",
          image: newportPlanLower,
        },
      ],
      materialsImage: newportMaterials,
      materialsNote:
        "Polished-concrete render, Monument metal roofing, Textura-black glazing and blackbutt timber screens.",
    },
  ],
};

// ── Remedial track record ─────────────────────────────────────────────────────
// Remedial / structural-repair jobs across NSW strata and commercial buildings,
// carried across from the director's CV (designs/cv-rinay-singh.pdf on the
// `design-engine` branch). Each is a full Project so it gets a standalone page at
// /projects/<slug>. By request, addresses are road + suburb only (no street
// number) and the approximate contract values in the CV are deliberately omitted
// from the public site. `year` is left blank (the detail hero hides it when
// empty). Images are on-theme Unsplash placeholders (verified 200 OK) — swap the
// `image` id for a real photo. The last six are listed by address alone in the
// CVs, so their pages carry portfolio-level copy until the client supplies scope.
export const remedialWork: {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Project[];
} = {
  eyebrow: "Remedial track record",
  heading: "Remediation delivered across NSW strata",
  subheading:
    "Remedial and structural-repair projects across residential and commercial buildings — waterproofing and membrane renewal, concrete and spalling repair, façade and balcony remediation, and structural strengthening — carried from first inspection through tender and into construction.",
  items: [
    {
      slug: "boronia-street-kensington",
      title: "Boronia Street",
      location: "Kensington, NSW",
      category: "Roof & Envelope Remediation",
      year: "",
      image: "photo-1616320999187-3c004dad4f0b",
      summary:
        "Structural roof reconstruction and full building-envelope remediation — new timber and steel roof, membranes, cavity flashings and concrete repair.",
      services: ["Remedial Engineering", "Structural Engineering", "Project Management"],
      scope: [
        "Design and construction of new timber and steel roof structures",
        "Structural timber framing and complete roof replacement",
        "Balcony and courtyard membrane replacement",
        "Cavity flashing upgrades and wall capping details",
        "Concrete spalling repairs across the building envelope",
        "Waterproofing and cavity flashing specifications",
      ],
      details: [
        "A comprehensive structural and waterproofing overhaul of a multi-storey residential complex. The works centred on the full design and construction of new timber and steel roof structures, structural timber framing and a complete roof replacement.",
        "Beyond the roof, the scope ran across the whole building envelope: extensive balcony and courtyard membrane replacements, cavity flashing upgrades, wall capping details and concrete spalling repairs. We managed design and construction, specified the waterproofing and flashing details, and acted as superintendent through site inspections and handover.",
      ],
    },
    {
      slug: "walker-street-rhodes",
      title: "Walker Street",
      location: "Rhodes, NSW",
      category: "Structural & Podium Waterproofing",
      year: "",
      image: walkerStreet,
      summary:
        "Structural remediation, roof waterproofing works and podium waterproofing addressing systemic water ingress across all elevations.",
      services: ["Remedial Engineering", "Structural Engineering", "Project Management"],
      scope: [
        "Diagnostic site investigations of water ingress and structural deterioration",
        "Roof waterproofing works — new membrane to the roof slabs and upstands",
        "Balcony membrane replacements",
        "Elevated courtyard slab waterproofing",
        "Perimeter cavity flashing reinstatement",
        "Parapet coping and capping upgrades across all elevations",
        "Remedial design package, scope of works and contractor tender management",
      ],
      details: [
        "A full-scale remedial investigation and rectification of a high-density residential development suffering systemic water ingress and structural deterioration. Diagnostic site investigations traced the leaks to their sources before any repair was specified.",
        "The major works covered roof waterproofing works, with a new membrane to the roof slabs and upstands, balcony membrane replacements, waterproofing of the elevated courtyard slab, reinstatement of perimeter cavity flashings and parapet coping upgrades across all elevations. We prepared the remedial design package and scope of works, ran the contractor tender, and stayed on for quality assurance through to handover.",
      ],
    },
    {
      slug: "bondi-road-bondi-beach",
      title: "Bondi Road",
      location: "Bondi Beach, NSW",
      category: "Façade Remediation & Structural Repair",
      year: "",
      image: bondiRoad,
      summary:
        "Façade remediation, roof waterproofing works and structural repair to cantilevered balconies, courtyards and masonry cavity flashings.",
      services: ["Remedial Engineering", "Structural Engineering", "Project Management"],
      scope: [
        "Structural defect diagnostics",
        "Major concrete patch repairs to exposed cantilevered balconies",
        "Roof waterproofing works",
        "Re-waterproofing of private outdoor courtyards",
        "Replacement of compromised masonry cavity flashings",
        "Parapet capping installation",
        "Full tender documentation and contractor superintendency",
      ],
      details: [
        "A complex urban remedial scheme on a mixed-use commercial and residential block. Structural defect diagnostics identified the extent of deterioration in the exposed cantilevered balconies before the repair scheme was documented.",
        "The works involved major concrete patch repairs to the cantilevered balconies, roof waterproofing works, re-waterproofing of private outdoor courtyards, replacement of compromised masonry cavity flashings and parapet capping installation. We prepared full tender documentation, superintended the contractor and managed variations, RFIs and final handovers.",
      ],
    },
    {
      slug: "kentwell-road-allambie-heights",
      title: "Kentwell Road",
      location: "Allambie Heights, NSW",
      category: "Waterproofing & Masonry Rectification",
      year: "",
      image: kentwellRoad,
      summary:
        "Roof waterproofing works, site-wide waterproofing and masonry rectification across multiple residential blocks.",
      services: ["Remedial Engineering", "Project Management"],
      scope: [
        "Roof waterproofing works — new membrane to the flat roofs",
        "Multi-balcony membrane replacements",
        "Common-area courtyard waterproofing",
        "Brickwork cavity flashing integration",
        "Parapet wall capping works",
        "Structural steel corrosion treatment",
        "Quality control inspections and payment milestone sign-offs",
      ],
      details: [
        "A site-wide remedial upgrade across the multiple residential blocks of a strata community. Rectification works included roof waterproofing works, with new membranes laid to the flat roofs, membrane replacements to many balconies, common-area courtyard waterproofing, integration of new brickwork cavity flashings, parapet wall capping and treatment of corroding structural steel.",
        "We carried out remedial engineering superintendency across the site, ran quality control inspections as each stage was completed, and managed the budget and payment milestone sign-offs.",
      ],
    },
    {
      slug: "liverpool-road-strathfield",
      title: "Liverpool Road",
      location: "Strathfield, NSW",
      category: "Structural Strengthening & Façade",
      year: "",
      image: liverpoolRoad,
      summary:
        "Structural strengthening, roof waterproofing works and façade waterproofing — spalling treatment, re-waterproofing and new perimeter flashings.",
      services: ["Structural Engineering", "Remedial Engineering"],
      scope: [
        "Concrete spalling treatment on structural beams and slab edges",
        "Structural design and strengthening details",
        "Roof waterproofing works — new membrane to the rooftop and plant areas",
        "Balcony re-waterproofing",
        "New perimeter cavity flashings",
        "Coping capping sheet replacement",
        "Remedial scope preparation and on-site engineering support",
      ],
      details: [
        "An integrated structural repair and waterproofing campaign on a multi-storey residential development. Concrete spalling on structural beams and slab edges was treated and the members strengthened to our design details.",
        "Alongside the structural work, the scope included roof waterproofing works, with a new membrane over the rooftop and plant areas, balcony re-waterproofing, new perimeter cavity flashings and coping capping sheet replacement. We prepared the remedial scope, produced the strengthening details and provided on-site engineering support and RFI responses through construction.",
      ],
    },
    {
      slug: "mowbray-road-lane-cove",
      title: "Mowbray Road",
      location: "Lane Cove, NSW",
      category: "Courtyard & Balcony Waterproofing",
      year: "",
      image: "photo-1669170930713-f7c778496177",
      summary:
        "Courtyard waterproofing works and balcony remediation to stop leakage into lower-level garages and living areas.",
      services: ["Remedial Engineering", "Project Management"],
      scope: [
        "Leak investigation and water testing",
        "Courtyard waterproofing works — complete removal and re-installation of the waterproofing systems",
        "Complete removal and re-installation of balcony waterproofing systems",
        "Replacement of defective cavity flashings",
        "Technical specification and detail drawings",
      ],
      details: [
        "A major remediation of an established residential apartment complex, addressing extensive water leakage into the lower-level garages and living areas. Leak investigation and water testing pinned down the failing elements before the scheme was designed.",
        "The key works were courtyard waterproofing works — complete removal and re-installation of the courtyard waterproofing systems — together with the same treatment to the balconies and replacement of defective cavity flashings. We produced the technical specification and detail drawings, then superintended the works and managed progress through to completion.",
      ],
    },
    {
      slug: "denham-street-bondi",
      title: "Denham Street",
      location: "Bondi, NSW",
      category: "Magnesite & Concrete Repair",
      year: "",
      image: denhamStreet,
      summary:
        "Magnesite removal, concrete spalling repair, a new tiled roof and balcony remediation in an aggressive coastal environment.",
      services: ["Remedial Engineering", "Structural Engineering", "Project Management"],
      scope: [
        "Full stripping and removal of corrosive magnesite flooring",
        "Concrete slab repairs and structural spalling treatment",
        "New tiled roof — replacement of the existing roof covering",
        "Complete balcony membrane waterproofing and retiling",
        "Cavity flashing replacement",
        "Parapet wall capping works",
        "Magnesite repair methodology and design",
      ],
      details: [
        "Extensive structural and building envelope remediation of a coastal apartment building suffering severe magnesite attack and coastal concrete deterioration. Magnesite flooring holds moisture against the slab and corrodes the reinforcement beneath it, so the works began with full stripping and removal of the flooring.",
        "The concrete slabs were then repaired and the structural spalling treated, followed by a new tiled roof to replace the existing roof covering, complete balcony membrane waterproofing and retiling, cavity flashing replacement and parapet wall capping. We diagnosed the structural and spalling defects, set the magnesite repair methodology and design, administered the contract and carried out quality control inspections through to handover sign-off.",
      ],
    },
    {
      slug: "alfred-street-narraweena",
      title: "Alfred Street",
      location: "Narraweena, NSW",
      category: "Balcony & Envelope Remediation",
      year: "",
      image: "photo-1578907464594-fa58ed85c9b0",
      summary:
        "Balcony and building-envelope structural remediation across all elevations.",
      services: ["Remedial Engineering", "Project Management"],
      scope: [
        "Balcony waterproofing membrane overhaul",
        "Installation of new cavity flashings",
        "Wall capping works",
        "Concrete spalling repairs across all building elevations",
        "Waterproofing and flashing details",
        "Site superintendency and client reporting",
      ],
      details: [
        "A comprehensive waterproofing and structural repair program for a residential apartment block. The works included an overhaul of the balcony waterproofing membranes, new cavity flashings, wall capping works and concrete spalling repairs across all elevations of the building.",
        "We managed the design and engineering, produced the waterproofing and flashing details, and acted as site superintendent with regular reporting to the owners.",
      ],
    },
  ],
};

// Single testimonial, as requested.
export const testimonials: { eyebrow: string; heading: string; items: Testimonial[] } = {
  eyebrow: "Testimonials",
  heading: "Trusted by the people we build with",
  items: [{ quote: "The minds behind XNDR are truly exceptional.", name: "Aryan G", role: "Client" }],
};

export const cta: { heading: string; subheading: string; button: Link } = {
  heading: "Have a structure that needs a sharper mind?",
  subheading:
    "Talk to a Registered Design and Building Practitioner about your structural or remedial challenge — proactive, transparent advice from the first conversation.",
  button: { label: "Contact us", href: "#contact" },
};

export const footer: {
  blurb: string;
  email: string;
  phone: string;
  columns: FooterColumn[];
  social: Link[];
} = {
  blurb:
    "Structural and remedial engineering for the strata and construction sectors across New South Wales. Built on trust, delivered with transparency.",
  // Still outstanding from Rinay — office address, ABN and social links
  // (QUESTIONS.md §7). Email + phone supplied 15 Jun 2026.
  email: "info@xndr.au",
  phone: "",
  columns: [
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Structural Engineering", href: "#services" },
        { label: "Remedial Engineering", href: "#services" },
        { label: "Project Management", href: "#services" },
      ],
    },
  ],
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "https://www.instagram.com/xndrconsulting" },
    { label: "Facebook", href: "#" },
  ],
};
