"use client";

import type { ComponentType, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MEMBER_STATUSES, statusLabel } from "@/lib/gym";
import type { MemberStatus } from "@/components/admin/types";

/**
 * Shared building blocks for admin views:
 * PageHeader, StatusBadge, EmptyState, Field, plus shared class constants.
 */

// ===== Shared class constants =====

/** Destructive outline button (delete triggers in tables/cards). */
export const DANGER_BUTTON_CLASS =
  "text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10";

/** Destructive solid confirm button (AlertDialogAction inside ConfirmDialog). */
export const DANGER_CONFIRM_CLASS =
  "bg-destructive text-destructive-foreground hover:bg-destructive/90";

// ===== Page header =====

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        {/* Luxury icon tile — ocean gradient fill + gold hairline cap */}
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent text-primary ring-1 ring-inset ring-primary/40 shadow-[0_8px_22px_rgba(56,199,232,0.22)]"
          aria-hidden="true"
        >
          <span className="absolute inset-x-2 top-0 h-px bg-gradient-to-l from-transparent via-[#e2bd62]/60 to-transparent" />
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden="true" className="h-px w-5 bg-gradient-to-l from-primary/60 to-transparent" />
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}

// ===== Member status badge =====

const STATUS_BADGE_CLASS: Record<MemberStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  expired: "bg-red-500/15 text-red-400 border-red-500/30",
  frozen: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_BADGE_CLASS[status as MemberStatus] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 gap-1.5", cls)}>
      {/* Leading dot echoes the badge color for a quick-glance status signal */}
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </Badge>
  );
}

// ===== Empty state =====

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center justify-center gap-4 py-16 px-6 text-center rounded-2xl border border-dashed border-primary/25",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-transparent text-primary/70 ring-1 ring-inset ring-primary/30"
      >
        <span className="ring-dashed absolute -inset-2 opacity-50" />
        <Icon className="h-7 w-7" />
      </span>
      <p className="font-bold">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}

// ===== Form field wrapper (for dialog forms) =====

export function Field({
  label,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label} {required && "*"}
      </Label>
      {children}
    </div>
  );
}
