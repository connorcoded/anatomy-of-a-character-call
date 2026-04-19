"use client";

import { motion, type Variants } from "framer-motion";

const TEAL = "#14B8A6";
const MUTE = "#6B7280";
const INK = "#0A0A0A";
const RULE = "#E5E5E5";

const stages = [
  { id: "connect", top: "Click connect", bottom: "user action", icon: "connect" as const },
  {
    id: "lifecycle",
    top: "NOT_READY → READY",
    bottom: "session spin-up",
    icon: "lifecycle" as const,
  },
  { id: "first-frame", top: "First frame", bottom: "T = 0", icon: "frame" as const },
  {
    id: "loop",
    top: "Turn-taking loop",
    bottom: "audio in ↔ frame out",
    icon: "loop" as const,
  },
  { id: "end", top: "Session end", bottom: "T ≤ 5 min", icon: "end" as const },
];

// Layout
const VB_W = 840;
const VB_H = 210;
const NODE_Y = 64;
const NODE_R = 24;
const NODE_XS = [100, 265, 420, 585, 740];

// Variants
const nodeStroke: Variants = {
  hidden: { stroke: MUTE, fill: "#FAFAFA" },
  visible: {
    stroke: TEAL,
    fill: TEAL,
    transition: { duration: 0.45 },
  },
};
const nodeIcon: Variants = {
  hidden: { stroke: MUTE, fill: "#FAFAFA" },
  visible: {
    stroke: "#FAFAFA",
    fill: "#FAFAFA",
    transition: { duration: 0.45 },
  },
};
const segment: Variants = {
  hidden: { pathLength: 0, stroke: MUTE, opacity: 0.5 },
  visible: {
    pathLength: 1,
    stroke: TEAL,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};
const labelFade: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StageIcon({ kind }: { kind: (typeof stages)[number]["icon"] }) {
  // All icons drawn relative to (0,0). Size ~18 px.
  switch (kind) {
    case "connect":
      // Play triangle — user initiates
      return (
        <motion.polygon
          variants={nodeIcon}
          points="-4,-6 -4,6 6,0"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      );
    case "lifecycle":
      // Four status dots, last filled
      return (
        <motion.g variants={nodeIcon}>
          <circle cx={-9} cy={0} r={2.2} fill="none" strokeWidth={1.3} />
          <circle cx={-3} cy={0} r={2.2} fill="none" strokeWidth={1.3} />
          <circle cx={3} cy={0} r={2.2} fill="none" strokeWidth={1.3} />
          <circle cx={9} cy={0} r={2.8} />
        </motion.g>
      );
    case "frame":
      // Filmstrip frame with two sprocket holes
      return (
        <motion.g variants={nodeIcon} strokeWidth={1.4}>
          <rect x={-8} y={-6} width={16} height={12} rx={1} fill="none" />
          <circle cx={-4.5} cy={0} r={1} />
          <circle cx={4.5} cy={0} r={1} />
        </motion.g>
      );
    case "loop":
      // Circular feedback arrow
      return (
        <motion.g variants={nodeIcon} strokeWidth={1.5} strokeLinecap="round" fill="none">
          <path d="M 7,-2 A 7,7 0 1,0 7,3" />
          <polyline points="4,-4 7,-2 9,-5" />
        </motion.g>
      );
    case "end":
      // Clock: circle + hour hand
      return (
        <motion.g variants={nodeIcon} strokeWidth={1.4} fill="none">
          <circle cx={0} cy={0} r={7.5} />
          <line x1={0} y1={0} x2={0} y2={-5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={4} y2={0} strokeLinecap="round" />
        </motion.g>
      );
  }
}

export function CallTimeline() {
  return (
    <motion.figure
      id="visual-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.16, delayChildren: 0.05 },
        },
      }}
      className="my-14 w-full"
    >
      <div className="mx-auto w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          role="img"
          aria-label="Horizontal timeline of a Character call: click connect, session goes NOT_READY to READY, first frame at T=0, turn-taking loop, session ends at or before five minutes."
          className="block"
        >
          {/* connector track (static gray) */}
          <line
            x1={NODE_XS[0]}
            x2={NODE_XS[NODE_XS.length - 1]}
            y1={NODE_Y}
            y2={NODE_Y}
            stroke={RULE}
            strokeWidth={1}
          />

          {/* animated teal segments over the track */}
          {NODE_XS.slice(0, -1).map((x, i) => (
            <motion.line
              key={`seg-${i}`}
              variants={segment}
              x1={x + NODE_R}
              x2={NODE_XS[i + 1] - NODE_R}
              y1={NODE_Y}
              y2={NODE_Y}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}

          {stages.map((s, i) => {
            const x = NODE_XS[i];
            return (
              <g key={s.id}>
                <motion.circle
                  variants={nodeStroke}
                  cx={x}
                  cy={NODE_Y}
                  r={NODE_R}
                  strokeWidth={1.5}
                />
                <g transform={`translate(${x}, ${NODE_Y})`}>
                  <StageIcon kind={s.icon} />
                </g>

                <motion.text
                  variants={labelFade}
                  x={x}
                  y={NODE_Y + NODE_R + 22}
                  textAnchor="middle"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fontWeight={600}
                  fill={INK}
                >
                  {s.top}
                </motion.text>
                <motion.text
                  variants={labelFade}
                  x={x}
                  y={NODE_Y + NODE_R + 38}
                  textAnchor="middle"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={10}
                  fill={MUTE}
                >
                  {s.bottom}
                </motion.text>
              </g>
            );
          })}

          {/* Stage 4 inline mini-cycle: audio ↔ frame (subtle infinite pulse) */}
          <g transform={`translate(${NODE_XS[3]}, ${NODE_Y + NODE_R + 66})`}>
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {/* audio waveform */}
              <motion.g
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <line x1={-42} x2={-42} y1={-6} y2={6} stroke={TEAL} strokeWidth={1.5} />
                <line x1={-38} x2={-38} y1={-3} y2={3} stroke={TEAL} strokeWidth={1.5} />
                <line x1={-34} x2={-34} y1={-8} y2={8} stroke={TEAL} strokeWidth={1.5} />
                <line x1={-30} x2={-30} y1={-4} y2={4} stroke={TEAL} strokeWidth={1.5} />
                <line x1={-26} x2={-26} y1={-2} y2={2} stroke={TEAL} strokeWidth={1.5} />
              </motion.g>

              {/* connector dots */}
              <motion.circle
                animate={{ cx: [-18, 18], opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                cy={0}
                r={1.8}
                fill={TEAL}
              />

              {/* frame rect */}
              <motion.rect
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
                x={22}
                y={-7}
                width={22}
                height={14}
                rx={1}
                fill="none"
                stroke={TEAL}
                strokeWidth={1.4}
              />
            </motion.g>
          </g>
        </svg>
      </div>

      <figcaption className="mx-auto mt-4 max-w-[56ch] text-center font-serif text-[0.95rem] italic leading-snug text-mute">
        One Avatar can spin up thousands of concurrent Sessions.
      </figcaption>
    </motion.figure>
  );
}
