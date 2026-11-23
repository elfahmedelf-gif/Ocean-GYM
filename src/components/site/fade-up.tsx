"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Fade-up-on-scroll wrapper (runs once when the element enters the viewport).
 * When the user prefers reduced motion, children render immediately with
 * no translate/opacity animation.
 */
export function FadeUp({ children, className, delay = 0, y = 24 }: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
