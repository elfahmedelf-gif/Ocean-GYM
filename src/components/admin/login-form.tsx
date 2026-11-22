"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, LogIn, User } from "lucide-react";

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
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="username"
            name="username"
            autoComplete="username"
            placeholder="أدخل اسم المستخدم"
            className="pr-9 h-11 bg-background/60"
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
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="أدخل كلمة المرور"
            className="pr-9 pl-10 h-11 bg-background/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-center text-sm text-muted-foreground">
        بيانات الدخول التجريبية:{" "}
        <span className="font-mono font-semibold text-primary" dir="ltr">
          admin / ocean123
        </span>
      </div>

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
