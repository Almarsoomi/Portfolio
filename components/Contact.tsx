"use client";

import type { PathKey } from "@/data/portfolio";
import ContactWizard from "./ContactWizard";
import { useContent } from "./i18n";
import { Reveal } from "./motion-primitives";

export default function Contact({ path }: { path: PathKey }) {
  const { contact, booksContact } = useContent();
  const { heading, text } = path === "books" ? booksContact : contact;

  return (
    <section id="contact" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised/60 px-4 py-12 shadow-card sm:px-10 sm:py-14">
          <div
            aria-hidden
            className="hero-glow absolute left-1/2 top-[-40%] h-[24rem] w-[36rem] -translate-x-1/2"
          />
          <div className="relative">
            <div className="text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {heading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {text}
              </p>
            </div>
            <div className="mt-10">
              <ContactWizard path={path} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
