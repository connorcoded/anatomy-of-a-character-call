"use client";

import { motion } from "framer-motion";

const TEAL = "#14B8A6";
const MUTE = "#6B7280";
const INK = "#0A0A0A";

const inputs = [
  "Reference image",
  "Prior frames (~last 20)",
  "Audio input",
  "Tool state",
];

const VB_W = 460;
const VB_H = 210;

const IN_X = 14;
const IN_W = 168;
const IN_H = 30;
const IN_GAP = 14;
const IN_TOP = 14;

const OUT_X = 300;
const OUT_W = 148;
const OUT_H = 72;
const OUT_Y = 70;
const OUT_CENTER = { x: OUT_X, y: OUT_Y + OUT_H / 2 };

export function ContextCone() {
  return (
    <motion.figure
      id="visual-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="my-14 w-full"
    >
      <div className="mx-auto w-full max-w-[680px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          role="img"
          aria-label="Context cone: reference image, prior frames, audio input, and tool state all feed into GWM-1 to predict the next frame."
          className="block"
        >
          <defs>
            <marker
              id="arrow-teal-cone"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={TEAL} />
            </marker>
          </defs>

          {/* input boxes */}
          {inputs.map((label, i) => {
            const y = IN_TOP + i * (IN_H + IN_GAP);
            return (
              <motion.g
                key={label}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <rect
                  x={IN_X}
                  y={y}
                  width={IN_W}
                  height={IN_H}
                  rx={2}
                  fill="#FAFAFA"
                  stroke={MUTE}
                  strokeWidth={1}
                />
                <text
                  x={IN_X + IN_W / 2}
                  y={y + IN_H / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fill={INK}
                >
                  {label}
                </text>
              </motion.g>
            );
          })}

          {/* converging teal arrows */}
          {inputs.map((_, i) => {
            const y = IN_TOP + i * (IN_H + IN_GAP) + IN_H / 2;
            return (
              <motion.line
                key={`cone-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.06 }}
                x1={IN_X + IN_W + 4}
                y1={y}
                x2={OUT_CENTER.x - 2}
                y2={OUT_CENTER.y}
                stroke={TEAL}
                strokeWidth={1.5}
                markerEnd="url(#arrow-teal-cone)"
              />
            );
          })}

          {/* output box */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ transformOrigin: `${OUT_X + OUT_W / 2}px ${OUT_Y + OUT_H / 2}px` }}
          >
            <rect
              x={OUT_X}
              y={OUT_Y}
              width={OUT_W}
              height={OUT_H}
              rx={3}
              fill={TEAL}
              stroke={TEAL}
              strokeWidth={1.5}
            />
            <text
              x={OUT_X + OUT_W / 2}
              y={OUT_Y + OUT_H / 2 - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize={12}
              fontWeight={600}
              fill="#FAFAFA"
            >
              Next frame
            </text>
            <text
              x={OUT_X + OUT_W / 2}
              y={OUT_Y + OUT_H / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize={10.5}
              fill="#FAFAFA"
              opacity={0.9}
            >
              (GWM-1)
            </text>
          </motion.g>
        </svg>
      </div>

      <figcaption className="mx-auto mt-4 max-w-[56ch] text-center font-serif text-[0.95rem] italic leading-snug text-mute">
        Everything the model conditions on to predict frame N+1.
      </figcaption>
    </motion.figure>
  );
}
