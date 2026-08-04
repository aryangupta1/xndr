import Image from "next/image";
import Link from "next/link";
import { remedialWork, projectImage } from "@/lib/content";

// Remedial track record — mirrors the Projects grid. Each card links to a
// standalone page at /projects/<slug>, which reuses ProjectDetail and shows the
// "case study coming soon" note until scope/details are populated. All images are
// Unsplash placeholders, so each renders in the fixed 4:3 box for placeholders.
// The section sits flush under Featured work (no top padding) so the two related
// grids read as one block instead of being separated by a full section gap.
export default function RemedialWork() {
  return (
    <section className="section section--flush-top" id="remedial">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{remedialWork.eyebrow}</span>
          <h2>{remedialWork.heading}</h2>
          <p>{remedialWork.subheading}</p>
        </div>

        <div className="projects-grid">
          {remedialWork.items.map((p) => {
            const src = projectImage(p.image, 800);
            const alt = `${p.category} — remedial project on ${p.title}, ${p.location}`;
            return (
              <Link className="project-card" key={p.slug} href={`/projects/${p.slug}`}>
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
                <div className="overlay" />
                <div className="meta">
                  <div>
                    <span className="tag">{p.category}</span>
                    <h3>{p.title}</h3>
                    <span className="loc">{p.location}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
