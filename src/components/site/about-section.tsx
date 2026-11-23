"use client";

import Image from "next/image";
import { Activity, Apple, BadgeCheck, Building2, Dumbbell, Flame, Users, Waves } from "lucide-react";
import { FadeUp } from "./fade-up";
import { useLang } from "./language";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";

const FEATURES = [
  { icon: Dumbbell },
  { icon: BadgeCheck },
  { icon: Apple },
  { icon: Activity },
  { icon: Flame },
  { icon: Building2 },
] as const;

export function AboutSection() {
  const { t } = useLang();

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
              {/* Slow-spinning dashed ring peeking from behind the card (end side) */}
              <div
                aria-hidden="true"
                className="ring-dashed animate-spin-slower pointer-events-none absolute -bottom-14 -end-14 z-0 size-52 opacity-40"
              />
              {/* Luxury offset hairline frame — a gallery-style back plate */}
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -start-5 z-0 h-full w-full rounded-3xl bg-gradient-to-br from-primary/25 via-primary/5 to-transparent"
              />
              <div
                className="lux-frame relative z-10 overflow-hidden rounded-3xl"
              >
                <Image
                  src="/images/about-gym.jpg"
                  alt={t.about.imageAlt}
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
              {/* Members badge — floating at the top-end, mirrors the since-2017 badge */}
              <div className="glass ocean-ring absolute -top-6 end-6 z-20 flex items-center gap-2.5 rounded-2xl px-4 py-2.5">
                <Users className="size-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-black">
                  <span dir="ltr" className="text-gradient-ocean">+1200</span> {t.about.membersBadge}
                </span>
              </div>
              {/* Since-2017 badge — the luxury gold anchor of the section */}
              <div className="glass ocean-ring absolute bottom-6 start-6 z-20 flex items-center gap-2.5 rounded-2xl px-5 py-3">
                <Waves className="size-5 text-[#e7c069]" aria-hidden="true" />
                <span className="text-gradient-gold-animated text-lg font-black">{t.about.sinceBadge}</span>
              </div>
            </div>
          </FadeUp>

          {/* Text + features */}
          <div>
            <SectionHeading
              align="start"
              kicker={t.about.kicker}
              headingId="about-title"
              ghostNumber="01"
              title={
                <>
                  {t.about.titlePre}
                  <span className="text-gradient-ocean">{t.about.titleGradient}</span>
                  {t.about.titlePost}
                </>
              }
              subtitle={t.about.subtitle}
            />

            <FadeUp delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature, i) => {
                  const f = t.about.features[i];
                  return (
                    <div
                      key={f.title}
                      className="card-sheen card-spotlight lux-card group relative flex items-start gap-3.5 overflow-hidden rounded-2xl border border-primary/15 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_-18px_rgba(56,199,232,0.3)] md:p-5"
                      {...spotlightProps}
                    >
                      {/* Editorial index — tiny, top-end corner */}
                      <span
                        aria-hidden="true"
                        className="text-ghost-outline pointer-events-none absolute end-3 top-2 select-none text-2xl font-black leading-none"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="icon-tile size-11">
                        <feature.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-extrabold transition-colors duration-300 group-hover:text-primary">{f.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
