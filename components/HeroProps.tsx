"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Check, Code2, Percent } from "lucide-react";
import type { PathKey } from "@/data/portfolio";

/**
 * Small "pieces of the work" that float around the hero portrait, so the
 * decoration says what the page is about:
 *   Build — a page assembling itself, a live site, a booking arriving, a phone layout.
 *   Books — a ledger being ticked off, VAT, a reconciled stamp, a monthly chart.
 * Like the other product mock-ups they stay LTR/English in both languages.
 * `bob` = gentle floating (desktop); `reduce` freezes every loop.
 */

const CARD =
  "rounded-xl border border-edge-strong bg-surface-raised/95 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)]";
const CHIP = `${CARD} flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 font-display text-[11px] font-semibold text-ink`;

type Anim = { reduce: boolean; bob: boolean };

function Float({
  children,
  className,
  dy = 8,
  duration = 4.5,
  delay = 0,
  reduce,
  bob,
}: Anim & { children: React.ReactNode; className: string; dy?: number; duration?: number; delay?: number }) {
  const on = bob && !reduce;
  return (
    <motion.div
      className={`absolute max-md:scale-[0.85] ${className}`}
      animate={on ? { y: [0, -dy, 0] } : undefined}
      transition={on ? { duration, delay, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Keyframes that play in, hold, and reset — staggered by `delay` — on a shared loop. */
const loop = (delay: number, duration = 5) => ({
  duration,
  delay,
  repeat: Infinity,
  times: [0, 0.12, 0.85, 1],
  ease: "easeOut" as const,
});

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70 light:bg-emerald-500" />
      <span className="relative h-2 w-2 rounded-full bg-emerald-400 light:bg-emerald-500" />
    </span>
  );
}

function BuildProps(a: Anim) {
  const { reduce } = a;
  return (
    <>
      {/* A page assembling itself */}
      <Float {...a} className="left-0 top-[1%] origin-top-left md:-left-[5%]" dy={9} duration={5}>
        <div className={`${CARD} w-[7.25rem] overflow-hidden`}>
          <div className="flex items-center gap-1 border-b border-edge px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            <span className="ms-1 h-1.5 flex-1 rounded-full bg-surface-overlay" />
          </div>
          <div className="space-y-1.5 p-2">
            <div className="h-2 w-10 rounded bg-gradient-to-r from-accent-bright to-accent-deep" />
            {[1, 0.7].map((w, i) => (
              <motion.div
                key={i}
                className="h-1.5 origin-left rounded bg-ink-faint/50"
                style={{ width: `${w * 100}%` }}
                animate={reduce ? undefined : { scaleX: [0, 1, 1, 0] }}
                transition={reduce ? undefined : loop(0.3 + i * 0.35)}
              />
            ))}
            <motion.div
              className="mt-0.5 h-3.5 w-12 rounded bg-accent"
              animate={reduce ? undefined : { opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
              transition={reduce ? undefined : loop(1.1)}
            />
          </div>
        </div>
      </Float>

      {/* The site is live */}
      <Float {...a} className="right-0 top-[9%] origin-top-right md:-right-[3%]" dy={11} duration={4.6} delay={0.4}>
        <div className={CHIP}>
          <LiveDot />
          Site live
        </div>
      </Float>

      {/* A booking arrives from the site */}
      <Float {...a} className="left-0 bottom-[13%] origin-bottom-left md:-left-[7%]" dy={8} duration={5.2} delay={0.2}>
        <motion.div
          className={CHIP}
          animate={reduce ? undefined : { opacity: [0, 1, 1, 0], y: [8, 0, 0, 8] }}
          transition={reduce ? undefined : loop(1.8, 5)}
        >
          <CalendarCheck className="h-3.5 w-3.5 text-accent" />
          New booking
        </motion.div>
      </Float>

      {/* Phone layout + code tag */}
      <Float {...a} className="right-0 bottom-[2%] origin-bottom-right md:-right-[2%]" dy={12} duration={5.5} delay={0.6}>
        <div className="relative">
          <div className={`${CARD} w-[3.25rem] space-y-1 rounded-[0.9rem] p-1.5`}>
            <div className="mx-auto h-1 w-4 rounded-full bg-surface-overlay" />
            <div className="h-5 rounded bg-gradient-to-br from-accent-bright/70 to-accent-deep/70" />
            <div className="h-1 w-full rounded bg-ink-faint/50" />
            <div className="h-1 w-2/3 rounded bg-ink-faint/40" />
            <div className="h-2.5 rounded bg-accent" />
          </div>
          <span className="absolute -left-5 -top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/40 bg-surface text-accent shadow-glow">
            <Code2 className="h-4 w-4" />
          </span>
        </div>
      </Float>
    </>
  );
}

const LEDGER: [string, string][] = [
  ["Sales", "+12,500"],
  ["Bills", "−4,320"],
  ["VAT", "−625"],
];
const BARS = [0.45, 0.7, 0.55, 1];

function BooksProps(a: Anim) {
  const { reduce } = a;
  return (
    <>
      {/* Ledger entries being ticked off */}
      <Float {...a} className="left-0 top-0 origin-top-left md:-left-[6%]" dy={9} duration={5}>
        <div className={`${CARD} w-[8.25rem] px-2.5 py-2`}>
          <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ink-faint">Ledger</p>
          <ul className="space-y-1.5">
            {LEDGER.map(([label, amount], i) => (
              <li key={label} className="flex items-center gap-1.5 text-[10px] text-ink-muted">
                <motion.span
                  className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-accent-deep text-surface"
                  animate={reduce ? undefined : { scale: [0, 1, 1, 0] }}
                  transition={reduce ? undefined : loop(0.4 + i * 0.5)}
                >
                  <Check className="h-2 w-2" strokeWidth={4} />
                </motion.span>
                <span className="flex-1">{label}</span>
                <span className="font-mono text-ink">{amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </Float>

      {/* VAT */}
      <Float {...a} className="right-0 top-[9%] origin-top-right md:-right-[3%]" dy={11} duration={4.6} delay={0.4}>
        <div className={CHIP}>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Percent className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
          VAT 5%
        </div>
      </Float>

      {/* Reconciled stamp */}
      <Float {...a} className="left-0 bottom-[13%] origin-bottom-left md:-left-[7%]" dy={8} duration={5.2} delay={0.2}>
        <motion.div
          className={`${CHIP} -rotate-6 border-accent-deep/50 text-accent-deep`}
          animate={reduce ? undefined : { opacity: [0, 1, 1, 0], scale: [1.5, 1, 1, 1] }}
          transition={reduce ? undefined : loop(2, 5)}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Reconciled
        </motion.div>
      </Float>

      {/* Monthly chart */}
      <Float {...a} className="right-0 bottom-[2%] origin-bottom-right md:-right-[3%]" dy={12} duration={5.5} delay={0.6}>
        <div className={`${CARD} w-[4.75rem] px-2 pb-2 pt-1.5`}>
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-faint">AED</p>
          <div className="mt-1 flex h-9 items-end gap-1">
            {BARS.map((h, i) => (
              <motion.span
                key={i}
                className={`flex-1 origin-bottom rounded-sm ${i === BARS.length - 1 ? "bg-accent-deep" : "bg-accent/70"}`}
                style={{ height: `${h * 100}%` }}
                animate={reduce ? undefined : { scaleY: [0, 1, 1, 0] }}
                transition={reduce ? undefined : loop(0.3 + i * 0.25)}
              />
            ))}
          </div>
        </div>
      </Float>
    </>
  );
}

export default function HeroProps({ path, reduce, bob }: Anim & { path: PathKey }) {
  return (
    <div aria-hidden dir="ltr" className="absolute inset-0">
      {path === "books" ? <BooksProps reduce={reduce} bob={bob} /> : <BuildProps reduce={reduce} bob={bob} />}
    </div>
  );
}
