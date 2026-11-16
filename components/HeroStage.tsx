"use client";

import { motion } from "framer-motion";
import { Check, Lock, MousePointer2 } from "lucide-react";
import type { PathKey } from "@/data/portfolio";
import DirhamSign from "./DirhamSign";

/**
 * The centre of the hero: instead of a portrait, the work doing itself.
 *   Build — a site goes wireframe → styled → published → first booking.
 *   Books — a month goes unsorted → categorised → reconciled → net profit.
 * Everything runs on one shared clock (`HERO_LOOP` seconds) so the chips
 * floating around the circle (HeroProps) can react to the same moments.
 * Designed on a 300×300 canvas (scaled by FitStage) and, like the other
 * product mock-ups, stays LTR/English in both languages.
 */

export const HERO_LOOP = 8.5;
/** Moments (in seconds) that the surrounding chips are timed against. */
export const HERO_BEATS = { live: 3.5, result: 5.2 };

type Values = Record<string, number | string>;

/**
 * Keyframes on the shared clock. `frames` are [second, values] pairs running
 * from 0 to HERO_LOOP; under reduced motion the element just sits at `rest`.
 */
export function heroSeq(reduce: boolean, frames: [number, Values][], rest: Values) {
  if (reduce) return { initial: false as const, animate: rest, transition: { duration: 0 } };
  const animate: Record<string, (number | string)[]> = {};
  for (const key of Object.keys(frames[0][1])) animate[key] = frames.map(([, v]) => v[key]);
  return {
    initial: frames[0][1],
    animate,
    transition: {
      duration: HERO_LOOP,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: frames.map(([t]) => t / HERO_LOOP),
    },
  };
}

/** Go from → to at `start`, hold, and reset just before the loop restarts. */
export function heroStep(reduce: boolean, from: Values, to: Values, start: number, len = 0.4) {
  return heroSeq(
    reduce,
    [
      [0, from],
      [start, from],
      [start + len, to],
      [HERO_LOOP - 0.6, to],
      [HERO_LOOP, from],
    ],
    to,
  );
}

const HIDE = { opacity: 0 };
const SHOW = { opacity: 1 };

/** The three stage names above the mock-up, one lit at a time. */
function Status({ reduce, labels, cuts }: { reduce: boolean; labels: string[]; cuts: number[] }) {
  const bounds = [0.1, ...cuts, HERO_LOOP - 0.6];
  return (
    <div className="absolute left-0 top-[22px] h-4 w-full font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
      {labels.map((label, i) => {
        const last = i === labels.length - 1;
        return (
          <motion.span
            key={label}
            className={`absolute inset-0 flex items-center justify-center gap-1.5 ${last ? "text-accent" : ""}`}
            {...heroSeq(
              reduce,
              [
                [0, HIDE],
                [bounds[i], HIDE],
                [bounds[i] + 0.25, SHOW],
                [bounds[i + 1] - 0.05, SHOW],
                [bounds[i + 1] + 0.2, HIDE],
                [HERO_LOOP, HIDE],
              ],
              last ? SHOW : HIDE,
            )}
          >
            <span className="font-semibold text-ink-faint">
              {i + 1}/{labels.length}
            </span>
            {label}
          </motion.span>
        );
      })}
    </div>
  );
}

/** A layout block: dashed outline first (wireframe), then its real fill. */
function Block({
  reduce,
  className,
  fill,
  wire,
  paint,
  children,
}: {
  reduce: boolean;
  className: string;
  fill: string;
  wire: number;
  paint: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.span
        className="absolute inset-0 rounded-[inherit] border border-dashed border-ink-faint/70"
        {...heroStep(reduce, HIDE, SHOW, wire, 0.3)}
      />
      <motion.span
        className={`absolute inset-0 flex items-center justify-center rounded-[inherit] ${fill}`}
        {...heroStep(reduce, HIDE, SHOW, paint)}
      >
        {children}
      </motion.span>
    </div>
  );
}

const WINDOW =
  "absolute overflow-hidden rounded-xl border border-edge-strong bg-surface shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)]";

function BuildStage({ reduce }: { reduce: boolean }) {
  const { live } = HERO_BEATS;
  return (
    <>
      <Status reduce={reduce} labels={["wireframe", "styling", "live"]} cuts={[1.6, live]} />

      <div className={`${WINDOW} left-[48px] top-[52px] h-[172px] w-[204px]`}>
        {/* Browser chrome */}
        <div className="flex h-6 items-center gap-1 border-b border-edge px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          <div className="ml-2 flex h-3.5 flex-1 items-center gap-1 rounded bg-surface-overlay/70 px-1.5 font-mono text-[7.5px] text-ink-muted">
            <motion.span
              className="flex text-emerald-400 light:text-emerald-600"
              {...heroStep(reduce, { opacity: 0.25 }, SHOW, live, 0.2)}
            >
              <Lock className="h-2 w-2" strokeWidth={3} />
            </motion.span>
            yourbusiness.ae
          </div>
        </div>
        {/* Publish progress */}
        <motion.div
          className="absolute left-0 top-6 h-[2px] w-full origin-left bg-accent"
          {...heroSeq(
            reduce,
            [
              [0, { scaleX: 0, opacity: 1 }],
              [live - 0.6, { scaleX: 0, opacity: 1 }],
              [live, { scaleX: 1, opacity: 1 }],
              [live + 0.4, { scaleX: 1, opacity: 0 }],
              [HERO_LOOP, { scaleX: 0, opacity: 0 }],
            ],
            { scaleX: 1, opacity: 0 },
          )}
        />

        <div className="space-y-2.5 p-3">
          {/* Site nav */}
          <div className="flex items-center justify-between">
            <Block reduce={reduce} className="h-2 w-10 rounded" fill="bg-gradient-to-r from-accent-bright to-accent-deep" wire={0.2} paint={1.7} />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <Block key={i} reduce={reduce} className="h-1.5 w-5 rounded" fill="bg-ink-faint/60" wire={0.3 + i * 0.06} paint={1.8 + i * 0.06} />
              ))}
            </div>
          </div>

          {/* Headline, button, picture */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <Block reduce={reduce} className="h-2.5 w-full rounded" fill="bg-ink/90" wire={0.5} paint={2} />
              <Block reduce={reduce} className="h-2.5 w-3/4 rounded" fill="bg-ink/90" wire={0.6} paint={2.1} />
              <Block reduce={reduce} className="h-1.5 w-5/6 rounded" fill="bg-ink-faint/60" wire={0.7} paint={2.2} />
              <motion.div
                className="!mt-2.5 w-[62px]"
                {...heroSeq(
                  reduce,
                  [
                    [0, { scale: 1 }],
                    [4.95, { scale: 1 }],
                    [5.05, { scale: 0.88 }],
                    [5.25, { scale: 1 }],
                    [HERO_LOOP, { scale: 1 }],
                  ],
                  { scale: 1 },
                )}
              >
                <Block reduce={reduce} className="h-5 w-full rounded-md" fill="bg-accent text-[8px] font-bold text-surface" wire={0.85} paint={2.4}>
                  Book now
                </Block>
              </motion.div>
            </div>
            <Block reduce={reduce} className="h-[58px] w-[58px] rounded-lg" fill="bg-gradient-to-br from-accent-bright/80 to-accent-deep/80" wire={0.95} paint={2.55} />
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <Block key={i} reduce={reduce} className="h-8 rounded-md" fill="border border-edge bg-surface-raised" wire={1.1 + i * 0.1} paint={2.7 + i * 0.1}>
                <span className={`h-2.5 w-2.5 rounded ${["bg-accent-bright/80", "bg-accent/80", "bg-accent-deep/80"][i]}`} />
              </Block>
            ))}
          </div>
        </div>
      </div>

      {/* A visitor arrives and books */}
      {reduce ? null : (
        <motion.div
          className="absolute text-ink drop-shadow"
          {...heroSeq(
            false,
            [
              [0, { left: 226, top: 232, opacity: 0 }],
              [4.0, { left: 226, top: 232, opacity: 0 }],
              [4.2, { left: 226, top: 232, opacity: 1 }],
              [4.95, { left: 100, top: 160, opacity: 1 }],
              [5.9, { left: 100, top: 160, opacity: 1 }],
              [6.3, { left: 100, top: 160, opacity: 0 }],
              [HERO_LOOP, { left: 226, top: 232, opacity: 0 }],
            ],
            HIDE,
          )}
        >
          <MousePointer2 className="h-4 w-4 fill-current" />
        </motion.div>
      )}
    </>
  );
}

const ROWS: { name: string; amount: string; tag: string; tone: string }[] = [
  { name: "Sales", amount: "+12,500", tag: "Income", tone: "bg-accent/15 text-accent" },
  { name: "Rent", amount: "−4,320", tag: "Expense", tone: "bg-surface-overlay text-ink-muted" },
  { name: "Supplies", amount: "−1,150", tag: "Expense", tone: "bg-surface-overlay text-ink-muted" },
  { name: "VAT", amount: "−625", tag: "Tax", tone: "bg-accent-deep/15 text-accent-deep" },
];

function BooksStage({ reduce }: { reduce: boolean }) {
  const { live, result } = HERO_BEATS;
  return (
    <>
      <Status reduce={reduce} labels={["unsorted", "categorised", "reconciled"]} cuts={[1.6, live]} />

      <div className={`${WINDOW} left-[48px] top-[52px] h-[172px] w-[204px]`}>
        <div className="flex h-6 items-center justify-between border-b border-edge px-2.5 font-mono text-[7.5px] uppercase tracking-[0.18em] text-ink-faint">
          <span>November</span>
          <span>4 entries</span>
        </div>

        <ul className="space-y-1.5 px-2.5 pt-2.5">
          {ROWS.map((row, i) => (
            <motion.li
              key={row.name}
              className="flex h-5 items-center gap-1.5 text-[9px] text-ink-muted"
              {...heroStep(reduce, { opacity: 0, x: -8 }, { opacity: 1, x: 0 }, 0.2 + i * 0.25, 0.3)}
            >
              {/* Empty circle → ticked once reconciled */}
              <span className="relative h-3 w-3 shrink-0 rounded-full border border-dashed border-ink-faint/70">
                <motion.span
                  className="absolute -inset-px flex items-center justify-center rounded-full bg-accent-deep text-surface"
                  {...heroStep(reduce, { scale: 0 }, { scale: 1 }, live + i * 0.25, 0.25)}
                >
                  <Check className="h-2 w-2" strokeWidth={4} />
                </motion.span>
              </span>
              <span className="flex-1 text-ink">{row.name}</span>
              <motion.span
                className={`rounded px-1 py-px text-[7px] font-semibold ${row.tone}`}
                {...heroStep(reduce, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1 }, 1.7 + i * 0.25, 0.3)}
              >
                {row.tag}
              </motion.span>
              <span className="w-10 text-right font-mono text-ink">{row.amount}</span>
            </motion.li>
          ))}
        </ul>

        {/* The answer the owner actually wants */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex h-9 items-center justify-between border-t border-edge bg-surface-raised px-2.5"
          {...heroStep(reduce, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, result - 0.3)}
        >
          <span className="text-[9px] font-semibold text-ink">Net profit</span>
          <span className="flex items-center gap-1 font-mono text-[12px] font-bold text-accent">
            <DirhamSign className="h-2.5 w-2.5" />
            6,405
          </span>
        </motion.div>
      </div>
    </>
  );
}

export default function HeroStage({ path, reduce }: { path: PathKey; reduce: boolean }) {
  return (
    <div dir="ltr" className="relative h-[300px] w-[300px] select-none font-display">
      {path === "books" ? <BooksStage reduce={reduce} /> : <BuildStage reduce={reduce} />}
    </div>
  );
}
