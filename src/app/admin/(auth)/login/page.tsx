import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Toaster } from "sonner";

import { getCurrentAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | لوحة تحكم Ocean GYM",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="bg-ocean-gradient relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Ambient ocean glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -top-24 start-[10%] size-96 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-pulse-glow absolute bottom-[-80px] end-[8%] size-80 rounded-full bg-[#1e6fe8]/10 blur-3xl"
          style={{ animationDelay: "1.6s" }}
        />
      </div>
      <Toaster richColors position="top-center" dir="rtl" />

      <div className="relative w-full max-w-md">
        <div className="glass ocean-ring glow-cyan space-y-6 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={96}
              height={96}
              className="h-24 w-auto object-contain"
              priority
            />
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
              <span className="text-gradient-ocean text-glow">لوحة تحكم Ocean GYM</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              سجّل الدخول لإدارة الأعضاء والكلاسات والباقات
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            الرجوع إلى الموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
