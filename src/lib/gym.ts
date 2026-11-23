/**
 * Ocean GYM — Shared domain constants & formatters
 * Used by landing page, admin dashboard and member portal.
 */

/** Week days — Egypt week starts Saturday */
export const GYM_DAYS = [
  { index: 0, name: "السبت" },
  { index: 1, name: "الأحد" },
  { index: 2, name: "الإثنين" },
  { index: 3, name: "الثلاثاء" },
  { index: 4, name: "الأربعاء" },
  { index: 5, name: "الخميس" },
  { index: 6, name: "الجمعة" },
] as const;

export function dayName(day: number): string {
  return GYM_DAYS.find((d) => d.index === day)?.name ?? "—";
}

/** Class levels */
export const CLASS_LEVELS = [
  { value: "all", label: "جميع المستويات" },
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
] as const;

export function levelLabel(level: string): string {
  return CLASS_LEVELS.find((l) => l.value === level)?.label ?? "جميع المستويات";
}

/** Shared badge classes for class levels (single source of truth). */
export function levelBadgeClass(level: string): string {
  switch (level) {
    case "beginner":
      return "border-emerald-400/30 bg-emerald-500/15 text-emerald-300";
    case "intermediate":
      return "border-amber-400/30 bg-amber-500/15 text-amber-300";
    case "advanced":
      return "border-rose-400/30 bg-rose-500/15 text-rose-300";
    default:
      return "border-primary/30 bg-primary/15 text-primary";
  }
}

/** Member statuses */
export const MEMBER_STATUSES = [
  { value: "pending", label: "قيد المراجعة" },
  { value: "active", label: "نشط" },
  { value: "expired", label: "منتهي" },
  { value: "frozen", label: "مجمّد" },
] as const;

export function statusLabel(status: string): string {
  return MEMBER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Nutrition meal types */
export const MEAL_TYPES = [
  { value: "breakfast", label: "الفطار" },
  { value: "lunch", label: "الغدا" },
  { value: "dinner", label: "العشا" },
  { value: "snack", label: "وجبة خفيفة" },
] as const;

export function mealTypeLabel(mealType: string): string {
  return MEAL_TYPES.find((m) => m.value === mealType)?.label ?? mealType;
}

/** Nutrition goals */
export const NUTRITION_GOALS = [
  { value: "bulk", label: "تضخيم" },
  { value: "cut", label: "تنشيف" },
  { value: "maintain", label: "وزن ثابت" },
  { value: "healthy", label: "صحة عامة" },
] as const;

export function goalLabel(goal: string): string {
  return NUTRITION_GOALS.find((g) => g.value === goal)?.label ?? goal;
}

/** Convert "HH:MM" (24h) to Arabic-friendly 12h string like "7:00 صباحًا" */
export function formatTime12(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = mStr ?? "00";
  if (Number.isNaN(h)) return time;
  const period = h < 12 ? "صباحًا" : "مساءً";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

/** Format price with currency */
export function formatPrice(price: number): string {
  const formatted = Number.isInteger(price) ? String(price) : price.toFixed(1);
  return `${formatted} ج.م`;
}

/** Format an ISO date as a long Arabic date (e.g. "١٢ يناير ٢٠٢٥"). Null → em dash. */
export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Digits-only price (cards render the currency label separately). */
export function formatPriceDigits(price: number): string {
  return Number.isInteger(price) ? price.toLocaleString("en-US") : price.toFixed(2);
}

/** Plan duration label in Arabic */
export function durationLabel(duration: number): string {
  if (duration === 1) return "شهريًا";
  if (duration === 3) return "كل 3 شهور";
  if (duration === 12) return "سنويًا";
  return `لكل ${duration} شهور`;
}

/** Available gym images (for admin selects) */
export const GYM_IMAGES = [
  "/images/hero-bg.jpg",
  "/images/hero-boxing.jpg",
  "/images/hero-weights.jpg",
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
  "/images/logo-wide.png",
  "/images/logo.png",
] as const;
