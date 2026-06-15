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
  title: string;
  category: string;
  year: string;
  image: string;
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

// Free, hotlinkable hero background video (Pexels — construction crew on site).
// Source: https://www.pexels.com/video/4271760/
export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/4271760/4271760-hd_1920_1080_30fps.mp4";

export const nav: { links: Link[]; cta: Link } = {
  links: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Start a project", href: "#contact" },
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
  // FOLLOW-UP: these are now real residential projects (granny flats, new builds,
  // retaining walls), but the `image` ids below are leftover stock from the old
  // commercial/infrastructure placeholders and DON'T match. Source better-suited
  // Unsplash photos per project — or, preferably, get Rinay's own site photos
  // (per QUESTIONS.md §5). Location + one-line descriptions from Rinay's email are
  // kept inline below so they're ready to wire in if/when the card adds those fields.
  items: [
    // Guildford — "Custom design featuring an integrated car hoist system."
    { title: "Granny Flat & Garage", category: "Residential", year: "2026", image: "photo-1590725140246-20acdee442be" },
    // Kellyville — "Structural design for a modern standalone home."
    { title: "New Residential Build", category: "Residential", year: "2026", image: "photo-1565008447742-97f6f38c985c" },
    // Box Hill — "Engineered support systems for residential site works."
    { title: "Retaining Wall Project", category: "Civil / Structural", year: "2026", image: "photo-1504307651254-35680f356dfd" },
    // Woy Woy — "Structural design for a premium residential dwelling."
    { title: "High-End Residence", category: "Residential", year: "2026", image: "photo-1487958449943-2429e8be8625" },
    // Newport — "Engineering oversight for a luxury residential build."
    { title: "High-End Residence", category: "Residential", year: "2026", image: "photo-1486406146926-c627a92ad1ab" },
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
