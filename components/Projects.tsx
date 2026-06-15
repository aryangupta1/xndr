import Image from "next/image";
import Link from "next/link";
import { projects, unsplash } from "@/lib/content";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{projects.eyebrow}</span>
          <h2>{projects.heading}</h2>
          <p>{projects.subheading}</p>
        </div>

        <div className="projects-grid">
          {projects.items.map((p) => (
            <Link className="project-card" key={p.slug} href={`/projects/${p.slug}`}>
              <Image
                src={unsplash(p.image, 800)}
                alt={`${p.title} — ${p.category} project in ${p.location}`}
                width={800}
                height={1000}
              />
              <div className="overlay" />
              <div className="meta">
                <div>
                  <span className="tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <span className="loc">{p.location}</span>
                </div>
                <span className="year">{p.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
