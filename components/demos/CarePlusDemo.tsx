"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Check, Loader2, MessageCircle, Smartphone, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoShell, ease, useDemoTimeline } from "./shared";

/**
 * Looping mini-demo of the Care Plus Auto booking flow:
 * customer picks a service → enters their car → picks a time slot →
 * books → workshop confirms on WhatsApp.
 */

const SERVICES = ["Mechanical", "Electrical", "Paint & dent"];
const SERVICE = 2;
const CAR = "Nissan Patrol · 2021";
const SLOTS = ["6:00 PM", "7:30 PM", "9:00 PM"];
const SLOT = 1;

/**
 * Timeline. Phase:
 *  0 → customer opens the form   1 → service picked
 *  2 → car entered               3 → time slot picked
 *  4 → booking…                  5 → hold: booked + WhatsApp sent
 */
const DURATIONS = [550, 450, 450, 450, 450, 2400];

type Toast = { key: string; icon: LucideIcon; text: string; tone: "info" | "ok" };

function Chip({ label, on, reduce }: { label: string; on: boolean; reduce: boolean }) {
  return (
    <motion.span
      animate={on && !reduce ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease }}
      className={`whitespace-nowrap rounded-md border px-2 py-0.5 text-[0.65rem] font-medium transition-colors duration-200 ${
        on ? "border-red-500/60 bg-red-500/15 text-red-300" : "border-edge bg-surface-raised/60 text-ink-faint"
      }`}
    >
      {label}
    </motion.span>
  );
}

export default function CarePlusDemo() {
  const { root, phase, last, reduce } = useDemoTimeline(DURATIONS);

  const hasService = phase >= 1;
  const hasCar = phase >= 2;
  const hasSlot = phase >= 3;
  const booking = phase === 4;
  const booked = phase >= 5;

  const toast: Toast = booked
    ? { key: "ok", icon: MessageCircle, text: "Booked ✓ · WhatsApp confirmation sent", tone: "ok" }
    : booking
      ? { key: "send", icon: Wrench, text: "Sending to the workshop…", tone: "info" }
      : { key: "new", icon: Smartphone, text: "New customer · booking from their phone", tone: "info" };
  const ToastIcon = toast.icon;

  return (
    <DemoShell
      rootRef={root}
      label="Animated demo: a customer books a car repair online — picks a service, enters their car, chooses a time — and gets a WhatsApp confirmation."
      status={phase === last ? "Booked ✓" : booking ? "Confirming…" : "Customer booking…"}
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
            className={`absolute inset-x-0 top-0 flex h-[2.4rem] items-center gap-2 rounded-xl border px-2.5 shadow-lg backdrop-blur ${
              toast.tone === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-edge-strong bg-surface-overlay/90 text-ink-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                toast.tone === "ok" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/15 text-red-400"
              }`}
            >
              <ToastIcon aria-hidden className="h-3 w-3" />
            </span>
            <p className="min-w-0 truncate text-[0.72rem] font-medium">{toast.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Booking card */}
      <div className="rounded-2xl border border-edge bg-surface/80 p-3.5 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600 font-display text-[0.7rem] font-bold text-white">
              C+
            </span>
            <div className="leading-tight">
              <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-red-400">
                Care Plus · Dubai
              </p>
              <p className="text-[0.78rem] font-semibold text-ink">Book a service</p>
            </div>
          </div>
          <span className="text-[0.6rem] text-ink-faint">Open until 10 PM</span>
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-[0.6rem] text-ink-faint">Service</span>
            <div className="flex flex-wrap gap-1">
              {SERVICES.map((s, i) => (
                <Chip key={s} label={s} on={hasService && i === SERVICE} reduce={reduce} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-[0.6rem] text-ink-faint">Car</span>
            <div
              className={`flex h-[1.4rem] flex-1 items-center rounded-md border px-2 text-[0.68rem] transition-colors duration-200 ${
                hasCar ? "border-red-500/40 bg-surface-raised/60 text-ink" : "border-edge bg-surface-raised/40 text-ink-faint"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={hasCar ? "car" : "empty"}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                >
                  {hasCar ? CAR : "Make & model"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-[0.6rem] text-ink-faint">Today</span>
            <div className="flex flex-wrap gap-1">
              {SLOTS.map((s, i) => (
                <Chip key={s} label={s} on={hasSlot && i === SLOT} reduce={reduce} />
              ))}
            </div>
          </div>
        </div>

        {/* Book button */}
        <motion.div
          animate={booking && !reduce ? { scale: [1, 0.96, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease }}
          className={`mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg text-[0.75rem] font-semibold transition-colors duration-300 ${
            booked
              ? "bg-emerald-500/15 text-emerald-400"
              : hasSlot
                ? "bg-red-600 text-white shadow-[0_0_20px_-4px_rgb(220_38_38/0.6)]"
                : "bg-red-600/30 text-white/60"
          }`}
        >
          {booked ? (
            <>
              <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
              Booked · #CP-2481 · Today 7:30 PM
            </>
          ) : booking ? (
            <>
              <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
              Booking…
            </>
          ) : (
            <>
              <CalendarCheck aria-hidden className="h-3.5 w-3.5" />
              Book now
            </>
          )}
        </motion.div>
      </div>
    </DemoShell>
  );
}
