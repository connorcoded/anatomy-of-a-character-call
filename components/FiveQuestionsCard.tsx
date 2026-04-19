"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    q: "Is the video generated or retrieved?",
    a: "Generated. Frames produced live on each call, not retrieved from a cache of pre-rendered clips.",
  },
  {
    q: "Does the character have idle behavior when no one is speaking, and does that behavior vary?",
    a: "Yes — blinks, micro-movements, and gaze drift are produced by the model per call, not looped from a recorded asset.",
  },
  {
    q: "Can the character be interrupted mid-sentence without restarting?",
    a: "Yes. Playback pivots in-place within roughly 500ms. No clip to cancel, no queue to drain.",
  },
  {
    q: "Where does my audio go, and is any of it stored by default?",
    a: "Streamed over a live WebRTC session. Not stored by default; session transcripts and logs are opt-in.",
  },
  {
    q: "What happens when my tool call needs to hit my own backend?",
    a: "The Character dispatches the tool call to your RPC endpoint and holds on an idle beat while you respond, then resumes with the new context.",
  },
];

export function FiveQuestionsCard() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <motion.figure
      id="visual-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      className="my-14"
    >
      <div
        className="mx-auto max-w-[640px] border-l-[6px] border-accent bg-accent/[0.05] px-6 py-6 shadow-[0_2px_0_rgba(20,184,166,0.08)] md:px-8 md:py-8"
      >
        <p className="mb-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
          Field guide · screenshot this
        </p>
        <h3 className="mb-6 font-serif text-[1.5rem] font-semibold leading-tight tracking-tight text-ink md:text-[1.75rem]">
          Five questions that cut through the demo reel.
        </h3>

        <ul className="divide-y divide-accent/20 border-t border-accent/20">
          {items.map((item, i) => {
            const isOpen = open.has(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`q-${i}-answer`}
                  className="flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-accent/[0.04] focus:outline-none focus-visible:bg-accent/[0.08]"
                >
                  <span className="mt-[2px] flex-shrink-0 font-mono text-[0.95rem] font-semibold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sans text-[1rem] leading-snug text-ink">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden
                    className="mt-[2px] flex-shrink-0 font-mono text-xl leading-none text-accent"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      id={`q-${i}-answer`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pl-10 pr-2">
                        <p className="mb-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-mute">
                          What a real answer looks like
                        </p>
                        <p className="font-serif text-[0.98rem] leading-relaxed text-ink/85">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-accent/20 pt-4">
          <p className="font-sans text-[0.85rem] text-ink">
            <span className="font-semibold">Five yeses</span>
            <span className="text-mute">
              {" "}
              = real-time generated video. Four or fewer = a fast stitch.
            </span>
          </p>
        </div>

        <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mute">
          From: Anatomy of a Character Call
        </p>
      </div>
    </motion.figure>
  );
}
