"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/** Elements that should trigger the "hover" (enlarged) cursor state. */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

/**
 * A dot that tracks the cursor exactly plus a spring-lagged ring that grows
 * over interactive elements. Only runs on fine-pointer devices and is fully
 * disabled under prefers-reduced-motion (native cursor stays).
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as Element | null;
      setHovering(Boolean(el?.closest?.(INTERACTIVE)));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Spring-lagged ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border border-accent"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: hovering ? 56 : 32,
            height: hovering ? 56 : 32,
            opacity: hovering ? 1 : 0.55,
            scale: pressed ? 0.82 : 1,
            backgroundColor: hovering
              ? "rgb(34 211 238 / 0.08)"
              : "rgb(34 211 238 / 0)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      </motion.div>

      {/* Exact-tracking dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full bg-accent"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: hovering ? 0 : 7,
            height: hovering ? 0 : 7,
            opacity: hovering ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        />
      </motion.div>
    </>
  );
}
