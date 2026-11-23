"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, LogIn, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { jsonPost } from "@/components/portal/api";
import type { PortalLoginResponse } from "@/components/portal/types";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !accessCode.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني وكود الدخول");
      return;
    }

    setLoading(true);
    try {
      await jsonPost<PortalLoginResponse>("/api/portal/login", {
        email: email.trim(),
        accessCode: accessCode.trim(),
      });
      toast.success("تم تسجيل الدخول بنجاح — أهلًا بيك");
      router.replace("/portal");
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
        <Label htmlFor="email" className="text-sm font-medium">
          البريد الإلكتروني
        </Label>
        <div className="relative">
          <Mail
            className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            dir="ltr"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 bg-background/60 ps-3 pe-9 text-start"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessCode" className="text-sm font-medium">
          كود الدخول
        </Label>
        <div className="relative">
          <KeyRound
            className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="accessCode"
            name="accessCode"
            dir="ltr"
            autoComplete="off"
            placeholder="OC-0000"
            className="h-11 bg-background/60 ps-3 pe-9 font-mono text-start tracking-widest"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            disabled={loading}
            required
            aria-describedby="access-code-hint"
          />
        </div>
        <p id="access-code-hint" className="text-xs text-muted-foreground">
          الكود الذي استلمته من الاستقبال — مثل{" "}
          <span className="font-mono" dir="ltr">
            OC-1234
          </span>
        </p>
      </div>

      <Button
        type="submit"
        className="btn-gradient glow-cyan-strong shimmer h-11 w-full text-base font-bold"
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
            دخول البوابة
          </>
        )}
      </Button>

      <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-center text-xs leading-relaxed text-muted-foreground">
        بيانات تجريبية للتجربة:{" "}
        <span className="font-mono font-semibold text-primary" dir="ltr">
          mohamed@example.com / OC-2024
        </span>
      </div>
    </form>
  );
}
