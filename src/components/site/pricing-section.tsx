"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { durationLabel, formatPrice } from "./format";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { useJoinStore } from "./store";
import type { PlanView } from "./types";

function PricingCard({ plan }: { plan: PlanView }) {
  const setPlanId = useJoinStore((s) => s.setPlanId);

  const choosePlan = () => {
    setPlanId(plan.id);
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 md:p-8",
        plan.popular
          ? "glow-cyan-strong z-10 border-primary/60 shadow-2xl md:scale-105"
          : "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      {plan.popular ? (
        <span className="glow-cyan absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold text-primary-foreground shadow-lg">
          الأكثر طلبًا
        </span>
      ) : null}

      <h3 className="text-xl font-extrabold">{plan.name}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span dir="ltr" className="text-4xl font-black text-gradient-ocean md:text-5xl">
          {formatPrice(plan.price)}
        </span>
        <span className="font-bold text-muted-foreground">ج.م</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{durationLabel(plan.duration)}</p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-border/60 pt-6">
        {plan.features
          .split("\n")
          .filter(Boolean)
          .map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="leading-relaxed text-muted-foreground">{feature}</span>
            </li>
          ))}
      </ul>

      <Button
        onClick={choosePlan}
        variant={plan.popular ? "default" : "outline"}
        className={cn(
          "mt-8 h-12 w-full text-base font-bold",
          !plan.popular && "border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 hover:text-primary"
        )}
      >
        اشترك الآن
      </Button>
    </article>
  );
}

export function PricingSection({ plans }: { plans: PlanView[] }) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-24 bg-secondary/25 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="الباقات"
          headingId="pricing-title"
          title={
            <>
              باقات <span className="text-gradient-ocean">مرنة</span> تناسب طموحك
            </>
          }
          subtitle="اختر الباقة التي تناسب هدفك — بدون رسوم خفية، وبإمكانك الترقية في أي وقت."
        />

        {plans.length === 0 ? (
          <FadeUp className="glass mx-auto max-w-md rounded-2xl p-10 text-center text-muted-foreground">
            سيتم إعلان الباقات قريبًا — تواصل معنا لمعرفة التفاصيل.
          </FadeUp>
        ) : (
          <div className="grid items-stretch gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.1} className="h-full">
                <PricingCard plan={plan} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
