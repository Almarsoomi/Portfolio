"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Factory, Store, Waves, ArrowRight } from "lucide-react";
import { accounting, type IndustryCard } from "@/data/portfolio";
import { Reveal, SectionHeading, StaggerGroup, StaggerItem } from "./motion-primitives";

const icons: Record<IndustryCard["icon"], typeof Factory> = {
  factory: Factory,
  store: Store,
  waves: Waves,
};

export default function Accounting() {
  return (
    <section id="services" className="relative">
      <div className="absolute inset-0 bg-surface-raised/30" aria-hidden />
      <div className="relative mx-auto max-w-content px-5 py-section-sm sm:px-8">
        <SectionHeading
          eyebrow="UAE Bookkeeping Specialist"
          title={accounting.heading}
          intro={accounting.intro}
        />

        {/* Industry experience cards */}
        <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {accounting.industries.map((card) => {
            const Icon = icons[card.icon];
            return (
              <StaggerItem key={card.industry} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-edge bg-surface-raised/60 p-6 shadow-card transition-colors duration-300 hover:border-accent/40 sm:p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                    <Icon aria-hidden className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {card.industry}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">{card.client}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-ink-muted">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* What I handle */}
        <Reveal className="mt-12 rounded-2xl border border-edge bg-surface-raised/60 p-6 shadow-card sm:p-8 md:mt-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-xl">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                What I handle
              </h3>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {accounting.handles.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <motion.a
              href={accounting.cta.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-accent to-accent-deep px-7 font-display text-sm font-semibold text-surface shadow-glow md:self-center"
            >
              {accounting.cta.label}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
