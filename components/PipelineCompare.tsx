"use client";

import { motion } from "framer-motion";

const TEAL = "#14B8A6";
const MUTE = "#6B7280";
const INK = "#0A0A0A";
const RULE = "#D4D4D8";

function DiffusionFlow() {
  // Four boxes, left-to-right with arrows between.
  const boxes = [
    { label: "Script", x: 10, w: 78 },
    { label: "Lip-sync", x: 108, w: 96 },
    { label: "Render clip", x: 224, w: 102 },
    { label: "Playback", x: 346, w: 84 },
  ];
  const y = 58;
  const h = 40;
  return (
    <svg
      viewBox="0 0 440 140"
      width="100%"
      role="img"
      aria-label="Pre-rendered diffusion pipeline: Script to Lip-sync model to Render whole clip to Playback."
      className="block"
    >
      <defs>
        <marker
          id="arrow-gray"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={MUTE} />
        </marker>
      </defs>

      {/* boxes */}
      {boxes.map((b, i) => (
        <motion.g
          key={b.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <rect
            x={b.x}
            y={y}
            width={b.w}
            height={h}
            fill="#FAFAFA"
            stroke={MUTE}
            strokeWidth={1}
            rx={2}
          />
          <text
            x={b.x + b.w / 2}
            y={y + h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize={11}
            fill={INK}
          >
            {b.label}
          </text>
        </motion.g>
      ))}

      {/* arrows between boxes */}
      {boxes.slice(0, -1).map((b, i) => {
        const nx = boxes[i + 1].x;
        return (
          <motion.line
            key={`arrow-${i}`}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
            x1={b.x + b.w + 2}
            x2={nx - 2}
            y1={y + h / 2}
            y2={y + h / 2}
            stroke={MUTE}
            strokeWidth={1.5}
            markerEnd="url(#arrow-gray)"
          />
        );
      })}

      {/* subtle bracket showing "whole thing renders before playback" */}
      <line
        x1={10}
        x2={326}
        y1={y + h + 20}
        y2={y + h + 20}
        stroke={RULE}
        strokeWidth={1}
      />
      <line x1={10} x2={10} y1={y + h + 16} y2={y + h + 20} stroke={RULE} strokeWidth={1} />
      <line x1={326} x2={326} y1={y + h + 16} y2={y + h + 20} stroke={RULE} strokeWidth={1} />
      <text
        x={168}
        y={y + h + 32}
        textAnchor="middle"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize={9.5}
        fill={MUTE}
      >
        render completes before frame 1
      </text>
    </svg>
  );
}

function AutoregressiveLoop() {
  // Audio → GWM-1 → Frame, with Frame looping back to GWM-1.
  const cy = 78;
  const audio = { cx: 62, r: 28 };
  const gwm = { cx: 220, r: 38 };
  const frame = { cx: 378, r: 28 };

  return (
    <svg
      viewBox="0 0 440 140"
      width="100%"
      role="img"
      aria-label="Autoregressive GWM-1 loop: Audio feeds GWM-1 which emits a Frame; each Frame loops back to condition the next one."
      className="block"
    >
      <defs>
        <marker
          id="arrow-teal"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={TEAL} />
        </marker>
      </defs>

      {/* nodes */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
      >
        <circle
          cx={audio.cx}
          cy={cy}
          r={audio.r}
          fill="#FAFAFA"
          stroke={TEAL}
          strokeWidth={1.5}
        />
        <text
          x={audio.cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={11}
          fill={INK}
        >
          Audio
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <circle
          cx={gwm.cx}
          cy={cy}
          r={gwm.r}
          fill={TEAL}
          stroke={TEAL}
          strokeWidth={1.5}
        />
        <text
          x={gwm.cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={12}
          fontWeight={600}
          fill="#FAFAFA"
        >
          GWM-1
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <circle
          cx={frame.cx}
          cy={cy}
          r={frame.r}
          fill="#FAFAFA"
          stroke={TEAL}
          strokeWidth={1.5}
        />
        <text
          x={frame.cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={11}
          fill={INK}
        >
          Frame
        </text>
      </motion.g>

      {/* Audio → GWM-1 */}
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 0.35 }}
        x1={audio.cx + audio.r + 2}
        x2={gwm.cx - gwm.r - 2}
        y1={cy}
        y2={cy}
        stroke={TEAL}
        strokeWidth={1.5}
        markerEnd="url(#arrow-teal)"
      />

      {/* GWM-1 → Frame */}
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 0.45 }}
        x1={gwm.cx + gwm.r + 2}
        x2={frame.cx - frame.r - 2}
        y1={cy}
        y2={cy}
        stroke={TEAL}
        strokeWidth={1.5}
        markerEnd="url(#arrow-teal)"
      />

      {/* Frame → GWM-1 (arc over the top) */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.55 }}
        d={`M ${frame.cx},${cy - frame.r - 1} C ${frame.cx},10 ${gwm.cx},10 ${gwm.cx},${cy - gwm.r - 1}`}
        fill="none"
        stroke={TEAL}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        markerEnd="url(#arrow-teal)"
      />

      {/* loop caption */}
      <text
        x={(gwm.cx + frame.cx) / 2}
        y={16}
        textAnchor="middle"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize={9.5}
        fill={TEAL}
      >
        feedback: last frame conditions the next
      </text>
    </svg>
  );
}

export function PipelineCompare() {
  return (
    <motion.figure
      id="visual-2"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="my-14 w-full"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        <div className="min-w-0">
          <p className="mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mute">
            Pre-rendered / diffusion
          </p>
          <DiffusionFlow />
          <p className="mt-3 font-serif text-[0.92rem] italic leading-snug text-mute">
            video exists before you see it.
          </p>
        </div>
        <div className="min-w-0">
          <p className="mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            Autoregressive (GWM-1)
          </p>
          <AutoregressiveLoop />
          <p className="mt-3 font-serif text-[0.92rem] italic leading-snug text-ink/80">
            each frame conditioned on the last.
          </p>
        </div>
      </div>
    </motion.figure>
  );
}
