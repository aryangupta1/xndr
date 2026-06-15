import { hero, HERO_VIDEO } from "@/lib/content";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=60"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      <div className="container hero-inner">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1>{hero.heading}</h1>
        <p className="lead">{hero.subheading}</p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <a className="btn btn-ghost" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>

        <div className="hero-stats">
          {hero.stats.map((s) => (
            <div className="stat" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
