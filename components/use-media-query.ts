"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query. Returns false on the server and first client render
 * (so markup matches during hydration), then updates after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on screens wide enough for the scroll-linked / pinned effects (lg+). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
