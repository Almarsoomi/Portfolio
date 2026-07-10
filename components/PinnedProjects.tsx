"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Sparkles,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { projects } from "@/data/portfolio";
import type { Project, ProjectStatus } from "@/data/portfolio";
import { SectionHeading } from "./motion-primitives";
import { useIsDesktop } from "./use-media-query";

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

export default function PinnedProjects() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const current = projects[active];
  const ActiveIcon = iconFor(current.category);

  // Connector pulse: measure a curve from the active row into the pinned panel.
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [path, setPath] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const measure = useCallback(() => {
    const grid = gridRef.current;
    const panel = panelRef.current;
    const row = rowRefs.current[active];
    // Panel only renders at lg; below that there's nothing to connect.
    if (!grid || !panel || !row || panel.offsetParent === null) {
      setPath(null);
      return;
    }
    const g = grid.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const x1 = r.right - g.left;
    const y1 = r.top + r.height / 2 - g.top;
    const x2 = p.left - g.left;
    const y2 = p.top + Math.min(p.height / 2, 150) - g.top;
    const cx = x1 + (x2 - x1) * 0.5;
    setPath(`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`);
  }, [active]);

  useEffect(() => {
    // The pinned panel (and so the connector) only exists at lg. Below that,
    // skip the per-scroll-frame measurement entirely.
    if (!isDesktop) {
      setPath(null);
      return;
    }
    measure();
    setPulseKey((k) => k + 1);
    const onScroll = () => requestAnimationFrame(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure, isDesktop]);

  return (
    <section id="projects" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Tools built for real businesses"
        intro="Web apps, financial automation, and back-office tooling — each one built to remove a specific, recurring pain."
      />

      <div ref={gridRef} className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
        {/* Connector overlay: faint path + a pulse that travels on activation */}
        {path ? (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible lg:block"
          >
            <path
              d={path}
              fill="none"
              stroke="rgb(var(--color-accent) / 0.14)"
              strokeWidth="1.5"
            />
            {reduce ? null : (
              <motion.path
                key={pulseKey}
                d={path}
                fill="none"
                stroke="rgb(var(--color-accent))"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.16 1"
                initial={{ strokeDashoffset: 1.16, opacity: 0.9 }}
                animate={{ strokeDashoffset: -0.16, opacity: [0.9, 1, 0] }}
                transition={{ duration: 0.85, ease: [0.25, 0.4, 0.25, 1] }}
              />
            )}
          </svg>
        ) : null}

        {/* Scrolling list */}
        <ol className="flex flex-col gap-4">
          {projects.map((project, index) => {
            const Icon = iconFor(project.category);
            const isActive = index === active;
            return (
              <motion.li
                key={project.title}
                onViewportEnter={() => setActive(index)}
                // Fires when the row crosses the vertical middle of the viewport.
                viewport={{ margin: "-48% 0px -48% 0px", amount: 0 }}
              >
                <button
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  type="button"
                  onMouseEnter={() => setActive(index)}
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
                          className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                        >
                          {project.title}
                          <ArrowUpRight
                            aria-hidden
                            className="h-4 w-4 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {project.description}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                      {project.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-md border border-edge bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              </motion.li>
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                  className="relative flex flex-col items-center gap-4 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
                    <ActiveIcon aria-hidden className="h-8 w-8" />
                  </span>
                  <span className="font-display text-[5rem] font-bold leading-none text-ink/10">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Detail footer */}
            <div className="border-t border-edge p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
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
