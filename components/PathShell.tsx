"use client";

import { useEffect, type ReactNode } from "react";
import type { PathKey } from "@/data/portfolio";
import Nav from "./Nav";
import Footer from "./Footer";

/**
 * Wraps a path page: applies its theme (via data-path → CSS tokens), plays the
 * entry curtain that continues the homepage's colour burst, and mounts the
 * path-aware nav.
 */
export default function PathShell({ path, children }: { path: PathKey; children: ReactNode }) {
  // Mirror the theme onto <html> so body, cursor and other root-level UI match.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.path = path;
    return () => {
      delete root.dataset.path;
    };
  }, [path]);

  return (
    <div data-path={path} className="min-h-screen bg-surface text-ink">
      <div aria-hidden className="path-curtain" />
      <Nav path={path} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
