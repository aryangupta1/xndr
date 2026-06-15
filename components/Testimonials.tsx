import { testimonials } from "@/lib/content";

export default function Testimonials() {
  const t = testimonials.items[0];
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div
          className="section-head"
          style={{ marginInline: "auto", textAlign: "center" }}
        >
          <span className="eyebrow">{testimonials.eyebrow}</span>
          <h2>{testimonials.heading}</h2>
        </div>

        <div className="testimonial-wrap">
          <figure className="testimonial">
            <div className="stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption className="author">
              <div className="name">{t.name}</div>
              <div className="role">{t.role}</div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
