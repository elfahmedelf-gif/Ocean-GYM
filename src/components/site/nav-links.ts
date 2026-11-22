export interface NavLink {
  href: string;
  label: string;
  /** Secondary links are hidden in the desktop bar below xl to avoid crowding. */
  secondary?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن الجيم" },
  { href: "#classes", label: "الكلاسات" },
  { href: "#schedule", label: "الجدول الأسبوعي" },
  { href: "#trainers", label: "المدربون" },
  { href: "#pricing", label: "الباقات" },
  { href: "#gallery", label: "المعرض" },
  { href: "#testimonials", label: "آراء العملاء", secondary: true },
  { href: "#contact", label: "تواصل معنا", secondary: true },
];
