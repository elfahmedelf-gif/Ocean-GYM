"use client";

import Image from "next/image";
import { Instagram, UserRound } from "lucide-react";
import { FadeUp } from "./fade-up";
import { useLang } from "./language";
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
  const { t, tx } = useLang();
  const handle = instagramHandle(trainer.instagram);

  return (
    <article
      className="card-sheen card-spotlight group relative overflow-hidden rounded-3xl border border-primary/15 bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_30px_76px_-18px_rgba(56,199,232,0.5)]"
      {...spotlightProps}
    >
      {/* Gradient edge sweeps across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] rtl:origin-right ltr:origin-left scale-x-0 rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-primary via-[#1e6fe8] to-[#7dd8f0] transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {trainer.image ? (
          <Image
            src={trainer.image}
            alt={t.trainers.trainerAlt(tx(trainer.name))}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:saturate-125"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <UserRound className="size-16 text-primary/40" aria-hidden="true" />
          </div>
        )}
        {/* Ocean duotone wash that lifts to true color on hover */}
        <div
          aria-hidden="true"
          className="duotone-ocean absolute inset-0 z-[1] bg-gradient-to-t from-primary/35 via-transparent to-primary/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          {/* Gold hairline above the name — the luxury nameplate signature */}
          <span
            aria-hidden="true"
            className="mb-3 block h-[2px] w-10 origin-right scale-x-100 rounded-full bg-gradient-to-l from-[#e7c069] to-[#c9962e]/30 shadow-[0_0_10px_rgba(226,189,98,0.4)] transition-transform duration-500 group-hover:scale-x-[2.2]"
          />
          <h3 className="text-xl font-black transition-colors duration-300 group-hover:text-foreground">{tx(trainer.name)}</h3>
          <p className="mt-1 text-sm font-bold text-primary drop-shadow-[0_0_10px_rgba(56,199,232,0.25)]">{tx(trainer.role)}</p>
          {trainer.specialty ? (
            <p className="mt-1.5 max-w-[85%] text-xs leading-relaxed text-muted-foreground">{tx(trainer.specialty)}</p>
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
  const { t } = useLang();

  return (
    <section
      id="trainers"
      aria-labelledby="trainers-title"
      className="bg-deep relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the plain schedule section above */}
      <WaveDivider variant={1} className="text-background" />
      {/* Living aurora — drifting glows keep the band alive */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker={t.trainers.kicker}
          headingId="trainers-title"
          ghostNumber="04"
          title={
            <>
              {t.trainers.titlePre}
              <span className="text-gradient-ocean">{t.trainers.titleGradient}</span>
              {t.trainers.titlePost}
            </>
          }
          subtitle={t.trainers.subtitle}
        />

        {trainers.length === 0 ? (
          <FadeUp className="glass mx-auto max-w-md rounded-2xl p-10 text-center text-muted-foreground">
            {t.trainers.empty}
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
