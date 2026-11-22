"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient progress bar fixed to the top edge of the viewport (RTL-safe). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right bg-gradient-to-l from-[#1e6fe8] via-primary to-[#7dd8f0]"
    />
  );
}
