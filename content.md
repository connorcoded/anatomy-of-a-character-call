---
kicker: RUNWAY / CHARACTERS
title: Anatomy of a Character Call
subtitle: What actually happens in the milliseconds between a user speaking and an avatar responding.
byline: By [Author]
date: April 2026
read_time: 5 min read
---

**RUNWAY / CHARACTERS**

# Anatomy of a Character Call

*What actually happens in the milliseconds between a user speaking and an avatar responding.*

By [Author] · April 2026 · 5 min read

**Runway Characters, launched March 2026, is a real-time video agent API that generates conversational avatars frame by frame over WebRTC. It runs on GWM-1, Runway's General World Model.**

---

A user says hello. A face on a screen says hello back. The lips move in time with the sound. The eyes do something small and human between words. The whole loop feels, for a second, like a conversation.

That second is made of a lot of pieces. Pulling them apart is the point of this piece.

> Some framing, as of April 2026. Runway Characters, launched in March 2026, is a real-time video agent API that generates conversational video avatars frame by frame from a single reference image. It runs on GWM-1, Runway's General World Model, which also underpins the company's world-building and robotics research surfaces. That's what this piece is digging into.

---

*The 300-millisecond budget*

## How much latency can a real-time video avatar tolerate?

Conversational turn-taking in humans averages around 200 milliseconds between speakers, according to Stivers et al.'s cross-linguistic study published in PNAS (2009). Push past roughly 300ms and listeners start to feel the gap. Past 500ms and they start filling it. You can watch this happen on any slightly-laggy video call: people talk over each other, then both stop, then both start again.

Follow-up work by Levinson and Torreira in *Frontiers in Psychology* (2015) pushed the finding further: listeners begin planning their response roughly 200ms before the current speaker finishes. Lag past 300ms isn't just a delay. It's a violation of a predictive loop the human brain is already running.

Any real-time avatar has the same budget. Under 300ms of round-trip latency and the thing feels alive. Over it and you're watching a slideshow with opinions.

*[PLACEHOLDER — Characters' actual p50 / p99 latency numbers in production. Insider data I'd drop in here to replace the theoretical budget with a measured one.]*

That budget is the constraint that shapes everything else in a Characters call. Not the image quality. Not the voice. The clock.

**VISUAL 1** — latency waterfall showing each hop of a Character call against a 300ms deadline

---

*Autoregressive versus pre-rendered*

## What's the difference between autoregressive and pre-rendered video avatars?

Most video avatar platforms work in two stages. Stage one: you write a script or the model generates text. Stage two: a diffusion model animates a face to match that text, usually by lip-syncing a pre-trained puppet to audio. The video comes out whole. You play it back.

Characters works differently. Frames are generated sequentially, each one conditioned on the frames that came before it, the audio so far, and the model's running understanding of the scene. Nothing is pre-rendered. Nothing is cached. The video is being made up as the conversation goes.

That's what "autoregressive" means in the GWM-1 context. Each frame is a prediction based on everything that happened up to now.

*[PLACEHOLDER — Direct quote from a Runway researcher on why autoregressive generation was the right architectural choice for conversational video. Insider access to a named engineer would close the authority loop.]*

|   | Pre-rendered / diffusion | Autoregressive (GWM-1) |
|---|---|---|
| **Generation** | Whole clip at once | Frame by frame, sequential |
| **Latency profile** | Render then stream | Stream as it generates |
| **Idle behavior** | Looped animation | Emergent, scene-conditioned |
| **Response to interruption** | Finish or restart | Pivot mid-frame |
| **Novel action execution** | Limited to trained animations | Generated on demand |

The distinction matters because it changes what the character can do mid-conversation. A pre-rendered avatar has to finish its current clip, or cut, or restart. An autoregressive avatar can turn its head toward a sound it just heard. It can pause because you paused. It can do a small thing with its mouth that wasn't in any script.

**VISUAL 2** — side-by-side diagram: diffusion pipeline vs. autoregressive frame generation

---

*The world model earns its name*

## What does a world model actually do in a Character call?

GWM-1 is a General World Model. Characters is one of three surfaces it powers, alongside world-building and robotics.

In the Characters context, "world model" means the generator carries a running understanding of physics, faces, and continuity. It knows that heads don't teleport. It knows that a hand raised in frame 100 should still be raised in frame 101 unless something caused it to move. It knows what the light was doing a second ago.

This is the part that's hard to see until it breaks. When a diffusion-based avatar glitches, you get uncanny stuttering: eyes that skip, a mouth that keeps moving after the audio stops, a background that re-renders itself between frames. Those are failures of continuity. A world model's job is to make those failures rarer.

**VISUAL 3** — the "context cone" of a single frame: reference image, prior frames, audio, tool state

---

*Putting it together*

## How do the layers of a real-time avatar call work together?

A Character call has four layers stacked on top of each other.

**Transport.** WebRTC over LiveKit. This is the same protocol family used by most modern video calling products. It prioritizes low latency over guaranteed delivery, which is the right tradeoff when the audio has to feel live.

**Session.** A Session is a live, temporary connection. It has a lifecycle: `NOT_READY → READY → RUNNING → COMPLETED`. Sessions are capped at five minutes. This is a deliberate choice, not a limitation. *[PLACEHOLDER — actual rationale for the 5-minute cap from the Characters team. I'd confirm with an engineer rather than speculate before shipping.]*

**Avatar.** An Avatar is a persistent persona: a reference image, a voice, a personality prompt, a knowledge base of up to 50,000 tokens, and optional tool definitions. You create an Avatar once and spin up Sessions against it.

**Generation.** GWM-1 producing frames, conditioned on everything above.

The conceptual separation of Avatar from Session matters for how you build. The Avatar is your product: the character, the knowledge, the tools. The Session is just the call. You can have a thousand concurrent Sessions against one Avatar. You can version an Avatar without breaking any ongoing Session. You can swap the voice without rebuilding the knowledge base.

*[PLACEHOLDER — named early-access customer and specific use case, e.g. "Company X is running a support-agent Avatar at N concurrent Sessions against a Y-document knowledge base." Insider access or partner permission required.]*

**VISUAL 4** — horizontal timeline of a Character call: click connect → session spin-up → first frame → turn-taking loop → session end

---

*A test you can take to any vendor*

## How can you tell if a "real-time" avatar is actually real-time?

There are five questions that cut through the demo reel.

1. Is the video generated or retrieved?
2. Does the character have idle behavior when no one is speaking, and does that behavior vary?
3. Can the character be interrupted mid-sentence without restarting?
4. Where does my audio go, and is any of it stored by default?
5. What happens when my tool call needs to hit my own backend?

The first three are architecture questions. The last two are integration questions. A platform that can answer all five in specifics is running something close to what Runway is running. A platform that hand-waves any of them is probably doing something else.

**VISUAL 5** — the five-question checklist as a standalone callout card

---

*Why the architecture decides the product*

## Why does the architecture matter for video conversational AI?

Most of the visible differences between conversational AI products are surface differences. Voice. Style. UI chrome. The interesting differences are below the surface, in what the model is doing per frame.

Characters isn't the only real-time video agent that will exist. But the choice to generate frames autoregressively, off a world model, inside a 300ms budget, is a choice that shapes every downstream product decision: what an Avatar is, why Sessions are ephemeral, why the knowledge base lives where it does, why the tool interface looks the way it looks.

You can build a good conversational product on top of a pre-rendered video stack. You can build a different kind of product on top of an autoregressive one. This piece is about the second kind.

---

## Frequently asked

*[PLACEHOLDER — embed Runway Character here. Avatar configured as a Characters product expert; knowledge base: the full Characters docs, this article, and the five-question checklist above. The FAQ below seeds the common ground; the Character handles the long tail.]*

**What is Runway Characters?**
Runway Characters is a real-time video agent API launched by Runway in March 2026. It generates conversational video avatars frame by frame from a single reference image, letting developers build interactive characters that can speak, listen, and respond in real time over WebRTC.

**What is GWM-1?**
GWM-1 is Runway's General World Model. It powers three research surfaces: Characters (conversational video avatars), world-building, and robotics. In the Characters context, it generates video frames autoregressively while maintaining a running understanding of physics, faces, and scene continuity.

**What's the difference between autoregressive and pre-rendered video avatars?**
Pre-rendered avatars, usually built on diffusion models, generate a whole video clip from a script or audio input and then play it back. Autoregressive avatars generate each frame sequentially, conditioned on prior frames and live input, so the video is produced as the conversation happens. Autoregressive generation enables mid-sentence interruption, emergent idle behavior, and novel actions that weren't pre-trained.

**What does "real-time" mean in the context of AI video avatars?**
Real-time, for conversational video, means round-trip latency under roughly 300 milliseconds. Human turn-taking averages around 200ms between speakers (Stivers et al., PNAS 2009), and listeners start to perceive lag past 300ms. An avatar that can't hit that window doesn't feel conversational, regardless of what its marketing says.

**How is Runway Characters different from other conversational AI platforms?**
Runway Characters is a video-native, autoregressive system built on a general world model. Most conversational platforms are either voice-only (like realtime voice APIs) or video avatars built on diffusion pipelines that pre-render clips. Characters generates video frame by frame during the conversation itself, which changes what the avatar can do mid-call: interrupt, pivot, idle naturally, and execute novel actions on demand.

---

---

## Implementation note for Lovable — FAQ schema (JSON-LD)

Emit the following into the page `<head>` so the FAQ block is eligible for rich results in Google and gets picked up cleanly by LLM citation crawlers.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Runway Characters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Runway Characters is a real-time video agent API launched by Runway in March 2026. It generates conversational video avatars frame by frame from a single reference image, letting developers build interactive characters that can speak, listen, and respond in real time over WebRTC."
      }
    },
    {
      "@type": "Question",
      "name": "What is GWM-1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GWM-1 is Runway's General World Model. It powers three research surfaces: Characters (conversational video avatars), world-building, and robotics. In the Characters context, it generates video frames autoregressively while maintaining a running understanding of physics, faces, and scene continuity."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between autoregressive and pre-rendered video avatars?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pre-rendered avatars, usually built on diffusion models, generate a whole video clip from a script or audio input and then play it back. Autoregressive avatars generate each frame sequentially, conditioned on prior frames and live input, so the video is produced as the conversation happens. Autoregressive generation enables mid-sentence interruption, emergent idle behavior, and novel actions that weren't pre-trained."
      }
    },
    {
      "@type": "Question",
      "name": "What does real-time mean in the context of AI video avatars?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Real-time, for conversational video, means round-trip latency under roughly 300 milliseconds. Human turn-taking averages around 200ms between speakers (Stivers et al., PNAS 2009), and listeners start to perceive lag past 300ms. An avatar that can't hit that window doesn't feel conversational, regardless of what its marketing says."
      }
    },
    {
      "@type": "Question",
      "name": "How is Runway Characters different from other conversational AI platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Runway Characters is a video-native, autoregressive system built on a general world model. Most conversational platforms are either voice-only (like realtime voice APIs) or video avatars built on diffusion pipelines that pre-render clips. Characters generates video frame by frame during the conversation itself, which changes what the avatar can do mid-call: interrupt, pivot, idle naturally, and execute novel actions on demand."
      }
    }
  ]
}
</script>
```
