"use client";

import { useState } from "react";
import { CircleCheckBig, LoaderCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SITE } from "@/lib/site";
import { formatPriceDigits } from "@/lib/gym";
import { FadeUp } from "./fade-up";
import { useJoinStore } from "./store";
import type { PlanView } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s-]{8,14}$/;

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const BENEFITS = [
  "حصة تقييم لياقة مجانية مع مدرب معتمد",
  "خطة تدريب وتغذية مصممة حسب هدفك",
  "متابعة دورية لقياس تقدمك وتعديل البرنامج",
];

export function JoinSection({ plans }: { plans: PlanView[] }) {
  const { toast } = useToast();
  const planId = useJoinStore((s) => s.planId);
  const setPlanId = useJoinStore((s) => s.setPlanId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "الاسم الكامل مطلوب";
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!phone.trim()) next.phone = "رقم الهاتف مطلوب";
    else if (!PHONE_REGEX.test(phone.trim())) next.phone = "رقم الهاتف غير صحيح";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, planId: planId || null, notes }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 201) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
        setPlanId(null);
      } else {
        toast({
          title: "تعذر إرسال الطلب",
          description: data.error ?? "حدث خطأ غير متوقع، حاول مرة أخرى",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "تعذر إرسال الطلب",
        description: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="join" aria-labelledby="join-title" className="relative scroll-mt-24 overflow-hidden py-16 md:py-24">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute -top-24 start-[15%] size-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Pitch */}
          <div>
            <FadeUp className="flex flex-col items-start gap-4">
              <span className="ocean-ring inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                انضم إلينا
              </span>
              <h2 id="join-title" className="text-3xl font-extrabold leading-tight md:text-5xl md:leading-tight">
                ابدأ <span className="text-gradient-ocean">رحلتك</span> الآن
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                املأ النموذج وسيتواصل معك فريق الاستقبال خلال 24 ساعة لحجز حصة التقييم المجانية
                واختيار الباقة المناسبة لك.
              </p>
              <ul className="mt-2 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm md:text-base">
                    <CircleCheckBig className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-primary" aria-hidden="true" />
                أو اتصل بنا مباشرة:
                <a
                  href={SITE.phoneHref}
                  dir="ltr"
                  className="font-bold text-foreground transition-colors hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </p>
            </FadeUp>
          </div>

          {/* Form / success */}
          <FadeUp delay={0.1}>
            {submitted ? (
              <div className="glass ocean-ring flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
                <span className="glow-cyan flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CircleCheckBig className="size-9" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-extrabold">تم استلام طلبك!</h3>
                <p className="max-w-sm text-muted-foreground">
                  سنتواصل معك خلال 24 ساعة لتأكيد اشتراكك وحجز حصة التقييم المجانية.
                </p>
                <Button variant="outline" className="mt-2 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => setSubmitted(false)}>
                  إرسال طلب آخر
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="glass space-y-4 rounded-2xl p-6 md:p-8" aria-labelledby="join-title">
                <div className="space-y-2">
                  <Label htmlFor="join-name">الاسم الكامل</Label>
                  <Input
                    id="join-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتب اسمك الكامل"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-11"
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="join-email">البريد الإلكتروني</Label>
                    <Input
                      id="join-email"
                      name="email"
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      className="h-11"
                    />
                    {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join-phone">رقم الهاتف</Label>
                    <Input
                      id="join-phone"
                      name="phone"
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      className="h-11"
                    />
                    {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
                  </div>
                </div>

                {plans.length > 0 ? (
                  <div className="space-y-2">
                    <Label htmlFor="join-plan">اختر الباقة</Label>
                    <Select value={planId ?? ""} onValueChange={(value) => setPlanId(value || null)}>
                      <SelectTrigger id="join-plan" className="h-11 w-full">
                        <SelectValue placeholder="اختر الباقة (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} — <span dir="ltr">{formatPriceDigits(plan.price)}</span> ج.م
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="join-notes">ملاحظات</Label>
                  <Textarea
                    id="join-notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أخبرنا عن هدفك أو أي متطلبات خاصة (اختياري)"
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={loading} className="glow-cyan h-12 w-full text-base font-bold">
                  {loading ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="size-5" aria-hidden="true" />
                      إرسال الطلب
                    </>
                  )}
                </Button>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
