/** Curated image paths available in /public/images for admin selects */
import { GYM_IMAGES } from "@/lib/gym";

/** Re-exported from lib/gym so all selects share one source of truth */
export const IMAGE_OPTIONS = GYM_IMAGES;

/** Trainer image subset */
export const TRAINER_IMAGE_OPTIONS = IMAGE_OPTIONS.filter((p) =>
  p.startsWith("/images/trainer-")
);

/** Class image subset */
export const CLASS_IMAGE_OPTIONS = IMAGE_OPTIONS.filter((p) =>
  p.startsWith("/images/class-")
);

/** Friendly Arabic labels for known image file names */
const IMAGE_LABELS: Record<string, string> = {
  "hero-bg": "خلفية الغلاف",
  "hero-boxing": "غلاف — بوكسينج",
  "hero-weights": "غلاف — أوزان حرة",
  "about-gym": "صورة عن النادي",
  "trainer-1": "مدرب 1",
  "trainer-2": "مدرب 2",
  "trainer-3": "مدرب 3",
  "class-boxing": "بوكسينج",
  "class-crossfit": "كروسفيت",
  "class-bodybuilding": "كمال أجسام",
  "class-spinning": "سبينينج",
  "class-yoga": "يوغا",
  "class-functional": "تمارين وظيفية",
  "logo-wide": "الشعار العريض",
  logo: "الشعار",
};

/**
 * Human-friendly label for an image path: strips the `/images/` prefix and the
 * file extension, then maps known names to Arabic labels (fallback: bare name).
 * Example: "/images/class-boxing.jpg" → "بوكسينج"
 */
export function imageOptionLabel(path: string): string {
  const name = path
    .replace(/^\/images\//, "")
    .replace(/\.(jpe?g|png|webp|gif|svg|avif)$/i, "");
  return IMAGE_LABELS[name] ?? name;
}
