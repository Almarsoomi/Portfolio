"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { hero } from "@/data/portfolio";
import { EASE } from "./motion-primitives";
import Typewriter from "./Typewriter";
import { useIsDesktop, useMediaQuery } from "./use-media-query";
import ahmedPhoto from "@/app/ahmed.webp";

/** A shape that gently bobs up and down (disabled under reduced motion). */
function Float({
  children,
  className,
  dy = 10,
  duration = 4.5,
  delay = 0,
  reduce,
}: {
  children: React.ReactNode;
  className?: string;
  dy?: number;
  duration?: number;
  delay?: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={reduce ? undefined : { y: [0, -dy, 0] }}
      transition={
        reduce
          ? undefined
          : { duration, delay, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  // Scroll/pointer-linked effects are desktop-only: on phones they add
  // main-thread work per scroll frame for effects nobody can trigger anyway.
  const motionOff = reduce || !isDesktop;
  // Shapes are *not rendered* below md (rather than CSS-hidden) so their 7
  // infinite animations never tick on phones.
  const showShapes = useMediaQuery("(min-width: 768px)");

  // Parallax: elements move at different rates as the hero scrolls away.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgYRaw = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textYRaw = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const photoYRaw = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bgY = motionOff ? undefined : bgYRaw;
  const textY = motionOff ? undefined : textYRaw;
  const photoY = motionOff ? undefined : photoYRaw;

  // Cursor-move parallax: the portrait and shapes react to pointer position,
  // at different depths, so the flat layout gains spatial depth.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springCfg = { stiffness: 150, damping: 18, mass: 0.4 };
  const psX = useSpring(pointerX, springCfg);
  const psY = useSpring(pointerY, springCfg);
  const shapeX = useTransform(psX, (v) => v * 46);
  const shapeY = useTransform(psY, (v) => v * 46);
  const photoX = useTransform(psX, (v) => v * 20);
  const photoRotY = useTransform(psX, (v) => v * 9);
  const photoRotX = useTransform(psY, (v) => v * -9);

  const handlePointerMove = (e: React.MouseEvent) => {
    if (motionOff || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {/* Atmosphere: grid texture + drifting radial glow (parallax layer) */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute inset-x-0 -top-[15%] h-[130%]"
      >
        <div className="bg-grid absolute inset-0" />
        <div className="hero-glow animate-glow-drift absolute left-1/2 top-[5%] h-[36rem] w-[52rem] max-w-[150vw] -translate-x-1/2" />
      </motion.div>

      <motion.div
        className="relative mx-auto grid min-h-[92svh] max-w-content items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {/* Text column */}
        <motion.div style={{ y: textY }} className="text-center lg:text-left">
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-edge-strong bg-surface-raised/60 px-4 py-2 text-sm font-medium text-ink-muted backdrop-blur"
          >
            <MapPin aria-hidden className="h-4 w-4 text-accent" />
            {hero.badge}
          </motion.p>

          <motion.p
            variants={item}
            className="mb-3 font-display text-lg font-medium text-ink-muted"
          >
            <span aria-hidden className="mr-1">
              👋
            </span>
            {hero.greeting}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-semibold tracking-tight text-ink"
            style={{ fontSize: "clamp(2.25rem, 6.5vw, 4.25rem)", lineHeight: 1.08 }}
          >
            {hero.lead}{" "}
            <Typewriter
              words={hero.typewriter}
              className="text-gradient inline-block min-h-[1.15em]"
            />
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start"
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

        {/* Photo column with floating shapes (parallax) */}
        <motion.div style={{ y: photoY }} className="relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem]">
          <motion.div
            variants={item}
            style={{
              x: photoX,
              rotateX: photoRotX,
              rotateY: photoRotY,
              transformPerspective: 700,
            }}
            className="relative aspect-square w-full"
          >
          {/* Gradient blob behind the portrait */}
          <div
            aria-hidden
            className="absolute inset-[6%] rounded-full bg-gradient-to-br from-accent/30 via-accent-deep/20 to-transparent blur-2xl"
          />
          {/* Accent ring */}
          <div
            aria-hidden
            className="absolute inset-[4%] rounded-full border border-accent/20"
          />

          {/* Portrait */}
          <div className="absolute inset-[9%] overflow-hidden rounded-full border border-edge-strong bg-surface-raised shadow-glow">
            <Image
              src={ahmedPhoto}
              alt="Ahmed"
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* ── Floating geometric shapes (extra cursor parallax) ── */}
          {showShapes ? (
          <motion.div style={{ x: shapeX, y: shapeY }} className="absolute inset-0">

          {/* Filled accent circle, top-right */}
          <Float
            reduce={!!reduce}
            dy={12}
            duration={5}
            className="absolute right-[4%] top-[8%] h-6 w-6 rounded-full bg-accent shadow-glow"
          >
            <span className="sr-only" />
          </Float>

          {/* Small deep-blue square, upper-left */}
          <Float
            reduce={!!reduce}
            dy={9}
            duration={4}
            delay={0.4}
            className="absolute left-[2%] top-[24%] h-4 w-4 rotate-12 rounded-[3px] bg-accent-deep"
          >
            <span className="sr-only" />
          </Float>

          {/* Hollow outline square, bottom-right */}
          <Float
            reduce={!!reduce}
            dy={14}
            duration={5.5}
            delay={0.2}
            className="absolute bottom-[6%] right-[0%] h-12 w-12 rotate-12 rounded-md border-2 border-ink/70"
          >
            <span className="sr-only" />
          </Float>

          {/* Squiggle, top-left */}
          <Float
            reduce={!!reduce}
            dy={8}
            duration={4.8}
            delay={0.6}
            className="absolute left-[6%] top-[2%] text-accent"
          >
            <svg width="62" height="20" viewBox="0 0 62 20" fill="none">
              <path
                d="M2 12 Q 9 2, 16 12 T 30 12 T 44 12 T 58 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </Float>

          {/* Curved arrow pointing at the portrait, lower-left */}
          <Float
            reduce={!!reduce}
            dy={7}
            duration={5.2}
            delay={0.3}
            className="absolute bottom-[20%] -left-2 text-ink-muted"
          >
            <div className="relative h-14 w-14">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path
                  d="M8 44 C 12 22, 32 14, 48 20"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M40 14 L 49 20 L 42 28"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* MotionPath: a dot rides the arrow curve, then repeats. */}
              {reduce ? null : (
                <motion.span
                  className="absolute left-0 top-0 h-2 w-2 rounded-full bg-accent shadow-glow"
                  style={{ offsetPath: "path('M8 44 C 12 22, 32 14, 48 20')" }}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: ["0%", "100%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.7,
                    times: [0, 0.1, 0.9, 1],
                  }}
                />
              )}
            </div>
          </Float>

          {/* Dot cluster, mid-right */}
          <Float
            reduce={!!reduce}
            dy={10}
            duration={4.4}
            delay={0.5}
            className="absolute -right-2 top-[46%] flex gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/30" />
          </Float>
          </motion.div>
          ) : null}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
