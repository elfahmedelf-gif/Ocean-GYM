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
