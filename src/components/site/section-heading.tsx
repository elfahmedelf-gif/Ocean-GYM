"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeUp } from "./fade-up";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  headingId?: string;
  align?: "center" | "start";
  /** Optional editorial ghost number rendered behind the header (e.g. "01"). */
  ghostNumber?: string;
}

/**
 * Premium kicker pill — live pulse dot + fading gradient whiskers.
 * Shared visual language across every section header.
 */
function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="glass ocean-ring inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-primary">
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 [animation-duration:2.4s]" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-transparent to-primary/60" />
      {children}
      <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-primary/60 to-transparent" />
    </span>
  );
}

/** Standard section header: ghost number + kicker pill + big black-weight title + glowing accent bar + subtitle. */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  headingId,
  align = "center",
  ghostNumber,
}: SectionHeadingProps) {
  return (
    <FadeUp
      className={cn(
        "relative mb-12 flex flex-col gap-4 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-start"
      )}
    >
      {ghostNumber ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-8 select-none font-black leading-none text-primary/[0.07] md:-top-10",
            "text-[clamp(3.5rem,9vw,6rem)]",
            align === "center"
              ? "left-1/2 -translate-x-1/2"
              : "start-0"
          )}
        >
          {ghostNumber}
        </span>
      ) : null}
      <Kicker>{kicker}</Kicker>
      <h2
        id={headingId}
        className="text-balance text-3xl font-black leading-[1.25] sm:text-4xl md:text-5xl md:leading-[1.25]"
      >
        {title}
      </h2>
      {/* Glowing accent bar — symmetric so it reads the same in RTL, with a hot center dot */}
      <span
        aria-hidden="true"
        className="relative h-[3px] w-28 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      >
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(56,199,232,0.9)]" />
      </span>
      {subtitle ? (
        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </FadeUp>
  );
}
