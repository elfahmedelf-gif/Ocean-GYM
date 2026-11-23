"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheckBig, LoaderCircle, Lock, Phone, Send } from "lucide-react";
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
import { useLang } from "./language";
import { WaveDivider } from "./wave-divider";
import { useJoinStore } from "./store";
import type { PlanView } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s-]{8,14}$/;

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function JoinSection({ plans }: { plans: PlanView[] }) {
  const { toast } = useToast();
  const { t, tx } = useLang();
  const planId = useJoinStore((s) => s.planId);
  const setPlanId = useJoinStore((s) => s.setPlanId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  // Announce the success card to screen readers by moving focus to it.
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = t.join.errors.nameRequired;
    if (!email.trim()) next.email = t.join.errors.emailRequired;
    else if (!EMAIL_REGEX.test(email.trim())) next.email = t.join.errors.emailInvalid;
    if (!phone.trim()) next.phone = t.join.errors.phoneRequired;
    else if (!PHONE_REGEX.test(phone.trim())) next.phone = t.join.errors.phoneInvalid;
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
          title: t.join.errors.sendFailed,
          description: data.error ?? t.join.errors.unexpected,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t.join.errors.sendFailed,
        description: t.join.errors.network,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="bg-deep relative scroll-mt-24 overflow-hidden py-16 md:py-24"
    >
      {/* Shoreline from the plain testimonials section above */}
      <WaveDivider variant={2} className="text-background" />

      {/* Living aurora behind the whole deep band */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0" />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute -top-24 start-[15%] size-96 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Slow-spinning dashed rings — quiet geometry behind the two columns */}
      <div
        aria-hidden="true"
        className="ring-dashed animate-spin-slower pointer-events-none absolute -top-20 -end-24 size-72 opacity-30"
      />
      <div
        aria-hidden="true"
        style={{ animationDirection: "reverse" }}
        className="ring-dashed animate-spin-slower pointer-events-none absolute -bottom-28 -start-24 size-80 opacity-20"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Pitch */}
          <div>
            <FadeUp className="flex flex-col items-start gap-4">
              <span className="glass ocean-ring inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-transparent to-primary/60" />
                {t.join.kicker}
                <span aria-hidden="true" className="h-px w-4 rounded-full bg-gradient-to-l from-primary/60 to-transparent" />
              </span>
              <h2 id="join-title" className="text-balance text-3xl font-black leading-[1.25] md:text-5xl md:leading-[1.25]">
                {t.join.titlePre}
                <span className="text-gradient-ocean text-glow">{t.join.titleGradient}</span>
                {t.join.titlePost}
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.join.subtitle}
              </p>
              <ul className="mt-2 space-y-3">
                {t.join.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="group flex items-center gap-2.5 text-sm md:text-base"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/5 text-primary ring-1 ring-inset ring-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:from-primary group-hover:to-[#1e6fe8] group-hover:text-primary-foreground">
                      <CircleCheckBig className="size-4" aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed transition-colors duration-300 group-hover:text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-primary" aria-hidden="true" />
                {t.join.callDirect}
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
              <div
                ref={successRef}
                tabIndex={-1}
                className="glass ocean-ring flex flex-col items-center gap-4 rounded-3xl p-10 text-center focus-visible:outline-none"
                aria-live="polite"
              >
                <span className="glow-cyan flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-primary ring-1 ring-inset ring-primary/40">
                  <CircleCheckBig className="size-9" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-black text-gradient-ocean">{t.join.success.title}</h3>
                <p className="max-w-sm text-muted-foreground">
                  {t.join.success.text}
                </p>
                <Button variant="outline" className="mt-2 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => setSubmitted(false)}>
                  {t.join.success.again}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="gradient-border space-y-4 rounded-3xl p-6 md:p-8" aria-labelledby="join-title">
                <div className="space-y-2">
                  <Label htmlFor="join-name">{t.join.form.name}</Label>
                  <Input
                    id="join-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.join.form.namePh}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "join-name-error" : undefined}
                    className="h-12 border-primary/25 bg-background/50 focus-visible:border-primary/60 focus-visible:ring-primary/25"
                  />
                  {errors.name ? (
                    <p id="join-name-error" role="alert" className="text-xs text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="join-email">{t.join.form.email}</Label>
                    <Input
                      id="join-email"
                      name="email"
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.join.form.emailPh}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "join-email-error" : undefined}
                      className="h-12 border-primary/25 bg-background/50 focus-visible:border-primary/60 focus-visible:ring-primary/25"
                    />
                    {errors.email ? (
                      <p id="join-email-error" role="alert" className="text-xs text-destructive">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join-phone">{t.join.form.phone}</Label>
                    <Input
                      id="join-phone"
                      name="phone"
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.join.form.phonePh}
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "join-phone-error" : undefined}
                      className="h-12 border-primary/25 bg-background/50 focus-visible:border-primary/60 focus-visible:ring-primary/25"
                    />
                    {errors.phone ? (
                      <p id="join-phone-error" role="alert" className="text-xs text-destructive">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>

                {plans.length > 0 ? (
                  <div className="space-y-2">
                    <Label htmlFor="join-plan">{t.join.form.plan}</Label>
                    <Select value={planId ?? ""} onValueChange={(value) => setPlanId(value || null)}>
                      <SelectTrigger id="join-plan" className="h-12 w-full border-primary/25 bg-background/50">
                        <SelectValue placeholder={t.join.form.planPh} />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {t.join.form.planItem(tx(plan.name), formatPriceDigits(plan.price))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="join-notes">{t.join.form.notes}</Label>
                  <Textarea
                    id="join-notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.join.form.notesPh}
                    rows={3}
                    className="border-primary/25 bg-background/50 focus-visible:border-primary/60 focus-visible:ring-primary/25"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient glow-cyan-strong shimmer h-12 w-full text-base font-bold"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                      {t.join.form.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="size-5" aria-hidden="true" />
                      {t.join.form.submit}
                    </>
                  )}
                </Button>

                {/* Quiet trust microcopy under the submit — closes the loop */}
                <p className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-muted-foreground">
                  <Lock className="size-3.5 shrink-0 text-primary/80" aria-hidden="true" />
                  {t.join.form.privacy}
                </p>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
