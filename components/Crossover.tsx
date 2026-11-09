"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PathKey } from "@/data/portfolio";
import { useContent, useLocalHref } from "./i18n";
import { Reveal } from "./motion-primitives";

/** A slim banner inviting visitors across to the other path. */
export default function Crossover({ path }: { path: PathKey }) {
  const { crossover } = useContent();
  const href = useLocalHref();
  const c = crossover[path];
  return (
    <div className="mx-auto max-w-content px-5 sm:px-8">
      <Reveal>
        <Link
          href={href(c.href)}
          className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-edge-strong px-6 py-5 transition-colors hover:border-accent/50 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-ink-muted sm:text-base">{c.text}</p>
          <span className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-accent">
            {c.label}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
