import { footer } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-img" role="img" aria-label="XNDR" />
            <p>{footer.blurb}</p>
            <div className="footer-contact">
              <a href={`mailto:${footer.email}`}>{footer.email}</a>
              <a href={`tel:${footer.phone.replace(/\s+/g, "")}`}>
                {footer.phone}
              </a>
            </div>
          </div>

          {footer.columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} XNDR. All rights reserved.</span>
          <div className="footer-social">
            {footer.social.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
