"use client";

import { useEffect, useRef } from "react";
import { animate, motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useLoop } from "./useLoop";

const REVENUE = 48500;
const COST_OF_SALES = 18200;
const OPEX = 12450;
const GROSS = REVENUE - COST_OF_SALES;
const NET = GROSS - OPEX;
const MARGIN = ((NET / REVENUE) * 100).toFixed(1);

type Row = { label: string; amount: number; kind: "income" | "cost" | "subtotal" };
const ROWS: Row[] = [
  { label: "Revenue", amount: REVENUE, kind: "income" },
  { label: "Cost of sales", amount: -COST_OF_SALES, kind: "cost" },
  { label: "Gross profit", amount: GROSS, kind: "subtotal" },
  { label: "Operating expenses", amount: -OPEX, kind: "cost" },
];

const money = (n: number) =>
  Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/** Number that counts up from zero each loop. */
function CountUp({ to, delay, reduce }: { to: number; delay: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (v: number) => {
      el.textContent = Math.round(v).toLocaleString("en-US");
    };
    if (reduce) {
      write(to);
      return;
    }
    write(0);
    const controls = animate(0, to, { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    return () => controls.stop();
  }, [to, delay, reduce]);
  return <span ref={ref} />;
}

/**
 * An income statement building itself: revenue lands, costs subtract with
 * bars sized to revenue, gross profit totals, and net profit counts up with
 * its margin. Designed on a 320×220 canvas (scaled by FitStage).
 */
export default function BooksVisual() {
  const { key, reduce, at } = useLoop(6200);

  return (
    <div className="relative h-[220px] w-[320px]">
      {/* Floating currency chip */}
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
          <span className="text-stone-300">Income Statement · Nov</span>
          <span className="text-emerald-400/90">Zoho Books</span>
        </div>

        {/* Lines */}
        <div className="px-3 pt-2">
          {ROWS.map((row, i) => {
            const subtotal = row.kind === "subtotal";
            const width = `${(Math.abs(row.amount) / REVENUE) * 100}%`;
            const t = 0.2 + i * 0.35;
            return (
              <motion.div
                key={row.label}
                className={`grid h-[25px] grid-cols-[112px_1fr_58px] items-center gap-2 text-[11px] ${
                  subtotal ? "border-t border-stone-700" : ""
                }`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={at(t)}
              >
                <span className={`whitespace-nowrap ${subtotal ? "font-semibold text-stone-100" : "text-stone-400"}`}>{row.label}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-stone-800/80">
                  <motion.span
                    className={`block h-full origin-left rounded-full ${
                      row.kind === "cost"
                        ? "bg-rose-400/70"
                        : row.kind === "income"
                          ? "bg-emerald-400"
                          : "bg-gradient-to-r from-amber-300 to-emerald-400"
                    }`}
                    style={{ width }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={at(t + 0.15, { duration: 0.6 })}
                  />
                </span>
                <span
                  className={`text-right font-mono font-semibold tabular-nums ${
                    row.kind === "cost" ? "text-rose-300/90" : subtotal ? "text-stone-100" : "text-emerald-300"
                  }`}
                >
                  {row.amount < 0 ? `(${money(row.amount)})` : money(row.amount)}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Net profit */}
        <motion.div
          className="mx-3 mt-2.5 flex items-center justify-between rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={at(1.7)}
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/90">
              Net profit
            </span>
            <motion.span
              className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-1.5 py-px text-[9px] font-semibold text-emerald-300"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={at(3, { type: "spring", stiffness: 420, damping: 18 })}
            >
              <TrendingUp className="h-2.5 w-2.5" strokeWidth={3} />
              {MARGIN}% margin
            </motion.span>
          </span>
          <span className="font-mono text-lg font-bold tabular-nums text-amber-300">
            <CountUp key={key} to={NET} delay={1.8} reduce={reduce} />
          </span>
        </motion.div>
      </div>
    </div>
  );
}
