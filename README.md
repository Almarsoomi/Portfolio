# Ahmed — Portfolio

Personal portfolio for Ahmed, a Dubai-based builder of practical business tools: web apps, financial automation, and accounting systems for UAE businesses — plus professional Zoho Books bookkeeping services.

A Next.js site built around a **two-path entrance**: the homepage asks visitors why they came, and sends them down one of two themed paths — **Websites & Tools** (`/build`) or **Accounting & Bookkeeping** (`/books`). Every effect is data-driven where possible and degrades gracefully under `prefers-reduced-motion`.

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

### The fork (homepage)
- **"What brings you here?"** — a full-screen choice between two animated doors. Desktop: side by side; hovering a door grows it and dims the other. Phones: stacked, with both choices on one screen.
- **Live door visuals** — the Build door shows a website assembling itself and taking a booking; the Books door shows a ledger posting, reconciling and getting stamped. Both loop and are drawn on a fixed canvas scaled to fit (`FitStage`).
- **Colour-burst transition** — choosing a door floods the screen from the click point in the destination's colour, then the destination page lifts a matching curtain (`.path-curtain`).
- **Remembers the last path** (a "Last visited" tag, via `localStorage`) and redirects old single-page links like `/#services` to the right path.

### Two themed paths
- **`/build`** — cool slate + cyan. Hero, pinned projects, what I do, skills, about, contact.
- **`/books`** — warm stone + gold → emerald. Hero, services & industries, a 4-step process with a scroll-filling rail, about, contact.
- The theme is a single `data-path` attribute that swaps the CSS tokens, so every shared component re-colours itself.
- Each path talks only about its own field — no bookkeeping on `/build`, no development on `/books` (each has its own hero, about text and footer line).
- The nav on each path has a **switch** pill to jump to the other path; the logo returns to the fork.

### Arabic / English
- Every page exists in both languages: `/`, `/build`, `/books` and `/ar`, `/ar/build`, `/ar/books`. Arabic pages are served with `lang="ar" dir="rtl"` from their own root layout, so they load already right-to-left (no flash) and can be indexed.
- The **language button** (nav and homepage header) wipes across in the new reading direction and opens the same page and section in the other language. The choice is remembered: a returning Arabic visitor landing on `/` is taken to `/ar`.
- Layout uses logical properties (`start`/`end`, `ps`/`pe`, `text-start`) and `rtl:` variants; arrows mirror, the project connector and drawers flip sides. Product mock-ups (door visuals, project demos) stay LTR on purpose.
- Arabic text uses IBM Plex Sans Arabic; letter-spacing is disabled on Arabic pages because it breaks the joins between letters.

### Clients & testimonials
- Each path shows a moving strip of client names (pauses on hover).
- A swipeable quote carousel appears automatically once real testimonials are added to `data/testimonials.ts`. Only add quotes clients have agreed to share.

### Light / dark theme
- A sun/moon button in the nav and on the homepage switches the theme. The new theme grows as a circle out of the button (View Transitions API; other browsers and reduced-motion visitors get an instant swap).
- Dark is the default. The choice is remembered (`localStorage`) and applied by a tiny inline script before first paint, so there is no flash.
- The light palette is the `[data-theme="light"]` blocks in `app/globals.css`. Use the `light:` Tailwind variant for one-off overrides. The homepage doors and their mock-ups stay dark on purpose.

### Availability badge
- A pill with a pulsing green dot ("Available for new projects" / "Taking on new clients") sits beside the logo on desktop and in the hero on smaller screens; it links to the contact section.
- Set `AVAILABLE` to `false` in `data/availability.ts` when fully booked — the badge turns amber. The wording is in `ui.availability` in each language file.

### Speed badge
- On the path pages, a small badge shows how long the page actually took to load on the visitor's device (browser navigation timing) and how many KB were transferred. It counts up, tucks away after a few seconds, and expands on hover or tap.

### Layout & content
- **Hero** — two-column layout: typewriter headline + CTAs on the left, framed portrait on the right, surrounded by small floating pieces of the work (`HeroProps`): on Build a page assembling itself, a "Site live" chip, a booking arriving and a phone layout; on Books a ledger being ticked off, VAT, a "Reconciled" stamp and a monthly chart.
- **Projects** — a *pinned scrollytelling* layout: a scrolling list of projects on the left activates items as they cross the viewport, while a sticky panel on the right updates to the active project.
- **Skills** — one compact, self-playing card: a spotlight moves through the skill groups, the active tab opens and fills a progress line while its skills pop in. Tapping a tab stops the autoplay.
- **Work categories, Accounting/Bookkeeping, About, Footer** — standard content sections driven from `data/portfolio.ts`.

### Contact form (tap-through, EmailJS)
- Each path ends with a short step-by-step form instead of a mailto link: **Build** asks project type → starting point & must-haves → budget & timeline; **Books** asks services → industry & volume → current setup & start date. The last step is name, company, email and/or WhatsApp, and how they'd like to be contacted.
- Visitors tap cards and chips instead of typing. Single-choice steps move on by themselves, the selection highlight glides between cards, a live "Your brief" panel fills in beside the form (edit any line), and sending ends in a drawn checkmark with a burst of particles and a reference number.
- Sent with **EmailJS** straight from the browser to your inbox (no server or database), with an optional auto-reply to the customer. UAE WhatsApp numbers are turned into a `wa.me` link in the email. Spam protection: honeypot, rate limit, headless-browser block.
- Until the EmailJS IDs are set in `data/emailjs.ts`, the form opens the visitor's email app with the request already written. **Setup guide: [`docs/emailjs-setup.md`](docs/emailjs-setup.md).**
- Questions and options live in `contactForm` in `data/portfolio.ts` / `data/portfolio.ar.ts`.

### Motion & interaction
- **Typewriter headline** — cycles through data-driven phrases with a blinking caret (`Typewriter`).
- **Custom cursor** — a dot that tracks the pointer plus a spring-lagged ring that enlarges over interactive elements (`CustomCursor`). Fine-pointer devices only; native cursor stays on touch.
- **Lenis smooth scrolling** — smooths the real scroll position (so `position: sticky` and scroll measurement keep working), with touch smoothing for mobile (`SmoothScroll`).
- **ScrollTo** — a shared helper (`lenis-store`) to smooth-scroll to any element, selector, or pixel with configurable duration/easing/offset; hash-links route through it, and a floating **back-to-top** button demos it (`ScrollToTop`).
- **Scroll parallax** — hero background, text, and portrait move at different rates as the hero scrolls away.
- **Cursor-move parallax + tilt** — the hero portrait leans toward the pointer while the floating cards drift further, for layered depth.
- **Heading lag** — section headings gently trail the scroll via a spring.
- **MotionPath effects:**
  - a self-drawing gradient underline flourish under every section heading;
  - a pulse travels along a measured connector from the active project row into the pinned panel;

All of the above are disabled or simplified when the visitor has `prefers-reduced-motion: reduce` set.

---

## Editing content

All copy — the fork's doors, both heroes, projects, services, process steps, skills, links — lives in one file:

```
data/portfolio.ts
```

Edit that file to add projects, change text, or update contact details. The Arabic text lives in `data/portfolio.ar.ts` with exactly the same shape (TypeScript flags any field you forget), and interface labels are in the `ui` object of each file. Testimonials and the client strip are in `data/testimonials.ts`. No component changes needed. Notable fields:

- `hero.greeting`, `hero.lead`, `hero.typewriter[]` — control the hero headline and the words the typewriter cycles through.
- `gateway` — the homepage question and the two doors (title, description, chips, button text).
- `booksHero`, `booksAbout`, `process`, `booksContact`, `navByPath` — bookkeeping-path copy and per-path navigation.
- `projects[]` — each project has `category`, `title`, `description`, optional `impact`, `tech[]`, `status`, and optional `link`.

Replace the portrait by swapping `app/Ahmed.png` (keep the filename, or update the import in `components/Hero.tsx`).

---

## Theming

Colors, spacing, and layout tokens are CSS variables in `app/globals.css` (`:root` block), consumed by `tailwind.config.ts`. Change the variables to retheme the whole site — the accent (cyan → blue) drives every highlight, glow, cursor, and motion-path color. The bookkeeping path overrides the same tokens under `[data-path="books"]` (gold → emerald on warm stone).

---

## Project structure

```
app/
  globals.css        Theme tokens (+ books theme), textures, fork + curtain, Arabic rules, cursor + Lenis CSS
  fonts.ts           Latin + Arabic fonts
  (en)/              English root layout (lang="en") + /, /build, /books
  (ar)/ar/           Arabic root layout (lang="ar" dir="rtl") + /ar, /ar/build, /ar/books
  Ahmed.png          Hero portrait
components/
  RootDocument.tsx   <html> shell shared by both languages
  i18n.tsx           LangProvider, useContent(), useLocalHref()
  LangSwitch.tsx     Language button + direction-aware wipe
  Testimonials.tsx / SpeedBadge.tsx
  pages/             Build and Books page bodies, shared by both languages
  fork/              Gateway (the homepage choice), BuildVisual, BooksVisual, FitStage, useLoop
  PathShell.tsx      Per-path wrapper: theme, entry curtain, nav, footer
  Process.tsx        Bookkeeping-path process steps
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
  portfolio.ts       All English content (+ `ui` labels)
  portfolio.ar.ts    Arabic content, same shape
  content.ts         Language map + path helpers
  meta.ts            Page titles/descriptions per language
  testimonials.ts    Client quotes + client strip
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
