import { db } from "@/lib/db";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { SkipLink } from "@/components/site/skip-link";
import { AboutSection } from "@/components/site/about-section";
import { ClassesSection } from "@/components/site/classes-section";
import { ScheduleSection } from "@/components/site/schedule-section";
import { TrainersSection } from "@/components/site/trainers-section";
import { PricingSection } from "@/components/site/pricing-section";
import { GallerySection } from "@/components/site/gallery-section";
import { VideoSection } from "@/components/site/video-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { JoinSection } from "@/components/site/join-section";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/footer";
import type {
  GalleryView,
  GymClassView,
  PlanView,
  ScheduleSlotView,
  TestimonialView,
  TrainerView,
} from "@/components/site/types";

export const dynamic = "force-dynamic";

/** Runs a db query and falls back to a safe default so the page never crashes. */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("[page] database query failed:", error);
    return fallback;
  }
}

/** Maps JS getDay() (0=Sun..6=Sat) to the gym week (0=السبت..6=الجمعة). */
function currentGymDay(): number {
  return (new Date().getDay() + 1) % 7;
}

async function loadPageData(): Promise<{
  classes: GymClassView[];
  trainers: TrainerView[];
  plans: PlanView[];
  testimonials: TestimonialView[];
  gallery: GalleryView[];
  slots: ScheduleSlotView[];
}> {
  const [gymClasses, trainers, plans, testimonials, galleryItems, scheduleSlots] = await Promise.all([
    safe(
      db.gymClass.findMany({
        where: { active: true },
        include: { trainer: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      }),
      []
    ),
    safe(db.trainer.findMany({ where: { active: true }, orderBy: { order: "asc" } }), []),
    safe(db.plan.findMany({ where: { active: true }, orderBy: { price: "asc" } }), []),
    safe(
      db.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" } }),
      []
    ),
    safe(db.galleryItem.findMany({ orderBy: { createdAt: "desc" } }), []),
    safe(
      db.scheduleSlot.findMany({
        where: { active: true },
        include: {
          gymClass: { select: { name: true, level: true, duration: true, image: true } },
          trainer: { select: { name: true } },
        },
        orderBy: [{ day: "asc" }, { time: "asc" }],
      }),
      []
    ),
  ]);

  return {
    classes: gymClasses.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      schedule: item.schedule,
      duration: item.duration,
      capacity: item.capacity,
      level: item.level,
      image: item.image,
      trainerName: item.trainer?.name ?? null,
    })),
    trainers: trainers.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      bio: item.bio,
      image: item.image,
      specialty: item.specialty,
      instagram: item.instagram,
    })),
    plans: plans.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      duration: item.duration,
      features: item.features,
      popular: item.popular,
    })),
    testimonials: testimonials.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      content: item.content,
      rating: item.rating,
      image: item.image,
    })),
    gallery: galleryItems.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
    })),
    slots: scheduleSlots.map((slot) => ({
      id: slot.id,
      day: slot.day,
      time: slot.time,
      gymClass: {
        name: slot.gymClass.name,
        level: slot.gymClass.level,
        duration: slot.gymClass.duration,
        image: slot.gymClass.image ?? null,
      },
      trainer: slot.trainer ? { name: slot.trainer.name } : null,
    })),
  };
}

export default async function HomePage() {
  const { classes, trainers, plans, testimonials, gallery, slots } = await loadPageData();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {/* Fixed ambient backdrop — faint blueprint grid + drifting ocean glows
          that give the whole page depth without re-rendering on scroll */}
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 -z-10">
        <div className="bg-grid-ocean absolute inset-0" />
        <div className="absolute -top-32 start-[8%] size-[420px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute top-[45%] end-[4%] size-[380px] rounded-full bg-[#1e6fe8]/[0.08] blur-3xl" />
        <div className="absolute bottom-[-120px] start-[30%] size-[360px] rounded-full bg-primary/[0.05] blur-3xl" />
      </div>

      {/* Skip-to-content — first focusable element, hidden until keyboard focus */}
      <SkipLink />
      <ScrollProgress />
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <AboutSection />
        <ClassesSection classes={classes} />
        <ScheduleSection slots={slots} initialDay={currentGymDay()} />
        <TrainersSection trainers={trainers} />
        <PricingSection plans={plans} />
        <GallerySection gallery={gallery} />
        <VideoSection />
        <TestimonialsSection testimonials={testimonials} />
        <JoinSection plans={plans} />
        <ContactSection />
      </main>
      <SiteFooter />
      <BackToTop />
      <WhatsAppFloat />
    </div>
  );
}
