"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { smoothScrollTo } from "./lenis-store";

/** Ease in-out cubic: starts slow, accelerates, settles gently. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Floating control that glides the page back to the top (exact pixel 0) with a
 * controlled duration + easing. A live demo of programmatic ScrollTo.
 */
export default function ScrollToTop() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          aria-label="Scroll back to top"
          onClick={() =>
            smoothScrollTo(0, { duration: 1.2, easing: easeInOutCubic })
          }
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          whileHover={reduce ? undefined : { y: -3 }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-surface-raised/80 text-accent shadow-glow backdrop-blur transition-colors hover:border-accent hover:bg-surface-overlay"
        >
          <ArrowUp aria-hidden className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
