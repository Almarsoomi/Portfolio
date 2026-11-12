"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { Briefcase, Cloud, Monitor, Server, type LucideIcon } from "lucide-react";
import { useContent } from "./i18n";
import { EASE, SectionHeading } from "./motion-primitives";

/** One icon per skill group, in the order the groups appear in the data. */
const ICONS: LucideIcon[] = [Monitor, Server, Cloud, Briefcase];
/** How long each group stays on screen before the next one takes over. */
const DWELL = 3200;

/**
 * The stack as one compact, self-playing card instead of four long lists.
 * A spotlight moves through the groups: the active tab opens to show its name
 * and fills a progress line while its skills pop in below. Picking a tab stops
 * the autoplay, and it only runs while the card is on screen.
 */
export default function Skills() {
  const { skills, ui } = useContent();
  const reduce = !!useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [picked, setPicked] = useState(false);
  const playing = inView && !hovered && !picked && !reduce;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % skills.length), DWELL);
    return () => window.clearTimeout(t);
  }, [playing, active, skills.length]);

  const group = skills[active];

  return (
    <section id="skills" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading eyebrow={ui.sections.skills.eyebrow} title={ui.sections.skills.title} />

      <div
        ref={cardRef}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="relative overflow-hidden rounded-3xl border border-edge bg-surface-raised/50 p-4 shadow-card sm:p-7"
      >
        <div aria-hidden className="hero-glow absolute -end-24 -top-32 h-72 w-72" />

        {/* Group tabs: the active one opens to show its name */}
        <div className="relative flex items-center gap-2">
          {skills.map((col, i) => {
            const Icon = ICONS[i % ICONS.length];
            const on = i === active;
            return (
              <button
                key={col.title}
                type="button"
                aria-pressed={on}
                aria-label={col.title}
                onClick={() => {
                  setActive(i);
                  setPicked(true);
                }}
                className={`relative flex h-11 items-center overflow-hidden rounded-full border px-3 transition-colors duration-300 ${
                  on
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-edge-strong text-ink-faint hover:border-accent/40 hover:text-ink"
                }`}
              >
                <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" />
                <span
                  aria-hidden
                  className={`grid transition-[grid-template-columns] duration-500 ease-out md:grid-cols-[1fr] ${
                    on ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
                  }`}
                >
                  <span className="overflow-hidden whitespace-nowrap ps-2 font-display text-xs font-semibold uppercase tracking-[0.14em]">
                    {col.title}
                  </span>
                </span>
                {/* Progress line: fills while this group is on screen */}
                {on ? (
                  <motion.span
                    key={`${active}-${playing}`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-accent-bright to-accent-deep rtl:origin-right"
                    initial={{ scaleX: playing ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: playing ? DWELL / 1000 : 0, ease: "linear" }}
                  />
                ) : null}
              </button>
            );
          })}
          <span dir="ltr" className="ms-auto hidden font-mono text-xs text-ink-faint sm:block">
            0{active + 1} / 0{skills.length}
          </span>
        </div>

        {/* Skills of the active group */}
        <div className="relative mt-5 min-h-[9.75rem] sm:mt-6 sm:min-h-[6.5rem] lg:min-h-[3.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active}
              className="flex flex-wrap gap-2 sm:gap-2.5"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
            >
              {group.skills.map((skill) => (
                <motion.li
                  key={skill}
                  variants={{
                    hidden: { opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
                  }}
                  className="flex items-center gap-2.5 rounded-full border border-edge-strong bg-surface/70 px-4 py-2.5 font-display text-base font-medium text-ink sm:px-5 sm:text-lg"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-gradient-to-br from-accent-bright to-accent-deep"
                  />
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
