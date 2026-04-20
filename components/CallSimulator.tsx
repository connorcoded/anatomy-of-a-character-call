"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ---------------- timeline ----------------

const DURATION = 6.0;
const USER_START = 0.25;
const USER_END = 1.8;
const USER_TEXT = "What is GWM-1?";
const AVATAR_START = 2.04;
const AVATAR_END = 5.2;
const AVATAR_TEXT =
  "GWM-1 is Runway's General World Model. It powers Characters, world-building, and robotics. For Characters, it generates video frames autoregressively, conditioned on everything that came before.";
const FIRST_FRAME_T = 2.04;

type Phase = "silent" | "user" | "processing" | "avatar";
type CallEvent = { t: number; name: string; payload?: string; isFirstFrame?: boolean };

function buildEvents(): CallEvent[] {
  const base: CallEvent[] = [
    { t: 0.0, name: "session.state", payload: "NOT_READY" },
    { t: 0.1, name: "session.state", payload: "READY" },
    { t: 0.25, name: "audio.capture.start()" },
    { t: 1.8, name: "audio.capture.end()", payload: 'transcript: "What is GWM-1?"' },
    { t: 1.85, name: "webrtc.upload", payload: "→ runway-endpoint" },
    { t: 1.92, name: "gwm1.context.update", payload: "audio=1.55s, prior_frames=0" },
    { t: 2.0, name: "gwm1.generate(frame_0)" },
    { t: 2.04, name: "frame_0 → browser", payload: "Δ 210ms", isFirstFrame: true },
  ];
  let idx = 1;
  for (let t = 2.08; t < AVATAR_END; t += 0.04) {
    base.push({ t: Number(t.toFixed(2)), name: `gwm1.generate(frame_${idx})` });
    idx++;
  }
  base.push({ t: 5.2, name: "avatar.speech.end()" });
  base.push({ t: 5.25, name: "session.state", payload: "IDLE" });
  return base.sort((a, b) => a.t - b.t);
}
const EVENTS = buildEvents();

function phaseAt(t: number): Phase {
  if (t < USER_START) return "silent";
  if (t < USER_END) return "user";
  if (t < AVATAR_START) return "processing";
  if (t < AVATAR_END) return "avatar";
  return "silent";
}
function visibleChars(t: number, s: number, e: number, text: string) {
  if (t < s) return "";
  if (t >= e) return text;
  return text.slice(0, Math.floor(((t - s) / (e - s)) * text.length));
}

// ---------------- master clock ----------------

function useCallSimulator() {
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const tRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(1);
  const playingRef = useRef(false);
  speedRef.current = speed;
  playingRef.current = isPlaying;

  useEffect(() => {
    const loop = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (playingRef.current) {
        tRef.current = Math.min(DURATION, tRef.current + dt * speedRef.current);
        setT(tRef.current);
        if (tRef.current >= DURATION) {
          playingRef.current = false;
          setIsPlaying(false);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggle = () => {
    if (tRef.current >= DURATION) {
      tRef.current = 0;
      setT(0);
    }
    lastRef.current = null;
    setIsPlaying((p) => !p);
  };
  const reset = () => {
    tRef.current = 0;
    setT(0);
    lastRef.current = null;
    setIsPlaying(false);
  };
  const seek = (s: number) => {
    tRef.current = Math.max(0, Math.min(DURATION, s));
    setT(tRef.current);
    lastRef.current = null;
  };
  return { t, isPlaying, speed, setSpeed, toggle, reset, seek };
}

// ---------------- subcomponents ----------------

function Avatar({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const speaking = phase === "avatar";
  const eyeAnim = reduced ? { ry: 1.2 } : { ry: [1.2, 0.1, 1.2, 1.2, 1.2] };
  const eyeT = { duration: 4.2, repeat: Infinity, times: [0, 0.03, 0.06, 0.5, 1] };
  const statusLabel =
    phase === "silent" ? "idle" : phase === "user" ? "listening" : phase === "processing" ? "thinking" : "speaking";
  return (
    <div className="mx-auto w-[160px]">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-rule bg-gradient-to-b from-code to-white shadow-[0_8px_24px_rgba(10,10,10,0.08)]">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <motion.g
            animate={reduced ? undefined : { y: [0, 0.7, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M 26 40 Q 28 22 50 20 Q 72 22 74 40 Q 70 32 50 30 Q 30 32 26 40" fill="#52525B" />
            <ellipse cx="50" cy="52" rx="22" ry="26" fill="#E5E5E5" />
            <rect x="42" y="72" width="16" height="20" fill="#D4D4D8" rx="2" />
            <path d="M 18 100 Q 30 82 50 82 Q 70 82 82 100 Z" fill="#A1A1AA" />
            <motion.ellipse cx="42" cy="50" rx="2.4" fill="#0A0A0A" animate={eyeAnim} transition={eyeT} />
            <motion.ellipse cx="58" cy="50" rx="2.4" fill="#0A0A0A" animate={eyeAnim} transition={eyeT} />
            <line x1="38" y1="44" x2="46" y2="43.5" stroke="#52525B" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="54" y1="43.5" x2="62" y2="44" stroke="#52525B" strokeWidth="1.4" strokeLinecap="round" />
            <motion.ellipse
              cx="50"
              cy="62"
              rx={speaking ? 3 : 2.6}
              fill="#0A0A0A"
              animate={speaking && !reduced ? { ry: [0.5, 2.2, 0.6, 1.6, 0.8] } : { ry: 0.6 }}
              transition={
                speaking && !reduced
                  ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            />
          </motion.g>
        </svg>
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-ink/80 px-2 py-1 backdrop-blur">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${phase === "silent" ? "bg-mute" : "bg-accent"}`} />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white">{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}

function Waveform({ phase }: { phase: Phase }) {
  const active = phase === "user" || phase === "avatar";
  return (
    <div aria-hidden className="mt-4 flex h-10 items-end justify-center gap-[3px]">
      {Array.from({ length: 12 }).map((_, i) => {
        const seed = Math.abs(Math.sin(i * 1.73)) * 0.6 + 0.3;
        return (
          <motion.span
            key={i}
            className={`w-[3px] rounded-sm ${active ? "bg-accent" : "bg-rule"}`}
            style={{ height: "18%" }}
            animate={
              active
                ? { height: [`${20 + seed * 30}%`, `${60 + seed * 35}%`, `${28 + seed * 30}%`] }
                : { height: "18%" }
            }
            transition={{
              duration: 0.5 + seed * 0.3,
              repeat: active ? Infinity : 0,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.035,
            }}
          />
        );
      })}
    </div>
  );
}

function Transcript({ t }: { t: number }) {
  const user = visibleChars(t, USER_START, USER_END, USER_TEXT);
  const avatar = visibleChars(t, AVATAR_START, AVATAR_END, AVATAR_TEXT);
  const userActive = t >= USER_START && t < USER_END;
  const avatarActive = t >= AVATAR_START && t < AVATAR_END;
  const caret = (
    <span className="ml-[1px] inline-block h-[0.9em] w-[2px] -mb-[2px] animate-pulse bg-accent align-middle" />
  );
  return (
    <div className="mt-5 space-y-3 font-serif text-[0.95rem] leading-relaxed">
      {user && (
        <div>
          <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">User</p>
          <p className="text-ink">
            {user}
            {userActive && caret}
          </p>
        </div>
      )}
      {avatar && (
        <div>
          <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent">Avatar</p>
          <p className="text-ink/85">
            {avatar}
            {avatarActive && caret}
          </p>
        </div>
      )}
    </div>
  );
}

function EventLog({ t }: { t: number }) {
  const fired = EVENTS.filter((e) => e.t <= t);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [fired.length]);
  const firstFrameFired = t >= FIRST_FRAME_T;
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink">session.log</p>
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
          />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mute">live</span>
        </div>
      </div>
      <div
        ref={ref}
        className="event-log-scroll relative h-[320px] overflow-y-auto rounded-sm border border-rule bg-code p-3 font-mono text-[0.72rem] leading-[1.55] text-ink"
      >
        {fired.length === 0 && <p className="text-mute">waiting for session.state = READY…</p>}
        {fired.map((e, i) => {
          const recent = t - e.t < 0.4;
          const color = e.isFirstFrame
            ? "font-semibold text-accent"
            : recent
              ? "text-accent"
              : "text-ink/70";
          return (
            <motion.div
              key={`${e.t.toFixed(2)}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex gap-2 py-[1px] transition-colors duration-[600ms] ${color}`}
            >
              <span className="flex-shrink-0 tabular-nums text-mute">[t={e.t.toFixed(2)}s]</span>
              <span className="min-w-0 flex-1 break-words">
                {e.name}
                {e.payload && (
                  <>
                    {"  "}
                    <span className={recent ? "text-accent/80" : "text-mute"}>{e.payload}</span>
                  </>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
      {/* Always rendered so the panel height doesn't change when it appears. */}
      <p
        aria-hidden={!firstFrameFired}
        className={`mt-3 font-mono text-[0.65rem] uppercase leading-snug tracking-[0.16em] text-warn transition-opacity duration-300 ${
          firstFrameFired ? "opacity-100" : "opacity-0"
        }`}
      >
        first frame — 210ms round trip, inside the 300ms budget
      </p>
    </div>
  );
}

function Controls({
  t,
  isPlaying,
  speed,
  onToggle,
  onReset,
  onSeek,
  onSpeed,
}: {
  t: number;
  isPlaying: boolean;
  speed: number;
  onToggle: () => void;
  onReset: () => void;
  onSeek: (s: number) => void;
  onSpeed: (s: number) => void;
}) {
  const pct = (t / DURATION) * 100;
  const markerPct = (FIRST_FRAME_T / DURATION) * 100;
  return (
    <div className="mt-6 space-y-3">
      <div
        role="slider"
        aria-label="Simulated call progress"
        aria-valuemin={0}
        aria-valuemax={DURATION}
        aria-valuenow={Number(t.toFixed(2))}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onSeek(t - 0.2);
          else if (e.key === "ArrowRight") onSeek(t + 0.2);
        }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onSeek(((e.clientX - r.left) / r.width) * DURATION);
        }}
        className="relative h-2 cursor-pointer rounded-full bg-rule focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${pct}%` }} />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 h-full w-[2px] bg-warn"
          style={{ left: `${markerPct}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
            {isPlaying ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 3l10 5-10 5z" />}
          </svg>
          {isPlaying ? "Pause" : t >= DURATION ? "Replay" : "Play"}
        </button>
        <div role="group" aria-label="Playback speed" className="inline-flex overflow-hidden rounded-md border border-rule bg-white">
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeed(s)}
              aria-pressed={speed === s}
              className={`px-3 py-2 font-mono text-xs transition-colors ${
                speed === s ? "bg-accent/10 text-accent" : "text-mute hover:text-ink"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border border-rule px-3 py-2 font-sans text-sm text-mute transition-colors hover:border-ink hover:text-ink"
          aria-label="Reset simulation"
        >
          Reset
        </button>
        <span className="ml-auto font-mono text-xs tabular-nums text-mute">
          t={t.toFixed(2)}s / {DURATION.toFixed(2)}s
        </span>
      </div>
    </div>
  );
}

// ---------------- main ----------------

export function CallSimulator() {
  const { t, isPlaying, speed, setSpeed, toggle, reset, seek } = useCallSimulator();
  const phase = phaseAt(t);
  const prefersReduced = useReducedMotion() ?? false;
  return (
    <section id="watch-a-call" className="anchor-offset mt-24">
      <p className="mb-3 font-serif text-[0.95rem] italic text-mute">A call, step by step</p>
      <h2 className="mb-8 font-serif text-[1.65rem] font-semibold leading-tight tracking-tight text-ink md:text-[2rem]">
        Watch a call happen
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 md:items-start">
        <div className="min-w-0">
          <Avatar phase={phase} reduced={prefersReduced} />
          <Waveform phase={phase} />
          <Transcript t={t} />
        </div>
        <EventLog t={t} />
      </div>
      <Controls
        t={t}
        isPlaying={isPlaying}
        speed={speed}
        onToggle={toggle}
        onReset={reset}
        onSeek={seek}
        onSpeed={setSpeed}
      />
      <p className="mt-5 font-serif text-[0.88rem] italic leading-snug text-mute">
        Simulated. Event names and timings are illustrative. Real Characters production latency
        would populate the PLACEHOLDER earlier in this piece.
      </p>
    </section>
  );
}
