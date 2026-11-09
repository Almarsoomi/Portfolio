"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, type Transition } from "framer-motion";

/**
 * Returns a key that changes every `ms`, so keyed children remount and replay
 * their entrance timeline. Frozen (and timelines collapse to their end state)
 * under reduced motion.
 */
export function useLoop(ms: number) {
  const reduce = !!useReducedMotion();
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setKey((k) => k + 1);
    }, ms);
    return () => window.clearInterval(id);
  }, [ms, reduce]);

  /** Transition helper: a timed step, or instant when motion is reduced. */
  const at = (delay: number, extra: Transition = {}): Transition =>
    reduce ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.4, 0.25, 1], ...extra, delay };

  return { key, reduce, at };
}
