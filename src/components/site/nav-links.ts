export interface NavLink {
  href: string;
  label: string;
}

/**
 * Landing page section links. Every link is always rendered in the desktop
 * bar (from lg up, with tighter sizing at lg) and in the mobile sheet —
 * no link is ever hidden based on viewport width.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن الجيم" },
  { href: "#classes", label: "الكلاسات" },
  { href: "#schedule", label: "الجدول الأسبوعي" },
  { href: "#trainers", label: "المدربون" },
  { href: "#pricing", label: "الباقات" },
  { href: "#gallery", label: "المعرض" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#contact", label: "تواصل معنا" },
];
