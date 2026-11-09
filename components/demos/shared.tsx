"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

export const ease = [0.25, 0.4, 0.25, 1] as const;

/**
 * Drives a looping demo timeline. `durations[i]` is how long phase i is held.
 * Only advances while the demo is on screen; reduced-motion users see the last phase.
 */
export function useDemoTimeline(durations: number[], opts: { hold?: boolean } = {}) {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });
  const last = durations.length - 1;
  const [phase, setPhase] = useState(reduce ? last : 0);
  const hold = !!opts.hold;

  useEffect(() => {
    if (reduce && !hold) {
      setPhase(last);
      return;
    }
    if (!inView) return;
    // `hold` freezes on the final phase instead of looping (e.g. user picked something).
    if (hold && phase >= last) return;
    const t = setTimeout(() => setPhase((p) => (p >= last ? 0 : p + 1)), durations[phase]);
    return () => clearTimeout(t);
  }, [phase, inView, reduce, durations, last, hold]);

  return { root, phase, setPhase, last, reduce, inView };
}

/** Animates a number into a span's text without re-rendering React on every frame. */
export function useCountUp(value: number, format: (n: number) => string, reduce: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      shown.current = value;
      el.textContent = format(value);
      return;
    }
    const controls = animate(shown.current, value, {
      duration: value < shown.current ? 0.25 : 0.35,
      ease: "easeOut",
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, format, reduce]);
  return ref;
}

/** Wrapper with the "Live demo" badge, status text and loop progress bar. */
export function DemoShell({
  rootRef,
  label,
  status,
  progress,
  reduce,
  interactive = false,
  children,
}: {
  rootRef: React.RefObject<HTMLDivElement>;
  label: string;
  status: string;
  progress: number;
  reduce: boolean;
  /** Has its own controls, so it must not be exposed as a single image. */
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      ref={rootRef}
      role={interactive ? "group" : "img"}
      aria-label={label}
      className="relative flex w-full max-w-[22rem] origin-center flex-col gap-2 text-left select-none [@media(max-height:760px)]:scale-90"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Live demo
        </span>
        <span className="text-[0.65rem] text-ink-faint">{status}</span>
      </div>
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-edge">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
        />
      </div>
      {children}
    </div>
  );
}
