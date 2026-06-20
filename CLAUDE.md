# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Goal

Personal portfolio website for Mark Lowel Montealto, a full-stack developer. The site is built for SEO — it must rank well when potential clients or employers search for terms like "full stack developer". All pages must be server-side rendered so crawlers receive complete HTML. Avoid client-side-only rendering for any content that should be indexed.

## Commands

```bash
npm run dev      # Start dev server (Next.js Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (no separate test runner configured)
```

## Stack

- **Next.js 16.2.9** with App Router — read `node_modules/next/dist/docs/` before writing any Next.js-specific code; this version has breaking changes from earlier releases
- **React 19.2.4**
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in CSS, not `@tailwind base/components/utilities`; theme tokens go in `@theme inline {}` blocks
- **TypeScript** with strict mode; path alias `@/*` maps to the repo root

## Architecture

This is an App Router project. All routes live under `app/`. Key conventions:

- `app/layout.tsx` — root layout; sets fonts (Geist Sans/Mono via CSS variables), global metadata, and site-wide structured data (JSON-LD)
- `app/page.tsx` — homepage / hero section
- `app/globals.css` — global styles; Tailwind v4 entry point with CSS variable theming for light/dark mode

Components default to **React Server Components** unless the file begins with `"use client"`. Server Functions (formerly Server Actions) require `"use server"`. Prefer RSC for all portfolio content sections so they SSR by default.

ESLint is configured with `next/core-web-vitals` and `next/typescript` presets via `eslint.config.mjs` (flat config format).

## SEO Requirements

Every page must export a `generateMetadata` function (or static `metadata` object) with:
- Descriptive `title` and `description` targeting full-stack developer search terms
- `openGraph` and `twitter` card fields for social sharing
- Canonical URL via `alternates.canonical`

Use Next.js built-in `<Image>` for all images (automatic format optimization, `sizes`, `alt` required on every image). Use semantic HTML (`<main>`, `<section>`, `<article>`, `<h1>`–`<h3>`) throughout. Add `Person` + `WebSite` JSON-LD structured data in the root layout. Add a `public/sitemap.xml` and `public/robots.txt` before deploying.
