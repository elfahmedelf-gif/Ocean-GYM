"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface CounterProps {
  to: number;
  prefix?: string;
  /** Animation duration in seconds. */
  duration?: number;
}

/** Animated counter that counts up once it scrolls into view. */
export function Counter({ to, prefix = "", duration = 1.8 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {prefix}
      {value}
    </span>
  );
}
