"use client";

import Image from "next/image";
import { ArrowLeft, Calendar, Timer, User, Users, Waves } from "lucide-react";
import { levelBadgeClass, levelLabel } from "@/lib/gym";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";
import type { GymClassView } from "./types";

function ClassCard({ gymClass }: { gymClass: GymClassView }) {
  const levelLabelValue = levelLabel(gymClass.level);
  const levelStyle = levelBadgeClass(gymClass.level);

  return (
    <article
      className="card-spotlight group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_24px_60px_-16px_rgba(56,199,232,0.35)]"
      {...spotlightProps}
    >
      {/* Gradient edge that sweeps in across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] origin-right scale-x-0 bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="relative h-60 w-full overflow-hidden">
        {gymClass.image ? (
          <Image
            src={gymClass.image}
            alt={`كلاس ${gymClass.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:saturate-125"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <Waves className="size-10 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
        />
        <span
          className={`absolute end-3 top-3 z-10 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${levelStyle}`}
        >
          {levelLabelValue}
        </span>
        {/* Duration chip on the opposite corner — instant info at a glance */}
        <span
          aria-hidden="true"
          className="absolute start-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/70 px-2.5 py-1 text-[11px] font-bold text-primary backdrop-blur-md"
        >
          <Timer className="size-3" />
          <span dir="ltr">{gymClass.duration}</span> د
        </span>
        {/* Booking CTA — always reachable (visible at reduced opacity), fully revealed
            on hover, and on keyboard focus of anything inside the card. */}
        <a
          href="#join"
          aria-label={`احجز مكانك في كلاس ${gymClass.name}`}
          className="absolute inset-x-3 bottom-3 flex min-h-11 translate-y-2 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background/80 py-2.5 text-sm font-bold text-primary opacity-80 backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          احجز مكانك
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-black transition-colors duration-300 group-hover:text-primary">{gymClass.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {gymClass.description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-2.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="col-span-2 flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            {gymClass.schedule}
          </span>
          <span className="chip max-w-fit">
            <Timer className="size-3.5 shrink-0" aria-hidden="true" />
            <span>
              <span dir="ltr">{gymClass.duration}</span> دقائق
            </span>
          </span>
          <span className="chip max-w-fit">
            <Users className="size-3.5 shrink-0" aria-hidden="true" />
            <span>
              حتى <span dir="ltr">{gymClass.capacity}</span>
            </span>
          </span>
          {gymClass.trainerName ? (
            <span className="col-span-2 flex items-center gap-1.5">
              <User className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              المدرب: {gymClass.trainerName}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ClassesSection({ classes }: { classes: GymClassView[] }) {
  return (
    <section
      id="classes"
      aria-labelledby="classes-title"
      className="bg-deep relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the plain section above */}
      <WaveDivider variant={2} className="text-background" />
      {/* Stage light washing the top of the deep band */}
      <div aria-hidden="true" className="beam-top pointer-events-none absolute inset-x-0 top-0 h-44" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="الكلاسات"
          headingId="classes-title"
          ghostNumber="02"
          title={
            <>
              اختر <span className="text-gradient-ocean">تحديك</span> القادم
            </>
          }
          subtitle="من البوكسينج إلى الكروس فت واليوجا — أكثر من 30 حصة أسبوعية بإشراف مدربين متخصصين لكل المستويات."
        />

        {classes.length === 0 ? (
          <FadeUp className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl p-10 text-center">
            <Waves className="size-10 text-primary/50" aria-hidden="true" />
            <p className="font-bold">لا توجد كلاسات متاحة حاليًا</p>
            <p className="text-sm text-muted-foreground">تابعنا قريبًا — جدول الحصص يجدد باستمرار.</p>
          </FadeUp>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((gymClass, i) => (
              <FadeUp key={gymClass.id} delay={(i % 3) * 0.1}>
                <ClassCard gymClass={gymClass} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
