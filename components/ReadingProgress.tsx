"use client";

import { motion, useScroll } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent"
    />
  );
}
