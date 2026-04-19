# Anatomy of a Character Call

A single-page Next.js 14 landing page that publishes the technical essay *Anatomy of a Character Call* — a layer-by-layer explainer of how Runway Characters generates conversational video avatars frame by frame over WebRTC on GWM-1. The page includes five hand-rolled SVG visuals (latency waterfall, pipeline comparison, context cone, call timeline, shareable field-guide card), an accessible Radix-based FAQ accordion, and FAQPage JSON-LD in `<head>` for rich-result eligibility.

**Live:** https://claudecodelandingpage.vercel.app

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Radix UI Accordion · Framer Motion · next/font (Source Serif 4, Inter, JetBrains Mono).

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve production build
```

The article copy, design system, and brief that produced this build are preserved at `content.md`, `design-spec.md`, and `BRIEF.md`.
