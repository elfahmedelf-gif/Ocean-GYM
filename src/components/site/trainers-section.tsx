"use client";

import Image from "next/image";
import { Instagram, UserRound } from "lucide-react";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";
import type { TrainerView } from "./types";

/** Extracts a clean Instagram handle from "@user", "user", or a full profile URL. */
function instagramHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const handle = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, "")
    .replace(/^@+/, "")
    .replace(/\/+$/, "");
  return handle || null;
}

function TrainerCard({ trainer }: { trainer: TrainerView }) {
  const handle = instagramHandle(trainer.instagram);

  return (
    <article
      className="card-sheen card-spotlight group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15"
      {...spotlightProps}
    >
      {/* Gradient edge sweeps across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] origin-right scale-x-0 bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {trainer.image ? (
          <Image
            src={trainer.image}
            alt={`المدرب ${trainer.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <UserRound className="size-16 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          {/* Gradient nameplate hairline above the name — matches the card edge language */}
          <span
            aria-hidden="true"
            className="mb-3 block h-[2px] w-10 origin-right scale-x-100 rounded-full bg-gradient-to-l from-primary to-[#1e6fe8]/40 transition-transform duration-500 group-hover:scale-x-[2.2]"
          />
          <h3 className="text-xl font-black">{trainer.name}</h3>
          <p className="mt-1 text-sm font-bold text-primary">{trainer.role}</p>
          {trainer.specialty ? (
            <p className="mt-1.5 max-w-[85%] text-xs leading-relaxed text-muted-foreground">{trainer.specialty}</p>
          ) : null}
          {handle ? (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
            >
              <Instagram className="size-3.5" aria-hidden="true" />
              <span dir="ltr">@{handle}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TrainersSection({ trainers }: { trainers: TrainerView[] }) {
  return (
    <section
      id="trainers"
      aria-labelledby="trainers-title"
      className="bg-deep relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the plain schedule section above */}
      <WaveDivider variant={1} className="text-background" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="المدربون"
          headingId="trainers-title"
          ghostNumber="04"
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
            {trainers.slice(0, 6).map((trainer, i) => (
              <FadeUp key={trainer.id} delay={(i % 3) * 0.12}>
                <TrainerCard trainer={trainer} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
