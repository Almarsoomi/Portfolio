"use client";

import { useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useContent } from "./i18n";

export const THEME_KEY = "site:theme";

/**
 * Runs in <head> before first paint so a visitor who chose the light theme
 * never sees a dark flash. Dark is the default.
 */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Light/dark switch. The new theme grows as a circle out of the button (View
 * Transitions API); other browsers and reduced-motion visitors get an instant
 * swap. Stateless on purpose: both icons render and CSS shows the right one,
 * so every toggle on the page stays in sync with no hydration mismatch.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { ui } = useContent();
  const reduce = useReducedMotion();

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      if (next === "light") root.dataset.theme = "light";
      else delete root.dataset.theme;
    };
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable — the choice just won't be remembered */
    }

    const doc = document as ViewTransitionDocument;
    if (reduce || !doc.startViewTransition) {
      apply();
      return;
    }
    // Keyboard activation has no pointer position — grow from the button centre.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${r}px`);
    root.classList.add("theme-switching");
    const done = () => root.classList.remove("theme-switching");
    doc.startViewTransition(apply).finished.then(done, done);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ui.themeLabel}
      title={ui.themeLabel}
      className={`group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-edge-strong text-ink transition-colors hover:border-accent/60 hover:text-accent ${className ?? ""}`}
    >
      <Moon
        aria-hidden
        className="absolute h-4 w-4 transition-all duration-500 light:-rotate-90 light:scale-0 light:opacity-0"
      />
      <Sun
        aria-hidden
        className="absolute h-4 w-4 rotate-90 scale-0 opacity-0 transition-all duration-500 light:rotate-0 light:scale-100 light:opacity-100"
      />
    </button>
  );
}
