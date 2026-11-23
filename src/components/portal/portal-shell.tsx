"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { ArrowRight, Dumbbell, Loader2, LogOut, Waves } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { jsonPost } from "@/components/portal/api";
import type { PortalMemberSession } from "@/components/portal/types";

export default function PortalShell({
  member,
  children,
}: {
  member: PortalMemberSession;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const firstLetter = member.name.trim().charAt(0).toUpperCase() || "ع";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await jsonPost<{ ok: boolean }>("/api/portal/logout", {});
      toast.success("تم تسجيل الخروج — مع السلامة");
      router.replace("/portal/login");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      toast.error(message);
      setLoggingOut(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Toaster richColors position="top-center" dir="rtl" />

      {/* Ambient ocean backdrop — blueprint grid + drifting glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid-ocean absolute inset-0" />
        <div className="absolute -top-28 start-[12%] size-[360px] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute bottom-[-110px] end-[5%] size-[320px] rounded-full bg-[#1e6fe8]/[0.07] blur-3xl" />
      </div>

      <header className="glass sticky top-0 z-40 border-b border-border/60">
        {/* Gradient hairline under the glass bar */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent"
        />
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
          <Link
            href="/portal"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="بوابة الأعضاء — الصفحة الرئيسية"
          >
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={36}
              height={36}
              className="ocean-ring h-9 w-9 rounded-lg object-contain transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
            />
            <span className="flex items-center gap-2 font-bold">
              <Dumbbell className="h-4 w-4 text-primary" aria-hidden="true" />
              بوابة الأعضاء
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-10 gap-1.5 px-2 text-sm text-muted-foreground hover:text-foreground md:px-3"
            >
              <Link href="/" aria-label="العودة إلى الموقع الرئيسي">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">العودة إلى الموقع</span>
              </Link>
            </Button>

            <div
              className="flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#1e6fe8] p-[2px] shadow-[0_4px_14px_rgba(56,199,232,0.35)]"
              title={member.name}
            >
              <span className="flex items-center gap-2 rounded-full bg-background py-0.5 pe-3 ps-1">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                    {firstLetter}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
                  {member.name}
                </span>
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-10 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="تسجيل الخروج من البوابة"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden md:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        {children}
      </main>

      {/* Sticky luxury footer — waves marker + copyright, respects safe areas */}
      <footer className="relative mt-auto border-t border-primary/10 bg-[#081228]/70">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent"
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row md:px-6">
          <p className="flex items-center gap-2">
            <Waves className="size-3.5 text-primary/70" aria-hidden="true" />
            © {new Date().getFullYear()} Ocean GYM — بوابة الأعضاء
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight className="size-3.5" aria-hidden="true" />
            العودة إلى الموقع
          </Link>
        </div>
      </footer>
    </div>
  );
}
