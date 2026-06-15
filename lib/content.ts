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
import kellyville4 from "@/public/projects/kellyville-4.jpeg";
import newport from "@/public/projects/newport.jpeg";
import woyWoy from "@/public/projects/woy-woy.jpeg";

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

export interface Project {
  slug: string; // URL segment for the standalone page: /projects/<slug>
  title: string;
  location: string;
  category: string;
  year: string;
  image: ProjectImage; // imported local photo, else a placeholder Unsplash id
  gallery?: ProjectImage[]; // extra photos shown on the detail page
  summary: string; // one-liner shown on the card + intro of the detail page
  // ── Detail-page fields — OUTSTANDING, awaiting Rinay (see QUESTIONS.md §5) ──
  // Left empty for now; the detail page degrades gracefully and shows a
  // "more detail coming soon" note for any project without these populated.
  client?: string; // named only with client permission
  scope?: string[]; // bullet list of the works carried out
  services?: string[]; // which of the three disciplines applied
  details?: string[]; // longer write-up paragraphs (challenge → solution)
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

// Free, hotlinkable hero background video (Pexels — construction crew on site).
// Source: https://www.pexels.com/video/4271760/
export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/4271760/4271760-hd_1920_1080_30fps.mp4";

// Nav hrefs are root-absolute (`/#about`) so they also work from sub-pages such
// as the standalone project pages, not just the landing page.
export const nav: { links: Link[]; cta: Link } = {
  links: [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Testimonials", href: "/#testimonials" },
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
  image: "photo-1503387762-592deb58ef4e", // engineer reviewing blueprints
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
  eyebrow: "Selected work",
  heading: "Bringing engineering visions to life with precision",
  subheading:
    "A selection of recent residential and structural projects delivered across New South Wales.",
  // Each item links to a standalone page at /projects/<slug>. Images supplied by
  // Rinay live in `public/projects/…`; the two without photos yet (Guildford,
  // Box Hill) fall back to a placeholder Unsplash id. The detail fields
  // (scope/services/details) are still OUTSTANDING — see QUESTIONS.md §5.
  // summary + location are from Rinay's email (15 Jun 2026).
  items: [
    {
      slug: "granny-flat-garage-guildford",
      title: "Granny Flat & Garage",
      location: "Guildford, NSW",
      category: "Residential",
      year: "2026",
      image: "photo-1590725140246-20acdee442be", // TODO: placeholder — awaiting photo
      summary: "Custom design featuring an integrated car hoist system.",
    },
    {
      slug: "new-residential-build-kellyville",
      title: "New Residential Build",
      location: "Kellyville, NSW",
      category: "Residential",
      year: "2026",
      image: kellyville1,
      gallery: [kellyville2, kellyville3, kellyville4],
      summary: "Structural design for a modern standalone home.",
    },
    {
      slug: "retaining-wall-box-hill",
      title: "Retaining Wall Project",
      location: "Box Hill, NSW",
      category: "Civil / Structural",
      year: "2026",
      image: "photo-1504307651254-35680f356dfd", // TODO: placeholder — awaiting photo
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
    },
  ],
};

// Single testimonial, as requested.
export const testimonials: { eyebrow: string; heading: string; items: Testimonial[] } = {
  eyebrow: "Testimonials",
  heading: "Trusted by the people we build with",
  items: [{ quote: "Rinay is an exceptional mind.", name: "Aryan G", role: "Client" }],
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
  phone: "0423 322 772",
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
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};
