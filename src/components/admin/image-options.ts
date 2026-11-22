/** Curated image paths available in /public/images for admin selects */
export const IMAGE_OPTIONS = [
  "/images/hero-bg.jpg",
  "/images/about-gym.jpg",
  "/images/trainer-1.jpg",
  "/images/trainer-2.jpg",
  "/images/trainer-3.jpg",
  "/images/class-boxing.jpg",
  "/images/class-crossfit.jpg",
  "/images/class-bodybuilding.jpg",
  "/images/class-spinning.jpg",
  "/images/class-yoga.jpg",
  "/images/class-functional.jpg",
  "/images/class-swimming.jpg",
  "/images/logo-wide.png",
  "/images/logo.png",
] as const;

/** Trainer image subset */
export const TRAINER_IMAGE_OPTIONS = IMAGE_OPTIONS.filter((p) =>
  p.startsWith("/images/trainer-")
);

/** Class image subset */
export const CLASS_IMAGE_OPTIONS = IMAGE_OPTIONS.filter((p) =>
  p.startsWith("/images/class-")
);
