"use client";

import { motion } from "framer-motion";

type Props = {
  id: string;
  number: number;
  caption: string;
};

export function VisualSlot({ id, number, caption }: Props) {
  return (
    <motion.figure
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="my-14 w-full"
    >
      <div
        role="img"
        aria-label={`Visual ${number}: ${caption}`}
        className="relative mx-auto flex aspect-[16/9] w-full items-center justify-center rounded-sm border-2 border-dashed border-accent/60 bg-white/50 px-8"
      >
        <div className="text-center">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
            Visual {number}
          </p>
          <p className="mx-auto mt-3 max-w-[38ch] font-serif text-[0.95rem] italic leading-snug text-mute">
            {caption}
          </p>
        </div>
      </div>
    </motion.figure>
  );
}
