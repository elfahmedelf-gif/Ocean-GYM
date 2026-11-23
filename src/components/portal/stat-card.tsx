"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Visual tone applied to a stat's value text and its icon chip. */
export type StatTone =
  | "default" // regular foreground
  | "primary" // brand cyan
  | "positive" // emerald (favorable movement)
  | "negative" // red (unfavorable movement, only used when goal is unknown)
  | "muted"; // muted-foreground (no data / ambiguous)

const CHIP_TONES: Record<StatTone, string> = {
  default: "bg-primary/10 text-primary",
  primary: "bg-primary/10 text-primary",
  muted: "bg-primary/10 text-primary",
  positive: "bg-emerald-500/10 text-emerald-400",
  negative: "bg-red-500/10 text-red-400",
};

const VALUE_TONES: Record<StatTone, string> = {
  default: "text-foreground",
  primary: "text-primary",
  muted: "text-muted-foreground",
  positive: "text-emerald-400",
  negative: "text-red-400",
};

interface StatCardProps {
  /** Optional leading icon rendered inside a subtle rounded chip. */
  icon?: LucideIcon;
  /** Small overline label, e.g. "الوزن الحالي". */
  label: string;
  /** Main value node — wrap numerals in dir="ltr" at the call site. */
  value: ReactNode;
  /** Optional one-line supporting hint under the value. */
  hint?: string;
  /** Color treatment for the value and icon chip. Defaults to "default". */
  tone?: StatTone;
}

/** Shared stat tile for the portal overview/progress tabs. */
export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: StatCardProps) {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                CHIP_TONES[tone]
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
        <div
          className={cn("mt-2 text-xl font-bold leading-snug", VALUE_TONES[tone])}
        >
          {value}
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

/**
 * Goal-aware tone for a weight delta:
 * - "cut" goal → losing weight is favorable (emerald)
 * - "bulk" goal → gaining weight is favorable (emerald)
 * - maintain/healthy or opposite direction → muted, arrow still shows direction
 * - no goal available in the data → keeps the legacy up=emerald / down=red
 */
export function weightDeltaTone(delta: number, goal?: string | null): StatTone {
  if (delta === 0) return "muted";
  if (goal) {
    if (goal === "bulk" && delta > 0) return "positive";
    if (goal === "cut" && delta < 0) return "positive";
    return "muted";
  }
  return delta > 0 ? "positive" : "negative";
}
