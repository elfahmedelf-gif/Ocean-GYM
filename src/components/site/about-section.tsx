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
          <FadeUp className="group relative">
            <div
              aria-hidden="true"
              className="absolute inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <div
                className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-primary/15"
              >
                <Image
                  src="/images/about-gym.jpg"
                  alt="من داخل Ocean GYM — منطقة الأوزان والأجهزة الحديثة"
                  width={1344}
                  height={768}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Inner ocean tint that lifts on hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                />
              </div>
              {/* Cyan corner frames — thin gradient segments fading away from each corner */}
              <div
                aria-hidden="true"
                className="absolute -top-4 -start-4 size-24"
              >
                <span className="absolute start-0 top-0 h-24 w-0.5 rounded-full bg-gradient-to-b from-primary/80 to-primary/0" />
                <span className="absolute start-0 top-0 h-0.5 w-24 rounded-full bg-gradient-to-l from-primary/80 to-primary/0" />
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -end-4 size-24"
              >
                <span className="absolute bottom-0 end-0 h-24 w-0.5 rounded-full bg-gradient-to-b from-primary/0 to-primary/80" />
                <span className="absolute bottom-0 end-0 h-0.5 w-24 rounded-full bg-gradient-to-l from-primary/0 to-primary/80" />
              </div>
              {/* Since-2017 badge — live pulse adds a premium feel */}
              <div className="glass ocean-ring absolute bottom-6 start-6 flex items-center gap-2.5 rounded-2xl px-5 py-3">
                <Waves className="size-5 text-primary" aria-hidden="true" />
                <span className="text-lg font-black text-gradient-ocean">منذ 2017</span>
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
                    className="card-sheen group flex items-start gap-3.5 rounded-2xl border bg-card/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 md:p-5"
                  >
                    <span className="icon-tile size-11">
                      <feature.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-extrabold">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
