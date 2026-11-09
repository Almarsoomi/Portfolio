"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Github, Mail } from "lucide-react";
import { gateway, site, type PathKey } from "@/data/portfolio";
import { useMediaQuery } from "../use-media-query";
import FitStage from "./FitStage";
import BuildVisual from "./BuildVisual";
import BooksVisual from "./BooksVisual";

const ORDER: PathKey[] = ["build", "books"];
const LAST_PATH_KEY = "fork:last-path";
/** Solid surface colour of each destination page — the wipe lands on it. */
const DEST_SURFACE: Record<PathKey, string> = { build: "rgb(2 6 23)", books: "rgb(12 10 9)" };
const DEST_GRADIENT: Record<PathKey, string> = {
  build: "linear-gradient(90deg, rgb(103 232 249), rgb(59 130 246))",
  books: "linear-gradient(90deg, rgb(253 224 71), rgb(16 185 129))",
};

/** Old single-page anchors → the path that now owns them. */
const LEGACY_HASHES: Record<string, PathKey> = {
  projects: "build",
  skills: "build",
  services: "books",
};

const EASE = [0.25, 0.4, 0.25, 1] as const;

type Choice = { path: PathKey; x: number; y: number };

export default function Gateway() {
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const isRow = useMediaQuery("(min-width: 768px)");
  const [hovered, setHovered] = useState<PathKey | null>(null);
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [lastPath, setLastPath] = useState<PathKey | null>(null);

  useEffect(() => {
    // Old shared links like /#projects keep working.
    const hash = window.location.hash.slice(1);
    const legacy = LEGACY_HASHES[hash];
    if (legacy) {
      router.replace(`${gateway.paths[legacy].href}#${hash}`);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LAST_PATH_KEY);
      if (saved === "build" || saved === "books") setLastPath(saved);
    } catch {
      /* storage unavailable — no "last visited" hint */
    }
    ORDER.forEach((p) => router.prefetch(gateway.paths[p].href));
  }, [router]);

  const choose = (path: PathKey, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let new-tab / modified clicks behave like normal links.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (chosen) return;
    try {
      window.localStorage.setItem(LAST_PATH_KEY, path);
    } catch {
      /* ignore */
    }
    const href = gateway.paths[path].href;
    if (reduce) {
      router.push(href);
      return;
    }
    // Keyboard activation has no pointer position — burst from the door centre.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    setChosen({ path, x, y });
    window.setTimeout(() => router.push(href), 720);
  };

  const growFor = (p: PathKey) => {
    if (chosen) return chosen.path === p ? 1.6 : 0.7;
    if (!canHover || !hovered) return 1;
    return hovered === p ? 1.5 : 0.72;
  };

  const words = gateway.question.split(" ");

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#020617] text-slate-100">
      {/* Ambient glows: cool on the build side, warm on the books side */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-3 sm:px-8 sm:pt-6">
        <span className="font-display text-lg font-semibold tracking-tight">{site.logo}</span>
        <div className="flex items-center gap-1">
          <a
            href={`mailto:${site.email}`}
            aria-label="Email Ahmed"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Mail aria-hidden className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Github aria-hidden className="h-[18px] w-[18px]" />
          </a>
        </div>
      </header>

      {/* The question */}
      <div className="relative z-10 px-5 pb-4 pt-1 text-center sm:px-8 md:pb-8 md:pt-6">
        <motion.p
          className="font-display text-sm font-medium text-slate-400 sm:text-base"
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span aria-hidden className="mr-1.5 inline-block origin-[70%_70%] animate-[wave_2.2s_ease-in-out_0.6s_2]">
            👋
          </span>
          {gateway.greeting}
        </motion.p>
        <h1
          className="mt-2 font-display font-semibold tracking-tight"
          style={{ fontSize: "clamp(1.6rem, 5.2vw, 3.6rem)", lineHeight: 1.08 }}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {gateway.hint}
        </motion.p>
      </div>

      {/* The two doors */}
      <div
        className="relative z-10 flex flex-1 flex-col gap-3 px-3 pb-3 sm:px-5 sm:pb-5 md:flex-row md:gap-4 md:px-6 md:pb-6"
        onMouseLeave={() => setHovered(null)}
      >
        {ORDER.map((p, i) => {
          const d = gateway.paths[p];
          const Visual = p === "build" ? BuildVisual : BooksVisual;
          const fromX = isRow ? (i === 0 ? -60 : 60) : 0;
          const fromY = isRow ? 30 : 40;
          return (
            <FragmentWithSeam key={p} showSeam={i === 1} reduce={reduce} dimmed={!!chosen}>
              <motion.div
                className="flex min-w-0 md:min-h-0 md:basis-0"
                initial={{ opacity: 0, x: reduce ? 0 : fromX, y: reduce ? 0 : fromY }}
                animate={{ opacity: 1, x: 0, y: 0, flexGrow: growFor(p) }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.35 + i * 0.12 },
                  x: { type: "spring", stiffness: 120, damping: 20, delay: 0.35 + i * 0.12 },
                  y: { type: "spring", stiffness: 120, damping: 20, delay: 0.35 + i * 0.12 },
                  flexGrow: { type: "spring", stiffness: 170, damping: 26 },
                }}
              >
                <Link
                  href={d.href}
                  onClick={(e) => choose(p, e)}
                  onMouseEnter={() => canHover && setHovered(p)}
                  onFocus={() => canHover && setHovered(p)}
                  onPointerMove={(e) => {
                    if (!canHover) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                  data-cursor="hover"
                  className={`fork-door door-${p} group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] p-4 outline-none transition-[border-color,filter] duration-500 focus-visible:ring-2 focus-visible:ring-[rgb(var(--door-accent))] sm:p-7 lg:p-9 ${
                    hovered && hovered !== p ? "md:brightness-[0.7] md:saturate-50" : ""
                  } hover:border-[rgb(var(--door-accent)/0.45)]`}
                >
                  <span aria-hidden className="door-texture pointer-events-none absolute inset-0 opacity-80" />

                  {/* Top row */}
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-slate-500">{d.index}</span>
                      <span className="rounded-full border border-[rgb(var(--door-accent)/0.35)] bg-[rgb(var(--door-accent)/0.08)] px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--door-accent))]">
                        {d.eyebrow}
                      </span>
                    </span>
                    {lastPath === p ? (
                      <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                        Last visited
                      </span>
                    ) : null}
                  </div>

                  {/* Live visual */}
                  <FitStage
                    width={340}
                    height={240}
                    max={1.5}
                    className="relative my-2 h-[clamp(64px,10svh,180px)] max-md:[@media(max-height:720px)]:hidden transition-transform duration-700 ease-out group-hover:scale-[1.03] md:my-6 md:h-auto md:min-h-[96px] md:flex-1"
                  >
                    <div className="p-[10px]">
                      <Visual />
                    </div>
                  </FitStage>

                  {/* Copy */}
                  <div className="relative mt-auto">
                    <h2
                      className="font-display font-semibold tracking-tight text-white"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", lineHeight: 1.05 }}
                    >
                      <span className="door-text-gradient">{d.title}</span>
                    </h2>
                    <p className="mt-1.5 line-clamp-2 max-w-md text-sm leading-relaxed text-slate-400 sm:line-clamp-none sm:text-[15px]">
                      {d.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 sm:mt-4">
                      <ul className="hidden flex-wrap gap-1.5 sm:flex">
                        {d.chips.map((c) => (
                          <li
                            key={c}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-white">
                        {d.cta}
                        <span className="flex h-8 w-8 items-center sm:h-9 sm:w-9 justify-center rounded-full bg-[rgb(var(--door-accent))] text-slate-950 transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight aria-hidden className="h-4 w-4" />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </FragmentWithSeam>
          );
        })}
      </div>

      {/* Chosen → colour burst from the click point, then navigate */}
      <AnimatePresence>
        {chosen ? (
          <motion.div
            key="burst"
            aria-hidden
            className="fixed inset-0 z-[90] flex items-center justify-center"
            style={{ background: DEST_SURFACE[chosen.path] }}
            initial={{ clipPath: `circle(0px at ${chosen.x}px ${chosen.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${chosen.x}px ${chosen.y}px)` }}
            transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {gateway.paths[chosen.path].eyebrow}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {gateway.paths[chosen.path].title}
              </p>
              <motion.div
                className="mx-auto mt-4 h-[3px] w-40 origin-left rounded-full"
                style={{ background: DEST_GRADIENT[chosen.path] }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

/** Renders the glowing "or" seam before the second door. */
function FragmentWithSeam({
  children,
  showSeam,
  reduce,
  dimmed,
}: {
  children: React.ReactNode;
  showSeam: boolean;
  reduce: boolean;
  dimmed: boolean;
}) {
  return (
    <>
      {showSeam ? (
        <div aria-hidden className="relative z-20 h-0 w-full flex-none md:h-auto md:w-0">
          <motion.div
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 md:h-14 md:w-14"
            initial={{ scale: reduce ? 1 : 0, rotate: reduce ? 0 : -90 }}
            animate={{ scale: dimmed ? 0 : 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: dimmed ? 0 : 0.75 }}
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgb(34 211 238), rgb(59 130 246), rgb(16 185 129), rgb(251 191 36), rgb(34 211 238))",
              }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-[2px] flex items-center justify-center rounded-full bg-[#020617] font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              or
            </span>
          </motion.div>
        </div>
      ) : null}
      {children}
    </>
  );
}
