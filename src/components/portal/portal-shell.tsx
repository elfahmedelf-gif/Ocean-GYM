"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Dumbbell, Loader2, LogOut } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster richColors position="top-center" dir="rtl" />

      <header className="glass sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
          <Link
            href="/portal"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="بوابة الأعضاء — الصفحة الرئيسية"
          >
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="flex items-center gap-2 font-bold">
              <Dumbbell className="h-4 w-4 text-primary" aria-hidden="true" />
              بوابة الأعضاء
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 py-1 pl-3 pr-1.5"
              title={member.name}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                  {firstLetter}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
                {member.name}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-9 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
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

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
