# Ahmed — Portfolio

Personal portfolio for Ahmed, a Dubai-based builder of practical business tools: web apps, financial automation, and accounting systems for UAE businesses — plus professional Zoho Books bookkeeping services.

A single-page Next.js site with a motion-rich, interactive front end. Every effect is data-driven where possible and degrades gracefully under `prefers-reduced-motion`.

**Live:** https://almarsoomi.github.io/Portfolio

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS (theme tokens via CSS variables) |
| Animation | Framer Motion |
| Smooth scroll | Lenis |
| Icons | Lucide React |
| Fonts | Space Grotesk (display) · Manrope (body) — via `next/font` |
| Hosting | GitHub Pages (static export) — also works on Vercel |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Before pushing:** run `npm run build` locally. The dev server does not run the strict production type-check that CI does, so a green dev server can still fail the build.

---

## Features

### Layout & content
- **Hero** — two-column layout: typewriter headline + CTAs on the left, framed portrait with floating SVG shapes on the right.
- **Projects** — a *pinned scrollytelling* layout: a scrolling list of projects on the left activates items as they cross the viewport, while a sticky panel on the right updates to the active project.
- **Work categories, Accounting/Bookkeeping, Skills, About, Contact, Footer** — standard content sections driven from `data/portfolio.ts`.

### Motion & interaction
- **Typewriter headline** — cycles through data-driven phrases with a blinking caret (`Typewriter`).
- **Custom cursor** — a dot that tracks the pointer plus a spring-lagged ring that enlarges over interactive elements (`CustomCursor`). Fine-pointer devices only; native cursor stays on touch.
- **Lenis smooth scrolling** — smooths the real scroll position (so `position: sticky` and scroll measurement keep working), with touch smoothing for mobile (`SmoothScroll`).
- **ScrollTo** — a shared helper (`lenis-store`) to smooth-scroll to any element, selector, or pixel with configurable duration/easing/offset; hash-links route through it, and a floating **back-to-top** button demos it (`ScrollToTop`).
- **Scroll parallax** — hero background, text, and portrait move at different rates as the hero scrolls away.
- **Cursor-move parallax + tilt** — the hero portrait leans toward the pointer while the shapes drift further, for layered depth.
- **Heading lag** — section headings gently trail the scroll via a spring.
- **MotionPath effects:**
  - a dot rides the hand-drawn arrow curve in the hero;
  - a self-drawing gradient underline flourish under every section heading;
  - a pulse travels along a measured connector from the active project row into the pinned panel;
  - a comet streaks into the Contact CTA on hover and lands with a ripple.

All of the above are disabled or simplified when the visitor has `prefers-reduced-motion: reduce` set.

---

## Editing content

All copy — projects, services, skills, links, hero text, typewriter phrases — lives in one file:

```
data/portfolio.ts
```

Edit that file to add projects, change text, or update contact details. No component changes needed. Notable fields:

- `hero.greeting`, `hero.lead`, `hero.typewriter[]` — control the hero headline and the words the typewriter cycles through.
- `projects[]` — each project has `category`, `title`, `description`, optional `impact`, `tech[]`, `status`, and optional `link`.

Replace the portrait by swapping `app/Ahmed.png` (keep the filename, or update the import in `components/Hero.tsx`).

---

## Theming

Colors, spacing, and layout tokens are CSS variables in `app/globals.css` (`:root` block), consumed by `tailwind.config.ts`. Change the variables to retheme the whole site — the accent (cyan → blue) drives every highlight, glow, cursor, and motion-path color.

---

## Project structure

```
app/
  globals.css        Theme tokens, background textures, cursor + Lenis CSS
  layout.tsx         Root layout; mounts SmoothScroll, CustomCursor, ScrollToTop
  page.tsx           Section composition
  Ahmed.png          Hero portrait
components/
  Hero.tsx           Two-column hero: typewriter, portrait, shapes, parallax, tilt
  Typewriter.tsx     Looping typewriter with reduced-motion fallback
  PinnedProjects.tsx Pinned scrollytelling projects + connector pulse
  StackedProjects.tsx  Alternate stacked-cards projects layout (unused)
  WorkCategories.tsx / Accounting.tsx / Skills.tsx / About.tsx / Contact.tsx / Footer.tsx / Nav.tsx
  CustomCursor.tsx   Dot + spring-lagged ring cursor
  SmoothScroll.tsx   Lenis setup, anchor routing, instance registration
  lenis-store.ts     Shared Lenis instance + smoothScrollTo() helper
  ScrollToTop.tsx    Floating back-to-top control
  motion-primitives.tsx  Reveal, StaggerGroup, SectionHeading, HeadingFlourish, lag
data/
  portfolio.ts       All site content
```

---

## Build

```bash
npm run build
```

Produces a static export in `out/` (configured via `output: "export"` in `next.config.mjs`).

---

## Deploy

### GitHub Pages (current)
Pushing to `main` triggers the GitHub Actions workflow, which runs `next build`, sets `basePath` to `/Portfolio`, and publishes the static export to the `gh-pages` branch. After deploying, keep `site.url` in `data/portfolio.ts` in sync with the production URL so Open Graph metadata resolves correctly.

### Vercel
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

Or with the CLI:

```bash
npm i -g vercel
vercel --prod
```

---

## Accessibility & performance notes

- Every animation respects `prefers-reduced-motion`.
- The custom cursor only activates on fine-pointer (mouse/trackpad) devices; text inputs keep their native caret.
- Pointer-driven effects update Framer motion values directly (no React re-renders) for smooth performance.
- Decorative SVG/motion layers are `aria-hidden` and `pointer-events-none`.
