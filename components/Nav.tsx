"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import anime from "animejs";
import { nav } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";

// Floating pill header. Sits detached from the page edge, tightens and gains
// depth once the page is scrolled, slips away while scrolling down and comes
// back the moment the visitor scrolls up. A highlight glides between links to
// follow the cursor and the section currently in view, and a hairline along
// the bottom shows reading progress.
const SCROLLED_AT = 24; // px before the pill switches to its compact state
const HIDE_AFTER = 180; // px before scroll-down starts hiding the header
const DELTA = 6; // px of scroll needed to flip hide/show (ignores jitter)

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const openRef = useRef(false);
  activeIdRef.current = activeId;
  openRef.current = open;

  const idOf = (href: string) => href.replace(/^\/?#/, "");

  // Slide the highlight under `el` (or under the active link when null).
  const moveIndicator = useCallback((el: HTMLElement | null) => {
    const ind = indicatorRef.current;
    const wrap = linksRef.current;
    if (!ind || !wrap) return;
    const target =
      el ??
      (activeIdRef.current
        ? wrap.querySelector<HTMLElement>(`a[data-id="${activeIdRef.current}"]`)
        : null);
    if (!target) {
      ind.style.opacity = "0";
      return;
    }
    const w = wrap.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    ind.style.opacity = "1";
    ind.style.transform = `translateX(${r.left - w.left}px)`;
    ind.style.width = `${r.width}px`;
  }, []);

  // Scroll: compact state, hide/show direction, progress hairline.
  useEffect(() => {
    let lastY = window.scrollY;
    let hiddenNow = false;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > SCROLLED_AT);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      let next = hiddenNow;
      if (openRef.current || y <= HIDE_AFTER) next = false;
      else if (y > lastY + DELTA) next = true;
      else if (y < lastY - DELTA) next = false;
      if (next !== hiddenNow) {
        hiddenNow = next;
        setHidden(next);
      }
      if (Math.abs(y - lastY) > DELTA) lastY = y;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Which section is on screen → active link (home page only; on other pages
  // none of the ids exist and nothing is highlighted).
  useEffect(() => {
    const sections = nav.links
      .map((l) => document.getElementById(idOf(l.href)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Prefer the entry nearest the top of the viewport among those visible.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) {
          if (window.scrollY < 200) setActiveId(null);
          return;
        }
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    moveIndicator(null);
  }, [activeId, moveIndicator]);

  // Drop-in entrance on first paint.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime({
      targets: el.querySelector(".nav-pill"),
      translateY: [-28, 0],
      opacity: [0, 1],
      duration: 900,
      delay: 120,
      easing: "easeOutCubic",
    });
  }, []);

  // Keep the highlight aligned if fonts/layout shift.
  useEffect(() => {
    const onResize = () => moveIndicator(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveIndicator]);

  const cls = ["nav", scrolled ? "is-scrolled" : "", hidden && !open ? "is-hidden" : "", open ? "is-open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls} ref={headerRef}>
      <div className="nav-pill">
        <div className="nav-inner">
          <a href="/#top" className="nav-logo" aria-label="XNDR home">
            <span
              className="logo-img"
              role="img"
              aria-label="XNDR — Structural, Remedial & Project Management"
            />
          </a>

          <nav
            className="nav-links"
            aria-label="Primary"
            ref={linksRef}
            onMouseLeave={() => moveIndicator(null)}
          >
            <span className="nav-indicator" aria-hidden="true" ref={indicatorRef} />
            {nav.links.map((l) => {
              const id = idOf(l.href);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  data-id={id}
                  className={activeId === id ? "is-active" : undefined}
                  aria-current={activeId === id ? "location" : undefined}
                  onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                  onFocus={(e) => moveIndicator(e.currentTarget)}
                  onBlur={() => moveIndicator(null)}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <a className="btn btn-primary nav-cta" href={nav.cta.href}>
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
            <a className="btn btn-primary" href={nav.cta.href} onClick={() => setOpen(false)}>
              {nav.cta.label}
            </a>
          </nav>
        )}

        <span className="nav-progress" aria-hidden="true" ref={progressRef} />
      </div>
    </header>
  );
}
