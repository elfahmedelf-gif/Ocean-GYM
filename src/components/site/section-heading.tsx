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
}

/** Standard section header: small cyan kicker pill + big bold title + muted subtitle. */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  headingId,
  align = "center",
}: SectionHeadingProps) {
  return (
    <FadeUp
      className={cn(
        "mb-12 flex flex-col gap-4 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-start"
      )}
    >
      <span className="ocean-ring inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
        <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
        {kicker}
      </span>
      <h2
        id={headingId}
        className="text-3xl font-extrabold leading-tight md:text-5xl md:leading-tight"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </FadeUp>
  );
}
