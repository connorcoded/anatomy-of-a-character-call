# Landing Page Brief — "Anatomy of a Character Call"

## Project overview

Build a single-page blog landing page for a technical essay titled *Anatomy of a Character Call*. The page's job is to host the essay as a confident, reading-optimized long-form piece, with five embedded visuals that carry roughly half the argument. Two of the visuals are interactive (animated + scrubbable); three are static.

Target audience: technical buyers, product-and-engineering leaders, and applied-AI leads evaluating real-time video conversational AI. The page should feel credible to engineers, not marketed to consumers.

Vibe references: Stripe docs long-form essays, Ethan Rosenthal's blog, the Anthropic research page. Confident, dry, typographic. Not a product landing page.

---

## Design system

### Colors

- Background: `#FAFAFA` (off-white)
- Text primary: `#0A0A0A` (near-black)
- Text secondary: `#6B7280` (cool gray)
- Accent primary: `#14B8A6` (muted teal)
- Accent warning / event: `#F97316` (warm orange)
- Rule lines / borders: `#E5E5E5`
- Code block background: `#F4F4F5`

### Typography

- Headings: a confident serif (Tiempos, GT Super, or fall back to Playfair Display / Source Serif). Avoid display fonts that feel "startup-y."
- Body: a readable sans-serif (Inter, Söhne, or system sans fallback). Optical size around 18–19px for body copy.
- Code / technical labels: monospace (JetBrains Mono, IBM Plex Mono, or system mono fallback).
- Article measure: 65–72 characters per line (~680px column width on desktop).
- Line height: 1.6 for body, 1.2 for headings.

### Spacing & layout

- Article column centered, maximum ~680px wide.
- Visuals break out to ~960px wide (wider than the text column, edge-aligned on mobile).
- Generous vertical rhythm: 48–64px between major sections.
- No boxes, cards, or shadows in the article body. Keep it quiet.

### Aesthetic direction

Clean, technical, confident. Off-white + black + one accent color. No gradients. No stock imagery. No emoji. Charts and diagrams use monospaced labels to signal "this is technical documentation, not marketing."

---

## Page architecture

In order, top to bottom:

1. **Minimal header** — Runway wordmark (placeholder), navigation link ("Read" / "Work" / "About" — not functional, decorative only).
2. **Article hero** — Title, kicker, byline, read time.
3. **Article body** with five visuals embedded at specific positions (specified inline below).
4. **Q&A section** — two short prompts and answers.
5. **Footer** — subtle, dark or muted background, Runway attribution (placeholder), publication date.

No sidebar. No CTAs mid-article. No "related posts" carousel. The page is the essay.

---

## Component specifications

### Article hero

- **Kicker** (above title, small monospaced, teal): `RUNWAY / CHARACTERS`
- **Title** (H1, serif, large): `Anatomy of a Character Call`
- **Deck / subtitle** (serif, medium, italic, secondary color): `What actually happens in the milliseconds between a user speaking and an avatar responding.`
- **Byline row** (small sans, secondary color): `By [Author Placeholder] · [Date Placeholder] · 5 min read`
- **Rule** below the hero to separate it from the article body.

### Article body

Full copy provided below in the "Article copy" section. Preserve section headings (H2) and inline visuals. No drop caps. No pull quotes except where specified.

### Visual 1 — Latency Waterfall (embedded after "The 300-millisecond budget" section opener)

Static horizontal bar chart rendered inline as SVG.

- Layout: 8 horizontal bars stacked vertically, sharing a single 0–300ms x-axis with tick marks at 0, 100, 200, 300ms.
- Each bar starts at its actual start time (so overlap is visible — layers run in parallel).
- Layers and illustrative durations:
  - Speech capture: 0ms → 40ms
  - Transcription: 20ms → 80ms
  - Language inference: 60ms → 140ms
  - Motion planning: 120ms → 140ms
  - Frame generation: 130ms → 180ms (continues streaming)
  - Encoding: 150ms → 170ms
  - WebRTC transport: 170ms → 190ms
  - Browser render: 190ms → 200ms
- Vertical dashed line at 300ms labeled `conversational breakdown threshold`.
- Bar labels: layer name (monospace) on the left, duration in ms on the right.
- Colors: all bars muted teal (`#14B8A6`), 300ms line warm orange (`#F97316`).
- Italic caption below: `Illustrative values. Exact per-layer figures pending confirmation with Runway.`
- Responsive: full-width on mobile, bars stack cleanly.

### Visual 2 — Autoregressive vs. Pre-rendered (embedded after "Autoregressive versus pre-rendered" section)

Interactive animated comparison. **This is the hero visual.**

- Two columns side-by-side on desktop (≥1024px), stacked on mobile.
- **Left column: "Pre-rendered (text-to-video)"**
  - Vertical timeline showing: user speech strip → response tokens → clip render block → playback begins only after render completes.
  - When interruption is simulated: clip freezes mid-play, visible gap (labeled `dead air` in orange) while a new clip renders, then playback resumes.
- **Right column: "Autoregressive (Characters)"**
  - Vertical timeline with user speech, language inference, and frame generation shown as overlapping parallel strips.
  - Playback begins while generation continues.
  - When interruption is simulated: frame generation pivots in-place, new frames within ~500ms, no gap. Labeled `reaction inside ~500ms` in teal.
- **Controls** (centered below both columns):
  - Play / Pause button (primary, teal)
  - Scrubber synced across both timelines
  - `Simulate interruption` button (secondary, orange outline) that injects an interruption event at current scrub position
- Animations run on a 10-second loop by default; scrubber overrides.
- Use SVG for the timelines. Smooth transitions, no bounce or easing that feels playful.

### Visual 3 — World-Model Context Cone (embedded after "The world model earns its name" section)

Static diagram rendered as SVG.

- Horizontal sequence of five rectangular "frame" cards across the top, labeled `Frame 1` through `Frame 5`. Thin black arrows connecting each frame to the next. Label one arrow only: `conditioned on previous frame + conversational state`.
- Below the frames, five horizontal context bars extending across all five frames, each with subtle visual variation between frames (context updates, doesn't duplicate).
- Context bars with labels (left side, monospace):
  - `Avatar identity` (teal, stable)
  - `Physics / motion` (teal, subtle variation)
  - `Gaze direction` (teal, visible variation)
  - `Conversational state` (orange, more variation)
  - `Active tool calls` (orange, intermittent — sometimes absent)
- Short caption below: `Each frame is conditioned on the state held in every bar above. Drop any one, the avatar degrades in a specific way.`

### Visual 4 — Call Anatomy Timeline (embedded after "Putting it together" section)

Interactive scrubbable timeline. **Second hero visual.**

- Horizontal timeline spanning 30 seconds with tick marks every 5 seconds (`0:00`, `0:05`, `0:10`, etc.).
- Five stacked layer rows, top to bottom:
  1. **Audio in** — user speech waveform, abstracted as an amplitude strip
  2. **Transcription** — streaming tokens as thin vertical ticks appearing over time
  3. **Language inference** — solid filled blocks showing when the model is actively reasoning
  4. **Frame generation** — continuous strip showing frames being produced
  5. **Video + audio out** — waveform plus frame ticks, same duration as generation above it
- Three events on the timeline, each with a vertical orange marker:
  - `0:10` — `tool call → backend RPC` (frame generation continues, audio may hold on an idle beat briefly)
  - `0:20` — `user cuts in` (user audio reappears, transcription restarts, inference pivots, generation changes visibly)
  - `0:28` — `Character picks back up`
- **Controls** below the timeline:
  - Play / Pause button
  - Scrubber on the timeline
  - A vertical "now" line that moves with the scrubber
  - A small descriptive panel below the timeline that updates with plain-English one-liners based on scrub position:
    - `Model producing response frames. User silent.`
    - `User interrupts. Generation pivoting.`
    - `Tool call resolved. Character delivering updated response.`

### Visual 5 — Five-Questions Callout (embedded before the "Why the architecture decides the product" section)

Shareable pull-out card, designed to be screenshot-worthy.

- Card centered in the article, roughly 680–720px wide, 4:5 aspect ratio.
- Thin 1px black border, off-white fill (`#FAFAFA`). Subtle drop shadow (2px blur, 5% opacity) — this is the one place shadow is allowed, because it signals "pull-out."
- **Header** (heavy serif, large): `Is this actually real-time?`
- **Subhead** (sans, medium, secondary color): `Five questions to ask any video-avatar vendor.`
- **Questions** (monospace body, 5 numbered, teal numbers):
  1. Does playback start before response generation finishes?
  2. Can a user interrupt mid-sentence and see the avatar react inside half a second?
  3. Is visible behavior produced by a model that understands physics and gaze, or assembled from canned clips?
  4. Does latency stay flat as the response gets longer?
  5. Are idle behaviors (blinks, micro-movements, breathing) generated per-call, or looped from a recorded asset?
- **Footer** (small sans, black): `Five yeses = real-time generated video. Four or fewer = a fast stitch.`
- **Attribution** (tiny, gray): `From: Anatomy of a Character Call`

### Q&A section

Styled as a distinct block below the article body, separated by a rule.

- Small kicker: `BEHIND THE PIECE`
- Two question/answer pairs, each with the question in serif H3 and the answer in body sans.

### Footer

Muted dark background (`#0A0A0A` or `#1F1F1F`), off-white text. Three columns on desktop, stacked on mobile:

- **Left**: Runway wordmark (placeholder), tagline
- **Center**: Article metadata — `Published [date placeholder]`, `5 min read`, share buttons (Twitter, LinkedIn, copy link)
- **Right**: `About Runway Characters` link, `Read the docs` link, `Contact sales` link — styled as subtle inline links, not buttons

---

## Article copy (full text)

Use this copy verbatim. Headings are H2 unless noted.

---

Every video AI vendor is shipping "real-time avatars" now. The phrase is doing a lot of work. On one end of the spectrum, a text-to-video model renders a clip after a TTS response lands, queues it up, and plays it once rendering finishes. At the other, a video stream being generated in sequence while you're watching it. Both get sold under the same headline. They behave very differently when a user cuts in mid-sentence.

This is a layer-by-layer look at what happens inside a Runway Characters call, and a test you can take to any vendor in the category to find out which version they're actually shipping.

### The 300-millisecond budget

Human conversation falls apart when turn-taking gaps cross roughly 300 milliseconds. People start talking over each other. They give up on the person who keeps lagging. That's the ceiling any real-time video agent lives under, and there isn't much slack in it.

Where the budget goes in a Characters call:

**[VISUAL 1 — Latency Waterfall]**

The math only works if the layers overlap. Any single step that has to finish before the next one begins will eat the whole budget on its own. Parallelism is load-bearing here, which is why the engineering under Characters looks more like a pipeline than a stack.

### Autoregressive versus pre-rendered

There are two ways to put an avatar on camera.

The first: a text-to-video model takes the response, renders a clip, and plays the clip once the render completes. Latency climbs with response length. Stopping a three-second clip halfway because a user interrupted looks bad every time. Every interruption is a cut.

The second: the model generates video frames in sequence, each one conditioned on the previous frame and on the current state of the conversation. Playback starts before the next second has been generated. When a user cuts in, the transcription stream updates, the model's intent shifts, and the frames that come out next have a different motivation behind them. Nothing gets queued. Nothing gets stopped.

Characters uses GWM-1 autoregressively. That's why a Character will turn its head mid-sentence when you interrupt it, instead of finishing a scripted thought. The behavior comes from the model reacting to the new input. No listening loop. No canned idle animation.

**[VISUAL 2 — Autoregressive vs. Pre-rendered, Animated]**

### The world model earns its name

A world model carries context across frames. At every frame, GWM-1 is conditioning on the avatar's identity (traced from the reference image), rough physics (how a head moves when a body stays still), gaze direction, conversational state, and any tool call in flight. That's what lets a Character glance at something on the screen and return to the camera without the jitter you get from generative systems that forget where everyone was looking two frames ago.

**[VISUAL 3 — World-Model Context Cone]**

Strip out identity conditioning and the face drifts. Physics conditioning does more than you'd guess; without it, motion goes rubbery and the uncanny valley opens up. Lose the conversational state and the avatar stares through the user while saying the right words. All three are load-bearing.

*[Placeholder: specific GWM-1 architecture internals, parameter counts, and training specifics pending publication.]*

### Putting it together

Stack the layers across a 30-second exchange:

- Audio in, from the user
- Transcribed tokens, streaming as they arrive
- Language inference, with a motion plan attached
- Autoregressive frame generation
- Encoded video and audio, streaming back out

**[VISUAL 4 — Call Anatomy Timeline]**

Every layer runs in parallel with the ones above and below. Interruption doesn't stall the pipeline. The transcription stream flags the change, inference pivots, generation keeps producing frames with a new intent behind them. What lands on the other end is an avatar that handles turn-taking the way people do, including the ugly parts. It backs off when you cut in. It picks up when you stop. There's no clip to resume, because there wasn't one in the first place.

### A test you can take to any vendor

Five questions to ask anyone selling "real-time avatars":

**[VISUAL 5 — Five-Questions Callout]**

Five yeses describes real-time generated video. Four or fewer describes a fast stitch. Pre-rendered clips have a place in product demos and onboarding videos. They can't sit in a live conversation with a person who wants to interrupt.

### Why the architecture decides the product

Rendering is going to get better for every vendor in the category over the next year or two. "Does it look human" will be a solved problem across the board. A harder question holds up longer: does the avatar behave like the conversation is alive. That's an architecture question, and it's the one most vendors marketing the same words haven't started on.

Runway is further along on it.

---

## Q&A (Behind the piece)

### Who did you write it for?

Technical buyers and product-and-engineering leaders evaluating video conversational AI, with an applied-AI lean. They're the ones fielding the vendor pitches and shaping the roadmap call. They're skeptical of marketing language, they want an architecture story, and they need something they can put in front of their team without it feeling like a re-shared press release.

### What did you want them to walk away thinking or changing about how they work?

Two things. One, they now have a mental model that lets them separate real-time generated video from the pre-rendered video being sold under the same phrase, plus a five-question test they can run on any vendor in the space. Two, they treat the architecture choice as a product decision rather than a technical footnote, because the behavior of the avatar during a live conversation flows directly from it.

---

## Technical requirements

- **Framework**: React + Tailwind CSS (Lovable default is fine).
- **Visuals**: Build Visuals 1, 3, and 5 as inline SVG components. Build Visuals 2 and 4 as interactive React components with SVG rendering and vanilla React state (no third-party animation libraries needed; Framer Motion is fine if preferred).
- **No external images or stock photos.** Everything is typography, vector, and code.
- **Fonts**: Load via Google Fonts or system stack. Serif for headings (Source Serif, Playfair Display, or similar), sans for body (Inter), mono for labels (JetBrains Mono).
- **Responsive breakpoints**: Mobile (< 640px), tablet (640–1024px), desktop (≥ 1024px). Article column stays narrow on all breakpoints; visuals break out on tablet and desktop only.
- **Accessibility**: All interactive controls keyboard-navigable. Visuals include text alternatives or sufficient surrounding prose that a screen reader user gets the argument. Color contrast ratio ≥ 4.5 for all text.
- **Performance**: No heavy dependencies. Target < 200KB JS and < 50KB CSS.
- **No tracking, no analytics, no popups, no email capture.** This is an essay page.

---

## Acceptance criteria

The landing page is done when:

1. The full article copy renders cleanly with proper typographic hierarchy and responsive behavior.
2. All five visuals are embedded at their specified positions and render correctly on desktop and mobile.
3. Visuals 2 and 4 are interactive: play/pause and scrub work smoothly, and the "simulate interruption" button on Visual 2 produces a visible behavior change on both timelines.
4. The Q&A section is visually distinct from the article body but uses the same typographic system.
5. The footer is subtle, informative, and does not compete with the article for attention.
6. The overall feel is confident, dry, typographic — a reader evaluating video AI vendors should feel this page was made for them, not at them.
