"use client";

import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { contact, site } from "@/data/portfolio";
import { Reveal } from "./motion-primitives";

export default function Contact() {
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
              <motion.a
                href={`mailto:${site.email}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-7 font-display text-sm font-semibold text-surface shadow-glow sm:w-auto"
              >
                <Mail aria-hidden className="h-4 w-4" />
                {site.email}
              </motion.a>
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
