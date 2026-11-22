"use client";

import { useState } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Flag,
  Minus,
  Percent,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/portal/empty-state";
import StatCard, { weightDeltaTone } from "@/components/portal/stat-card";
import { formatDelta, formatShortDate } from "@/components/portal/format";
import type { ProgressLogItem } from "@/components/portal/types";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";

/**
 * Recharts SVG props need concrete colors — kept in sync with the brand
 * palette / CSS vars (--foreground, --muted-foreground, --card, --chart-1).
 */
const CHART = {
  foreground: "#e8f1f8",
  muted: "#8fa6bf",
  card: "#0a1630",
  primary: "#38c7e8",
  grid: "rgba(56, 199, 232, 0.12)",
  axis: "rgba(56, 199, 232, 0.2)",
  cursor: "rgba(56, 199, 232, 0.3)",
} as const;

interface WeightPoint {
  date: string;
  weight: number;
}

function WeightTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value;
  return (
    <div
      dir="rtl"
      className="rounded-lg border border-primary/40 px-3 py-2 text-sm shadow-lg"
      style={{ backgroundColor: CHART.card, color: CHART.foreground }}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold text-primary">
        <span dir="ltr">{typeof value === "number" ? value : "—"}</span> كجم
      </p>
    </div>
  );
}

function MeasurementCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">—</span>;
  return <span dir="ltr">{value}</span>;
}

export default function ProgressTab({
  logs,
  goal = null,
}: {
  logs: ProgressLogItem[];
  /** Nutrition-plan goal used to interpret weight changes (cut/bulk/...). */
  goal?: string | null;
}) {
  const [showAll, setShowAll] = useState(false);

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="لا توجد قياسات مسجلة بعد"
        description="الكابتن هيسجل قياساتك في أول جلسة متابعة"
      />
    );
  }

  // API returns logs newest-first; chart needs chronological order.
  const chartData: WeightPoint[] = [...logs]
    .reverse()
    .map((log) => ({ date: formatShortDate(log.date), weight: log.weight }));

  const latest = logs[0];
  const oldest = logs[logs.length - 1];
  const delta = latest.weight - oldest.weight;

  const LATEST_ROWS = 6;
  const hasMoreRows = logs.length > LATEST_ROWS;
  const tableLogs = showAll ? logs : logs.slice(0, LATEST_ROWS);

  return (
    <div className="space-y-6">
      {/* Weight chart */}
      <Card className="glass border-primary/20">
        <CardContent className="p-4 md:p-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            تطور الوزن عبر الزمن (كجم)
          </p>
          <div dir="ltr" className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: CHART.muted, fontSize: 12 }}
                  axisLine={{ stroke: CHART.axis }}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: CHART.muted, fontSize: 12 }}
                  axisLine={{ stroke: CHART.axis }}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<WeightTooltip />} cursor={{ stroke: CHART.cursor }} />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="الوزن"
                  stroke={CHART.primary}
                  strokeWidth={2.5}
                  fill="url(#weightAreaFill)"
                  dot={{ r: 4, fill: CHART.primary, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: CHART.primary, stroke: CHART.card, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Scale}
          label="الوزن الحالي"
          hint={`آخر قياس: ${formatShortDate(latest.date)}`}
          value={
            <span>
              <span dir="ltr">{latest.weight}</span>{" "}
              <span className="text-sm font-medium text-muted-foreground">كجم</span>
            </span>
          }
        />
        <StatCard
          icon={Flag}
          label="الوزن المبدئي"
          hint={`أول قياس: ${formatShortDate(oldest.date)}`}
          value={
            <span>
              <span dir="ltr">{oldest.weight}</span>{" "}
              <span className="text-sm font-medium text-muted-foreground">كجم</span>
            </span>
          }
        />
        <StatCard
          icon={delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus}
          label="التغير الكلي"
          tone={weightDeltaTone(delta, goal)}
          value={
            <span className="inline-flex items-baseline gap-1">
              <span dir="ltr">{formatDelta(delta)}</span>
              <span className="text-sm font-medium">كجم</span>
            </span>
          }
        />
        <StatCard
          icon={Percent}
          label="نسبة الدهون الحالية"
          value={
            latest.fatPercent !== null ? (
              <span dir="ltr">{latest.fatPercent}%</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
      </div>

      {/* Measurements table */}
      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead className="text-start">التاريخ</TableHead>
                <TableHead className="text-start">الوزن (كجم)</TableHead>
                <TableHead className="text-start">الدهون %</TableHead>
                <TableHead className="text-start">العضلات</TableHead>
                <TableHead className="text-start">الخصر</TableHead>
                <TableHead className="text-start">الصدر</TableHead>
                <TableHead className="text-start">الذراع</TableHead>
                <TableHead className="text-start">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableLogs.map((log) => (
                <TableRow key={log.id} className="border-border/40">
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatShortDate(log.date)}
                  </TableCell>
                  <TableCell><MeasurementCell value={log.weight} /></TableCell>
                  <TableCell><MeasurementCell value={log.fatPercent} /></TableCell>
                  <TableCell><MeasurementCell value={log.muscleMass} /></TableCell>
                  <TableCell><MeasurementCell value={log.waist} /></TableCell>
                  <TableCell><MeasurementCell value={log.chest} /></TableCell>
                  <TableCell><MeasurementCell value={log.arm} /></TableCell>
                  <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                    {log.notes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {hasMoreRows && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="min-h-11 gap-1.5 px-4 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary"
          >
            {showAll ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
            {showAll ? "عرض أقل" : `عرض الكل (${logs.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}
