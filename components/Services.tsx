import { services } from "@/lib/content";

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{services.eyebrow}</span>
          <h2>{services.heading}</h2>
          <p>{services.subheading}</p>
        </div>

        <div className="services-grid">
          {services.items.map((s) => (
            <article className="service-card" key={s.number}>
              <span className="num">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
