"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import anime from "animejs";
import { services } from "@/lib/content";

// How long each discipline stays on stage before auto-advancing. Pauses on
// hover/focus, stops entirely once the visitor picks one themselves, and is
// disabled under prefers-reduced-motion.
const AUTO_MS = 7000;

// Line-art per discipline, drawn stroke-by-stroke on every switch, in a
// 260×200 box. `heavy` strokes are thick and round-capped (Gantt bars),
// `faint` ones sit back as construction lines, `idle` strokes get a gentle
// looping motion once the drawing has finished (see IDLE below).
type Stroke = { d: string; heavy?: boolean; faint?: boolean; idle?: boolean; dot?: boolean };
const ICONS: Stroke[][] = [
  // 01 Structural — portal frame with a roof truss on pad footings, under a
  // distributed load; dimension line beneath.
  [
    { d: "M16 172 H244" },
    { d: "M36 172l-10 10M76 172l-10 10M116 172l-10 10M156 172l-10 10M196 172l-10 10M236 172l-10 10", faint: true },
    { d: "M44 172v-10h32v10 M184 172v-10h32v10" },
    { d: "M60 162V78" },
    { d: "M200 162V78" },
    { d: "M52 78 L130 46 L208 78" },
    { d: "M52 78 H208" },
    { d: "M91 78V62 M130 78V46 M169 78V62 M91 62L130 78 M169 62L130 78" },
    { d: "M60 188H200 M60 183v10 M200 183v10", faint: true },
    { d: "M100 20v14m-6-5l6 6 6-6 M130 12v14m-6-5l6 6 6-6 M160 20v14m-6-5l6 6 6-6", idle: true },
  ],
  // 02 Remedial — masonry elevation with a crack, crack-stitch bars and
  // injection ports; an inspection scan line sweeps the wall.
  [
    { d: "M28 28 H232 V172 H28 Z" },
    { d: "M28 64H232 M28 100H232 M28 136H232", faint: true },
    { d: "M80 28V64 M180 28V64 M60 64V100 M200 64V100 M80 100V136 M180 100V136 M60 136V172 M200 136V172", faint: true },
    { d: "M128 28 l-8 24 l14 20 l-10 22 l12 20 l-8 24 l10 34" },
    { d: "M104 66h34" },
    { d: "M110 94h34" },
    { d: "M112 122h34" },
    { d: "M104 150h34" },
    { d: "M117 52a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M130 114a4 4 0 1 0 8 0a4 4 0 1 0-8 0", dot: true },
    { d: "M36 44H224", idle: true },
  ],
  // 03 Project management — Gantt programme with dependencies, a milestone
  // and a today-line that tracks across.
  [
    { d: "M28 28 V172 H232" },
    { d: "M28 64H232 M28 100H232 M28 136H232", faint: true },
    { d: "M70 172v8 M112 172v8 M154 172v8 M196 172v8" },
    { d: "M48 46H118", heavy: true },
    { d: "M84 82H166", heavy: true },
    { d: "M126 118H214", heavy: true },
    { d: "M118 46V64H84V82 M166 82V100H126V118", faint: true },
    { d: "M200 145l9 9-9 9-9-9z" },
    { d: "M96 28V172", idle: true },
  ],
];

// Idle motion applied to the `idle` strokes after the draw finishes.
const IDLE: anime.AnimeParams[] = [
  { translateY: [0, 5], duration: 1300, easing: "easeInOutSine", direction: "alternate", loop: true },
  { translateY: [0, 118], duration: 2800, easing: "easeInOutSine", direction: "alternate", loop: true },
  { translateX: [0, 84], duration: 3400, easing: "easeInOutSine", direction: "alternate", loop: true },
];

export default function Services() {
  const items = services.items;
  const n = items.length;

  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeRef = useRef(0);
  const revealed = useRef(false);
  const busy = useRef(false);
  const hovered = useRef(false);
  const visible = useRef(false);
  const autoplayRef = useRef(true);
  const reduce = useRef(false);
  const progress = useRef<anime.AnimeInstance | null>(null);
  const idle = useRef<anime.AnimeInstance | null>(null);
  const goRef = useRef<(i: number, manual?: boolean) => void>(() => {});

  activeRef.current = active;
  autoplayRef.current = autoplay;

  const stopIdle = () => {
    idle.current?.pause();
    idle.current = null;
  };

  const syncPlayback = useCallback(() => {
    const p = progress.current;
    if (!p) return;
    if (hovered.current || !visible.current || !autoplayRef.current) p.pause();
    else p.play();
  }, []);

  const startProgress = useCallback(() => {
    progress.current?.pause();
    progress.current = null;
    const rails = rootRef.current?.querySelectorAll<HTMLElement>(".disc-tab-rail");
    if (rails) anime.set(rails, { scaleX: 0 });
    if (reduce.current || !autoplayRef.current) return;
    const rail = tabRefs.current[activeRef.current]?.querySelector<HTMLElement>(".disc-tab-rail");
    if (!rail) return;
    progress.current = anime({
      targets: rail,
      scaleX: [0, 1],
      duration: AUTO_MS,
      easing: "linear",
      autoplay: false,
      complete: () => goRef.current((activeRef.current + 1) % n),
    });
    syncPlayback();
  }, [n, syncPlayback]);

  // Bring the freshly-rendered discipline onto the stage: accent bar sweeps
  // the top edge, the glow drifts, the copy staggers up, and the illustration
  // draws itself stroke by stroke before its idle motion kicks in.
  const animateIn = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const idx = activeRef.current;
    const bits = stage.querySelectorAll(".stage-anim");
    const icon = stage.querySelector<SVGSVGElement>(".stage-icon");
    const paths = stage.querySelectorAll<SVGPathElement>(".stage-icon path");
    const idlePaths = stage.querySelectorAll<SVGPathElement>(".stage-icon path.idle");
    const wipe = stage.querySelector(".stage-wipe");
    const glow = stage.querySelector<HTMLElement>(".stage-glow");
    stopIdle();

    // On phones the tabs are a horizontally scrolling row — keep the active
    // one in view (scrolls only that row, never the page).
    const tabsRow = rootRef.current?.querySelector<HTMLElement>(".disc-tabs");
    const tab = tabRefs.current[idx];
    if (tabsRow && tab && tabsRow.scrollWidth > tabsRow.clientWidth + 1) {
      tabsRow.scrollTo({ left: Math.max(0, tab.offsetLeft - 8), behavior: reduce.current ? "auto" : "smooth" });
    }

    const startIdle = () => {
      if (reduce.current || idlePaths.length === 0) return;
      idle.current = anime({ targets: idlePaths, ...IDLE[idx % IDLE.length] });
    };

    if (reduce.current) {
      anime.set(bits, { opacity: 1, translateY: 0 });
      anime.set(icon, { opacity: 1 });
      anime.set(paths, { strokeDashoffset: 0, opacity: 1 });
      busy.current = false;
      return;
    }

    anime.set(bits, { opacity: 0, translateY: 22 });
    anime.set(icon, { opacity: 1, translateY: 0, scale: 1 });
    anime.set(paths, { strokeDashoffset: (el: SVGPathElement) => anime.setDashoffset(el), opacity: 1 });
    anime.set(idlePaths, { translateX: 0, translateY: 0 });

    anime
      .timeline({ easing: "easeOutCubic" })
      .add({ targets: wipe, translateX: ["-100%", "0%"], duration: 400, easing: "easeInOutQuart" }, 0)
      .add({ targets: wipe, translateX: ["0%", "100%"], duration: 400, easing: "easeInOutQuart" }, 400)
      .add({ targets: glow, translateX: `${idx * 28 - 28}%`, duration: 1000, easing: "easeInOutQuad" }, 0)
      .add({ targets: bits, opacity: [0, 1], translateY: [22, 0], duration: 640, delay: anime.stagger(70) }, 180)
      .add(
        {
          targets: paths,
          strokeDashoffset: [(el: SVGPathElement) => anime.setDashoffset(el), 0],
          duration: 1100,
          easing: "easeInOutSine",
          delay: anime.stagger(70),
          complete: startIdle,
        },
        200,
      )
      .finished.then(() => {
        busy.current = false;
      });
    startProgress();
  }, [startProgress]);

  // Switch discipline: play the outgoing content off the stage, then swap
  // state so React renders the next one and `animateIn` picks it up.
  const go = useCallback((next: number, manual = false) => {
    if (manual && autoplayRef.current) setAutoplay(false);
    if (next === activeRef.current || busy.current) return;
    progress.current?.pause();
    progress.current = null;
    stopIdle();
    if (reduce.current || !revealed.current) {
      setActive(next);
      return;
    }
    busy.current = true;
    const stage = stageRef.current!;
    anime
      .timeline({ easing: "easeInCubic" })
      .add({ targets: stage.querySelectorAll(".stage-anim"), opacity: [1, 0], translateY: [0, -16], duration: 220, delay: anime.stagger(25) }, 0)
      .add({ targets: stage.querySelector(".stage-icon"), opacity: [1, 0], translateY: [0, -10], scale: [1, 0.97], duration: 240 }, 0)
      .finished.then(() => setActive(next));
  }, []);
  goRef.current = go;

  // Initial hide + scroll reveal (once). Skipped under reduced motion.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const head = (root.closest("section") ?? root).querySelectorAll(".section-head > *");
    const tabs = root.querySelectorAll(".disc-tab, .disc-hint");

    if (!reduce.current) {
      anime.set(head, { opacity: 0, translateY: 24 });
      anime.set(tabs, { opacity: 0, translateX: -28 });
      anime.set(stage, { opacity: 0, translateY: 36 });
      anime.set(stage.querySelectorAll(".stage-anim, .stage-icon"), { opacity: 0 });
    }

    const reveal = () => {
      if (revealed.current) return;
      revealed.current = true;
      if (reduce.current) {
        animateIn();
        return;
      }
      busy.current = true;
      anime
        .timeline({ easing: "easeOutCubic" })
        .add({ targets: head, opacity: [0, 1], translateY: [24, 0], duration: 700, delay: anime.stagger(90) }, 0)
        .add({ targets: tabs, opacity: [0, 1], translateX: [-28, 0], duration: 700, delay: anime.stagger(110) }, 200)
        .add({ targets: stage, opacity: [0, 1], translateY: [36, 0], duration: 800 }, 260)
        .finished.then(animateIn);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.current = e.isIntersecting;
          if (e.intersectionRatio >= 0.3) reveal();
          syncPlayback();
        }
      },
      { threshold: [0, 0.3] },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      progress.current?.pause();
      idle.current?.pause();
    };
  }, [animateIn, syncPlayback]);

  // Every time the active discipline changes after reveal, run the entrance.
  useLayoutEffect(() => {
    if (!revealed.current) return;
    animateIn();
  }, [active, animateIn]);

  useEffect(() => {
    if (!autoplay) {
      progress.current?.pause();
      progress.current = null;
      const rails = rootRef.current?.querySelectorAll<HTMLElement>(".disc-tab-rail");
      if (rails) anime.set(rails, { scaleX: 0 });
    }
    syncPlayback();
  }, [autoplay, syncPlayback]);

  const onKey = (e: KeyboardEvent) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    go(next, true);
  };

  const s = items[active];
  const icon = ICONS[active % ICONS.length];

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{services.eyebrow}</span>
          <h2>{services.heading}</h2>
          <p>{services.subheading}</p>
        </div>

        <div
          className="disciplines"
          ref={rootRef}
          onMouseEnter={() => {
            hovered.current = true;
            syncPlayback();
          }}
          onMouseLeave={() => {
            hovered.current = false;
            syncPlayback();
          }}
          onFocusCapture={() => {
            hovered.current = true;
            syncPlayback();
          }}
          onBlurCapture={() => {
            hovered.current = false;
            syncPlayback();
          }}
        >
          <div className="disc-tabs" role="tablist" aria-orientation="vertical" onKeyDown={onKey}>
            {items.map((item, i) => (
              <button
                key={item.number}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`disc-tab-${i}`}
                aria-selected={i === active}
                aria-controls="disc-stage"
                tabIndex={i === active ? 0 : -1}
                className={`disc-tab${i === active ? " is-active" : ""}`}
                onClick={() => go(i, true)}
              >
                <span className="disc-tab-num">{item.number}</span>
                <span className="disc-tab-title">{item.title}</span>
                <span className="disc-tab-arrow" aria-hidden="true">
                  →
                </span>
                <span className="disc-tab-rail" aria-hidden="true" />
              </button>
            ))}
            <p className="disc-hint">
              {autoplay ? "Cycling automatically — hover to pause, pick one to stay." : "Use ↑ ↓ to move between disciplines."}
            </p>
          </div>

          <div
            className="disc-stage"
            id="disc-stage"
            role="tabpanel"
            aria-labelledby={`disc-tab-${active}`}
            ref={stageRef}
          >
            <span className="stage-glow" aria-hidden="true" />
            <span className="stage-wipe" aria-hidden="true" />
            <span className="stage-corner stage-corner--tl" aria-hidden="true" />
            <span className="stage-corner stage-corner--br" aria-hidden="true" />

            <div className="stage-art">
              <svg className="stage-icon" viewBox="0 0 260 200" aria-hidden="true" focusable="false">
                {icon.map((p, i) => (
                  <path
                    key={`${active}-${i}`}
                    d={p.d}
                    className={
                      [p.heavy ? "heavy" : "", p.faint ? "faint" : "", p.idle ? "idle" : "", p.dot ? "dot" : ""]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                  />
                ))}
              </svg>
            </div>

            <div className="stage-body">
              <h3 className="stage-title stage-anim">{s.title}</h3>
              <p className="stage-text stage-anim">{s.text}</p>
              <ul className="stage-points">
                {s.points.map((p) => (
                  <li key={p} className="stage-anim">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
