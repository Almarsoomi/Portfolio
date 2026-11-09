"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Camera, Check, Languages, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoShell, ease, useDemoTimeline } from "./shared";

/**
 * Looping mini-demo of The Walls website:
 * parametric wave hero → EN ⇄ Arabic (RTL) switch → Instagram posts sync in →
 * visitor requests a quote.
 */

/**
 * Timeline. Phase:
 *  0 → English hero, waves animating   1 → switched to Arabic (RTL)
 *  2 → back to English                 3..5 → Instagram tiles appear
 *  6 → "Get a quote" pressed           7 → hold: quote request received
 */
const DURATIONS = [700, 1000, 300, 250, 250, 300, 400, 2200];

const GOLD = "#c9a55c";

const COPY = {
  en: { title: "Crafted walls, made to measure", sub: "Joinery · Solid surfaces · Aluminium" },
  ar: { title: "جدران مصنوعة حسب الطلب", sub: "نجارة · أسطح صلبة · ألمنيوم" },
};

const TILES = [
  "linear-gradient(135deg,#6b4a2b,#a47148 55%,#3b2a1a)",
  "linear-gradient(160deg,#2a2a2a,#8a8a85 50%,#1c1c1c)",
  "linear-gradient(120deg,#c9a55c,#7a5c2e 60%,#2b2115)",
];

type Toast = { key: string; icon: LucideIcon; text: string; ok?: boolean };

/** Vertical "fins" bent by a travelling sine wave, like the facade on the real site. */
function ParametricWaves({ animate }: { animate: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const inView = useInView(svg, { amount: 0.2 });
  const paths = useRef<Array<SVGPathElement | null>>([]);
  const FINS = 22;
  const W = 300;
  const H = 90;

  useEffect(() => {
    const draw = (t: number) => {
      paths.current.forEach((p, i) => {
        if (!p) return;
        const x0 = (i + 0.5) * (W / FINS);
        let d = "";
        for (let s = 0; s <= 10; s++) {
          const y = (s / 10) * H;
          const amp = 7 * Math.sin((i / FINS) * Math.PI);
          const x = x0 + amp * Math.sin(y * 0.045 + t * 0.0016 + i * 0.32);
          d += `${s === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
        }
        p.setAttribute("d", d);
      });
    };
    draw(0);
    if (!animate || !inView) return;
    let raf = requestAnimationFrame(function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [animate, inView]);

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      {Array.from({ length: FINS }, (_, i) => (
        <path
          key={i}
          ref={(el) => {
            paths.current[i] = el;
          }}
          fill="none"
          stroke={GOLD}
          strokeWidth={1.4}
          strokeOpacity={+(0.18 + 0.4 * Math.sin((i / FINS) * Math.PI)).toFixed(3)}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export default function TheWallsDemo() {
  const { root, phase, last, reduce } = useDemoTimeline(DURATIONS);

  const lang = phase === 1 ? "ar" : "en";
  const tiles = phase >= 3 ? Math.min(phase - 2, 3) : 0;
  const quoting = phase === 6;
  const quoted = phase >= 7;

  const toast: Toast = quoted
    ? { key: "quote", icon: Check, text: "Quote request received · lead sent to sales", ok: true }
    : phase === 0
      ? { key: "waves", icon: Waves, text: "Parametric hero · drawn live in code" }
      : phase === 1
        ? { key: "ar", icon: Languages, text: "Switched to العربية · full right-to-left layout" }
        : { key: "ig", icon: Camera, text: "New Instagram posts · synced automatically" };
  const ToastIcon = toast.icon;

  return (
    <DemoShell
      rootRef={root}
      label="Animated demo: The Walls website with a live parametric wave hero, an English to Arabic switch, an auto-synced Instagram feed, and a quote request."
      status={quoted ? "Lead captured ✓" : phase >= 2 ? "Syncing feed…" : phase === 1 ? "Bilingual…" : "Rendering…"}
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
              toast.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-edge-strong bg-surface-overlay/90 text-ink-muted"
            }`}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={
                toast.ok
                  ? { background: "rgb(16 185 129 / 0.2)" }
                  : { background: "rgb(201 165 92 / 0.18)", color: GOLD }
              }
            >
              <ToastIcon aria-hidden className="h-3 w-3" strokeWidth={toast.ok ? 3 : 2} />
            </span>
            <p className="min-w-0 truncate text-[0.72rem] font-medium">{toast.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini website */}
      <div className="overflow-hidden rounded-2xl border border-edge bg-[#0d0c0a]/90 shadow-card backdrop-blur">
        {/* Site header */}
        <div
          className={`flex items-center justify-between px-3 py-2 ${lang === "ar" ? "flex-row-reverse" : ""}`}
        >
          <span
            className="font-serif text-[0.7rem] font-semibold tracking-[0.25em]"
            style={{ color: GOLD }}
          >
            THE WALLS
          </span>
          <div className={`flex items-center gap-1.5 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
            <span className="flex overflow-hidden rounded border border-[#c9a55c]/40 text-[0.55rem] font-semibold">
              {(["en", "ar"] as const).map((l) => (
                <span
                  key={l}
                  className="px-1.5 py-0.5 transition-colors duration-200"
                  style={
                    lang === l
                      ? { background: GOLD, color: "#0d0c0a" }
                      : { color: "rgb(201 165 92 / 0.7)" }
                  }
                >
                  {l === "en" ? "EN" : "عربي"}
                </span>
              ))}
            </span>
            <motion.span
              animate={quoting && !reduce ? { scale: [1, 0.92, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease }}
              className="rounded border px-1.5 py-0.5 text-[0.55rem] font-semibold tracking-wider transition-colors duration-200"
              style={
                quoting || quoted
                  ? { background: GOLD, borderColor: GOLD, color: "#0d0c0a" }
                  : { borderColor: "rgb(201 165 92 / 0.6)", color: GOLD }
              }
            >
              {quoted ? "SENT ✓" : lang === "ar" ? "اطلب عرض سعر" : "GET A QUOTE"}
            </motion.span>
          </div>
        </div>

        {/* Hero with parametric waves */}
        <div className="relative h-[5.4rem] border-y border-[#c9a55c]/15">
          <ParametricWaves animate={!reduce} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/90 via-[#0d0c0a]/40 to-transparent" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={lang}
              dir={lang === "ar" ? "rtl" : "ltr"}
              initial={reduce ? false : { opacity: 0, x: lang === "ar" ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="absolute inset-0 flex flex-col justify-center px-3 text-start"
            >
              <p className="max-w-[80%] font-serif text-[1.05rem] leading-tight text-[#f3ede2]">
                {COPY[lang].title}
              </p>
              <p className="mt-1 text-[0.6rem] tracking-wide" style={{ color: GOLD }}>
                {COPY[lang].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Instagram feed */}
        <div className="px-3 pb-3 pt-2">
          <p className="mb-1.5 flex items-center gap-1 text-[0.55rem] font-semibold uppercase tracking-wider text-ink-faint">
            <Camera aria-hidden className="h-2.5 w-2.5" />
            Instagram · live feed
          </p>
          <div className="grid h-10 grid-cols-3 gap-1.5">
            {TILES.map((bg, i) => (
              <div key={i} className="overflow-hidden rounded-md border border-edge bg-surface-raised/40">
                <AnimatePresence>
                  {i < tiles ? (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease }}
                      className="h-full w-full"
                      style={{ background: bg }}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
