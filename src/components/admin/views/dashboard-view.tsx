"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  Dumbbell,
  Mail,
  UserCheck,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/components/admin/api";
import { StatusBadge } from "@/components/admin/shared";
import { spotlightProps } from "@/components/site/spotlight";
import { formatDate } from "@/lib/gym";
import type { StatsResponse } from "@/components/admin/types";

/** Neutral card + colored icon chip (semantic colors, brand primary for members/classes). */
const CHIP = {
  primary: "bg-primary/15 text-primary border-primary/25",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
} as const;

/**
 * Dashboard welcome header — greeting chip with the gold diamond marker,
 * live date, and a gradient hairline melting into the content below.
 */
function FadeHeader({ today }: { today: string }) {
  return (
    <div className="relative">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            مرحبًا بك في لوحة تحكم{" "}
            <span className="text-gradient-ocean text-glow">Ocean GYM</span>
          </h1>
          <p
            className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground"
            suppressHydrationWarning
          >
            <span
              aria-hidden="true"
              className="size-1.5 rotate-45 rounded-[1px] bg-gradient-to-br from-[#f3ddab] to-[#c9962e] dot-gold"
            />
            {today || "جارٍ تحميل التاريخ..."}
          </p>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="mt-4 block h-px w-full bg-gradient-to-l from-transparent via-primary/30 to-transparent"
      />
    </div>
  );
}

const STAT_CARDS = [
  {
    key: "totalMembers" as const,
    label: "إجمالي الأعضاء",
    icon: Users,
    chip: CHIP.primary,
  },
  {
    key: "activeMembers" as const,
    label: "أعضاء نشطون",
    icon: UserCheck,
    chip: CHIP.emerald,
  },
  {
    key: "pendingMembers" as const,
    label: "طلبات معلقة",
    icon: UserPlus,
    chip: CHIP.amber,
  },
  {
    key: "monthlyRevenue" as const,
    label: "إيرادات شهرية تقديرية",
    icon: Banknote,
    chip: CHIP.emerald,
    format: (v: number) => `${v.toLocaleString("ar-EG")} ج.م`,
  },
  {
    key: "unreadMessages" as const,
    label: "رسائل غير مقروءة",
    icon: Mail,
    chip: CHIP.red,
  },
  {
    key: "totalClasses" as const,
    label: "عدد الكلاسات",
    icon: Dumbbell,
    chip: CHIP.primary,
  },
  {
    key: "totalSlots" as const,
    label: "مواعيد الجدول",
    icon: CalendarDays,
    chip: CHIP.violet,
  },
  {
    key: "nutritionPlans" as const,
    label: "خطط التغذية",
    icon: UtensilsCrossed,
    chip: CHIP.amber,
  },
];

export default function DashboardView() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<StatsResponse>("/api/admin/stats");
        if (cancelled) return;
        setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) {
          setToday(
            new Date().toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxDistribution = Math.max(
    1,
    ...(stats?.planDistribution.map((d) => d.count) ?? [1])
  );

  return (
    <div className="space-y-6">
      {/* Header — greeting chip + gradient hairline underline */}
      <FadeHeader today={today} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats ? stats[card.key] : null;
          const display =
            value === null
              ? null
              : "format" in card && card.format
                ? card.format(value as number)
                : String(value);
          return (
            <Card
              key={card.key}
              className="card-sheen card-spotlight group relative overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              {...spotlightProps}
            >
              {/* Gradient edge sweeping across the top on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-10 h-[3px] origin-right scale-x-0 bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
              />
              <CardContent className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <span
                  className={`flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${card.chip}`}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-3.5 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-xl md:text-2xl font-black tabular-nums text-gradient-value">
                        {display}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate transition-colors duration-300 group-hover:text-foreground/80">
                        {card.label}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plan distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">توزيع الأعضاء النشطين على الباقات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-8 w-3/5" />
            </div>
          ) : !stats || stats.planDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              لا يوجد أعضاء نشطون مشتركون في باقات حاليًا.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.planDistribution.map((d) => (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {d.count} {d.count === 1 ? "عضو" : "أعضاء"}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-primary via-primary/80 to-[#1e6fe8]/60 shadow-[0_0_12px_rgba(56,199,232,0.45)] transition-all duration-700"
                      style={{ width: `${(d.count / maxDistribution) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={d.count}
                      aria-valuemin={0}
                      aria-valuemax={maxDistribution}
                      aria-label={`${d.name}: ${d.count} أعضاء`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent members + recent messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span aria-hidden="true" className="h-4 w-1 rounded-full bg-gradient-to-b from-primary to-[#1e6fe8]" />
              أحدث الأعضاء
            </CardTitle>
            <Link
              href="/admin/members"
              className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              عرض الكل
              <span aria-hidden="true" className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !stats || stats.recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">لا يوجد أعضاء بعد.</p>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الباقة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentMembers.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {m.plan?.name ?? "بدون باقة"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={m.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                          {formatDate(m.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span aria-hidden="true" className="h-4 w-1 rounded-full bg-gradient-to-b from-primary to-[#1e6fe8]" />
              آخر الرسائل
            </CardTitle>
            <Link
              href="/admin/messages"
              className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              عرض الكل
              <span aria-hidden="true" className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !stats || stats.recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                لا توجد رسائل بعد.
              </p>
            ) : (
              <ul className="space-y-1">
                {stats.recentMessages.map((msg, idx) => (
                  <li key={msg.id}>
                    {idx > 0 && <Separator className="mb-1 opacity-50" />}
                    <Link
                      href="/admin/messages"
                      className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          msg.read ? "bg-muted-foreground/40" : "bg-primary"
                        }`}
                        aria-label={msg.read ? "مقروءة" : "غير مقروءة"}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm truncate ${
                            msg.read
                              ? "text-muted-foreground"
                              : "font-semibold text-foreground"
                          }`}
                        >
                          {msg.subject || "بدون عنوان"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {msg.name} · {formatDate(msg.createdAt)}
                        </p>
                      </div>
                      {!msg.read && (
                        <Badge className="bg-primary/15 text-primary border border-primary/30">
                          جديدة
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
