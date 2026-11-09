"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, FileText, MessageSquare } from "lucide-react";
import { DemoShell, ease, useCountUp, useDemoTimeline } from "./shared";

/**
 * Looping mini-demo of PreStatement's core idea:
 * bank SMS arrives → transaction lands in the live bill → statement arrives →
 * every line is checked off against it.
 */

type Tx = { merchant: string; category: string; amount: number; sms: string };

const TXS: Tx[] = [
  {
    merchant: "Carrefour",
    category: "Groceries",
    amount: 245,
    sms: "Purchase of AED 245.00 with card ending 4821 at CARREFOUR MOE.",
  },
  {
    merchant: "ENOC",
    category: "Fuel",
    amount: 120.5,
    sms: "Purchase of AED 120.50 with card ending 4821 at ENOC 1043.",
  },
  {
    merchant: "Talabat",
    category: "Food delivery",
    amount: 86.75,
    sms: "Purchase of AED 86.75 with card ending 4821 at TALABAT.",
  },
];

/**
 * Timeline. Phase n (0-based):
 *  0,2,4  → SMS for tx n/2 is showing
 *  1,3,5  → tx (n-1)/2 has landed in the bill
 *  6      → statement arrives
 *  7..9   → rows checked one by one
 *  10     → "matches" banner
 */
// Fast enough that the whole story plays in ~4s — visitors only glance at it.
const DURATIONS = [650, 280, 650, 280, 650, 400, 550, 200, 200, 200, 2200];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PreStatementDemo() {
  const { root, phase, last, reduce } = useDemoTimeline(DURATIONS);

  const txCount = phase >= 6 ? 3 : Math.floor(phase / 2) + (phase % 2);
  const smsIndex = phase < 6 && phase % 2 === 0 ? phase / 2 : null;
  const statement = phase >= 6;
  const checked = phase >= 7 ? Math.min(phase - 6, 3) : 0;
  const matched = phase === last;

  const total = TXS.slice(0, txCount).reduce((s, t) => s + t.amount, 0);
  const totalRef = useCountUp(total, fmt, reduce);

  return (
    <DemoShell
      rootRef={root}
      label="Animated demo: bank SMS alerts build the credit card bill in real time, then each line is checked against the monthly statement."
      status={matched ? "Verified ✓" : statement ? "Checking statement…" : "Reading bank SMS…"}
      progress={(phase + 1) / DURATIONS.length}
      reduce={reduce}
    >
      {/* Incoming SMS / statement notification */}
      <div className="relative h-[2.4rem]">
        <AnimatePresence mode="popLayout">
          {smsIndex !== null ? (
            <motion.div
              key={`sms-${smsIndex}`}
              initial={reduce ? false : { opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.9, filter: "blur(2px)" }}
              transition={{ duration: 0.25, ease }}
              className="absolute inset-x-0 top-0 flex h-[2.4rem] items-center gap-2 rounded-xl border border-edge-strong bg-surface-overlay/90 px-2.5 shadow-lg backdrop-blur"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <MessageSquare aria-hidden className="h-3 w-3" />
              </span>
              <p className="min-w-0 truncate text-[0.7rem] text-ink-muted">
                <span className="font-semibold text-ink">Bank SMS:</span> {TXS[smsIndex].sms}
              </p>
            </motion.div>
          ) : statement ? (
            <motion.div
              key="statement"
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className={`absolute inset-x-0 top-0 flex h-[2.4rem] items-center gap-2 rounded-xl border px-2.5 transition-colors duration-300 ${
                matched
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-accent/30 bg-accent/10"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  matched ? "bg-emerald-500/20 text-emerald-400" : "bg-accent/20 text-accent"
                }`}
              >
                {matched ? (
                  <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <FileText aria-hidden className="h-3 w-3" />
                )}
              </span>
              <p className="text-[0.72rem] font-medium text-ink">
                {matched ? (
                  <span className="text-emerald-400">Statement matches · no surprises</span>
                ) : (
                  <>
                    October statement arrived
                    <span className="text-ink-faint"> · checking…</span>
                  </>
                )}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Live bill card */}
      <div className="rounded-2xl border border-edge bg-surface/80 p-3.5 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[0.7rem] text-ink-faint">
            <CreditCard aria-hidden className="h-3.5 w-3.5" />
            Everyday card ·· 4821
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink">
          <span className="mr-1 text-sm font-medium text-ink-faint">AED</span>
          <span ref={totalRef} className="tabular-nums">
            {fmt(total)}
          </span>
        </p>
        <p className="text-[0.65rem] text-ink-faint">bill so far · statement closes 24 Oct</p>

        <ul className="mt-2.5 flex min-h-[5.6rem] flex-col gap-1">
          <AnimatePresence initial={false}>
            {TXS.slice(0, txCount).map((t, i) => {
              const ok = i < checked;
              return (
                <motion.li
                  key={t.merchant}
                  layout
                  initial={reduce ? false : { opacity: 0, y: -18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease }}
                  className={`flex items-center justify-between rounded-lg border px-2.5 py-1 transition-colors duration-300 ${
                    ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-edge bg-surface-raised/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                        ok ? "bg-emerald-500 text-surface" : "border border-edge-strong"
                      }`}
                    >
                      {ok ? <Check aria-hidden className="h-3 w-3" strokeWidth={3} /> : null}
                    </span>
                    <span className="text-[0.75rem] font-medium text-ink">{t.merchant}</span>
                    <span className="text-[0.65rem] text-ink-faint">{t.category}</span>
                  </div>
                  <span className="text-[0.75rem] tabular-nums text-ink-muted">{fmt(t.amount)}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </DemoShell>
  );
}
