import Image from "next/image";
import { remedialWork, projectImage } from "@/lib/content";

// Remedial track record — mirrors the Projects grid visually, but the cards are
// static (no detail pages) since these are a portfolio-at-a-glance, not case
// studies. All images are Unsplash placeholders, so each renders in the fixed
// 4:3 box the card design uses for placeholders.
export default function RemedialWork() {
  return (
    <section className="section" id="remedial">
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
              <div className="project-card" key={`${p.title}-${p.location}`}>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
