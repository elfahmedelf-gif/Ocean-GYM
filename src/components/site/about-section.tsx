"use client";

import Image from "next/image";
import { Activity, Apple, BadgeCheck, Building2, Dumbbell, Flame, Waves } from "lucide-react";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "أحدث الأجهزة الأمريكية",
    desc: "أجهزة Life Fitness و Hammer Strength بأحدث الموديلات العالمية.",
  },
  {
    icon: BadgeCheck,
    title: "مدربون معتمدون دوليًا",
    desc: "فريق متخصص يحمل شهادات ISSA و NASM و خبرة ميدانية طويلة.",
  },
  {
    icon: Apple,
    title: "برنامج تغذية متكامل",
    desc: "خطط غذائية مخصصة لهدفك من خبراء التغذية الرياضية.",
  },
  {
    icon: Activity,
    title: "منطقة كارديو متطورة",
    desc: "أجهزة جري ودراجات وإليبتيكال بأحدث الموديلات وشاشات تفاعلية لمتابعة أدائك.",
  },
  {
    icon: Flame,
    title: "ساونا وجاكوزي",
    desc: "استرجاع سريع للعضلات واسترخاء كامل بعد كل تمرين.",
  },
  {
    icon: Building2,
    title: "مساحة 1500 متر مربع",
    desc: "ثلاثة أدوار مجهزة بالكامل من الأوزان الحرة إلى استوديوهات الكلاسات.",
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image with decorative corner frame */}
          <FadeUp className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <Image
                src="/images/about-gym.jpg"
                alt="من داخل Ocean GYM — منطقة الأوزان والأجهزة الحديثة"
                width={1344}
                height={768}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full rounded-2xl object-cover shadow-2xl shadow-black/40"
              />
              {/* Cyan corner frame */}
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 h-24 w-24 rounded-tr-3xl border-r-2 border-t-2 border-primary/60"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -left-4 h-24 w-24 rounded-bl-3xl border-b-2 border-l-2 border-primary/60"
              />
              {/* Since-2017 badge */}
              <div className="glass ocean-ring absolute bottom-6 right-6 flex items-center gap-2 rounded-2xl px-5 py-3">
                <Waves className="size-5 text-primary" aria-hidden="true" />
                <span className="text-lg font-extrabold text-gradient-ocean">منذ 2017</span>
              </div>
            </div>
          </FadeUp>

          {/* Text + features */}
          <div>
            <SectionHeading
              align="start"
              kicker="عن الجيم"
              headingId="about-title"
              title={
                <>
                  لماذا <span className="text-gradient-ocean">Ocean GYM</span>؟
                </>
              }
              subtitle="لسنا مجرد نادٍ رياضي — نحن مجتمع متكامل صُمم ليأخذك من أول تمرين إلى أفضل نسخة من نفسك، بمكانة عالمية وأجواء تدفعك للاستمرار."
            />

            <FadeUp delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="group flex items-start gap-3 rounded-2xl border bg-card/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <feature.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-bold">{feature.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
