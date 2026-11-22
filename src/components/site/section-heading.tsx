"use client";

import type { ReactNode } from "react";
import { Waves } from "lucide-react";
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
      <span className="glass ocean-ring inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold text-primary">
        <Waves className="size-3.5" aria-hidden="true" />
        <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-transparent to-primary/60" />
        {kicker}
        <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-primary/60 to-transparent" />
      </span>
      <h2
        id={headingId}
        className="text-3xl font-extrabold leading-tight md:text-5xl md:leading-tight"
      >
        {title}
      </h2>
      {/* Gradient accent bar under the title — symmetric so it reads the same in RTL */}
      <span
        aria-hidden="true"
        className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      {subtitle ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </FadeUp>
  );
}
