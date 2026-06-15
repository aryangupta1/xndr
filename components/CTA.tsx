import { cta, footer } from "@/lib/content";

export default function CTA() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="cta-banner">
          <h2>{cta.heading}</h2>
          <p>{cta.subheading}</p>
          <a className="btn btn-primary" href={`mailto:${footer.email}`}>
            {cta.button.label}
          </a>
        </div>
      </div>
    </section>
  );
}
