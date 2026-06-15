"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import anime from "animejs";
import {
  type Project,
  type ProjectImage,
  projectImage,
  isPlaceholderImage,
} from "@/lib/content";

// Render a project image whether it's a static import (has intrinsic
// dimensions) or a placeholder Unsplash id (needs explicit width/height).
function Img({
  img,
  alt,
  w = 1400,
  h = 1050,
  sizes,
  priority,
  className,
}: {
  img: ProjectImage;
  alt: string;
  w?: number;
  h?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = projectImage(img, w);
  if (isPlaceholderImage(img)) {
    return (
      <Image src={src} alt={alt} width={w} height={h} sizes={sizes} priority={priority} className={className} />
    );
  }
  return <Image src={src} alt={alt} sizes={sizes} priority={priority} className={className} />;
}

export default function ProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const [activeFloor, setActiveFloor] = useState(0);

  const hasDetail =
    (project.scope?.length ?? 0) > 0 ||
    (project.services?.length ?? 0) > 0 ||
    (project.details?.length ?? 0) > 0 ||
    (project.floors?.length ?? 0) > 0;

  // Entrance + scroll-reveal animations (respect reduced-motion).
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveals = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [],
    );

    if (reduce) {
      reveals.forEach((el) => (el.style.opacity = "1"));
      return;
    }

    // Hero: gentle zoom-in of the image, staggered rise of the text.
    if (heroRef.current) {
      anime({ targets: heroRef.current, scale: [1.07, 1], opacity: [0, 1], duration: 1200, easing: "easeOutCubic" });
    }
    anime({
      targets: rootRef.current?.querySelectorAll(".project-hero-text > *") ?? [],
      translateY: [26, 0],
      opacity: [0, 1],
      delay: anime.stagger(90, { start: 240 }),
      duration: 720,
      easing: "easeOutCubic",
    });

    reveals.forEach((el) => (el.style.opacity = "0"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const kids = el.querySelectorAll<HTMLElement>("[data-stagger]");
          if (kids.length) {
            el.style.opacity = "1";
            anime({ targets: kids, translateY: [20, 0], opacity: [0, 1], delay: anime.stagger(70), duration: 620, easing: "easeOutCubic" });
          } else {
            anime({ targets: el, translateY: [28, 0], opacity: [0, 1], duration: 720, easing: "easeOutCubic" });
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Cross-fade the floor plan whenever the active level changes.
  useEffect(() => {
    if (!planRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    anime({ targets: planRef.current, opacity: [0, 1], scale: [1.015, 1], duration: 460, easing: "easeOutQuad" });
  }, [activeFloor]);

  const floors = project.floors ?? [];
  const current = floors[activeFloor];

  return (
    <main className="project-page" ref={rootRef}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="project-hero">
        <div className="project-hero-media" ref={heroRef}>
          <Img
            img={project.image}
            alt={`${project.title} — ${project.category} project in ${project.location}`}
            w={1600}
            h={1000}
            sizes="100vw"
            priority
          />
          <div className="project-hero-scrim" />
        </div>
        <div className="container">
          <Link className="project-back" href="/#projects">
            ← All projects
          </Link>
          <div className="project-hero-text">
            <span className="eyebrow">{project.category}</span>
            <h1>{project.title}</h1>
            <p className="project-hero-loc">
              {project.location} <span>·</span> {project.year}
            </p>
            <p className="project-hero-summary">{project.summary}</p>
          </div>
        </div>
      </section>

      <div className="container project-content">
        {/* ── At-a-glance facts ────────────────────────────────── */}
        {project.facts && project.facts.length > 0 && (
          <section className="project-stats" data-reveal>
            {project.facts.map((f) => (
              <div className="project-stat" data-stagger key={f.label}>
                <span className="project-stat-value">{f.value}</span>
                <span className="project-stat-label">{f.label}</span>
              </div>
            ))}
          </section>
        )}

        {/* ── Narrative ────────────────────────────────────────── */}
        {project.details && project.details.length > 0 && (
          <section className="project-prose" data-reveal>
            {project.details.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}

        {/* ── Interactive level explorer ───────────────────────── */}
        {floors.length > 0 && current && (
          <section className="project-levels" data-reveal>
            <div className="project-levels-head">
              <h2>Explore the levels</h2>
              <p>Tap through the plan set, level by level.</p>
            </div>
            <div className="project-levels-tabs" role="tablist" aria-label="Levels">
              {floors.map((f, i) => (
                <button
                  key={f.label}
                  role="tab"
                  aria-selected={i === activeFloor}
                  className={`project-level-tab${i === activeFloor ? " is-active" : ""}`}
                  onClick={() => setActiveFloor(i)}
                >
                  <span className="project-level-num">{`0${i + 1}`}</span>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="project-level-view">
              <div className="project-level-plan" ref={planRef} key={activeFloor}>
                <Img
                  img={current.image}
                  alt={`${project.title} — ${current.label} floor plan`}
                  w={1400}
                  h={1200}
                  sizes="(max-width: 880px) 100vw, 70vw"
                />
              </div>
              <p className="project-level-caption">
                <strong>{current.label}.</strong> {current.caption}
              </p>
            </div>
          </section>
        )}

        {/* ── Services + scope ─────────────────────────────────── */}
        {Boolean(project.services?.length || project.scope?.length) && (
          <section className="project-cols" data-reveal>
            {project.services && project.services.length > 0 && (
              <div className="project-col">
                <h2>Services provided</h2>
                <ul className="project-list">
                  {project.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.scope && project.scope.length > 0 && (
              <div className="project-col">
                <h2>Scope of works</h2>
                <ul className="project-list">
                  {project.scope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ── Materials & finishes ─────────────────────────────── */}
        {project.materialsImage && (
          <section className="project-materials" data-reveal>
            <div className="project-materials-head">
              <h2>Materials &amp; finishes</h2>
              {project.materialsNote && <p>{project.materialsNote}</p>}
            </div>
            <div className="project-materials-board">
              <Img
                img={project.materialsImage}
                alt={`${project.title} — materials and finishes board`}
                w={1400}
                h={905}
                sizes="(max-width: 880px) 100vw, 80vw"
              />
            </div>
          </section>
        )}

        {/* ── Photo gallery ────────────────────────────────────── */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="project-gallery" data-reveal>
            {project.gallery.map((img, i) => (
              <div className="project-gallery-item" data-stagger key={i}>
                <Img
                  img={img}
                  alt={`${project.title} — additional photo`}
                  w={1000}
                  h={750}
                  sizes="(max-width: 760px) 50vw, 33vw"
                />
              </div>
            ))}
          </section>
        )}

        {!hasDetail && (
          <p className="project-note" data-reveal>
            A detailed case study for this project is coming soon.
          </p>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="project-cta-row" data-reveal>
          <h2>Have a project like this?</h2>
          <Link className="btn btn-primary" href="/#contact">
            Discuss a similar project
          </Link>
        </section>
      </div>
    </main>
  );
}
