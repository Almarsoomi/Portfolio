"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { useContent } from "./i18n";

type Stats = { seconds: number; kb: number };

/** Real numbers from this visit: navigation timing + bytes over the network. */
function readStats(): Stats | null {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!nav || !nav.loadEventEnd) return null;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const bytes = [nav, ...resources].reduce((sum, e) => sum + (e.transferSize || 0), 0);
  return { seconds: nav.loadEventEnd / 1000, kb: Math.round(bytes / 1024) };
}

/**
 * A small live badge: how long this page took to load on the visitor's own
 * device, measured by the browser (not a claimed number). It counts up,
 * shrinks to a chip after a few seconds, and expands again on hover or tap.
 */
export default function SpeedBadge() {
  const { ui } = useContent();
  const reduce = useReducedMotion();
  const [stats, setStats] = useState<Stats | null>(null);
  const [open, setOpen] = useState(true);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timer = 0;
    const measure = () => {
      // loadEventEnd is filled in just after the load event finishes.
      timer = window.setTimeout(() => {
        const s = readStats();
        if (s) setStats(s);
      }, 50);
    };
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });
    return () => {
      window.removeEventListener("load", measure);
      window.clearTimeout(timer);
    };
  }, []);

  // Count up, then tuck away.
  useEffect(() => {
    if (!stats) return;
    const el = numRef.current;
    const write = (v: number) => {
      if (el) el.textContent = v.toFixed(2);
    };
    const controls = reduce
      ? (write(stats.seconds), null)
      : animate(0, stats.seconds, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    const t = window.setTimeout(() => setOpen(false), 5000);
    return () => {
      controls?.stop();
      window.clearTimeout(t);
    };
  }, [stats, reduce]);

  return (
    <AnimatePresence>
      {stats ? (
        <motion.button
          type="button"
          title={ui.speed.title}
          aria-label={`${ui.speed.loadedIn} ${stats.seconds.toFixed(2)}${ui.speed.seconds}`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((o) => !o)}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.6 }}
          className="fixed bottom-6 start-6 z-[55] flex h-11 items-center gap-2 overflow-hidden rounded-full border border-accent/30 bg-surface-raised/90 pe-4 ps-3 text-sm text-ink shadow-glow backdrop-blur"
        >
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Zap aria-hidden className="h-3.5 w-3.5 fill-current" />
            {reduce ? null : (
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent/20 [animation-iteration-count:3]" />
            )}
          </span>
          <motion.span
            layout
            className="flex items-baseline gap-1.5 whitespace-nowrap"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnimatePresence initial={false}>
              {open ? (
                <motion.span
                  key="label"
                  className="text-ink-muted"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {ui.speed.loadedIn}
                </motion.span>
              ) : null}
            </AnimatePresence>
            <span className="font-mono font-semibold tabular-nums text-accent">
              <span dir="ltr" ref={numRef}>
                0.00
              </span>
              {ui.speed.seconds}
            </span>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.span
                  key="kb"
                  className="flex items-baseline gap-1.5 text-xs text-ink-faint"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {stats.kb > 0 ? (
                    <>
                      <span aria-hidden>·</span>
                      <span dir="ltr" className="font-mono">
                        {stats.kb} KB
                      </span>
                    </>
                  ) : null}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
