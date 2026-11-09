"use client";

import { useEffect, useRef } from "react";
import { animate, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLoop } from "./useLoop";

const ROWS = [
  { label: "Invoice #1042 — Sales", amount: 12500 },
  { label: "Supplier bill — Timber", amount: -4320 },
  { label: "VAT payable (5%)", amount: -625 },
  { label: "Bank charges", amount: -35 },
];
const BALANCE = ROWS.reduce((s, r) => s + r.amount, 0);

const fmt = (n: number) =>
  `${n < 0 ? "−" : "+"}${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** Balance that counts up from zero each loop. */
function CountUp({ to, delay, reduce }: { to: number; delay: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (v: number) => {
      el.textContent = v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    if (reduce) {
      write(to);
      return;
    }
    write(0);
    const controls = animate(0, to, { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    return () => controls.stop();
  }, [to, delay, reduce]);
  return <span ref={ref} />;
}

/**
 * A ledger reconciling itself: entries post one by one, a check sweep ticks
 * each against the bank, the balance counts up and a "Reconciled" stamp lands.
 * Designed on a 320×220 canvas (scaled by FitStage).
 */
export default function BooksVisual() {
  const { key, reduce, at } = useLoop(6200);
  const sweepStart = 1.5;

  return (
    <div className="relative h-[220px] w-[320px]">
      {/* Floating calculator chip */}
      <motion.div
        className="absolute -left-3 -top-4 z-20 rounded-lg border border-amber-400/40 bg-stone-950 px-2 py-1 font-mono text-[11px] font-semibold text-amber-300 shadow-[0_0_24px_-6px_rgb(251_191_36/0.6)]"
        animate={reduce ? undefined : { y: [0, -6, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      >
        AED
      </motion.div>

      <div
        key={key}
        className="absolute inset-0 overflow-hidden rounded-xl border border-stone-700/80 bg-stone-950/90 shadow-[0_20px_60px_-20px_rgb(251_191_36/0.3)]"
      >
        {/* Header */}
        <div className="flex h-7 items-center justify-between border-b border-stone-800 px-3 text-[9px] font-semibold uppercase tracking-[0.14em]">
          <span className="text-stone-300">General Ledger · Nov</span>
          <span className="text-emerald-400/90">Zoho Books</span>
        </div>

        {/* Column heads */}
        <div className="flex justify-between px-3 pb-1 pt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          <span>Entry</span>
          <span>AED</span>
        </div>

        <div className="relative px-3">
          {/* Reconcile sweep */}
          {reduce ? null : (
            <motion.div
              className="absolute inset-x-1 h-6 rounded bg-gradient-to-r from-amber-400/0 via-amber-400/15 to-amber-400/0"
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: [0, 0, 26 * 3], opacity: [0, 1, 1, 0] }}
              transition={{ delay: sweepStart, duration: 1.2, times: [0, 0.1, 0.9, 1], ease: "linear" }}
            />
          )}

          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              className="relative flex h-[26px] items-center justify-between border-b border-dashed border-stone-800 text-[11px]"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={at(0.2 + i * 0.22)}
            >
              <span className="flex items-center gap-1.5 text-stone-300">
                <motion.span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-stone-950"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={at(sweepStart + 0.15 + i * 0.27, { type: "spring", stiffness: 500, damping: 18 })}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </motion.span>
                {row.label}
              </span>
              <span
                className={`font-mono font-semibold tabular-nums ${
                  row.amount > 0 ? "text-emerald-300" : "text-stone-300"
                }`}
              >
                {fmt(row.amount)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Balance */}
        <motion.div
          className="mx-3 mt-3 flex items-center justify-between rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={at(2.7)}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/90">
            Net balance
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-amber-300">
            <CountUp key={key} to={BALANCE} delay={2.8} reduce={reduce} />
          </span>
        </motion.div>

        {/* Stamp */}
        <motion.div
          className="absolute bottom-[58px] right-[96px] rounded-md bg-stone-950/70 border-2 border-emerald-400 px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400"
          initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
          animate={{ opacity: 0.95, scale: 1, rotate: -10 }}
          transition={at(3.8, { type: "spring", stiffness: 380, damping: 16 })}
        >
          Reconciled
        </motion.div>
      </div>
    </div>
  );
}
