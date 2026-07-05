# Ahmed — Portfolio

Personal portfolio for Ahmed, a Dubai-based builder of practical business tools: web apps, financial automation, and accounting systems for UAE businesses — plus professional Zoho Books bookkeeping services.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All content — projects, services, skills, copy, links — lives in a single file:

```
data/portfolio.ts
```

Edit that file to add projects, change text, or update contact details. No component changes needed.

## Theming

Colors, spacing, and layout tokens are CSS variables in `app/globals.css` (`:root` block), consumed by `tailwind.config.ts`. Change the variables to retheme the whole site.

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

Or with the CLI:

```bash
npm i -g vercel
vercel --prod
```

After deploying, update `site.url` in `data/portfolio.ts` with your production URL so Open Graph metadata resolves correctly.
