"use client";

import {
  Activity,
  Minus,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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
import { formatDelta, formatShortDate } from "@/components/portal/format";
import type { ProgressLogItem } from "@/components/portal/types";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";

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
      style={{ backgroundColor: "#0a1630", color: "#e2e8f0" }}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold text-primary">
        <span dir="ltr">{typeof value === "number" ? value : "—"}</span> كجم
      </p>
    </div>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1.5 text-xl font-bold">{children}</div>
      </CardContent>
    </Card>
  );
}

function MeasurementCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">—</span>;
  return <span dir="ltr">{value}</span>;
}

export default function ProgressTab({ logs }: { logs: ProgressLogItem[] }) {
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
  const tableLogs = logs.slice(0, 6);

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
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,199,232,0.12)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8ea0bd", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(56,199,232,0.2)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "#8ea0bd", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(56,199,232,0.2)" }}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<WeightTooltip />} cursor={{ stroke: "rgba(56,199,232,0.3)" }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="الوزن"
                  stroke="#38c7e8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#38c7e8", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#38c7e8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="الوزن الحالي">
          <span dir="ltr">{latest.weight}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground">كجم</span>
        </StatCard>
        <StatCard label="الوزن المبدئي">
          <span dir="ltr">{oldest.weight}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground">كجم</span>
        </StatCard>
        <StatCard label="التغير الكلي">
          <span
            className={`inline-flex items-center gap-1.5 ${
              delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-muted-foreground"
            }`}
          >
            {delta > 0 ? (
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            ) : delta < 0 ? (
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Minus className="h-4 w-4" aria-hidden="true" />
            )}
            <span dir="ltr">{formatDelta(delta)}</span>
            <span className="text-sm font-medium">كجم</span>
          </span>
        </StatCard>
        <StatCard label="نسبة الدهون الحالية">
          {latest.fatPercent !== null ? (
            <span dir="ltr">{latest.fatPercent}%</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </StatCard>
      </div>

      {/* Measurements table */}
      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الوزن (كجم)</TableHead>
                <TableHead className="text-right">الدهون %</TableHead>
                <TableHead className="text-right">العضلات</TableHead>
                <TableHead className="text-right">الخصر</TableHead>
                <TableHead className="text-right">الصدر</TableHead>
                <TableHead className="text-right">الذراع</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
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
    </div>
  );
}
