import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All theme colors resolve to CSS variables (defined in globals.css)
        // so the whole site can be rethemed from one place.
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
          overlay: "rgb(var(--color-surface-overlay) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--color-ink-faint) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          bright: "rgb(var(--color-accent-bright) / <alpha-value>)",
          deep: "rgb(var(--color-accent-deep) / <alpha-value>)",
        },
        edge: {
          DEFAULT: "rgb(var(--color-edge) / <alpha-value>)",
          strong: "rgb(var(--color-edge-strong) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "var(--space-section)",
        "section-sm": "var(--space-section-sm)",
      },
      maxWidth: {
        content: "var(--width-content)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgb(var(--color-accent) / 0.35)",
        card: "0 1px 0 0 rgb(var(--color-edge) / 0.6) inset",
      },
      animation: {
        "glow-drift": "glow-drift 14s ease-in-out infinite alternate",
      },
      keyframes: {
        "glow-drift": {
          "0%": { transform: "translate3d(-6%, -4%, 0) scale(1)", opacity: "0.7" },
          "50%": { transform: "translate3d(4%, 3%, 0) scale(1.08)", opacity: "1" },
          "100%": { transform: "translate3d(-2%, 5%, 0) scale(0.96)", opacity: "0.75" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
