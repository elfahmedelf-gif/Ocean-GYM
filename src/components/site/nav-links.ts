export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن الجيم" },
  { href: "#classes", label: "الكلاسات" },
  { href: "#trainers", label: "المدربون" },
  { href: "#pricing", label: "الباقات" },
  { href: "#gallery", label: "المعرض" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#contact", label: "تواصل معنا" },
];
