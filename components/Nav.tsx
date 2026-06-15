"use client";

import { useState } from "react";
import Image from "next/image";
import { nav } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="nav-logo" aria-label="XNDR home">
          <Image
            src="/logo-nav.png"
            alt="XNDR — Structural, Remedial & Project Management"
            width={880}
            height={614}
            priority
          />
        </a>

        <nav className="nav-links" aria-label="Primary">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="btn btn-primary" href={nav.cta.href}>
            {nav.cta.label}
          </a>
          <button
            className={`nav-toggle${open ? " open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav className="nav-mobile" aria-label="Mobile">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={nav.cta.href}
            onClick={() => setOpen(false)}
          >
            {nav.cta.label}
          </a>
        </nav>
      )}
    </header>
  );
}
