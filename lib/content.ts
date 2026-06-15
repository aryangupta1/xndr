// ─────────────────────────────────────────────────────────────────────────────
// XNDR — Site content
//
// Copy populated from Rinay Singh's answers (email, 15 Jun 2026). Outstanding
// gaps are flagged with TODO inline — chiefly contact details and footer/socials,
// which Rinay has not supplied yet. See QUESTIONS.md for the full list.
//
// Images are sourced from Unsplash (free to use). To swap an image, replace the
// `photo` id with another Unsplash photo id (the slug after `/photos/...`).
// ─────────────────────────────────────────────────────────────────────────────

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
  image: string; // local "/projects/…" path, else a placeholder Unsplash id
  gallery?: string[]; // extra photos shown on the detail page
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

// Helper: resolve a project image. Local files (supplied by Rinay, kept in
// `public/projects/…`) start with "/" and are served as-is; anything else is
// treated as a placeholder Unsplash photo id.
export const projectImage = (image: string, w = 1200): string =>
  image.startsWith("/") ? image : unsplash(image, w);

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
    "XNDR was founded by Rinay Singh, who built a foundational expertise in structural integrity through a Bachelor of Engineering and a Master of Engineering in Structural Engineering from the University of Melbourne.",
    "With over a decade of industry experience, the practice was established to bridge the gap between complex engineering requirements and the clear, honest communication that building owners deserve.",
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
      image: "/projects/kellyville-1.jpeg",
      gallery: [
        "/projects/kellyville-2.jpeg",
        "/projects/kellyville-3.jpeg",
        "/projects/kellyville-4.jpeg",
      ],
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
      image: "/projects/woy-woy.jpeg",
      summary: "Structural design for a premium residential dwelling.",
    },
    {
      slug: "high-end-residence-newport",
      title: "High-End Residence",
      location: "Newport, NSW",
      category: "Residential",
      year: "2026",
      image: "/projects/newport.jpeg",
      summary: "Engineering oversight for a luxury residential build.",
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
  // TODO: still outstanding from Rinay — business email, phone, office address,
  // ABN and social links (QUESTIONS.md §7). Placeholders below until supplied.
  email: "hello@xndr.example", // TODO: replace with real email
  phone: "+61 0000 000 000", // TODO: replace with real phone
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
