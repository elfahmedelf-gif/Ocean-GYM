"use client";

import { Check, Flame, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPriceDigits, durationLabel } from "@/lib/gym";
import { FadeUp } from "./fade-up";
import { useLang } from "./language";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";
import { useJoinStore } from "./store";
import type { PlanView } from "./types";

function PricingCard({ plan }: { plan: PlanView }) {
  const { t, lang, tx } = useLang();
  const setPlanId = useJoinStore((s) => s.setPlanId);

  // Duration suffix — Arabic uses the localized helper, English composes its own units.
  const per =
    lang === "ar"
      ? durationLabel(plan.duration)
      : plan.duration === 1
        ? "month"
        : plan.duration === 3
          ? "3 months"
          : plan.duration === 12
            ? "year"
            : `${plan.duration} months`;

  const choosePlan = () => {
    setPlanId(plan.id);
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-3xl p-6 transition-all duration-300 md:p-8",
        plan.popular
          ? "gradient-border gradient-border-animated glow-cyan-strong z-10 shadow-2xl md:scale-105"
          : "card-spotlight lux-card border border-primary/15 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_56px_-20px_rgba(56,199,232,0.35)]"
      )}
      {...(plan.popular ? {} : spotlightProps)}
    >
      {/* Gradient edge for non-popular cards too — keeps the hover language consistent */}
      {!plan.popular ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] rtl:origin-right ltr:origin-left scale-x-0 rounded-t-3xl rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
        />
      ) : null}
      {plan.popular ? (
        <div
          aria-hidden="true"
          className="absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-b from-[#e2bd62]/20 via-primary/10 to-transparent blur-2xl"
        />
      ) : null}
      {plan.popular ? (
        <span className="gold-badge gold-shimmer absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-black">
          <Flame className="size-3.5" aria-hidden="true" />
          {t.pricing.popular}
        </span>
      ) : null}

      <h3 className="text-xl font-black">{tx(plan.name)}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span
          dir="ltr"
          className="text-gradient-ocean text-glow text-4xl font-black tabular-nums transition-transform duration-300 group-hover:scale-105 md:text-5xl"
        >
          {formatPriceDigits(plan.price)}
        </span>
        <span className="font-bold text-muted-foreground">{t.pricing.currency}</span>
        <span className="text-sm text-muted-foreground">/ {per}</span>
      </div>
      {plan.duration > 1 ? (
        <p className="mt-1 text-xs font-semibold text-primary/90">
          {t.pricing.equalPre}
          <span dir="ltr">{formatPriceDigits(Math.round(plan.price / plan.duration))}</span> {t.pricing.equalCurrency}
          {t.pricing.equalPost}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">{t.pricing.flexible}</p>
      )}

      <ul className="mt-6 flex-1 space-y-3 border-t border-border/60 pt-6">
        {plan.features
          .split("\n")
          .filter(Boolean)
          .map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-transform duration-300 group-hover:scale-115",
                  plan.popular
                    ? "bg-gradient-to-br from-primary to-[#1e6fe8] text-primary-foreground ring-primary/60"
                    : "bg-primary/15 text-primary ring-primary/25"
                )}
              >
                <Check className="size-3" aria-hidden="true" />
              </span>
              <span className="leading-relaxed text-muted-foreground">{tx(feature)}</span>
            </li>
          ))}
      </ul>

      <Button
        onClick={choosePlan}
        variant={plan.popular ? "default" : "outline"}
        className={cn(
          "mt-8 h-12 w-full text-base font-bold",
          plan.popular && "btn-gradient shimmer",
          !plan.popular && "border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 hover:text-primary"
        )}
      >
        {t.pricing.subscribe}
      </Button>
    </article>
  );
}

export function PricingSection({ plans }: { plans: PlanView[] }) {
  const { t } = useLang();

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the deep trainers band above */}
      <WaveDivider variant={2} className="text-[#081228]" />
      {/* Warm gold ambient behind the heading — quiet luxury for the pricing stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[#e2bd62]/[0.05] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker={t.pricing.kicker}
          headingId="pricing-title"
          ghostNumber="05"
          title={
            <>
              {t.pricing.titlePre}
              <span className="text-gradient-ocean">{t.pricing.titleGradient}</span>
              {t.pricing.titlePost}
            </>
          }
          subtitle={t.pricing.subtitle}
        />

        {plans.length === 0 ? (
          <FadeUp className="glass mx-auto max-w-md rounded-2xl p-10 text-center text-muted-foreground">
            {t.pricing.comingSoon}
          </FadeUp>
        ) : (
          <div
            className={cn(
              "grid items-stretch gap-6 lg:gap-8",
              // Resilient to any plan count: lone/small sets stay centered, full sets use the 3-col layout.
              plans.length === 1 && "mx-auto max-w-md",
              plans.length === 2 && "mx-auto max-w-3xl sm:grid-cols-2",
              plans.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {plans.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.1} className="h-full">
                <PricingCard plan={plan} />
              </FadeUp>
            ))}
          </div>
        )}

        {/* Trust strip — quiet reassurance under the pricing stage */}
        {plans.length > 0 ? (
          <FadeUp
            delay={0.15}
            className="mt-12 flex flex-col items-center justify-center gap-x-8 gap-y-4 sm:flex-row md:mt-14"
          >
            {[
              { icon: ShieldCheck, label: t.pricing.trust[0] },
              { icon: RefreshCw, label: t.pricing.trust[1] },
              { icon: Sparkles, label: t.pricing.trust[2] },
            ].map((item) => (
              <span
                key={item.label}
                className="glass flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <item.icon className="size-4 text-primary" aria-hidden="true" />
                {item.label}
              </span>
            ))}
          </FadeUp>
        ) : null}
      </div>
    </section>
  );
}
