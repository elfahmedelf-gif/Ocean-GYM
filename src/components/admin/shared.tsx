"use client";

import type { ComponentType, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MEMBER_STATUSES, statusLabel } from "@/lib/gym";
import type { MemberStatus } from "@/components/admin/types";

/**
 * Shared building blocks for admin views:
 * PageHeader, StatusBadge, EmptyState, Field.
 */

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
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-400"
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
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
    <Badge variant="outline" className={cls}>
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
        "flex flex-col items-center justify-center gap-3 py-16 px-6 text-center rounded-xl border border-dashed bg-card",
        className
      )}
    >
      <Icon className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
      <p className="text-muted-foreground font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground/80">{description}</p>}
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
