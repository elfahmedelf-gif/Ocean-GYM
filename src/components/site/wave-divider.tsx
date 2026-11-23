import { cn } from "@/lib/utils";

type WaveVariant = 1 | 2 | 3;

/** Three hand-tuned crests so consecutive dividers never look copy-pasted. */
const PATHS: Record<WaveVariant, string> = {
  1: "M0,48 C240,88 480,8 720,42 C960,76 1200,24 1440,52 L1440,90 L0,90 Z",
  2: "M0,56 C180,20 380,80 660,52 C900,28 1140,72 1440,40 L1440,90 L0,90 Z",
  3: "M0,40 C260,76 520,18 780,50 C1040,82 1240,30 1440,58 L1440,90 L0,90 Z",
};

interface WaveDividerProps {
  variant?: WaveVariant;
  /** Mirrors the wave vertically (used when anchored to a section bottom). */
  flip?: boolean;
  className?: string;
}

/**
 * Ocean wave divider. Anchored to the TOP edge of a section and colored with
 * the PREVIOUS section's background (via `text-*`), it melts the two sections
 * into one continuous shoreline. Pure SVG — a few hundred bytes, no runtime.
 */
export function WaveDivider({ variant = 1, flip = false, className }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        focusable="false"
        className={cn("block h-[44px] w-full md:h-[64px]", flip && "-scale-y-100")}
      >
        <path d={PATHS[variant]} fill="currentColor" />
      </svg>
    </div>
  );
}
