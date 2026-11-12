"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { Languages } from "lucide-react";
import { switchLangPath, type Lang } from "@/data/content";
import { useContent, useLang } from "./i18n";

export const LANG_KEY = "site:lang";

/**
 * Switches to the same page in the other language. A wash sweeps across in
 * the reading direction of the new language (right→left into Arabic,
 * left→right into English), then the page loads already laid out for it.
 */
export default function LangSwitch({ compact = false, className }: { compact?: boolean; className?: string }) {
  const lang = useLang();
  const { ui } = useContent();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [going, setGoing] = useState<Lang | null>(null);
  const to: Lang = lang === "ar" ? "en" : "ar";

  const go = () => {
    if (going) return;
    try {
      window.localStorage.setItem(LANG_KEY, to);
    } catch {
      /* ignore */
    }
    const target = switchLangPath(pathname || "/", to) + window.location.hash;
    if (reduce) {
      router.push(target);
      return;
    }
    setGoing(to);
    window.setTimeout(() => router.push(target), 420);
  };

  return (
    <>
      <button
        type="button"
        onClick={go}
        aria-label={ui.switchLangLabel}
        lang={to}
        className={`group inline-flex h-10 items-center gap-2 rounded-full border border-edge-strong px-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent/60 hover:text-accent ${className ?? ""}`}
      >
        <Languages aria-hidden className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[360deg]" />
        <span>
          {compact ? ui.otherLangShort : ui.otherLangName}
        </span>
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {going ? (
                <motion.div
                  aria-hidden
                  className="fixed inset-0 z-[95] flex items-center justify-center bg-surface"
                  initial={{ clipPath: going === "ar" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0 0 0%)" }}
                  transition={{ duration: 0.42, ease: [0.7, 0, 0.2, 1] }}
                >
                  <motion.span
                    className="font-display text-3xl font-semibold text-ink"
                    lang={going}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {ui.otherLangName}
                  </motion.span>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
