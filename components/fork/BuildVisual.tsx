"use client";

import { motion } from "framer-motion";
import { Check, MousePointer2 } from "lucide-react";
import { useLoop } from "./useLoop";

const URL_TEXT = "yourbusiness.ae";

/**
 * A browser window that assembles a website in front of you: URL types in,
 * layout blocks build up, a cursor clicks "Book now" and a booking lands.
 * Designed on a 320×220 canvas (scaled by FitStage).
 */
export default function BuildVisual() {
  const { key, reduce, at } = useLoop(6200);

  return (
    <div className="relative h-[220px] w-[320px]">
      {/* Floating code tag */}
      <motion.div
        className="absolute -right-3 -top-4 z-20 rounded-lg border border-cyan-400/40 bg-slate-950 px-2 py-1 font-mono text-[11px] font-semibold text-cyan-300 shadow-[0_0_24px_-6px_rgb(34_211_238/0.7)]"
        animate={reduce ? undefined : { y: [0, -6, 0], rotate: [6, 2, 6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {"</>"}
      </motion.div>

      <div
        key={key}
        className="absolute inset-0 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/90 shadow-[0_20px_60px_-20px_rgb(34_211_238/0.35)]"
      >
        {/* Chrome */}
        <div className="flex h-7 items-center gap-1.5 border-b border-slate-800 px-3">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <div className="ml-3 flex h-4 flex-1 items-center rounded bg-slate-800/80 px-2 font-mono text-[9px] text-slate-400">
            <span className="mr-1 text-emerald-400/80">https://</span>
            {URL_TEXT.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={at(0.15 + i * 0.035, { duration: 0.01 })}
              >
                {ch}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="relative space-y-3 p-3">
          {/* Site nav */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={at(0.8)}
          >
            <div className="h-2.5 w-12 rounded bg-gradient-to-r from-cyan-400 to-blue-500" />
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-1.5 w-6 rounded bg-slate-700" />
              ))}
            </div>
          </motion.div>

          {/* Hero */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              {[0.92, 0.7].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-3 origin-left rounded bg-slate-200/90"
                  style={{ width: `${w * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={at(1.1 + i * 0.15, { duration: 0.5 })}
                />
              ))}
              <motion.div
                className="h-1.5 w-4/5 origin-left rounded bg-slate-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={at(1.45, { duration: 0.4 })}
              />
            </div>
            <motion.div
              className="relative flex h-6 items-center rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 px-2.5 text-[9px] font-bold text-slate-950"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                reduce
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0, 1.08, 1, 1, 0.9, 1], opacity: 1 }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : { delay: 1.65, duration: 2.1, times: [0, 0.12, 0.2, 0.62, 0.68, 0.76] }
              }
            >
              Book now
            </motion.div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="space-y-1.5 rounded-lg border border-slate-800 bg-slate-900 p-2"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={at(1.9 + i * 0.12)}
              >
                <div
                  className={`h-4 w-4 rounded ${
                    ["bg-cyan-400/80", "bg-blue-500/80", "bg-sky-300/80"][i]
                  }`}
                />
                <div className="h-1.5 w-full rounded bg-slate-600" />
                <div className="h-1.5 w-2/3 rounded bg-slate-700" />
              </motion.div>
            ))}
          </div>

          {/* Cursor glides to the button and clicks */}
          {reduce ? null : (
            <motion.div
              className="absolute z-10 text-white drop-shadow"
              initial={{ left: 40, top: 150, opacity: 0 }}
              animate={{ left: [40, 40, 276], top: [150, 150, 48], opacity: [0, 1, 1] }}
              transition={{ delay: 2.3, duration: 0.9, times: [0, 0.15, 1], ease: "easeInOut" }}
            >
              <MousePointer2 className="h-4 w-4 fill-white" />
            </motion.div>
          )}

          {/* Booking toast */}
          <motion.div
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-400/40 bg-slate-900 px-3 py-1 text-[10px] font-semibold text-emerald-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={at(3.5, { type: "spring", stiffness: 300, damping: 20 })}
          >
            <Check className="h-3 w-3" /> New booking received
          </motion.div>
        </div>
      </div>
    </div>
  );
}
