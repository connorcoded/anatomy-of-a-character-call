"use client";

import { motion } from "framer-motion";

const layers = [
  { name: "Audio capture", duration: 20 },
  { name: "Network upload", duration: 30 },
  { name: "ASR / tokenize", duration: 40 },
  { name: "GWM-1 frame generation", duration: 120 },
  { name: "Network download", duration: 30 },
  { name: "Render", duration: 20 },
];

const bars = (() => {
  let cursor = 0;
  return layers.map((l) => {
    const start = cursor;
    cursor += l.duration;
    return { ...l, start, end: cursor };
  });
})();

const TOTAL_MS = bars[bars.length - 1].end;
const THRESHOLD = 300;
const X_MAX = 360;
const W = 800;
const PAD_L = 180;
const PAD_R = 40;
const CHART_W = W - PAD_L - PAD_R;
const TOP = 40;
const ROW_H = 26;
const ROW_GAP = 12;
const CHART_H = bars.length * (ROW_H + ROW_GAP);
const H = TOP + CHART_H + 40;

const xOf = (ms: number) => PAD_L + (ms / X_MAX) * CHART_W;
const ticks = [0, 100, 200, 300];

const TEAL = "#14B8A6";
const ORANGE = "#F97316";
const MUTE = "#6B7280";
const INK = "#0A0A0A";
const RULE = "#E5E5E5";

export function LatencyWaterfall() {
  return (
    <motion.figure
      id="visual-1"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="my-14 w-full"
    >
      <div className="mx-auto w-full overflow-visible">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Latency waterfall. Six sequential stages total ${TOTAL_MS}ms, inside the 300ms conversational turn-taking threshold.`}
          className="block"
        >
          {/* x-axis baseline */}
          <line
            x1={PAD_L}
            x2={xOf(X_MAX)}
            y1={TOP - 14}
            y2={TOP - 14}
            stroke={RULE}
            strokeWidth={1}
          />

          {/* x-axis ticks + labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={xOf(t)}
                x2={xOf(t)}
                y1={TOP - 18}
                y2={TOP - 10}
                stroke={MUTE}
                strokeWidth={1}
              />
              <text
                x={xOf(t)}
                y={TOP - 22}
                textAnchor="middle"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize={10}
                fill={MUTE}
              >
                {t}ms
              </text>
            </g>
          ))}

          {/* faint gridlines at each tick */}
          {ticks.slice(1).map((t) => (
            <line
              key={`grid-${t}`}
              x1={xOf(t)}
              x2={xOf(t)}
              y1={TOP - 6}
              y2={TOP + CHART_H + 6}
              stroke={RULE}
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.6}
            />
          ))}

          {/* bars */}
          {bars.map((b, i) => {
            const y = TOP + i * (ROW_H + ROW_GAP);
            const barX = xOf(b.start);
            const barW = xOf(b.end) - xOf(b.start);
            const withinBudget = b.end <= THRESHOLD;
            const fill = withinBudget ? TEAL : ORANGE;

            return (
              <g key={b.name}>
                {/* layer name (left) */}
                <text
                  x={PAD_L - 10}
                  y={y + ROW_H / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fill={INK}
                >
                  {b.name}
                </text>

                {/* bar track (empty part of row) */}
                <rect
                  x={PAD_L}
                  y={y + ROW_H / 2 - 0.5}
                  width={CHART_W}
                  height={1}
                  fill={RULE}
                />

                {/* actual bar */}
                <motion.rect
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 * i,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  style={{ transformOrigin: `${barX}px ${y + ROW_H / 2}px` }}
                  x={barX}
                  y={y}
                  width={barW}
                  height={ROW_H}
                  rx={2}
                  fill={fill}
                />

                {/* duration label (right of bar) */}
                <text
                  x={xOf(b.end) + 8}
                  y={y + ROW_H / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fill={MUTE}
                >
                  {b.duration}ms
                </text>
              </g>
            );
          })}

          {/* 300ms threshold dashed line */}
          <line
            x1={xOf(THRESHOLD)}
            x2={xOf(THRESHOLD)}
            y1={TOP - 8}
            y2={TOP + CHART_H + 18}
            stroke={ORANGE}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={xOf(THRESHOLD) + 8}
            y={TOP + CHART_H + 30}
            textAnchor="start"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize={10.5}
            fill={ORANGE}
          >
            300ms — human turn-taking threshold
          </text>

          {/* total summary (bottom-left) */}
          <text
            x={PAD_L - 10}
            y={TOP + CHART_H + 30}
            textAnchor="end"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize={10.5}
            fill={INK}
          >
            total {TOTAL_MS}ms
          </text>
        </svg>
      </div>

      <figcaption className="mx-auto mt-5 max-w-[56ch] text-center font-serif text-[0.95rem] italic leading-snug text-mute">
        Illustrative budget. Real Characters production numbers live in the PLACEHOLDER above.
      </figcaption>
    </motion.figure>
  );
}
