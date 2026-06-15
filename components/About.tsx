import Image from "next/image";
import { about, unsplash } from "@/lib/content";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-media">
          <Image
            src={unsplash(about.image, 900)}
            alt="XNDR engineer reviewing structural drawings"
            width={900}
            height={1125}
          />
        </div>

        <div className="about-body">
          <span className="eyebrow">{about.eyebrow}</span>
          <h2>{about.heading}</h2>
          {about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <div className="about-pillars">
            {about.pillars.map((p) => (
              <div className="pillar" key={p.title}>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
