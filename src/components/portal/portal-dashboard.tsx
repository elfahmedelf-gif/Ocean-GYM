"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

/** Shared active-state styling for the three tab triggers (single source of truth). */
const TRIGGER_CLASS =
  "min-h-11 gap-2 py-2.5 sm:min-h-10 rounded-xl font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-[#1e6fe8] data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground";

/** Subtle fade-up on tab content mount — skipped when reduced motion is preferred. */
function TabFadeIn({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

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
      <h1 className="sr-only">بوابة أعضاء Ocean GYM</h1>

      <TabsList className="tabbar-glass grid h-auto w-full grid-cols-3 rounded-2xl p-1.5">
        <TabsTrigger value="overview" className={TRIGGER_CLASS}>
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          نظرة عامة
        </TabsTrigger>
        <TabsTrigger value="nutrition" className={TRIGGER_CLASS}>
          <Apple className="h-4 w-4" aria-hidden="true" />
          نظامي الغذائي
        </TabsTrigger>
        <TabsTrigger value="progress" className={TRIGGER_CLASS}>
          <Activity className="h-4 w-4" aria-hidden="true" />
          متابعتي
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <TabFadeIn>
          <OverviewTab member={member} />
        </TabFadeIn>
      </TabsContent>

      <TabsContent value="nutrition">
        <TabFadeIn>
          {member.nutritionPlan ? (
            <NutritionTab plan={member.nutritionPlan} />
          ) : (
            <EmptyState
              icon={Apple}
              title="لم يتم إسناد خطة غذائية لك بعد"
              description="اطلبها من الكابتن في الجيم"
            />
          )}
        </TabFadeIn>
      </TabsContent>

      <TabsContent value="progress">
        <TabFadeIn>
          <ProgressTab
            logs={member.progressLogs}
            goal={member.nutritionPlan?.goal ?? null}
          />
        </TabFadeIn>
      </TabsContent>
    </Tabs>
  );
}
