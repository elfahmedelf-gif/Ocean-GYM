"use client";

import Image from "next/image";
import { ArrowLeft, Calendar, Timer, User, Users, Waves } from "lucide-react";
import { levelBadgeClass, levelLabel } from "@/lib/gym";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import type { GymClassView } from "./types";

function ClassCard({ gymClass }: { gymClass: GymClassView }) {
  const levelLabelValue = levelLabel(gymClass.level);
  const levelStyle = levelBadgeClass(gymClass.level);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative h-52 w-full overflow-hidden">
        {gymClass.image ? (
          <Image
            src={gymClass.image}
            alt={`كلاس ${gymClass.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <Waves className="size-10 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
        />
        <span
          className={`absolute end-3 top-3 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${levelStyle}`}
        >
          {levelLabelValue}
        </span>
        {/* Booking CTA — revealed on card hover (desktop), always visible on touch devices */}
        <a
          href="#join"
          aria-label={`احجز مكانك في كلاس ${gymClass.name}`}
          tabIndex={-1}
          className="pointer-coarse:translate-y-0 pointer-coarse:opacity-100 absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background/80 py-2.5 text-sm font-bold text-primary opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:pointer-coarse:translate-y-0 group-hover:translate-y-0 group-hover:opacity-100"
        >
          احجز مكانك
          <ArrowLeft className="size-4" aria-hidden="true" />
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-extrabold">{gymClass.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {gymClass.description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="col-span-2 flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            {gymClass.schedule}
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span dir="ltr">{gymClass.duration}</span> دقائق
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              حتى <span dir="ltr">{gymClass.capacity}</span> متدرب
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
      className="scroll-mt-24 bg-secondary/25 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="الكلاسات"
          headingId="classes-title"
          title={
            <>
              اختر <span className="text-gradient-ocean">تحديك</span> القادم
            </>
          }
          subtitle="من البوكسينج إلى الكروس فت والسباحة — أكثر من 30 حصة أسبوعية بإشراف مدربين متخصصين لكل المستويات."
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
