"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Play,
  Sparkles,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { projects } from "@/data/portfolio";
import type { Project, ProjectStatus } from "@/data/portfolio";
import { SectionHeading } from "./motion-primitives";
import { useIsDesktop } from "./use-media-query";
import { demos } from "./demos";
import { smoothScrollTo } from "./lenis-store";

const statusStyles: Record<ProjectStatus, string> = {
  Live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  "In Progress": "border-accent/40 bg-accent/10 text-accent",
  Planning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  Archived: "border-edge-strong bg-surface-overlay/60 text-ink-faint",
};

/** Map a project category to a representative icon for the pinned panel + list. */
function iconFor(category: string): LucideIcon {
  if (category.startsWith("Financial")) return Wallet;
  if (category.startsWith("Web")) return Globe;
  return Workflow;
}

/** Viewport line rows are judged against (a bit above centre = reading position). */
const readingLine = () => window.innerHeight * 0.42;

/** Seconds the page takes to glide from one project to the next. */
const STEP_DURATION = 1;
/** Slow start, slow finish — feels like a deliberate transition, not a jump. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ease = [0.25, 0.4, 0.25, 1] as const;

/** Panel slides in the scroll direction: down → new project rises from below. */
const slide = {
  enter: (dir: number) => ({ opacity: 0, y: 70 * dir, scale: 0.94, filter: "blur(6px)" }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: 0.12, ease },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: -70 * dir,
    scale: 0.94,
    filter: "blur(6px)",
    transition: { duration: 0.4, ease },
  }),
};
const fadeText = {
  enter: (dir: number) => ({ opacity: 0, y: 14 * dir }),
  center: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
  exit: (dir: number) => ({ opacity: 0, y: -14 * dir, transition: { duration: 0.18, ease } }),
};

export default function PinnedProjects() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const current = projects[active];
  const ActiveIcon = iconFor(current.category);
  const ActiveDemo = current.demo ? demos[current.demo] : null;

  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);
  activeRef.current = active;

  // Which way we moved (1 = down/next, -1 = up/previous) — drives the slide direction.
  const prevActive = useRef(0);
  const dirRef = useRef(1);
  if (prevActive.current !== active) {
    dirRef.current = active > prevActive.current ? 1 : -1;
    prevActive.current = active;
  }
  const dir = dirRef.current;

  // While a click-to-scroll is running, don't let the rows it passes take over.
  const lockUntil = useRef(0);
  // Ignore hover for a moment after scrolling, so rows sliding under a still
  // mouse don't steal the highlight from the row being read.
  const lastScroll = useRef(0);

  // Connector: drawn straight into the SVG (no React re-render per scroll frame).
  const pathBase = useRef<SVGPathElement>(null);
  const pathPulse = useRef<SVGPathElement>(null);
  const [hasPath, setHasPath] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const drawConnector = useCallback(() => {
    const grid = gridRef.current;
    const panel = panelRef.current;
    const row = rowRefs.current[activeRef.current];
    if (!grid || !panel || !row || panel.offsetParent === null) return false;
    const g = grid.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const x1 = r.right - g.left;
    const y1 = r.top + r.height / 2 - g.top;
    const x2 = p.left - g.left;
    const y2 = p.top + Math.min(p.height / 2, 150) - g.top;
    const cx = x1 + (x2 - x1) * 0.5;
    const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    pathBase.current?.setAttribute("d", d);
    pathPulse.current?.setAttribute("d", d);
    return true;
  }, []);

  /** Pick the row whose centre is nearest the reading line, with a little hysteresis. */
  const pickActive = useCallback(() => {
    if (performance.now() < lockUntil.current) return;
    const line = readingLine();
    let best = activeRef.current;
    let bestDist = Infinity;
    let currentDist = Infinity;
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const r = row.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - line);
      if (i === activeRef.current) currentDist = dist;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    // Only switch when the new row is clearly closer — stops flicker at the boundary.
    if (best !== activeRef.current && bestDist + 24 < currentDist) setActive(best);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      lastScroll.current = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pickActive();
        if (isDesktop) drawConnector();
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pickActive, drawConnector, isDesktop]);

  // On every project change: redraw the connector and fire its pulse.
  useEffect(() => {
    if (!isDesktop) {
      setHasPath(false);
      return;
    }
    setHasPath(drawConnector());
    setPulseKey((k) => k + 1);
  }, [active, isDesktop, drawConnector]);

  /** Smoothly bring a project's row to the reading line and make it active. */
  const goTo = useCallback((index: number) => {
    const i = Math.max(0, Math.min(projects.length - 1, index));
    const row = rowRefs.current[i];
    if (!row) return;
    setActive(i);
    const r = row.getBoundingClientRect();
    const target = window.scrollY + r.top + r.height / 2 - readingLine();
    lockUntil.current = performance.now() + STEP_DURATION * 1000 + 150;
    smoothScrollTo(target, {
      duration: STEP_DURATION,
      easing: easeInOutCubic,
      lock: true,
      onComplete: () => {
        lockUntil.current = performance.now() + 120;
      },
    });
  }, []);

  /**
   * Desktop step-scrolling: inside the project list, one wheel/trackpad gesture
   * moves exactly one project, with a slow eased glide. Before the first and
   * after the last project the wheel scrolls the page normally.
   */
  useEffect(() => {
    if (!isDesktop || reduce) return;
    let lastWheel = 0;
    let stepping = false;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // pinch-zoom / sideways
      const list = listRef.current;
      if (!list) return;
      const line = readingLine();
      const rect = list.getBoundingClientRect();
      const first = rowRefs.current[0]?.getBoundingClientRect();
      const last = rowRefs.current[projects.length - 1]?.getBoundingClientRect();
      if (!first || !last) return;

      const down = e.deltaY > 0;
      // Only take over while the list is at the reading position.
      const inZone =
        rect.top <= line + 4 &&
        rect.bottom >= line - 4 &&
        // Let the page scroll normally into the list until the first row arrives…
        !(down && first.top + first.height / 2 > line + 8) &&
        // …and out of it, once the last row is passed going up from below.
        !(!down && last.top + last.height / 2 < line - 8);
      if (!inZone) return;

      const next = activeRef.current + (down ? 1 : -1);
      if (next < 0 || next >= projects.length) return; // edges: release to normal scroll

      // From here on we own this wheel event.
      e.preventDefault();
      e.stopImmediatePropagation();

      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      // One step per gesture: ignore the trailing inertia of a trackpad swipe.
      if (stepping || now < lockUntil.current) return;
      if (gap < 140 && Math.abs(e.deltaY) < 40) return;

      stepping = true;
      goTo(next);
      window.setTimeout(() => {
        stepping = false;
      }, STEP_DURATION * 1000 + 100);
    };

    // Capture phase on window so it runs before the smooth-scroll library sees the wheel.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [isDesktop, reduce, goTo]);

  const hoverActivate = (index: number) => {
    if (performance.now() - lastScroll.current < 250) return;
    if (performance.now() < lockUntil.current) return;
    if (index !== activeRef.current) setActive(index);
  };

  return (
    <section id="projects" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Tools built for real businesses"
        intro="Web apps, financial automation, and back-office tooling — each one built to remove a specific, recurring pain."
      />

      <div ref={gridRef} className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
        {/* Connector overlay: faint path + a pulse that travels on activation */}
        <svg
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible ${
            hasPath ? "lg:block" : ""
          }`}
        >
          <path ref={pathBase} fill="none" stroke="rgb(var(--color-accent) / 0.14)" strokeWidth="1.5" />
          {reduce ? null : (
            <motion.path
              key={pulseKey}
              ref={pathPulse}
              fill="none"
              stroke="rgb(var(--color-accent))"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 1"
              initial={{ strokeDashoffset: 1.16, opacity: 0.9 }}
              animate={{ strokeDashoffset: -0.16, opacity: [0.9, 1, 0] }}
              transition={{ duration: 0.75, ease: [0.25, 0.4, 0.25, 1] }}
            />
          )}
        </svg>

        {/* Scrolling list */}
        <ol ref={listRef} className="flex flex-col gap-4">
          {projects.map((project, index) => {
            const Icon = iconFor(project.category);
            const RowDemo = project.demo ? demos[project.demo] : null;
            const isActive = index === active;
            return (
              <li key={project.title}>
                <button
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  type="button"
                  onPointerMove={() => hoverActivate(index)}
                  onClick={() => goTo(index)}
                  onFocus={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`group flex w-full gap-4 rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6 ${
                    isActive
                      ? "border-accent/40 bg-surface-raised/80 shadow-glow"
                      : "border-edge bg-surface-raised/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                      isActive
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-edge bg-surface text-ink-faint"
                    }`}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        {project.category}
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium ${statusStyles[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-ink">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="transition-colors hover:text-accent"
                        >
                          {project.title}
                          {/* Inline (not flex) so the arrow stays glued to the last word when the title wraps */}
                          <ArrowUpRight
                            aria-hidden
                            className="ml-1 inline-block h-4 w-4 align-[-2px] text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>

                    {RowDemo ? (
                      <span
                        className={`mt-2 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors duration-300 lg:inline-flex ${
                          isActive
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-accent/30 bg-accent/5 text-accent/80"
                        }`}
                      >
                        <Play aria-hidden className="h-3 w-3 fill-current" />
                        {isActive ? "Live demo playing →" : "Live demo"}
                      </span>
                    ) : null}

                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {project.description}
                    </p>
                  </div>
                </button>

                {/* Mobile/tablet: the pinned panel is hidden, so show the demo under the row.
                    Kept outside the button because some demos have their own controls. */}
                {RowDemo ? (
                  <div className="mt-2 flex justify-center rounded-2xl border border-edge bg-gradient-to-br from-accent/10 via-surface-raised to-surface px-4 py-5 lg:hidden">
                    <RowDemo />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* Pinned panel — stays fixed while the list scrolls */}
        <div className="hidden lg:block">
          <div
            ref={panelRef}
            className="sticky flex flex-col overflow-hidden rounded-3xl border border-edge bg-surface-raised/70 shadow-card"
            style={{ top: "calc(var(--nav-height) + 2rem)", height: "clamp(24rem, 62vh, 34rem)" }}
          >
            {/* Visual header with the active project's index + gradient */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-accent/15 via-surface-raised to-surface">
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 70% 30%, rgb(var(--color-accent) / 0.28), transparent 55%)",
                }}
              />
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={reduce ? undefined : slide}
                  initial={reduce ? false : "enter"}
                  animate="center"
                  exit={reduce ? undefined : "exit"}
                  className="absolute inset-0 flex w-full flex-col items-center justify-center gap-4 px-6 text-center"
                >
                  {ActiveDemo ? (
                    <ActiveDemo />
                  ) : (
                    <>
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
                        <ActiveIcon aria-hidden className="h-8 w-8" />
                      </span>
                      <span className="font-display text-[5rem] font-bold leading-none text-ink/10">
                        {String(active + 1).padStart(2, "0")}
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Detail footer */}
            <div className="relative border-t border-edge p-6">
              {/* Project counter + step controls */}
              <div className="absolute right-5 top-4 z-10 flex items-center gap-1.5">
                <span className="mr-1 font-display text-xs tabular-nums text-ink-faint">
                  <span className="text-ink">{String(active + 1).padStart(2, "0")}</span> /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous project"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronUp aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === projects.length - 1}
                  aria-label="Next project"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronDown aria-hidden className="h-4 w-4" />
                </button>
              </div>
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={reduce ? undefined : fadeText}
                  initial={reduce ? false : "enter"}
                  animate="center"
                  exit={reduce ? undefined : "exit"}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    {current.category}
                  </p>
                  <h4 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink">
                    {current.title}
                  </h4>
                  {current.impact ? (
                    <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                      <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <p className="text-sm font-medium text-ink">{current.impact}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {current.description}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
