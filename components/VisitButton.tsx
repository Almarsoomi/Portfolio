"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useContent } from "./i18n";

/**
 * "Visit the website" pill: a pulsing live dot, the label, and an
 * arrow badge. On hover a gradient floods in, the arrow flies out and a new
 * one flies in, and the whole pill leans toward the pointer (magnetic).
 * On touch screens a soft shine sweeps across it every few seconds instead.
 */
export default function VisitButton({
  href,
  title,
  className,
}: {
  href: string;
  title: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { ui } = useContent();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      data-cursor="hover"
      className={`group/visit visit-shine relative inline-flex h-11 max-w-full items-center gap-2.5 overflow-hidden rounded-full border border-accent/40 bg-surface ps-4 pe-1.5 shadow-[0_0_24px_-10px_rgb(var(--color-accent)/0.8)] outline-none transition-[border-color,box-shadow] duration-300 hover:border-transparent hover:shadow-glow focus-visible:ring-2 focus-visible:ring-accent ${className ?? ""}`}
    >
      {/* Gradient flood */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-[101%] rtl:translate-x-[101%] rounded-full bg-gradient-to-r from-accent-bright to-accent-deep transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/visit:translate-x-0 group-focus-visible/visit:translate-x-0"
      />

      {/* Live dot */}
      <span aria-hidden className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400 transition-colors group-hover/visit:bg-surface" />
      </span>

      <span className="relative whitespace-nowrap font-display text-sm font-semibold text-ink transition-colors duration-300 group-hover/visit:text-surface">
        {ui.visit}
      </span>
      <span className="sr-only">— {title} ({ui.opensNewTab})</span>

      {/* Arrow badge: arrow exits top-right, a fresh one enters bottom-left */}
      <span
        aria-hidden
        className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-surface rtl:-scale-x-100 transition-colors duration-300 group-hover/visit:bg-surface group-hover/visit:text-accent"
      >
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/visit:-translate-y-6 group-hover/visit:translate-x-6" />
        <ArrowUpRight className="absolute h-4 w-4 -translate-x-6 translate-y-6 transition-transform delay-75 duration-300 ease-out group-hover/visit:translate-x-0 group-hover/visit:translate-y-0" />
      </span>
    </motion.a>
  );
}
