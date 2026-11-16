"use client";

import { motion } from "framer-motion";
import { Check, Lock, MapPin, MousePointer2, Scissors, Sparkles, Star } from "lucide-react";
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

/** A piece of the page: dashed outline first (wireframe), then the real thing. */
function Block({
  reduce,
  className,
  fill = "",
  wire,
  paint,
  children,
}: {
  reduce: boolean;
  className: string;
  fill?: string;
  wire: number;
  paint: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.span
        className="absolute inset-0 rounded-[inherit] border border-dashed border-ink-faint/70"
        {...heroSeq(
          reduce,
          [
            [0, HIDE],
            [wire, HIDE],
            [wire + 0.3, SHOW],
            [paint, SHOW],
            [paint + 0.4, HIDE],
            [HERO_LOOP, HIDE],
          ],
          HIDE,
        )}
      />
      <motion.span
        className={`absolute inset-0 flex items-center whitespace-nowrap rounded-[inherit] ${fill}`}
        {...heroStep(reduce, HIDE, SHOW, paint)}
      >
        {children}
      </motion.span>
    </div>
  );
}

const WINDOW =
  "absolute overflow-hidden rounded-xl border border-edge-strong bg-surface shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)]";

const SERVICES: { name: string; price: number; Icon: typeof Scissors }[] = [
  { name: "Haircut", price: 60, Icon: Scissors },
  { name: "Beard trim", price: 40, Icon: Sparkles },
  { name: "Full combo", price: 90, Icon: Star },
];

/** The salon's hero picture, drawn rather than loaded: a figure in a lit room. */
function Picture() {
  return (
    <svg viewBox="0 0 62 74" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hs-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--color-accent-bright))" stopOpacity="0.95" />
          <stop offset="1" stopColor="rgb(var(--color-accent-deep))" />
        </linearGradient>
        <radialGradient id="hs-light" cx="0.72" cy="0.2" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="62" height="74" fill="url(#hs-wall)" />
      <rect width="62" height="74" fill="url(#hs-light)" />
      {/* Mirror */}
      <rect x="35" y="9" width="19" height="30" rx="9.5" fill="#fff" fillOpacity="0.22" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
      {/* Person in the chair */}
      <circle cx="24" cy="32" r="8.5" fill="#0f172a" fillOpacity="0.78" />
      <path d="M15.5 30.5c1-7 16-7 17 0-4-3.5-13-3.5-17 0z" fill="#0f172a" />
      <path d="M6 74c0-17 8-26 18-26s18 9 18 26z" fill="#0f172a" fillOpacity="0.78" />
      {/* Counter */}
      <rect x="0" y="62" width="62" height="12" fill="#0f172a" fillOpacity="0.35" />
    </svg>
  );
}

function BuildStage({ reduce }: { reduce: boolean }) {
  const { live, result } = HERO_BEATS;
  return (
    <>
      <Status reduce={reduce} labels={["wireframe", "styling", "live"]} cuts={[1.6, live]} />

      <div className={`${WINDOW} left-[44px] top-[52px] h-[174px] w-[212px]`}>
        {/* Browser chrome */}
        <div className="flex h-[22px] items-center gap-1 border-b border-edge px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          <div className="ml-2 flex h-3.5 flex-1 items-center gap-1 rounded bg-surface-overlay/70 px-1.5 font-mono text-[7px] text-ink-muted">
            <motion.span
              className="flex text-emerald-400 light:text-emerald-600"
              {...heroStep(reduce, { opacity: 0.25 }, SHOW, live, 0.2)}
            >
              <Lock className="h-2 w-2" strokeWidth={3} />
            </motion.span>
            lumasalon.ae
          </div>
        </div>
        {/* Publish progress */}
        <motion.div
          className="absolute left-0 top-[22px] h-[2px] w-full origin-left bg-accent"
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

        <div className="px-2.5 pt-2">
          {/* Site nav */}
          <div className="flex h-3 items-center justify-between">
            <Block reduce={reduce} className="h-3 w-[38px] rounded" fill="gap-1 text-[9px] font-bold tracking-tight text-ink" wire={0.2} paint={1.7}>
              <span className="h-2.5 w-2.5 rounded-[3px] bg-gradient-to-br from-accent-bright to-accent-deep" />
              Luma
            </Block>
            <div className="flex gap-2">
              {["Services", "Gallery", "Contact"].map((link, i) => (
                <Block key={link} reduce={reduce} className="h-2 w-[25px] rounded-sm" fill="justify-center text-[6px] font-medium text-ink-muted" wire={0.3 + i * 0.06} paint={1.8 + i * 0.06}>
                  {link}
                </Block>
              ))}
            </div>
          </div>

          {/* Headline, button, picture */}
          <div className="mt-2 flex items-start justify-between gap-2.5">
            <div className="flex-1">
              <Block reduce={reduce} className="h-2 w-[70px] rounded-sm" fill="gap-0.5 text-[6px] font-medium text-ink-muted" wire={0.45} paint={1.95}>
                <Star className="h-[7px] w-[7px] fill-amber-400 text-amber-400" />
                <span className="font-bold text-ink">4.9</span> · 120 reviews
              </Block>
              <Block reduce={reduce} className="mt-1 h-[13px] w-[72px] rounded" fill="text-[12.5px] font-bold leading-none tracking-tight text-ink" wire={0.5} paint={2}>
                Look sharp.
              </Block>
              <Block reduce={reduce} className="mt-0.5 h-[13px] w-full rounded" fill="text-gradient text-[12.5px] font-bold leading-none tracking-tight" wire={0.6} paint={2.1}>
                Book in seconds.
              </Block>
              <Block reduce={reduce} className="mt-1.5 h-2 w-[88px] rounded-sm" fill="gap-0.5 text-[6px] text-ink-muted" wire={0.7} paint={2.2}>
                <MapPin className="h-2 w-2 shrink-0 text-accent" />
                Dubai Marina · Open till 10 PM
              </Block>
              {/* The button, and the booking it turns into once clicked */}
              <div className="mt-2 flex items-center gap-1.5">
                <motion.div
                  className="w-[58px]"
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
                  <Block reduce={reduce} className="h-[18px] w-full rounded-md" fill="bg-gradient-to-r from-accent to-accent-deep text-[7.5px] font-bold text-surface shadow-[0_4px_12px_-4px_rgb(var(--color-accent)/0.7)]" wire={0.85} paint={2.4}>
                    <motion.span className="absolute inset-0 flex items-center justify-center" {...heroStep(reduce, SHOW, HIDE, result - 0.1, 0.15)}>
                      Book now
                    </motion.span>
                    <motion.span className="absolute inset-0 flex items-center justify-center gap-0.5" {...heroStep(reduce, HIDE, SHOW, result, 0.2)}>
                      <Check className="h-2 w-2" strokeWidth={4} />
                      Booked
                    </motion.span>
                  </Block>
                </motion.div>
                <motion.span
                  className="whitespace-nowrap text-[6px] font-semibold leading-tight text-emerald-400 light:text-emerald-600"
                  {...heroStep(reduce, { opacity: 0, x: -4 }, { opacity: 1, x: 0 }, result + 0.15, 0.3)}
                >
                  Today, 4:30 PM
                </motion.span>
              </div>
            </div>
            <Block reduce={reduce} className="h-[74px] w-[62px] rounded-lg" fill="overflow-hidden" wire={0.95} paint={2.55}>
              <Picture />
            </Block>
          </div>

          {/* Services */}
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {SERVICES.map(({ name, price, Icon }, i) => (
              <Block key={name} reduce={reduce} className="h-[30px] rounded-md" fill="gap-1 border border-edge bg-surface-raised px-1" wire={1.1 + i * 0.1} paint={2.7 + i * 0.1}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent/15 text-accent">
                  <Icon className="h-2.5 w-2.5" />
                </span>
                <span className="flex flex-col gap-[3px] leading-none">
                  <span className="text-[6px] font-semibold text-ink">{name}</span>
                  <span className="flex items-center gap-[2px] font-mono text-[6px] text-ink-muted">
                    <DirhamSign className="h-[6px] w-[6px]" />
                    {price}
                  </span>
                </span>
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
              [0, { left: 230, top: 236, opacity: 0 }],
              [4.0, { left: 230, top: 236, opacity: 0 }],
              [4.2, { left: 230, top: 236, opacity: 1 }],
              [4.95, { left: 103, top: 173, opacity: 1 }],
              [5.9, { left: 103, top: 173, opacity: 1 }],
              [6.3, { left: 103, top: 173, opacity: 0 }],
              [HERO_LOOP, { left: 230, top: 236, opacity: 0 }],
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
