"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Framer honours the visitor's Reduce Motion setting site-wide. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
