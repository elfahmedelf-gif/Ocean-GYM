/**
 * Thin compatibility layer over the shared domain lib (src/lib/gym.ts).
 * New code should import from "@/lib/gym" directly.
 */

// Re-exported from the shared lib — identical behavior to the previous copies here.
export { durationLabel } from "@/lib/gym";

/**
 * Formats a plan price as digits only: 600 -> "600", 1250.5 -> "1250.50".
 * Kept local (instead of re-exporting gym.ts's formatPrice) because the
 * landing-page cards render the "ج.م" currency label separately.
 */
export function formatPrice(price: number): string {
  return Number.isInteger(price) ? price.toLocaleString("en-US") : price.toFixed(2);
}
