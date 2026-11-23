"use client";

import {
  Apple,
  BadgeCheck,
  Building2,
  Calendar,
  Dumbbell,
  Flame,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/**
 * Selling points that stream across the strip between the hero and the story
 * section — a premium "news ticker" of everything that makes Ocean GYM strong.
 */
const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Dumbbell, label: "أحدث الأجهزة الأمريكية" },
  { icon: BadgeCheck, label: "مدربون معتمدون دوليًا" },
  { icon: Apple, label: "خطط تغذية مخصصة" },
  { icon: Calendar, label: "+30 حصة أسبوعية" },
  { icon: Flame, label: "ساونا وجاكوزي" },
  { icon: Building2, label: "مساحة 1500 م² على 3 أدوار" },
  { icon: ShieldCheck, label: "بيئة تدريب آمنة" },
  { icon: Trophy, label: "خبرة منذ 2017" },
];

/** One streaming copy of the item list — rendered twice for the seamless loop. */
function MarqueeCopy({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex w-max items-center"
    >
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center">
          {/* Item — icon tile + bold label, generous spacing for the luxury rhythm */}
          <span className="group flex items-center gap-2.5 px-7 py-3.5 md:px-9">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_16px_rgba(56,199,232,0.35)]">
              <item.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap text-sm font-bold text-foreground/80 transition-colors duration-300 group-hover:text-primary md:text-base">
              {item.label}
            </span>
          </span>
          {/* Champagne-gold diamond separator — the luxury signature */}
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rotate-45 rounded-[1px] bg-gradient-to-br from-[#f3ddab] to-[#c9962e] shadow-[0_0_8px_rgba(226,189,98,0.55)]"
          />
        </span>
      ))}
    </div>
  );
}

/**
 * Infinite trust ticker bridging the hero and the about section.
 * Purely decorative motion: duplicated copy + translateX(-50%) loop,
 * pauses on hover, frozen entirely under prefers-reduced-motion.
 */
export function TrustMarquee() {
  return (
    <section
      aria-label="لماذا Ocean GYM — أبرز المزايا"
      className="marquee relative border-y border-primary/15 bg-deep/60"
    >
      {/* Hairline glows melting the strip into the sections around it */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-primary/25 to-transparent"
      />
      <div className="marquee-mask overflow-hidden">
        <div
          className="marquee-track flex w-max"
          style={{ "--marquee-duration": "36s" } as React.CSSProperties}
        >
          <MarqueeCopy />
          {/* Second identical copy — what makes translateX(-50%) loop seamlessly */}
          <MarqueeCopy hidden />
        </div>
      </div>
    </section>
  );
}
