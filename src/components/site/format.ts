/** Formats a plan price: 600 -> "600", 1250.5 -> "1250.50" */
export function formatPrice(price: number): string {
  return Number.isInteger(price) ? price.toLocaleString("en-US") : price.toFixed(2);
}

/** Human label for a plan duration in months */
export function durationLabel(months: number): string {
  if (months === 1) return "شهريًا";
  if (months === 3) return "كل 3 شهور";
  if (months === 12) return "سنويًا";
  return `لكل ${months} شهور`;
}
