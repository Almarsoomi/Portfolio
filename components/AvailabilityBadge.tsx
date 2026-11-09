"use client";

import type { PathKey } from "@/data/portfolio";
import { AVAILABLE } from "@/data/availability";
import { useContent } from "./i18n";

/**
 * "Available for new projects" pill with a live pulsing dot; links to the
 * contact section. Turns amber (no pulse) when AVAILABLE is false.
 */
export default function AvailabilityBadge({ path, className }: { path: PathKey; className?: string }) {
  const { ui } = useContent();
  const label = AVAILABLE ? ui.availability.open[path] : ui.availability.busy;
  const dot = AVAILABLE ? "bg-emerald-400 light:bg-emerald-500" : "bg-amber-400 light:bg-amber-500";

  return (
    <a
      href="#contact"
      className={`group items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        AVAILABLE
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/70 light:text-emerald-700"
          : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400/70 light:text-amber-700"
      } ${className ?? "inline-flex"}`}
    >
      <span aria-hidden className="relative flex h-2 w-2">
        {AVAILABLE ? (
          <span className={`absolute inset-0 animate-ping rounded-full opacity-70 ${dot}`} />
        ) : null}
        <span className={`relative h-2 w-2 rounded-full ${dot}`} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}
