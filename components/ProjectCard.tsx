"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Project, ProjectStatus } from "@/data/portfolio";
import { StaggerItem } from "./motion-primitives";
import VisitButton from "./VisitButton";

const statusStyles: Record<ProjectStatus, string> = {
  Live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  "In Progress": "border-accent/40 bg-accent/10 text-accent",
  Planning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  Archived: "border-edge-strong bg-surface-overlay/60 text-ink-faint",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <StaggerItem className="h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="group flex h-full flex-col rounded-2xl border border-edge bg-surface-raised/50 p-6 shadow-card transition-colors duration-300 hover:border-accent/40 hover:shadow-glow sm:p-7"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {project.category}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
          {project.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {project.description}
        </p>

        {project.impact ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
            <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm font-medium text-ink">{project.impact}</p>
          </div>
        ) : null}

        {project.link ? (
          <div className="mt-auto pt-5">
            <VisitButton href={project.link} title={project.title} />
          </div>
        ) : null}

      </motion.article>
    </StaggerItem>
  );
}
