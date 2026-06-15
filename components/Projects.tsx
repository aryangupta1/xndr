import Image from "next/image";
import Link from "next/link";
import { projects, projectImage, isPlaceholderImage } from "@/lib/content";

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
          {projects.items.map((p) => {
            const src = projectImage(p.image, 800);
            const alt = `${p.title} — ${p.category} project in ${p.location}`;
            return (
              <Link className="project-card" key={p.slug} href={`/projects/${p.slug}`}>
                {/* Local photos keep their real aspect ratio; placeholders get a
                    fixed 4:3 box until a real photo replaces them. */}
                {isPlaceholderImage(p.image) ? (
                  <Image src={src} alt={alt} width={1200} height={900} sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw" />
                ) : (
                  <Image src={src} alt={alt} sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw" />
                )}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
