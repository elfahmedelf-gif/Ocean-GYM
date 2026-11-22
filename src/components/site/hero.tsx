"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Trophy,
  Users,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Counter } from "./counter";

/** Slide rotation interval (ms) — drives autoplay, progress bar and Ken Burns zoom. */
const SLIDE_DURATION = 6000;

const SLIDES = [
  {
    src: "/images/hero-bg.jpg",
    alt: "صالة Ocean GYM الرئيسية بأحدث الأجهزة الأمريكية",
  },
  {
    src: "/images/hero-boxing.jpg",
    alt: "كلاس البوكسينج بإشراف مدربين محترفين",
  },
  {
    src: "/images/hero-weights.jpg",
    alt: "منطقة الأوزان الحرة بالمعدات المتطورة",
  },
] as const;

const STATS = [
  { icon: Users, to: 1200, label: "عضو نشط" },
  { icon: BadgeCheck, to: 15, label: "مدرب محترف" },
  { icon: Calendar, to: 30, label: "حصة أسبوعية" },
  { icon: Trophy, to: 8, label: "سنوات خبرة" },
] as const;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  /** Bumped when playback resumes so the progress bar restarts in sync with the timer. */
  const [epoch, setEpoch] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Slider chrome (controls + progress bar) stays fixed while a meaningful
  // part of the hero is still on screen, then fades out on scroll.
  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      setHeroVisible(el.getBoundingClientRect().bottom > window.innerHeight * 0.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback(
    (target: number) => setIndex(((target % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay — a fresh timer per slide; cleared while paused.
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [playing, index, epoch, goTo]);

  // Preload the upcoming slide to keep crossfades seamless.
  useEffect(() => {
    const img = new window.Image();
    img.src = SLIDES[(index + 1) % SLIDES.length].src;
  }, [index]);

  const pause = useCallback(() => setPlaying(false), []);
  const resume = useCallback(() => {
    setPlaying(true);
    setEpoch((e) => e + 1);
  }, []);

  // Touch swipe: finger left = next, finger right = previous (RTL flow).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (dx < -50) goNext();
    else if (dx > 50) goPrev();
  };

  return (
    <section
      id="home"
      ref={heroRef}
      role="region"
      aria-roledescription="كاروسيل"
      aria-label="صور أجواء Ocean GYM"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Slides — crossfade + slow cinematic zoom */}
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.src}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              active ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className={cn("absolute inset-0", active && "animate-ken-burns")}
              style={
                {
                  "--slide-duration": `${SLIDE_DURATION}ms`,
                  animationPlayState: playing ? "running" : "paused",
                } as React.CSSProperties
              }
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {/* Dark navy overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#050d1f] via-[#050d1f]/55 to-[#050d1f]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,13,31,0.7)_100%)]"
      />

      {/* Floating glow orbs */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute -top-20 start-[8%] z-0 size-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        style={{ animationDelay: "1.6s" }}
        className="animate-pulse-glow pointer-events-none absolute bottom-4 end-[6%] z-0 size-80 rounded-full bg-[#1e6fe8]/25 blur-3xl"
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
            أسبوعية لكل المستويات — رحلتك نحو نسخة أقوى منك تبدأ اليوم.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="glow-cyan-strong group h-12 px-8 text-base font-bold"
            >
              <a href="#join">
                <Sparkles
                  className="size-5 transition-transform duration-300 group-hover:-rotate-12"
                  aria-hidden="true"
                />
                انضم الآن
                <ArrowLeft
                  className="size-5 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-primary/40 bg-primary/5 px-8 text-base font-bold text-primary hover:bg-primary/15 hover:text-primary"
            >
              <a href="#classes">
                <Waves className="size-5" aria-hidden="true" />
                اكتشف الكلاسات
              </a>
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

      {/* Slider controls — centered at the bottom, minimal premium style */}
      <div
        aria-hidden={!heroVisible}
        className={cn(
          "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center transition-all duration-300",
          heroVisible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="الصورة السابقة"
          className="flex size-12 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronRight
            className="size-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
            aria-hidden="true"
          />
        </button>

        <span aria-hidden="true" className="h-7 w-px bg-white/25" />

        <button
          type="button"
          onClick={playing ? pause : resume}
          aria-label={playing ? "إيقاف تقليب الصور" : "تشغيل تقليب الصور"}
          aria-pressed={playing}
          className="flex size-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          {playing ? (
            <Pause
              className="size-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              aria-hidden="true"
            />
          ) : (
            <Play
              className="size-6 -translate-x-px drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              aria-hidden="true"
            />
          )}
        </button>

        <span aria-hidden="true" className="h-7 w-px bg-white/25" />

        <button
          type="button"
          onClick={goNext}
          aria-label="الصورة التالية"
          className="flex size-12 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft
            className="size-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
            aria-hidden="true"
          />
        </button>

        <span className="sr-only" aria-live="polite">
          الشريحة {index + 1} من {SLIDES.length}: {SLIDES[index].alt}
        </span>
      </div>

      {/* Slide progress bar — fixed at the viewport edge, fills right-to-left with the timer */}
      <div
        aria-hidden={!heroVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 h-[3px] bg-foreground/10 transition-opacity duration-300",
          heroVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          key={`${index}:${epoch}`}
          className={cn(
            "animate-slider-progress h-full w-full origin-right bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0]",
            !playing && "[animation-play-state:paused]"
          )}
          style={{ "--slide-duration": `${SLIDE_DURATION}ms` } as React.CSSProperties}
        />
      </div>
    </section>
  );
}
