"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { hero } from "@/data/portfolio";
import { EASE } from "./motion-primitives";

export default function Hero() {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
  };

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Atmosphere: grid texture + drifting radial glow */}
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div
        aria-hidden
        className="hero-glow animate-glow-drift absolute left-1/2 top-[-20%] h-[36rem] w-[52rem] max-w-[150vw] -translate-x-1/2"
      />

      <motion.div
        className="relative mx-auto flex min-h-[92svh] max-w-content flex-col items-center justify-center px-5 pb-20 pt-32 text-center sm:px-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.p
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-edge-strong bg-surface-raised/60 px-4 py-2 text-sm font-medium text-ink-muted backdrop-blur"
        >
          <MapPin aria-hidden className="h-4 w-4 text-accent" />
          {hero.badge}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl font-display font-semibold tracking-tight text-ink"
          style={{ fontSize: "clamp(2.25rem, 7vw, 4.5rem)", lineHeight: 1.08 }}
        >
          Building Tools That Solve{" "}
          <span className="text-gradient">Real Problems</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          {hero.subheadline}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          <motion.a
            href={hero.primaryCta.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-7 font-display text-sm font-semibold text-surface shadow-glow sm:w-auto"
          >
            {hero.primaryCta.label}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </motion.a>
          <motion.a
            href={hero.secondaryCta.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-edge-strong bg-surface-raised/60 px-7 font-display text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-accent/50 sm:w-auto"
          >
            {hero.secondaryCta.label}
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
