"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

export const EASE = [0.25, 0.4, 0.25, 1] as const;

export function useRevealVariants(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: EASE },
    },
  };
}

/** Fades/slides content up once when it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its motion children as they scroll into view. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const variants = useRevealVariants();
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Lag: the heading gently trails the scroll via a spring-smoothed offset.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useSpring(useTransform(scrollYProgress, [0, 1], [26, -26]), {
    stiffness: 110,
    damping: 20,
    mass: 0.35,
  });
  const y = reduce ? undefined : yRaw;

  return (
    <Reveal className="mb-12 max-w-2xl md:mb-16">
      <motion.div ref={ref} style={{ y }}>
        <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <HeadingFlourish />
        {intro ? <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{intro}</p> : null}
      </motion.div>
    </Reveal>
  );
}

/** A hand-drawn accent underline that draws itself when scrolled into view. */
export function HeadingFlourish({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="0 0 168 14"
      fill="none"
      className={`mt-3 h-3 w-40 ${className ?? ""}`}
    >
      <defs>
        <linearGradient id="flourish-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--color-accent-bright))" />
          <stop offset="100%" stopColor="rgb(var(--color-accent-deep))" />
        </linearGradient>
      </defs>
      <motion.path
        d="M2 9 Q 22 2, 44 8 T 88 8 T 132 7 T 166 6"
        stroke="url(#flourish-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      />
    </svg>
  );
}
