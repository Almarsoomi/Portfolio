"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, Music2, Pause, Play, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoShell, ease, useDemoTimeline } from "./shared";
import { RECORDS, RecordCover, type RecordInfo } from "./RecordCovers";
import { TRACKS, VinylPlayer } from "./vinylSynth";

/**
 * Metal East Records virtual shop demo.
 * Auto-plays: flip the crate → pull a record → it lands on the turntable → plays.
 * Visitors can tap any record (or ▶ Listen) to actually hear an original groove.
 */

const ORANGE = "#e08a2c";
const AUTO_PICK = 0; // "Midnight Groove"

/**
 * Timeline. Phase:
 *  0,1,2 → flipping through sleeves 3,2,1   3 → chosen record pulled out
 *  4     → vinyl lands on the platter        5 → hold: arm down, spinning
 */
const DURATIONS = [420, 420, 420, 480, 480, 2800];
const ARM_DELAY = 0.95; // seconds from pick until the needle drops (phases 3 + 4)

type Toast = { key: string; icon: LucideIcon; text: string; glow?: boolean };

/** Platter + record with real spin-up / spin-down instead of an instant CSS spin. */
function Turntable({
  record,
  onPlatter,
  spinning,
  reduce,
}: {
  record: RecordInfo;
  onPlatter: boolean;
  spinning: boolean;
  reduce: boolean;
}) {
  const disc = useRef<HTMLDivElement>(null);
  const state = useRef({ angle: 0, speed: 0 });

  useEffect(() => {
    if (reduce) return;
    const TARGET = 200; // deg/s ≈ 33⅓ rpm feel
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const s = state.current;
      const goal = spinning ? TARGET : 0;
      // Motor spins up in ~0.6s, coasts down slower like a real deck.
      const rate = spinning ? 340 : 160;
      s.speed += Math.sign(goal - s.speed) * Math.min(Math.abs(goal - s.speed), rate * dt);
      s.angle = (s.angle + s.speed * dt) % 360;
      if (disc.current) disc.current.style.transform = `rotate(${s.angle}deg)`;
      if (spinning || s.speed > 0.5) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spinning, reduce]);

  return (
    <div className="absolute left-2 top-1/2 h-[6.6rem] w-[6.6rem] -translate-y-1/2">
      {/* Rotating group: rim with strobe dots + the record */}
      <div ref={disc} className="absolute inset-0 rounded-full">
        <div
          className="absolute inset-0 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.6)]"
          style={{ background: "repeating-conic-gradient(#8a7d6d 0deg 3deg, #2a2420 3deg 9deg)" }}
        />
        <div className="absolute inset-[3px] rounded-full bg-[#111]" />
        <AnimatePresence>
          {onPlatter ? (
            <motion.div
              key={record.id}
              initial={reduce ? false : { opacity: 0, x: -70, y: -24, scale: 0.75, rotate: -40 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -40, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ duration: 0.42, ease }}
              className="absolute inset-[5px] rounded-full"
              style={{
                background:
                  "repeating-radial-gradient(circle at center, #0c0c0c 0 1.2px, #1d1d1d 1.2px 2.1px)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Centre label — off-centre text makes the rotation visible */}
              <div
                className="absolute left-1/2 top-1/2 flex h-[2.1rem] w-[2.1rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full"
                style={{ background: record.label }}
              >
                <span className="font-serif text-[0.42rem] font-bold leading-none text-black/75">MER</span>
                <span className="mt-[1px] max-w-[1.8rem] truncate text-[0.3rem] font-semibold leading-none text-black/60">
                  {record.title}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {/* Static light reflection — stays still while the grooves turn under it */}
      <div
        className="pointer-events-none absolute inset-[5px] rounded-full transition-opacity duration-300"
        style={{
          background:
            "conic-gradient(from 20deg, transparent 0deg, rgba(255,255,255,0.10) 25deg, transparent 55deg, transparent 180deg, rgba(255,255,255,0.07) 205deg, transparent 235deg)",
          opacity: onPlatter ? 1 : 0.4,
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfc3b3]" />
    </div>
  );
}

export default function MetalEastDemo() {
  const [user, setUser] = useState(false); // visitor took control
  const [pick, setPick] = useState(AUTO_PICK);
  const [audioOn, setAudioOn] = useState(false);
  const { root, phase, setPhase, last, reduce, inView } = useDemoTimeline(DURATIONS, { hold: user });

  const player = useRef<VinylPlayer | null>(null);
  const getPlayer = () => (player.current ??= new VinylPlayer());

  // Stop the music when the demo scrolls away or unmounts (e.g. another project is hovered).
  useEffect(() => {
    if (!inView && audioOn) {
      player.current?.stop();
      setAudioOn(false);
    }
  }, [inView, audioOn]);
  useEffect(() => () => player.current?.dispose(), []);

  const record = RECORDS[pick];
  const flipping = !user && phase <= 2 ? 3 - phase : null;
  const pulled = phase >= 3;
  const onPlatter = phase >= 4;
  const spinning = phase >= 5 && (!user || audioOn);

  /** Visitor tapped a sleeve: pull it, drop it on the deck and play it. */
  const playRecord = useCallback(
    (i: number) => {
      const p = (player.current ??= new VinylPlayer());
      p.unlock(); // must happen inside the click
      setUser(true);
      setPick(i);
      setPhase(3);
      p.play(TRACKS[RECORDS[i].id], ARM_DELAY);
      setAudioOn(true);
    },
    [setPhase],
  );

  const toggleListen = () => {
    const p = getPlayer();
    if (audioOn) {
      p.stop();
      setAudioOn(false);
      return;
    }
    p.unlock();
    setUser(true);
    if (phase >= 4) {
      // Record already on the deck — just drop the needle.
      setPhase(last);
      p.play(TRACKS[record.id], 0.35);
      setAudioOn(true);
    } else {
      playRecord(pick);
    }
  };

  const toast: Toast =
    phase >= 5
      ? user && !audioOn
        ? { key: "paused", icon: Pause, text: `Paused · ${record.artist} — ${record.title}` }
        : { key: `play-${record.id}`, icon: Music2, text: `Now playing · ${record.artist} — ${record.title}`, glow: true }
      : pulled
        ? { key: `pull-${record.id}`, icon: Disc3, text: `Pulled out · ${record.title} (${record.genre})` }
        : { key: "crate", icon: Store, text: "Walked into the shop · flipping the crates" };
  const ToastIcon = toast.icon;

  return (
    <DemoShell
      rootRef={root}
      interactive
      label="Interactive demo of the Metal East Records virtual shop: flip through a crate, pull out a record, and play it on the shop turntable."
      status={
        user
          ? audioOn
            ? "Playing ♪"
            : "Paused"
          : phase === last
            ? "Now playing ♪"
            : pulled
              ? "Pulling a record…"
              : "Flipping crates…"
      }
      progress={(phase + 1) / DURATIONS.length}
      reduce={reduce}
    >
      {/* Notification */}
      <div className="relative h-[2.4rem]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={toast.key}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92, filter: "blur(2px)" }}
            transition={{ duration: 0.25, ease }}
            className={`absolute inset-x-0 top-0 flex h-[2.4rem] items-center gap-2 rounded-xl border px-2.5 shadow-lg backdrop-blur ${
              toast.glow ? "" : "border-edge-strong bg-surface-overlay/90 text-ink-muted"
            }`}
            style={
              toast.glow
                ? { borderColor: "rgb(224 138 44 / 0.45)", background: "rgb(224 138 44 / 0.12)", color: "#f5c58a" }
                : undefined
            }
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgb(224 138 44 / 0.2)", color: ORANGE }}
            >
              <ToastIcon aria-hidden className="h-3 w-3" />
            </span>
            <p className="min-w-0 truncate text-[0.72rem] font-medium">{toast.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shop card */}
      <div className="overflow-hidden rounded-2xl border border-edge bg-[#120d09]/90 p-3 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="font-serif text-[0.72rem] font-semibold tracking-[0.12em] text-[#f1e6d6]">
            METAL EAST RECORDS
          </span>
          <span className="text-[0.58rem] uppercase tracking-wider text-[#a08a70]">Dubai · virtual shop</span>
        </div>

        <div className="mt-2.5 grid h-[7.6rem] grid-cols-[1fr_1.1fr] gap-2.5">
          {/* Crate — every sleeve is tappable */}
          <div className="relative rounded-lg border border-[#5a3a1e]/60 bg-gradient-to-b from-[#2a1a0e] to-[#1a1009]">
            {/* crate front panel */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-5 rounded-b-lg border-t border-[#7a5230]/70 bg-gradient-to-b from-[#5a3a1e] to-[#3a2412]">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[0.5rem] font-semibold uppercase tracking-wider text-[#e8d5b8]/80">
                Tap a record ♪
              </span>
            </div>
            {RECORDS.map((r, i) => {
              const raised = flipping === i;
              const gone = pulled && i === pick;
              return (
                <motion.button
                  key={r.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playRecord(i);
                  }}
                  aria-label={`Play ${r.title} by ${r.artist} (${r.genre})`}
                  className="absolute top-2 h-[4.4rem] w-[4.4rem] overflow-hidden rounded-[3px] shadow-[2px_3px_8px_rgba(0,0,0,0.6)] ring-1 ring-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e08a2c]"
                  style={{ left: `${0.35 + i * 1.3}rem`, zIndex: raised ? 15 : RECORDS.length - i }}
                  animate={{
                    y: gone ? -60 : raised ? -12 : 0,
                    rotate: raised || gone ? 0 : -4 + i * 3,
                    opacity: gone ? 0 : 1,
                  }}
                  whileHover={reduce ? undefined : { y: -12, rotate: 0, zIndex: 16 }}
                  transition={{ duration: reduce ? 0 : 0.28, ease }}
                >
                  <RecordCover id={r.id} className="h-full w-full" />
                </motion.button>
              );
            })}
          </div>

          {/* Turntable */}
          <div className="relative rounded-lg border border-[#5a3a1e]/60 bg-gradient-to-br from-[#4a3020] via-[#2a1b10] to-[#160e08] shadow-inner">
            <Turntable record={record} onPlatter={onPlatter} spinning={spinning} reduce={reduce} />

            {/* Tonearm */}
            <div className="absolute right-2.5 top-2.5 h-4 w-4 rounded-full bg-gradient-to-br from-[#d9cdbd] to-[#6d6255] ring-2 ring-black/40" />
            <motion.div
              className="absolute right-[1.05rem] top-[1.15rem] h-[5rem] w-[3px] origin-top rounded-full bg-gradient-to-b from-[#e6dccd] to-[#8a7d6d] shadow-[1px_2px_3px_rgba(0,0,0,0.6)]"
              animate={{ rotate: spinning ? 27 : 3 }}
              transition={{ type: "spring", stiffness: reduce ? 1000 : 90, damping: 14 }}
            >
              <span className="absolute -bottom-1.5 -left-[4px] h-2.5 w-[11px] rounded-sm bg-[#d9cdbd] shadow" />
            </motion.div>

            {/* Power LED + speed button */}
            <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
              <span className="rounded-sm bg-black/40 px-1 text-[0.4rem] font-semibold text-[#e8d5b8]/80">33</span>
              <span
                className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  background: spinning ? "#ff3b30" : "#4a1a14",
                  boxShadow: spinning ? "0 0 6px #ff3b30" : "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Now playing bar */}
        <div className="mt-2 flex h-8 items-center gap-2">
          <div className="h-7 w-7 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/50">
            <RecordCover id={record.id} className="h-full w-full" />
          </div>
          <div className="flex h-4 items-end gap-[2px]">
            {[0, 1, 2, 3, 4].map((b) => (
              <motion.span
                key={b}
                className="w-[3px] rounded-sm"
                style={{ background: ORANGE }}
                animate={
                  spinning && !reduce
                    ? { height: ["30%", "100%", "45%", "80%", "30%"] }
                    : { height: spinning ? "60%" : "20%" }
                }
                transition={
                  spinning && !reduce
                    ? { duration: 0.8, repeat: Infinity, delay: b * 0.11, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              />
            ))}
          </div>
          <p className="min-w-0 flex-1 truncate text-[0.66rem] text-[#a08a70]">
            <span className="font-semibold text-[#f1e6d6]">{record.title}</span> · {record.artist}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleListen();
            }}
            className="relative isolate flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold text-black transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            style={{ background: ORANGE }}
            aria-label={audioOn ? "Pause music" : `Listen to ${record.title}`}
          >
            {!user && !reduce ? (
              <span
                className="absolute inset-0 -z-10 animate-ping rounded-full"
                style={{ background: ORANGE, opacity: 0.35 }}
              />
            ) : null}
            {audioOn ? (
              <>
                <Pause aria-hidden className="h-3 w-3 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play aria-hidden className="h-3 w-3 fill-current" /> Listen
              </>
            )}
          </button>
        </div>
      </div>
    </DemoShell>
  );
}
