"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView } from "framer-motion";
import { BadgeCheck, Calendar, ChevronDown, Trophy, Users, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Users, to: 1200, label: "عضو نشط" },
  { icon: BadgeCheck, to: 15, label: "مدرب محترف" },
  { icon: Calendar, to: 30, label: "حصة أسبوعية" },
  { icon: Trophy, to: 8, label: "سنوات خبرة" },
] as const;

/** Animated counter that counts up once it scrolls into view. */
function Counter({ to, prefix = "" }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {prefix}
      {value}
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image + dark navy overlay */}
      <Image
        src="/images/hero-bg.jpg"
        alt="أجواء التمرين داخل Ocean GYM بإضاءة سماوية"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#050d1f] via-[#050d1f]/55 to-[#050d1f]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,13,31,0.7)_100%)]"
      />

      {/* Floating glow orbs */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute -top-20 start-[8%] size-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        style={{ animationDelay: "1.6s" }}
        className="animate-pulse-glow pointer-events-none absolute bottom-4 end-[6%] size-80 rounded-full bg-[#1e6fe8]/25 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-32 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <span className="glass ocean-ring inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary">
            <Waves className="size-4" aria-hidden="true" />
            أقوى جيم في القاهرة
          </span>

          <h1
            id="hero-title"
            className="text-4xl font-black leading-[1.25] sm:text-5xl md:text-7xl md:leading-[1.2]"
          >
            <span className="text-gradient-ocean">بحر من القوة</span> يبدأ من هنا
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            تدرب على أحدث الأجهزة الأمريكية بإشراف مدربين معتمدين دوليًا، واستمتع بأكثر من 30 حصة
            أسبوعية وحمام سباحة أولمبي — رحلتك نحو نسخة أقوى منك تبدأ اليوم.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="glow-cyan-strong h-12 px-8 text-base font-bold"
            >
              <a href="#join">انضم الآن</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-primary/40 bg-primary/5 px-8 text-base font-bold text-primary hover:bg-primary/15 hover:text-primary"
            >
              <a href="#classes">اكتشف الكلاسات</a>
            </Button>
          </div>
        </motion.div>

        {/* Animated stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:gap-5 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="glass rounded-2xl px-4 py-5"
            >
              <stat.icon className="mx-auto mb-2 size-6 text-primary" aria-hidden="true" />
              <div className="text-3xl font-extrabold text-gradient-ocean md:text-4xl">
                <Counter to={stat.to} prefix="+" />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="انتقل إلى قسم عن الجيم"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="text-xs font-semibold">اكتشف المزيد</span>
        <ChevronDown className="size-6 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
