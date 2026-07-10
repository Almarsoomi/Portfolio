"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { projects } from "@/data/portfolio";
import type { Project, ProjectStatus } from "@/data/portfolio";
import { SectionHeading } from "./motion-primitives";

const statusStyles: Record<ProjectStatus, string> = {
  Live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  "In Progress": "border-accent/40 bg-accent/10 text-accent",
  Planning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  Archived: "border-edge-strong bg-surface-overlay/60 text-ink-faint",
};

/** Vertical offset (px) each pinned card is nudged down from the one before it. */
const STACK_STEP = 22;

function StackCard({
  project,
  index,
  total,
  progress,
  reduce,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Each card shrinks slightly as later cards slide over it, creating depth.
  // The range maps this card's slice of the parent scroll to its rest → covered state.
  const targetScale = 1 - (total - index) * 0.04;
  const range: [number, number] = [index * (1 / total), 1];
  const scaled = useTransform(progress, range, [1, targetScale]);
  const scale = reduce ? undefined : scaled;

  return (
    <div
      className="sticky flex justify-center"
      style={{ top: `calc(var(--nav-height) + 2.5rem + ${index * STACK_STEP}px)` }}
    >
      <motion.article
        style={{ scale }}
        className="group relative grid w-full origin-top overflow-hidden rounded-3xl border border-edge bg-surface-raised/80 shadow-card backdrop-blur-sm transition-colors duration-300 hover:border-accent/40 md:grid-cols-[1.35fr_1fr]"
      >
        {/* Content */}
        <div className="flex flex-col p-7 sm:p-9">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {project.category}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
            >
              {project.status}
            </span>
          </div>

          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                {project.title}
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              project.title
            )}
          </h3>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted sm:text-base">
            {project.description}
          </p>

          {project.impact ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
              <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm font-medium text-ink">{project.impact}</p>
            </div>
          ) : null}

          <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="Tech stack">
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

        {/* Decorative panel */}
        <div className="relative hidden items-center justify-center overflow-hidden border-l border-edge bg-gradient-to-br from-accent/10 via-surface-raised to-surface md:flex">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, rgb(var(--color-accent) / 0.25), transparent 55%)",
            }}
          />
          <span
            aria-hidden
            className="font-display text-[7rem] font-bold leading-none text-ink/5 sm:text-[9rem]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </motion.article>
    </div>
  );
}

export default function StackedProjects() {
  const reduce = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section id="projects" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Tools built for real businesses"
        intro="Web apps, financial automation, and back-office tooling — each one built to remove a specific, recurring pain."
      />

      <div ref={container} className="relative">
        {projects.map((project, index) => (
          <div
            key={project.title}
            // Flow height per card gives the scroll distance that drives the pinning.
            className="pb-[56vh] last:pb-0"
          >
            <StackCard
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              reduce={!!reduce}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
