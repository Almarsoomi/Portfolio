"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { contact, site } from "@/data/portfolio";
import { Reveal } from "./motion-primitives";

// Comet path (160×80 box): arcs from upper-left down to the button's top-center.
const COMET_PATH = "M 24 12 C 74 4, 104 42, 80 74";

export default function Contact() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <section id="contact" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised/60 px-6 py-14 text-center shadow-card sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="hero-glow absolute left-1/2 top-[-40%] h-[24rem] w-[36rem] -translate-x-1/2"
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {contact.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {contact.text}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <div
                className="relative w-full sm:w-auto"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
              >
                {/* Comet trail: streaks in and lands on the button on hover */}
                {hovered && !reduce ? (
                  <svg
                    aria-hidden
                    viewBox="0 0 160 80"
                    className="pointer-events-none absolute bottom-full left-1/2 h-20 w-40 -translate-x-1/2 translate-y-2 overflow-visible"
                  >
                    <motion.path
                      d={COMET_PATH}
                      fill="none"
                      stroke="rgb(var(--color-accent))"
                      strokeWidth={3}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="0.3 1"
                      initial={{ strokeDashoffset: 1.3, opacity: 0 }}
                      animate={{ strokeDashoffset: -0.3, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      style={{ filter: "drop-shadow(0 0 5px rgb(var(--color-accent)))" }}
                    />
                    {/* Impact ripple where the comet lands */}
                    <motion.circle
                      cx={80}
                      cy={74}
                      r={4}
                      fill="none"
                      stroke="rgb(var(--color-accent))"
                      strokeWidth={2}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 2.4, opacity: [0.9, 0] }}
                      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                      style={{ transformOrigin: "80px 74px" }}
                    />
                  </svg>
                ) : null}

                <motion.a
                  href={`mailto:${site.email}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-7 font-display text-sm font-semibold text-surface shadow-glow sm:w-auto"
                >
                  <Mail aria-hidden className="h-4 w-4" />
                  {site.email}
                </motion.a>
              </div>
              <motion.a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-edge-strong bg-surface px-7 font-display text-sm font-semibold text-ink transition-colors hover:border-accent/50 sm:w-auto"
              >
                <Github aria-hidden className="h-4 w-4" />
                GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </motion.a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
