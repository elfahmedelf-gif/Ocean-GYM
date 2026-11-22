"use client";

import {
  BadgeInfo,
  CalendarDays,
  CreditCard,
  Flame,
  Info,
  Minus,
  Quote,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/portal/status-badge";
import {
  clamp,
  daysBetween,
  daysRemaining,
  formatDate,
  formatDelta,
} from "@/components/portal/format";
import { durationLabel, formatPrice } from "@/lib/gym";
import type { PortalMemberDetail } from "@/components/portal/types";

function QuickStat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1.5 text-xl font-bold">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function OverviewTab({ member }: { member: PortalMemberDetail }) {
  const firstName = member.name.trim().split(/\s+/)[0] ?? member.name;
  const logs = member.progressLogs;
  const latestLog = logs.length > 0 ? logs[0] : null;
  const oldestLog = logs.length > 0 ? logs[logs.length - 1] : null;

  const weightDelta =
    latestLog && oldestLog ? latestLog.weight - oldestLog.weight : null;

  const remaining = daysRemaining(member.endDate);
  const total =
    remaining !== null
      ? daysBetween(member.startDate, member.endDate) ??
        (member.plan ? member.plan.duration * 30 : null)
      : null;
  const pct =
    remaining !== null && total ? clamp((remaining / total) * 100, 0, 100) : null;
  const note = member.nutritionPlan?.notes ?? member.notes;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold">أهلاً بيك، {firstName}</h2>
        <StatusBadge status={member.status} />
      </div>

      {member.status === "expired" && (
        <Alert variant="destructive" role="alert">
          <BadgeInfo className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>انتهى اشتراكك</AlertTitle>
          <AlertDescription>جدد عند الاستقبال لتفعيل حسابك من جديد</AlertDescription>
        </Alert>
      )}

      {member.status === "pending" && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-300 [&>svg]:text-amber-400">
          <Info className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>طلبك قيد المراجعة</AlertTitle>
          <AlertDescription>سنتواصل معك قريبًا لتفعيل الاشتراك</AlertDescription>
        </Alert>
      )}

      {/* Subscription card */}
      <Card
        className={`overflow-hidden ${member.status === "active" ? "glass glow-cyan border-primary/30" : "bg-card/60"}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
            <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
            اشتراكك الحالي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {member.plan ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-bold md:text-2xl">
                    <span className="text-gradient-ocean">{member.plan.name}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {durationLabel(member.plan.duration)}
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(member.plan.price)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    تاريخ البداية
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(member.startDate)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    تاريخ الانتهاء
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(member.endDate)}
                  </p>
                </div>
              </div>

              {remaining !== null && total !== null && pct !== null && (
                <div className="space-y-2">
                  <Progress value={pct} aria-label="نسبة الاشتراك المتبقية" />
                  <p className="text-sm text-muted-foreground">
                    متبقي{" "}
                    <span className="font-bold text-primary" dir="ltr">
                      {remaining}
                    </span>{" "}
                    يوم من أصل{" "}
                    <span dir="ltr">{total}</span> يوم
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              لم يتم ربط اشتراك بحسابك بعد — راجع الاستقبال لاختيار الباقة المناسبة
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <QuickStat label="الوزن الحالي">
          {latestLog ? (
            <span>
              <span dir="ltr">{latestLog.weight}</span>{" "}
              <span className="text-sm font-medium text-muted-foreground">كجم</span>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </QuickStat>

        <QuickStat label="تغير الوزن">
          {weightDelta !== null ? (
            <span
              className={`inline-flex items-center gap-1.5 ${
                weightDelta > 0
                  ? "text-emerald-400"
                  : weightDelta < 0
                    ? "text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {weightDelta > 0 ? (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              ) : weightDelta < 0 ? (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Minus className="h-4 w-4" aria-hidden="true" />
              )}
              <span dir="ltr">{formatDelta(weightDelta)}</span>
              <span className="text-sm font-medium">كجم</span>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </QuickStat>

        <QuickStat label="سعرات خطتك">
          {member.nutritionPlan ? (
            <span className="inline-flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-400" aria-hidden="true" />
              <span dir="ltr">{member.nutritionPlan.calories}</span>
              <span className="text-sm font-medium text-muted-foreground">سعرة</span>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </QuickStat>

        <QuickStat label="باقة الاشتراك">
          {member.plan ? (
            <span className="text-base">{member.plan.name}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </QuickStat>
      </div>

      {/* Coach note */}
      {note && (
        <Card className="border-border/60 bg-card/40">
          <CardContent className="flex gap-3 p-4">
            <Quote
              className="mt-0.5 h-5 w-5 shrink-0 text-primary/60"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                ملاحظة من الكابتن
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {note}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
