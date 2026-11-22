"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  Apple,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/components/portal/api";
import EmptyState from "@/components/portal/empty-state";
import OverviewTab from "@/components/portal/overview-tab";
import NutritionTab from "@/components/portal/nutrition-tab";
import ProgressTab from "@/components/portal/progress-tab";
import type {
  PortalMemberDetail,
  PortalMeResponse,
} from "@/components/portal/types";

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="جارٍ التحميل">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const [member, setMember] = useState<PortalMemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<PortalMeResponse>("/api/portal/me");
        if (!cancelled) setMember(res.member);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        if (!cancelled) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function handleRetry() {
    setMember(null);
    setError(null);
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  if (loading) return <DashboardSkeleton />;

  if (error || !member) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          <span>{error ?? "تعذر تحميل بياناتك"}</span>
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            إعادة المحاولة
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="overview" dir="rtl" className="space-y-6">
      <TabsList className="grid h-auto w-full grid-cols-3 bg-card/60 p-1">
        <TabsTrigger
          value="overview"
          className="gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          نظرة عامة
        </TabsTrigger>
        <TabsTrigger
          value="nutrition"
          className="gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Apple className="h-4 w-4" aria-hidden="true" />
          نظامي الغذائي
        </TabsTrigger>
        <TabsTrigger
          value="progress"
          className="gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Activity className="h-4 w-4" aria-hidden="true" />
          متابعتي
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab member={member} />
      </TabsContent>

      <TabsContent value="nutrition">
        {member.nutritionPlan ? (
          <NutritionTab plan={member.nutritionPlan} />
        ) : (
          <EmptyState
            icon={Apple}
            title="لم يتم إسناد خطة غذائية لك بعد"
            description="اطلبها من الكابتن في الجيم"
          />
        )}
      </TabsContent>

      <TabsContent value="progress">
        <ProgressTab logs={member.progressLogs} />
      </TabsContent>
    </Tabs>
  );
}
