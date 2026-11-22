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
    <main className="bg-ocean-gradient min-h-screen flex items-center justify-center p-4">
      <Toaster richColors position="top-center" dir="rtl" />

      <div className="w-full max-w-md">
        <div className="glass glow-cyan rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={96}
              height={96}
              className="h-24 w-auto object-contain"
              priority
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-gradient-ocean">لوحة تحكم Ocean GYM</span>
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
