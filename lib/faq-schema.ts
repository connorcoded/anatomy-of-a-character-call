import { slugify } from "./utils";

// Smart quotes → ASCII so visible DOM text and JSON-LD text match byte-for-byte.
// (Source markdown sometimes has curly quotes; the JSON-LD spec and Rich Results
// are fine with either, but an exact match between name and visible <h3> text is
// load-bearing for rich-result eligibility.)
function ascii(s: string): string {
  return s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}

export type FaqEntry = {
  q: string;
  a: string;
  slug: string;
};

const raw = [
  {
    q: "What is Runway Characters?",
    a: "Runway Characters is a real-time video agent API launched by Runway in March 2026. It generates conversational video avatars frame by frame from a single reference image, letting developers build interactive characters that can speak, listen, and respond in real time over WebRTC.",
  },
  {
    q: "What is GWM-1?",
    a: "GWM-1 is Runway's General World Model. It powers three research surfaces: Characters (conversational video avatars), world-building, and robotics. In the Characters context, it generates video frames autoregressively while maintaining a running understanding of physics, faces, and scene continuity.",
  },
  {
    q: "What's the difference between autoregressive and pre-rendered video avatars?",
    a: "Pre-rendered avatars, usually built on diffusion models, generate a whole video clip from a script or audio input and then play it back. Autoregressive avatars generate each frame sequentially, conditioned on prior frames and live input, so the video is produced as the conversation happens. Autoregressive generation enables mid-sentence interruption, emergent idle behavior, and novel actions that weren't pre-trained.",
  },
  {
    q: "What does real-time mean in the context of AI video avatars?",
    a: "Real-time, for conversational video, means round-trip latency under roughly 300 milliseconds. Human turn-taking averages around 200ms between speakers (Stivers et al., PNAS 2009), and listeners start to perceive lag past 300ms. An avatar that can't hit that window doesn't feel conversational, regardless of what its marketing says.",
  },
  {
    q: "How is Runway Characters different from other conversational AI platforms?",
    a: "Runway Characters is a video-native, autoregressive system built on a general world model. Most conversational platforms are either voice-only (like realtime voice APIs) or video avatars built on diffusion pipelines that pre-render clips. Characters generates video frame by frame during the conversation itself, which changes what the avatar can do mid-call: interrupt, pivot, idle naturally, and execute novel actions on demand.",
  },
];

// Normalize once; both visible DOM text and JSON-LD entries use this exact payload.
export const faqEntries: FaqEntry[] = raw.map((e) => {
  const q = ascii(e.q);
  const a = ascii(e.a);
  return { q, a, slug: slugify(q) };
});

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.a,
    },
  })),
};
