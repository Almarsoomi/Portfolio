"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { Quote } from "lucide-react";
import type { PathKey } from "@/data/portfolio";
import { clients, testimonials } from "@/data/testimonials";
import { useContent, useLang } from "./i18n";
import { SectionHeading } from "./motion-primitives";

/**
 * Social proof for a path: an endless strip of client names, plus a swipeable
 * quote carousel once real testimonials are added in data/testimonials.ts.
 */
export default function Testimonials({ path }: { path: PathKey }) {
  const { ui } = useContent();
  const rtl = useLang() === "ar";
  const reduce = useReducedMotion();
  const names = clients.filter((c) => c.paths.includes(path)).map((c) => c.name);
  const quotes = testimonials.filter((t) => t.paths.includes(path));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance quotes (paused on hover/focus).
  useEffect(() => {
    if (reduce || paused || quotes.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % quotes.length), 6500);
    return () => window.clearInterval(t);
  }, [reduce, paused, quotes.length]);

  const step = (d: number) => setIndex((i) => (i + d + quotes.length) % quotes.length);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dx = rtl ? -info.offset.x : info.offset.x;
    if (dx < -60) step(1);
    else if (dx > 60) step(-1);
  };

  // Repeat the names so one copy always fills the strip; the second copy makes the loop seamless.
  const strip = names.length ? Array.from({ length: Math.max(2, Math.ceil(8 / names.length)) }, () => names).flat() : [];
  const q = quotes[index];

  return (
    <section id="clients" className="py-section-sm">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading eyebrow={ui.sections.testimonials.eyebrow} title={ui.sections.testimonials.title} />
      </div>

      {/* Client strip */}
      <p className="mb-5 px-5 text-center text-sm text-ink-faint sm:px-8">{ui.sections.testimonials.trustedBy}</p>
      <div
        dir="ltr"
        className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      >
        <div
          className={`flex w-max gap-4 ${reduce ? "flex-wrap justify-center" : "client-marquee group-hover:[animation-play-state:paused]"} ${
            rtl ? "[animation-direction:reverse]" : ""
          }`}
        >
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4">
              {strip.map((name, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center gap-4 whitespace-nowrap rounded-full border border-edge bg-surface-raised/50 px-6 py-3 font-display text-lg font-semibold text-ink-muted transition-colors hover:border-accent/50 hover:text-ink sm:text-xl"
                >
                  <span aria-hidden className="h-2 w-2 rounded-full bg-gradient-to-br from-accent-bright to-accent-deep" />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quotes (only when real ones exist) */}
      {q ? (
        <div
          className="mx-auto mt-12 max-w-3xl px-5 sm:px-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised/60 p-8 shadow-card sm:p-10">
            <Quote aria-hidden className="absolute end-6 top-6 h-16 w-16 text-accent/15 rtl:-scale-x-100" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                drag={quotes.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={onDragEnd}
                initial={{ opacity: 0, x: reduce ? 0 : rtl ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : rtl ? 40 : -40 }}
                transition={{ duration: 0.35 }}
                className="relative cursor-grab active:cursor-grabbing"
              >
                <blockquote className="font-display text-xl leading-relaxed text-ink sm:text-2xl">“{q.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-bright to-accent-deep font-display font-bold text-surface">
                    {q.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{q.name}</span>
                    <span className="block text-sm text-ink-muted">
                      {q.role}, {q.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          {quotes.length > 1 ? (
            <div className="mt-5 flex justify-center gap-2">
              {quotes.map((t, i) => (
                <button
                  key={t.name + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1} / ${quotes.length}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-accent" : "w-2 bg-edge-strong hover:bg-ink-faint"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
