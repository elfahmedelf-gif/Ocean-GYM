"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, Eye, EyeOff, Loader2, Lock, LogIn, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { jsonPost } from "@/components/admin/api";
import type { AdminPayload } from "@/components/admin/types";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      await jsonPost<{ ok: boolean; admin: AdminPayload }>(
        "/api/admin/login",
        { username: username.trim(), password }
      );
      toast.success("تم تسجيل الدخول بنجاح — أهلًا بك من جديد");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          اسم المستخدم
        </Label>
        <div className="relative">
          <User
            className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="username"
            name="username"
            autoComplete="username"
            placeholder="أدخل اسم المستخدم"
            className="ps-9 h-11 bg-background/60"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          كلمة المرور
        </Label>
        <div className="relative">
          <Lock
            className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="أدخل كلمة المرور"
            className="ps-9 pe-10 h-11 bg-background/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute end-1 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            جارٍ تسجيل الدخول...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            تسجيل الدخول
          </>
        )}
      </Button>

      <details className="group rounded-lg border border-border/50 bg-background/30 text-sm">
        <summary className="flex cursor-pointer select-none list-none items-center justify-center gap-1.5 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg [&::-webkit-details-marker]:hidden">
          بيانات الدخول التجريبية
          <ChevronDown
            className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <p className="px-3 pb-3 text-center text-xs text-muted-foreground">
          <span className="font-mono font-semibold text-primary" dir="ltr">
            admin / ocean123
          </span>
        </p>
      </details>

      <div className="flex items-center justify-center gap-3 pt-1 text-xs text-muted-foreground">
        <Image
          src="/images/logo.png"
          alt="شعار Ocean GYM"
          width={22}
          height={22}
          className="rounded"
        />
        <span>لوحة تحكم Ocean GYM — إدارة النادي</span>
      </div>
    </form>
  );
}
