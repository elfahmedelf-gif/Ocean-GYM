import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
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
      </div>
    </main>
  );
}
