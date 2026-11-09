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
import type { PathKey } from "@/data/portfolio";
import { useContent } from "./i18n";
import { EASE } from "./motion-primitives";
import Typewriter from "./Typewriter";
import HeroProps from "./HeroProps";
import AvailabilityBadge from "./AvailabilityBadge";
import { useIsDesktop, useMediaQuery } from "./use-media-query";
import ahmedPhoto from "@/app/ahmed.webp";

export default function Hero({ path }: { path: PathKey }) {
  const c = useContent();
  const content = path === "books" ? c.booksHero : c.hero;
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  // Scroll/pointer-linked effects are desktop-only: on phones they add
  // main-thread work per scroll frame for effects nobody can trigger anyway.
  const motionOff = reduce || !isDesktop;
  // The floating cards only bob from md up; on phones they stay put so fewer
  // infinite animations tick.
  const isMd = useMediaQuery("(min-width: 768px)");

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
        <motion.div style={{ y: textY }} className="text-center lg:text-start">
          <motion.div
            variants={item}
            className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-edge-strong bg-surface-raised/60 px-4 py-2 text-sm font-medium text-ink-muted backdrop-blur">
              <MapPin aria-hidden className="h-4 w-4 text-accent" />
              {content.badge}
            </p>
            {/* The nav carries this badge from lg up */}
            <AvailabilityBadge path={path} className="inline-flex py-2 lg:hidden" />
          </motion.div>

          <motion.p
            variants={item}
            className="mb-3 font-display text-lg font-medium text-ink-muted"
          >
            <span aria-hidden className="me-1">
              👋
            </span>
            {content.greeting}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-semibold tracking-tight text-ink"
            style={{ fontSize: "clamp(2.25rem, 6.5vw, 4.25rem)", lineHeight: 1.08 }}
          >
            {content.lead}{" "}
            <Typewriter
              words={content.typewriter}
              className="text-gradient inline-block min-h-[1.15em]"
            />
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.a
              href={content.primaryCta.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-7 font-display text-sm font-semibold text-surface shadow-glow sm:w-auto"
            >
              {content.primaryCta.label}
              <ArrowRight aria-hidden className="h-4 w-4 rtl:-scale-x-100" />
            </motion.a>
            <motion.a
              href={content.secondaryCta.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-edge-strong bg-surface-raised/60 px-7 font-display text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-accent/50 sm:w-auto"
            >
              {content.secondaryCta.label}
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
              alt={c.ui.portraitAlt}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating pieces of the work (extra cursor parallax on desktop) */}
          <motion.div style={{ x: shapeX, y: shapeY }} className="absolute inset-0">
            <HeroProps path={path} reduce={!!reduce} bob={isMd} />
          </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
