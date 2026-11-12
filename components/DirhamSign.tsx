/**
 * The UAE dirham sign (introduced 2025): a "D" crossed by two horizontal bars.
 * Drawn as SVG because font support for the new Unicode character (U+20C3)
 * is still patchy. Inherits colour from `currentColor`.
 */
export default function DirhamSign({ className, title = "AED" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" role="img" aria-label={title} className={className}>
      <path
        d="M7 4h4.5a8 8 0 0 1 0 16H7z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M3 10h18.5M3 14h18.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
