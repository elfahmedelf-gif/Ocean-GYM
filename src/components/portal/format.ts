/** Portal formatting helpers — safe date parsing + RTL-safe numbers. */

const DAY_MS = 86_400_000;

/** Parse an ISO string safely; returns null when missing/invalid. */
export function safeDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format a date in ar-EG (e.g. "22 نوفمبر 2025"). Returns "—" when invalid. */
export function formatDate(
  iso: string | null | undefined,
  opts?: Intl.DateTimeFormatOptions
): string {
  const d = safeDate(iso);
  if (!d) return "—";
  return d.toLocaleDateString("ar-EG", opts ?? { day: "numeric", month: "long", year: "numeric" });
}

/** Short date label for charts/tables (e.g. "٢٢ نوف"). */
export function formatShortDate(iso: string | null | undefined): string {
  return formatDate(iso, { day: "numeric", month: "short" });
}

/** Days remaining until endDate (ceil, min 0). Null when no valid endDate. */
export function daysRemaining(iso: string | null | undefined): number | null {
  const end = safeDate(iso);
  if (!end) return null;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / DAY_MS));
}

/** Whole days between two dates (ceil, min 1). Null when either is invalid. */
export function daysBetween(
  startIso: string | null | undefined,
  endIso: string | null | undefined
): number | null {
  const start = safeDate(startIso);
  const end = safeDate(endIso);
  if (!start || !end) return null;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));
}

/** Clamp a value into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Format a weight-change delta with explicit sign, e.g. "+3.4" / "−2.1". */
export function formatDelta(delta: number): string {
  const rounded = Math.round(delta * 10) / 10;
  if (rounded > 0) return `+${rounded}`;
  if (rounded < 0) return `${rounded}`;
  return "0";
}
