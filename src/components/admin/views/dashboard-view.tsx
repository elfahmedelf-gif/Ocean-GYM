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
import type { StatsResponse } from "@/components/admin/types";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const STAT_CARDS = [
  {
    key: "totalMembers" as const,
    label: "إجمالي الأعضاء",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/25",
  },
  {
    key: "activeMembers" as const,
    label: "أعضاء نشطون",
    icon: UserCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/25",
  },
  {
    key: "pendingMembers" as const,
    label: "طلبات معلقة",
    icon: UserPlus,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/25",
  },
  {
    key: "monthlyRevenue" as const,
    label: "إيرادات شهرية تقديرية",
    icon: Banknote,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/25",
    format: (v: number) => `${v.toLocaleString("ar-EG")} ج.م`,
  },
  {
    key: "unreadMessages" as const,
    label: "رسائل غير مقروءة",
    icon: Mail,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/25",
  },
  {
    key: "totalClasses" as const,
    label: "عدد الكلاسات",
    icon: Dumbbell,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/25",
  },
  {
    key: "totalSlots" as const,
    label: "مواعيد الجدول",
    icon: CalendarDays,
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/25",
  },
  {
    key: "nutritionPlans" as const,
    label: "خطط التغذية",
    icon: UtensilsCrossed,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/25",
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
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          مرحبًا بك في لوحة تحكم <span className="text-gradient-ocean">Ocean GYM</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground" suppressHydrationWarning>
          {today || "جارٍ تحميل التاريخ..."}
        </p>
      </div>

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
            <Card key={card.key} className={`border ${card.bg} p-0`}>
              <CardContent className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <div
                  className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-background/40 ${card.color}`}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-3.5 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-xl md:text-2xl font-bold tabular-nums">
                        {display}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
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
                      className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-blue-500 transition-all duration-700"
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
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">أحدث الأعضاء</CardTitle>
            <Link
              href="/admin/members"
              className="text-sm font-medium text-primary hover:underline"
            >
              عرض الكل
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

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">آخر الرسائل</CardTitle>
            <Link
              href="/admin/messages"
              className="text-sm font-medium text-primary hover:underline"
            >
              عرض الكل
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
                          msg.read ? "bg-muted-foreground/40" : "bg-cyan-400"
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
                        <Badge className="bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
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
