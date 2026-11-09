"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftRight, Menu, X } from "lucide-react";
import type { PathKey } from "@/data/portfolio";
import { EASE } from "./motion-primitives";
import { useContent, useLang, useLocalHref } from "./i18n";
import LangSwitch from "./LangSwitch";
import ThemeToggle from "./ThemeToggle";
import AvailabilityBadge from "./AvailabilityBadge";

export default function Nav({ path }: { path: PathKey }) {
  const { navByPath, crossover, site, ui } = useContent();
  const rtl = useLang() === "ar";
  const href = useLocalHref();
  const nav = navByPath[path];
  const other = crossover[path];
  const offscreen = rtl ? "-100%" : "100%";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-edge bg-surface/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label={ui.nav.main}
        className="mx-auto flex h-[var(--nav-height)] max-w-content items-center justify-between px-5 sm:px-8"
      >
        <Link
          href={href("/")}
          aria-label={ui.nav.backToStart}
          className="font-display text-lg font-semibold tracking-tight text-ink transition-colors hover:text-accent"
        >
          {site.logo}
        </Link>
        <AvailabilityBadge path={path} className="ms-4 me-auto hidden lg:inline-flex" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="ms-2">
            <Link
              href={href(other.href)}
              className="group inline-flex items-center gap-2 rounded-full border border-edge-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/60 hover:text-accent"
            >
              <ArrowLeftRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180"
              />
              {ui.nav.switchTo[path]}
            </Link>
          </li>
          <li className="ms-1">
            <LangSwitch compact />
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile: language + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
        <LangSwitch compact />
        <ThemeToggle className="ms-1" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={ui.nav.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-raised md:hidden"
        >
          <Menu aria-hidden className="h-6 w-6" />
        </button>
        </div>
      </nav>
    </header>

    {/* Mobile drawer — rendered outside the header: its backdrop-blur would
        otherwise become the containing block for these fixed elements. */}
    <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-surface/70 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="drawer"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={ui.nav.mobileMenu}
              className="fixed inset-y-0 end-0 z-[70] flex w-72 max-w-[85vw] flex-col border-s border-edge bg-surface-raised p-6 md:hidden"
              initial={{ x: reduce ? 0 : offscreen, opacity: reduce ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: reduce ? 0 : offscreen, opacity: reduce ? 0 : 1 }}
              transition={
                reduce
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 320, damping: 32 }
              }
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-ink">
                  {site.logo}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={ui.nav.closeMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-overlay"
                >
                  <X aria-hidden className="h-6 w-6" />
                </button>
              </div>
              <motion.ul
                className="flex flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                }}
              >
                {nav.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: reduce ? 0 : rtl ? -16 : 16 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.25, ease: EASE },
                      },
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-auto flex flex-col gap-2 border-t border-edge pt-5">
                <Link
                  href={href(other.href)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-edge-strong px-4 py-3 text-sm font-medium text-ink"
                >
                  <ArrowLeftRight aria-hidden className="h-4 w-4 text-accent" />
                  {ui.nav.switchPrefix} {ui.nav.switchTo[path]}
                </Link>
                <Link
                  href={href("/")}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-ink-faint transition-colors hover:text-ink"
                >
                  <span aria-hidden className="inline-block rtl:-scale-x-100">←</span> {ui.nav.backToStartText}
                </Link>
              </div>
            </motion.div>
          </>
        )}
    </AnimatePresence>
    </>
  );
}
