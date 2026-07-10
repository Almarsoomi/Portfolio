import type Lenis from "lenis";

/** The live Lenis instance, registered by <SmoothScroll /> once it mounts. */
let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

export interface ScrollToOptions {
  /** Seconds the scroll should take. */
  duration?: number;
  /** Pixels to stop short of the target (negative clears a sticky header). */
  offset?: number;
  /** Easing curve, t in 0..1. Controls fast/slow/smooth. */
  easing?: (t: number) => number;
  /** Ignore user input during the scroll (default: false, so manual scroll interrupts). */
  lock?: boolean;
  onComplete?: () => void;
}

/**
 * Smooth-scroll to a target: an element, a CSS selector, or an exact pixel Y.
 * Uses Lenis when active (which cancels on manual scroll); falls back to the
 * platform's native smooth scroll when Lenis is off (e.g. reduced motion).
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options: ScrollToOptions = {},
) {
  if (instance) {
    instance.scrollTo(target, options);
    return;
  }

  // Fallback: no Lenis (reduced motion / not yet mounted) → native scroll.
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : typeof target === "number"
        ? null
        : target;

  const top =
    typeof target === "number"
      ? target
      : el
        ? el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0)
        : 0;

  window.scrollTo({ top, behavior: "smooth" });
}
