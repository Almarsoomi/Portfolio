"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useRef } from "react";
import { BarChart3, ClipboardCheck, FileSpreadsheet, Landmark } from "lucide-react";
import { useContent } from "./i18n";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion-primitives";

const icons = [ClipboardCheck, FileSpreadsheet, Landmark, BarChart3];

/**
 * The engagement, step by step. A progress rail fills as you scroll through
 * the steps (vertical on phones, horizontal on desktop).
 */
export default function Process() {
  const { process, ui } = useContent();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="process" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading eyebrow={ui.sections.process.eyebrow} title={process.heading} intro={process.intro} />

      <div ref={ref} className="relative">
        {/* Rail — horizontal (lg) */}
        <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-edge-strong lg:block">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-accent-bright to-accent-deep rtl:origin-right rtl:bg-gradient-to-l"
            style={{ scaleX: reduce ? 1 : progress }}
          />
        </div>
        {/* Rail — vertical (mobile) */}
        <div aria-hidden className="absolute bottom-6 start-6 top-6 w-px bg-edge-strong lg:hidden">
          <motion.div
            className="h-full w-full origin-top bg-gradient-to-b from-accent-bright to-accent-deep"
            style={{ scaleY: reduce ? 1 : progress }}
          />
        </div>

        <StaggerGroup className="relative grid gap-8 lg:grid-cols-4 lg:gap-6" stagger={0.12}>
          {process.steps.map((step, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={step.title} className="flex gap-5 lg:flex-col lg:gap-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface shadow-glow">
                  <Icon aria-hidden className="h-5 w-5 text-accent" />
                </div>
                <div className="lg:mt-6">
                  <p className="text-xs text-ink-faint">
                    {ui.step} <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
