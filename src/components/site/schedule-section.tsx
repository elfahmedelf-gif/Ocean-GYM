"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dumbbell, Timer, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GYM_DAYS, formatTime12, levelBadgeClass, levelLabel } from "@/lib/gym";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";
import type { ScheduleSlotView } from "./types";

/** Arabic plural rules: 1 -> دقيقة واحدة, 2 -> دقيقتين, 3-10 -> دقائق, 11+ -> دقيقة */
function minutesLabel(minutes: number): string {
  if (minutes === 1) return "دقيقة واحدة";
  if (minutes === 2) return "دقيقتين";
  if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
}

function SlotRow({ slot, index }: { slot: ScheduleSlotView; index: number }) {
  const [digits = slot.time, period = ""] = formatTime12(slot.time).split(" ");
  const badgeStyle = levelBadgeClass(slot.gymClass.level);

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.4), ease: "easeOut" }}
      className="flex items-stretch gap-3 md:gap-5"
    >
      {/* Time chip — big LTR digits + small period label */}
      <div className="flex w-16 shrink-0 flex-col items-center gap-0.5 pt-2.5 md:w-20">
        <span
          dir="ltr"
          className="text-gradient-ocean text-xl font-extrabold tabular-nums md:text-2xl"
        >
          {digits}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground md:text-xs">
          {period}
        </span>
      </div>

      {/* Vertical connector line with dot */}
      <div aria-hidden="true" className="relative flex w-3 shrink-0 flex-col items-center">
        <span className="glow-cyan mt-4 size-3 shrink-0 rounded-full bg-primary" />
        <span className="w-px flex-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
      </div>

      {/* Slot card */}
      <div
        className="glass card-sheen card-spotlight group/slot relative mb-1 flex flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-primary/15 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/10 md:gap-4 md:p-4"
        {...spotlightProps}
      >
        {/* Hover accent bar sliding in from the inline-start edge */}
        <span
          aria-hidden="true"
          className="absolute inset-y-2 start-0 w-[3px] origin-top scale-y-0 rounded-full bg-gradient-to-b from-primary to-[#1e6fe8] transition-transform duration-500 group-hover/slot:scale-y-100"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black transition-colors duration-300 group-hover/slot:text-primary md:text-lg">{slot.gymClass.name}</h3>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-bold md:text-xs",
                badgeStyle
              )}
            >
              {levelLabel(slot.gymClass.level)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground md:text-sm">
            {slot.trainer ? (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                {slot.trainer.name}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Timer className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              {minutesLabel(slot.gymClass.duration)}
            </span>
          </div>
        </div>
        {slot.gymClass.image ? (
          <Image
            src={slot.gymClass.image}
            alt={`كلاس ${slot.gymClass.name}`}
            width={64}
            height={48}
            className="h-12 w-16 shrink-0 rounded-lg border border-primary/20 object-cover transition-all duration-300 group-hover/slot:scale-105 group-hover/slot:border-primary/50"
          />
        ) : null}
      </div>
    </motion.li>
  );
}

export function ScheduleSection({
  slots,
  initialDay = 0,
}: {
  slots: ScheduleSlotView[];
  /** Gym week index of "today" (0=السبت..6=الجمعة) — computed on the server. */
  initialDay?: number;
}) {
  // Never call new Date() here — initialDay comes as a prop to stay hydration-safe.
  const [selectedDay, setSelectedDay] = useState(initialDay);

  /** Number of sessions per day — shown as a mini counter inside each day pill. */
  const countByDay = useMemo(() => {
    const map = new Map<number, number>();
    for (const slot of slots) map.set(slot.day, (map.get(slot.day) ?? 0) + 1);
    return map;
  }, [slots]);

  const daySlots = useMemo(
    () =>
      slots
        .filter((slot) => slot.day === selectedDay)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [slots, selectedDay]
  );

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-title"
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the deep classes band above */}
      <WaveDivider variant={3} className="text-[#081228]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="الجدول الأسبوعي"
          headingId="schedule-title"
          ghostNumber="03"
          title={
            <>
              خطط <span className="text-gradient-ocean">أسبوعك</span> بالساعة
            </>
          }
          subtitle="حصصنا متاحة طوال الأسبوع من السبت إلى الجمعة — اختر اليوم المناسب واكتشف مواعيد الكلاسات والمدربين المتاحين."
        />

        {/* Day pill tabs — single row, horizontally scrollable on mobile */}
        <FadeUp className="-mx-4 mb-8 px-4 md:mx-0 md:mb-10 md:px-0">
          <div
            role="tablist"
            aria-label="أيام الجدول الأسبوعي"
            className="custom-scrollbar flex gap-2 overflow-x-auto pb-2 md:justify-center md:pb-0"
          >
            {GYM_DAYS.map((day) => {
              const isToday = day.index === initialDay;
              return (
                <button
                  key={day.index}
                  id={`schedule-day-tab-${day.index}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedDay === day.index}
                  aria-controls="schedule-day-panel"
                  onClick={() => setSelectedDay(day.index)}
                  className={cn(
                    "relative flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
                    selectedDay === day.index
                      ? "border-transparent text-primary-foreground"
                      : "border-primary/20 bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {selectedDay === day.index ? (
                    <motion.span
                      layoutId="schedule-day-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-l from-primary to-[#1e6fe8] shadow-lg shadow-primary/30"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-2">
                    {day.name}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-black tabular-nums",
                        selectedDay === day.index
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/15 text-primary"
                      )}
                    >
                      {countByDay.get(day.index) ?? 0}
                    </span>
                    {isToday ? (
                      <span
                        className="size-1.5 rounded-full bg-gradient-to-br from-[#f3ddab] to-[#c9962e] shadow-[0_0_8px_rgba(226,189,98,0.8)]"
                        title="اليوم"
                        aria-label="اليوم"
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* Timeline of the selected day */}
        <div
          id="schedule-day-panel"
          role="tabpanel"
          aria-labelledby={`schedule-day-tab-${selectedDay}`}
        >
          {daySlots.length === 0 ? (
            <FadeUp className="mx-auto max-w-lg rounded-2xl border-2 border-dashed border-primary/25 p-10 text-center">
              <Dumbbell className="mx-auto mb-3 size-10 text-primary/50" aria-hidden="true" />
              <p className="font-bold">لا توجد حصص مجدولة في هذا اليوم</p>
              <p className="mt-1 text-sm text-muted-foreground">استمتع براحة أو تمرن فردّي</p>
            </FadeUp>
          ) : (
            <ol className="mx-auto flex max-w-3xl flex-col gap-5 md:gap-6">
              {daySlots.map((slot, i) => (
                <SlotRow key={slot.id} slot={slot} index={i} />
              ))}
            </ol>
          )}
        </div>

        {/* Bottom hint */}
        <FadeUp className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-12">
          <p className="text-sm text-muted-foreground md:text-base">
            بتحتاج مساعدة في اختيار الحصة المناسبة؟
          </p>
          <Button
            asChild
            className="btn-gradient glow-cyan-strong shimmer font-bold"
          >
            <a href="#join">انضم الآن</a>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
