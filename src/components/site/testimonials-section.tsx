"use client";

import Image from "next/image";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";
import type { TestimonialView } from "./types";

function TestimonialCard({ testimonial }: { testimonial: TestimonialView }) {
  const rating = Math.min(5, Math.max(1, testimonial.rating));

  return (
    <figure
      className="card-sheen card-spotlight group flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_48px_-16px_rgba(56,199,232,0.3)]"
      {...spotlightProps}
    >
      {/* Giant ghost quote watermark behind the content — editorial depth */}
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -start-4 size-24 rotate-12 text-primary/[0.05]"
      />
      {/* Gradient edge sweeps across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-right scale-x-0 rounded-t-2xl bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="flex items-center justify-between">
        <div
          className="flex gap-0.5"
          role="img"
          aria-label={`التقييم: ${rating} من 5 نجوم`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn(
                "size-4",
                i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <span className="icon-tile size-9 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          <Quote className="size-4" aria-hidden="true" />
        </span>
      </div>

      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
        {testimonial.content}
      </blockquote>

      <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
        {/* Gradient ring around the avatar */}
        <span
          aria-hidden="true"
          className="rounded-full bg-gradient-to-br from-primary to-[#1e6fe8] p-[2px]"
        >
          {testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={`صورة ${testimonial.name}`}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full border border-background object-cover"
            />
          ) : (
            <Avatar className="size-10 border border-background">
              <AvatarFallback className="bg-primary/15 font-extrabold text-primary">
                {testimonial.name.trim().charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold">{testimonial.name}</div>
          <div className="truncate text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
        {/* Verified-member gold check — quiet trust marker */}
        <BadgeCheck
          aria-hidden="true"
          className="ms-auto size-4 shrink-0 text-[#e7c069]/80"
        />
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialView[] }) {
  // Average rating across approved testimonials (1 decimal, clamped to 5).
  const avgRating =
    testimonials.length > 0
      ? Math.round(
          (testimonials.reduce((sum, t) => sum + Math.min(5, Math.max(1, t.rating)), 0) /
            testimonials.length) *
            10
        ) / 10
      : 0;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the deep gallery band above */}
      <WaveDivider variant={1} className="text-[#081228]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="آراء العملاء"
          headingId="testimonials-title"
          ghostNumber="06"
          title={
            <>
              قصص <span className="text-gradient-ocean">نجاح</span> أعضائنا
            </>
          }
          subtitle="أكثر من 1200 عضو اختاروا Ocean GYM — إليك بعض تجاربهم الحقيقية."
        />

        {testimonials.length === 0 ? (
          <FadeUp className="glass mx-auto max-w-md rounded-2xl p-10 text-center text-muted-foreground">
            آراء العملاء ستتوفر قريبًا.
          </FadeUp>
        ) : (
          <>
            <FadeUp className="mb-8 flex justify-center md:mb-10">
              <div className="glass flex items-center gap-3 rounded-full px-5 py-2.5">
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span
                  aria-hidden="true"
                  className="h-4 w-px bg-primary/25"
                />
                <span className="text-sm font-black tabular-nums">
                  <span dir="ltr">{avgRating.toFixed(1)}</span> / 5
                </span>
                <span className="text-xs text-muted-foreground">
                  متوسط تقييم <span dir="ltr">{testimonials.length}</span>
                  {testimonials.length === 1 ? " تجربة" : " تجارب"} حقيقية
                </span>
              </div>
            </FadeUp>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.slice(0, 8).map((testimonial, i) => (
                <FadeUp key={testimonial.id} delay={(i % 4) * 0.1} className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </FadeUp>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
