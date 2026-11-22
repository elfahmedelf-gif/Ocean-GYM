import { Waves } from "lucide-react";

const ITEMS = ["OCEAN GYM", "قوة", "انضباط", "نتائج", "NO PAIN NO GAIN"];

function Sequence() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center">
          <span
            className={`mx-6 whitespace-nowrap text-lg font-extrabold tracking-wide md:text-xl ${
              i % 2 === 0 ? "text-foreground/85" : "text-primary"
            }`}
            dir="auto"
          >
            {item}
          </span>
          <Waves className="size-5 shrink-0 text-primary/70" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

/** Infinite scrolling brand strip (CSS marquee, seamless in RTL via duplicated content). */
export function MarqueeStrip() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-primary/20 bg-secondary/40 py-4"
    >
      <div className="animate-marquee flex w-max">
        <Sequence />
        <Sequence />
      </div>
      {/* Edge fade overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
