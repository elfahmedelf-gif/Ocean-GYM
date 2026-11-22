import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Toaster } from "sonner";

import { getCurrentPortalMember } from "@/lib/portal-auth";
import LoginForm from "@/components/portal/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | بوابة أعضاء Ocean GYM",
};

export default async function PortalLoginPage() {
  const member = await getCurrentPortalMember();
  if (member) redirect("/portal");

  return (
    <main className="bg-ocean-gradient flex min-h-screen items-center justify-center p-4">
      <Toaster richColors position="top-center" dir="rtl" />

      <div className="w-full max-w-md">
        <div className="glass glow-cyan space-y-6 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={96}
              height={96}
              className="h-24 w-auto object-contain"
              priority
            />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              <span className="text-gradient-ocean">بوابة أعضاء Ocean GYM</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              تابع اشتراكك ونظامك الغذائي ونتائجك
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 bg-background/40 px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة للموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
