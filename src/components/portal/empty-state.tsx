import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/25 px-6 py-14 text-center">
      <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-transparent text-primary ring-1 ring-inset ring-primary/35">
        <span className="ring-dashed absolute -inset-2.5 opacity-60" aria-hidden="true" />
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="text-base font-bold">{title}</p>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
