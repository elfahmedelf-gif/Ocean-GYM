import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/gym";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  active: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  expired: "border-red-500/40 bg-red-500/10 text-red-400",
  frozen: "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={cn(style, "rounded-full font-semibold")}>
      {statusLabel(status)}
    </Badge>
  );
}
