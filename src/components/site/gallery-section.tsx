"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { WaveDivider } from "./wave-divider";
import type { GalleryView } from "./types";

export function GallerySection({ gallery }: { gallery: GalleryView[] }) {
  /** Index of the image open in the lightbox (null = closed). */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const selected = openIndex !== null ? gallery[openIndex] : null;

  // Wrap-around navigation (RTL flow: "next" moves toward the visual left).
  const goNext = useCallback(() => {
    setOpenIndex((i) => (i === null || gallery.length === 0 ? null : (i + 1) % gallery.length));
  }, [gallery.length]);
  const goPrev = useCallback(() => {
    setOpenIndex((i) =>
      i === null || gallery.length === 0 ? null : (i - 1 + gallery.length) % gallery.length
    );
  }, [gallery.length]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="bg-deep relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the plain pricing section above */}
      <WaveDivider variant={3} className="text-background" />
      {/* Living aurora — drifting glows keep the band alive */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="المعرض"
          headingId="gallery-title"
          ghostNumber="07"
          title={
            <>
              جولة داخل <span className="text-gradient-ocean">المكان</span>
            </>
          }
          subtitle="اطلع على أرضية التمرين والاستوديوهات ومناطق الكارديو — الأجواء التي ستمارس فيها كل يوم."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {gallery.map((item, i) => (
            <FadeUp
              key={item.id}
              delay={(i % 4) * 0.08}
              className={i === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`عرض صورة: ${item.title}`}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
                  // First image becomes a wide featured banner (spans 2 columns from sm up)
                  i === 0
                    ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full"
                    : "aspect-[4/3]"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Always-visible index chip — gold for the featured tile, cyan for the rest */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute start-3 top-3 z-10 rounded-full border px-2.5 py-0.5 text-[11px] font-black tabular-nums backdrop-blur-md",
                    i === 0
                      ? "border-[#e7c069]/40 bg-[#e2bd62]/10 text-[#e7c069]"
                      : "border-primary/25 bg-background/70 text-primary/90"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Title tag stays pinned on the featured tile (desktop) */}
                {i === 0 ? (
                  <span className="absolute inset-x-0 bottom-0 hidden p-3 text-start text-sm font-bold lg:block">
                    <span className="glass rounded-lg px-2.5 py-1">{item.title}</span>
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                {/* Glass zoom cue at the center */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  <span className="glass flex size-11 scale-75 items-center justify-center rounded-full text-primary transition-transform duration-300 group-hover:scale-100">
                    <Maximize2 className="size-5" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-start text-sm font-bold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="glass rounded-lg px-2.5 py-1">{item.title}</span>
                </span>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Lightbox with prev/next navigation (RTL: next = visual left) */}
      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          className="max-w-3xl gap-3 border-primary/30 bg-card p-3 md:p-4"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goNext();
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              goPrev();
            }
          }}
        >
          {selected && openIndex !== null ? (
            <>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  key={selected.id}
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>

              {gallery.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="الصورة السابقة"
                    className="absolute start-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none md:start-3"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="الصورة التالية"
                    className="absolute end-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none md:end-3"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}

              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-lg font-extrabold">{selected.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  صورة من معرض Ocean GYM — استخدم الأسهم للتنقل بين الصور
                </DialogDescription>
                <span
                  dir="ltr"
                  className="text-xs font-semibold tabular-nums text-muted-foreground"
                >
                  {openIndex + 1} / {gallery.length}
                </span>
              </DialogHeader>

              <span className="sr-only" aria-live="polite">
                الصورة {openIndex + 1} من {gallery.length}: {selected.title}
              </span>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
