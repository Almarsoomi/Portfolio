"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children on a fixed-size design canvas and scales it to fit the
 * available box — so the door visuals look identical on a phone and a 4K
 * monitor, without per-breakpoint tuning.
 */
export default function FitStage({
  width,
  height,
  max = 1.6,
  children,
  className,
}: {
  width: number;
  height: number;
  max?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      setScale(Math.max(0, Math.min(w / width, h / height, max)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, max]);

  return (
    <div ref={ref} aria-hidden className={`relative flex items-center justify-center ${className ?? ""}`}>
      <div
        style={{
          width,
          height,
          flex: "none",
          transform: `scale(${scale})`,
          opacity: scale ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
