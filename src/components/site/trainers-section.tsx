"use client";

import Image from "next/image";
import { Instagram, UserRound } from "lucide-react";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import type { TrainerView } from "./types";

function TrainerCard({ trainer }: { trainer: TrainerView }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {trainer.image ? (
          <Image
            src={trainer.image}
            alt={`المدرب ${trainer.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <UserRound className="size-16 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050d1f] via-[#050d1f]/25 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-xl font-extrabold">{trainer.name}</h3>
          <p className="mt-0.5 text-sm font-bold text-primary">{trainer.role}</p>
          {trainer.specialty ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{trainer.specialty}</p>
          ) : null}
          {trainer.instagram ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Instagram className="size-3.5 text-primary" aria-hidden="true" />
              <span dir="ltr">@{trainer.instagram}</span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TrainersSection({ trainers }: { trainers: TrainerView[] }) {
  return (
    <section id="trainers" aria-labelledby="trainers-title" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="المدربون"
          headingId="trainers-title"
          title={
            <>
              نخبة من <span className="text-gradient-ocean">الخبراء</span> معك خطوة بخطوة
            </>
          }
          subtitle="مدربون معتمدون دوليًا يجمعون بين العلم والخبرة الميدانية، ويصممون لك برنامجًا يناسب هدفك ومستواك."
        />

        {trainers.length === 0 ? (
          <FadeUp className="glass mx-auto max-w-md rounded-2xl p-10 text-center text-muted-foreground">
            سيتم التعريف بفريق المدربين قريبًا.
          </FadeUp>
        ) : (
          <div className="grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {trainers.slice(0, 3).map((trainer, i) => (
              <FadeUp key={trainer.id} delay={i * 0.12}>
                <TrainerCard trainer={trainer} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
