// ─────────────────────────────────────────────────────────────────────────────
// XNDR — Site content
//
// All copy below is PLACEHOLDER (lorem ipsum) by design. See QUESTIONS.md for the
// list of questions to ask the business owner before populating real content.
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
  heading: "Engineering certainty into every structure",
  subheading:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.",
  primaryCta: { label: "Book a consultation", href: "#contact" },
  secondaryCta: { label: "Our services", href: "#services" },
  stats: [
    { value: "200+", label: "Projects delivered" },
    { value: "15", label: "Years of practice" },
    { value: "100%", label: "Compliance record" },
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
  ],
  image: "photo-1503387762-592deb58ef4e", // engineer reviewing blueprints
  pillars: [
    {
      title: "Our vision",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    },
    {
      title: "Our approach",
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
    },
    {
      title: "Our standards",
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    },
  ],
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  items: [
    {
      number: "01",
      title: "Structural Engineering",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      points: ["Design & analysis", "Inspections & certification", "Load assessments"],
    },
    {
      number: "02",
      title: "Remedial Engineering",
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      points: ["Defect diagnosis", "Concrete & waterproofing repair", "Strengthening works"],
    },
    {
      number: "03",
      title: "Project Management",
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      points: ["Scope & programming", "Contractor coordination", "Cost & risk control"],
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  items: [
    { title: "Lorem Tower", category: "Commercial", year: "2025", image: "photo-1565008447742-97f6f38c985c" },
    { title: "Ipsum Bridge Remediation", category: "Remedial", year: "2024", image: "photo-1504307651254-35680f356dfd" },
    { title: "Dolor Civic Centre", category: "Structural", year: "2024", image: "photo-1487958449943-2429e8be8625" },
    { title: "Amet Transit Slab", category: "Infrastructure", year: "2023", image: "photo-1541888946425-d81bb19240f5" },
    { title: "Consectetur Plaza", category: "Commercial", year: "2023", image: "photo-1486406146926-c627a92ad1ab" },
    { title: "Adipiscing Residence", category: "Residential", year: "2022", image: "photo-1590725140246-20acdee442be" },
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
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
