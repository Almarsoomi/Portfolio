"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Types out each word, pauses, deletes it, and moves to the next — looping.
 * Falls back to the first word (static) when the user prefers reduced motion.
 */
export default function Typewriter({
  words,
  className,
  typeSpeed = 85,
  deleteSpeed = 40,
  pause = 1500,
}: {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce || words.length === 0) return;
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () =>
        setText((prev) =>
          deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1),
        ),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduce, typeSpeed, deleteSpeed, pause]);

  if (reduce) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      <span aria-hidden>{text}</span>
      <span className="typewriter-caret" aria-hidden>
        |
      </span>
      {/* Static, screen-reader-friendly summary of the cycling words. */}
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
