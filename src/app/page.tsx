import { db } from "@/lib/db";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { MarqueeStrip } from "@/components/site/marquee";
import { AboutSection } from "@/components/site/about-section";
import { ClassesSection } from "@/components/site/classes-section";
import { TrainersSection } from "@/components/site/trainers-section";
import { PricingSection } from "@/components/site/pricing-section";
import { GallerySection } from "@/components/site/gallery-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { JoinSection } from "@/components/site/join-section";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/footer";
import type {
  GalleryView,
  GymClassView,
  PlanView,
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

async function loadPageData(): Promise<{
  classes: GymClassView[];
  trainers: TrainerView[];
  plans: PlanView[];
  testimonials: TestimonialView[];
  gallery: GalleryView[];
}> {
  const [gymClasses, trainers, plans, testimonials, galleryItems] = await Promise.all([
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
    })),
    gallery: galleryItems.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
    })),
  };
}

export default async function HomePage() {
  const { classes, trainers, plans, testimonials, gallery } = await loadPageData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeStrip />
        <AboutSection />
        <ClassesSection classes={classes} />
        <TrainersSection trainers={trainers} />
        <PricingSection plans={plans} />
        <GallerySection gallery={gallery} />
        <TestimonialsSection testimonials={testimonials} />
        <JoinSection plans={plans} />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
