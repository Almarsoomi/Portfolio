"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Anchor, Check, Gauge, Navigation, UserRound, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoShell, ease, useCountUp, useDemoTimeline } from "./shared";

/**
 * Looping mini-demo of MyBoatLog's core idea:
 * trips are logged → engine hours climb → a service comes due → crew is
 * assigned → it's signed off, parts stock updates, boat is back in service.
 */

const START_HOURS = 1291.4;
const TRIPS = [
  { route: "Dubai Marina → Palm Jumeirah", hours: 3.2 },
  { route: "Palm Jumeirah → The World", hours: 3.3 },
];
const SERVICE_EVERY = 50; // oil change interval (engine hours)
const LAST_SERVICE = 1250;

/**
 * Timeline. Phase:
 *  0 → trip 1 notification      1 → trip 1 logged, hours up
 *  2 → trip 2 notification      3 → trip 2 logged, hours up
 *  4 → oil change comes due     5 → assigned to crew
 *  6 → signed off, stock updated
 *  7 → hold: back in service
 */
const DURATIONS = [600, 300, 600, 350, 750, 550, 500, 2200];

const fmtHours = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type Toast = { key: string; icon: LucideIcon; text: string; tone: "info" | "warn" | "ok" };

export default function MyBoatLogDemo() {
  const { root, phase, last, reduce } = useDemoTimeline(DURATIONS);

  const tripsLogged = phase >= 3 ? 2 : phase >= 1 ? 1 : 0;
  const hours = START_HOURS + TRIPS.slice(0, tripsLogged).reduce((s, t) => s + t.hours, 0);
  const due = phase >= 4 && phase < 6;
  const assigned = phase >= 5;
  const done = phase >= 6;

  const lastService = done ? hours : LAST_SERVICE;
  const used = Math.min((hours - lastService) / SERVICE_EVERY, 1);
  const dueIn = LAST_SERVICE + SERVICE_EVERY - hours;

  const hoursRef = useCountUp(hours, fmtHours, reduce);

  const toast: Toast =
    phase <= 1
      ? { key: "t1", icon: Navigation, text: `Trip logged · ${TRIPS[0].route}`, tone: "info" }
      : phase <= 3
        ? { key: "t2", icon: Navigation, text: `Trip logged · ${TRIPS[1].route}`, tone: "info" }
        : phase === 4
          ? { key: "due", icon: Wrench, text: `Oil change due in ${fmtHours(dueIn)} h`, tone: "warn" }
          : phase === 5
            ? { key: "crew", icon: UserRound, text: "Assigned to Rashid (engineer) · notified", tone: "warn" }
            : { key: "ok", icon: Check, text: "Oil change signed off · filter stock 4 → 3", tone: "ok" };

  const toneCls = {
    info: "border-edge-strong bg-surface-overlay/90 text-ink-muted",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-300 light:text-amber-600",
    ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 light:text-emerald-600",
  }[toast.tone];
  const iconCls = {
    info: "bg-amber-500/15 text-amber-400 light:text-amber-600",
    warn: "bg-amber-500/20 text-amber-400 light:text-amber-600",
    ok: "bg-emerald-500/20 text-emerald-400 light:text-emerald-600",
  }[toast.tone];
  const ToastIcon = toast.icon;

  const barCls = done ? "bg-emerald-400" : used > 0.92 ? "bg-amber-400" : "bg-amber-500/70";

  return (
    <DemoShell
      rootRef={root}
      label="Animated demo: boat trips are logged, engine hours climb, an oil change comes due, it's assigned to crew and signed off, and the boat is back in service."
      status={phase === last ? "Back in service ✓" : phase >= 4 ? "Maintenance due…" : "Logging trips…"}
      progress={(phase + 1) / DURATIONS.length}
      reduce={reduce}
    >
      {/* Notification */}
      <div className="relative h-[2.4rem]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={toast.key}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92, filter: "blur(2px)" }}
            transition={{ duration: 0.25, ease }}
            className={`absolute inset-x-0 top-0 flex h-[2.4rem] items-center gap-2 rounded-xl border px-2.5 shadow-lg backdrop-blur ${toneCls}`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconCls}`}>
              <ToastIcon aria-hidden className="h-3 w-3" strokeWidth={toast.tone === "ok" ? 3 : 2} />
            </span>
            <p className="min-w-0 truncate text-[0.72rem] font-medium">{toast.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vessel card */}
      <div className="rounded-2xl border border-edge bg-surface/80 p-3.5 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-400 light:text-amber-600">
              <Anchor aria-hidden className="h-3.5 w-3.5" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-ink-faint">
                Vessel
              </p>
              <p className="text-[0.78rem] font-semibold text-ink">Sea Breeze</p>
            </div>
          </div>
          <motion.span
            key={due ? "due" : "ok"}
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease }}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${
              due ? "bg-amber-500/15 text-amber-400 light:text-amber-600" : "bg-emerald-500/10 text-emerald-400 light:text-emerald-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${due ? "animate-ping bg-amber-400" : "bg-emerald-400"}`}
            />
            {due ? "Service due" : "In service"}
          </motion.span>
        </div>

        {/* Engine hours + service bar */}
        <div className="mt-2.5 flex items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1 text-[0.62rem] text-ink-faint">
              <Gauge aria-hidden className="h-3 w-3 text-amber-400 light:text-amber-600" />
              Engine hours
            </p>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              <span ref={hoursRef} className="tabular-nums">
                {fmtHours(hours)}
              </span>
              <span className="ml-1 text-sm font-medium text-ink-faint">h</span>
            </p>
          </div>
          <div className="w-[45%] pb-1">
            <div className="flex justify-between text-[0.58rem] text-ink-faint">
              <span>Oil change</span>
              <span className="tabular-nums">
                {done ? `next ${fmtHours(lastService + SERVICE_EVERY)} h` : `due ${LAST_SERVICE + SERVICE_EVERY} h`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-edge">
              <motion.div
                className={`h-full rounded-full ${barCls}`}
                animate={{ width: `${Math.max(used, 0.02) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Log */}
        <ul className="mt-2.5 flex min-h-[5.6rem] flex-col gap-1">
          <AnimatePresence initial={false}>
            {TRIPS.slice(0, tripsLogged).map((t) => (
              <motion.li
                key={t.route}
                layout
                initial={reduce ? false : { opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease }}
                className="flex items-center justify-between gap-2 rounded-lg border border-edge bg-surface-raised/60 px-2.5 py-1"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Navigation aria-hidden className="h-3 w-3 shrink-0 text-amber-400 light:text-amber-600" />
                  <span className="truncate text-[0.72rem] font-medium text-ink">{t.route}</span>
                </span>
                <span className="shrink-0 text-[0.72rem] tabular-nums text-ink-muted">
                  +{fmtHours(t.hours)} h
                </span>
              </motion.li>
            ))}
            {phase >= 4 ? (
              <motion.li
                key="task"
                layout
                initial={reduce ? false : { opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease }}
                className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1 transition-colors duration-300 ${
                  done ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                      done ? "bg-emerald-500 text-surface" : "border border-amber-500/60"
                    }`}
                  >
                    {done ? <Check aria-hidden className="h-3 w-3" strokeWidth={3} /> : null}
                  </span>
                  <span className="text-[0.72rem] font-medium text-ink">Oil change</span>
                </span>
                <span
                  className={`text-[0.65rem] font-medium ${done ? "text-emerald-400 light:text-emerald-600" : "text-amber-400 light:text-amber-600"}`}
                >
                  {done ? "Done · Rashid" : assigned ? "Assigned · Rashid" : "Due"}
                </span>
              </motion.li>
            ) : null}
          </AnimatePresence>
        </ul>
      </div>
    </DemoShell>
  );
}
