"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe "prefers reduced motion".
 *
 * Framer's own useReducedMotion() returns the real setting on the very first
 * client render, while the static HTML was rendered as "no preference". For
 * visitors with Reduce Motion on (common on iPhones) that made the first
 * render's styles differ from the HTML, so React threw the whole page away and
 * re-rendered it — which could leave animated content stuck invisible.
 *
 * This hook answers `false` while hydrating (matching the HTML) and the real
 * setting immediately after, and keeps following changes. <MotionProvider>
 * (MotionConfig reducedMotion="user") still skips motion for those visitors
 * during that first frame.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
