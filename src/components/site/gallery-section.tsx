"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import type { GalleryView } from "./types";

export function GallerySection({ gallery }: { gallery: GalleryView[] }) {
  const [selected, setSelected] = useState<GalleryView | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="المعرض"
          headingId="gallery-title"
          title={
            <>
              جولة داخل <span className="text-gradient-ocean">المكان</span>
            </>
          }
          subtitle="اطلع على أرضية التمرين، الاستوديوهات، والحمام السباحة — الأجواء التي ستمارس فيها كل يوم."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {gallery.map((item, i) => (
            <FadeUp key={item.id} delay={(i % 4) * 0.08}>
              <button
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`عرض صورة: ${item.title}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/15"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#050d1f]/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-start text-sm font-bold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title}
                </span>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl gap-3 border-primary/30 bg-card p-3 md:p-4">
          {selected ? (
            <>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-lg font-extrabold">{selected.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  صورة من معرض Ocean GYM
                </DialogDescription>
              </DialogHeader>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
