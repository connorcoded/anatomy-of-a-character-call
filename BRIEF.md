# Claude Code brief — Anatomy of a Character Call landing page

You are building a single-page marketing landing page that renders a long-form article titled "Anatomy of a Character Call." The article is a writing sample for a content strategy role at Runway AI. The deliverable is a production URL on Vercel that I can share with Runway's recruiting team.

## The end state I want

1. A Next.js 14 landing page rendering the article from `content.md` styled per `design-spec.md`.
2. The code committed to a **new public GitHub repo** called `anatomy-of-a-character-call` on my connected GitHub account.
3. The site **deployed to Vercel** with a production URL.
4. A **shareable production URL** returned to me in chat that I can paste into an email to the Runway recruiting team.
5. A one-paragraph `README.md` at the repo root briefly explaining what the project is, with a live-preview link.

Don't stop short of the deploy. I want one prompt, one finished result.

## Inputs in this folder

- `content.md` — **source of truth for all article copy.** Includes kicker, title, subtitle, TL;DR, lede, blockquote, six H2 sections with italic eyebrows, comparison table, numbered list, FAQ, FAQ JSON-LD schema block, and five `[PLACEHOLDER — ...]` callouts that must render as visible amber-tinted blocks.
- `design-spec.md` — **design system and component specs.** Palette, typography, responsive breakpoints, component structure, animation notes. Follow this closely. Where the design spec has stale article copy, defer to `content.md`.

## Stack

- **Next.js 14** (App Router), TypeScript
- **Tailwind CSS** with custom theme from `design-spec.md`
- **shadcn/ui** for primitives (button, card, table)
- **Framer Motion** for subtle scroll-in animations on the visual slots and FAQ
- **next/font** with the serif called for in the design spec + a monospace for labels
- No CMS, no DB — content compiled in at build time

## Required behavior

### Article rendering
Render `content.md` faithfully. Every section from the markdown must appear. Preserve:

- The kicker → title → subtitle → byline → TL;DR → hero rule sequence
- The blockquote definitional block immediately after the lede
- The italic eyebrow above each H2 (e.g. *The 300-millisecond budget*)
- Question-format H2s
- The 5-row comparison table (autoregressive column should be highlighted with the accent color)
- The numbered five-question checklist with accent-colored numerals
- The full FAQ (5 entries)

### Placeholders
The five `[PLACEHOLDER — ...]` blocks in `content.md` must render as visible amber callouts (soft fill, left accent bar, label "PLACEHOLDER" in small caps, italic body). They are intentional — an interviewer should see where insider data would go.

### Visual slots
The five `**VISUAL N** — ...` lines must render as styled empty slots (dashed accent border, centered caption text, aspect ratio ~16:9). Leave them empty for now. Give each a stable id so a future prompt can target it.

### FAQ schema
The JSON-LD block at the bottom of `content.md` must be injected into the page `<head>` via Next.js metadata or a `<Script type="application/ld+json">` tag. Load-bearing for AEO.

### Embedded Character slot
Reserve space at the top of the FAQ for a future embedded Runway Character widget. Render it as an amber placeholder card for now with a "Character goes here" label.

## Ship pipeline — do all of this in order

1. **Scaffold** Next.js 14 + TypeScript + Tailwind + shadcn/ui + Framer Motion in this directory alongside the existing markdown files.
2. **Build** all components per the design spec.
3. **Run** the dev server locally, load `http://localhost:3000`, confirm the page renders without errors.
4. **Write** a short `README.md` at the repo root with: project name, one-sentence description, link to the live site (fill in after deploy), local dev instructions.
5. **Initialize git**, stage, commit with message `initial commit: anatomy of a character call landing page`.
6. **Create a new public GitHub repo** called `anatomy-of-a-character-call` using `gh repo create --public --source=. --push`. If the name is taken, append a suffix.
7. **Deploy to Vercel** via `npx vercel --prod` (non-interactive: `--yes` or provide flags as needed). If Vercel auth is needed, tell me exactly what to do.
8. **Update the repo README** with the live Vercel URL and push the update.
9. **Report back** with: the GitHub repo URL, the production Vercel URL, a two-sentence summary of what's in the page, a note on what's left as placeholders, and suggested next iterations.

## Don't do

- Don't rewrite the article copy. If something in `content.md` feels clunky, leave it.
- Don't invent customer logos, testimonials, or CTAs that aren't in `content.md`.
- Don't swap the palette. If the design spec says teal, use teal.
- Don't pull in heavy chart libraries yet. Visual slots stay empty this session.
- Don't stop after the dev server runs. I need the deployed URL.
- Don't create a private repo. This needs to be shareable with the Runway recruiting team.

## Handling auth / friction

- If `gh` isn't authed: run `gh auth status` and tell me exactly what to do.
- If Vercel CLI needs a login: run `npx vercel login` and walk me through the prompts.
- If the deploy fails: read the Vercel build logs, fix the issue, redeploy. Don't hand back a broken URL.

## Nice to have (only if time)

- Reading-progress bar at top of page
- Anchor links on each H2 (hover: show `#` link)
- Copy-link button on each FAQ entry
- Open Graph image generated from the title + teal accent
- `robots.txt` and `sitemap.xml` via Next.js conventions
- Lighthouse pass with a 90+ score on all four axes

Start now. Ask a clarifying question only if something in the two input files is genuinely ambiguous. Otherwise: scaffold, build, test, commit, push to GitHub, deploy to Vercel, report back with the URL.
