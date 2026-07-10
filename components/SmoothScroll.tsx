"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "./lenis-store";

/**
 * Smooths native scrolling with Lenis (a free ScrollSmoother alternative).
 * Because it smooths the *real* scroll position rather than transforming a
 * wrapper, position: sticky, framer's useScroll, and DOM measurements all keep
 * working. Fully disabled under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices already scroll smoothly on the compositor thread. Driving
    // that from JS (syncTouch) moves scrolling onto the main thread and makes
    // phones stutter, so leave native scroll alone there.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Expo-out: quick to respond, gentle to settle.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    registerLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Offset in-page anchor jumps by the sticky nav height.
    const navOffset = () => {
      const root = getComputedStyle(document.documentElement);
      const raw = root.getPropertyValue("--nav-height").trim();
      const px = raw.endsWith("rem")
        ? parseFloat(raw) * parseFloat(root.fontSize)
        : parseFloat(raw) || 0;
      return -(px + 16);
    };

    // Route hash-link clicks through Lenis so anchors scroll smoothly too.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: navOffset() });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  return null;
}
