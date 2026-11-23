/**
 * Ocean GYM — single source of truth for brand & contact data.
 * Used by the landing page, footer, forms and floating widgets.
 */

export const SITE = {
  name: "Ocean GYM",
  nameAr: "أوشن جيم",
  tagline: "بحر من القوة",

  phoneDisplay: "0100 123 4567",
  phoneHref: "tel:+201001234567",

  whatsappHref:
    "https://wa.me/201001234567?text=" +
    encodeURIComponent("أهلاً Ocean GYM، عايز أستفسر عن الباقات والحصص"),
  whatsappHrefEn:
    "https://wa.me/201001234567?text=" +
    encodeURIComponent("Hello Ocean GYM, I would like to ask about your plans and classes"),

  email: "info@oceangym.com",
  emailHref: "mailto:info@oceangym.com",

  address: "المقطم حي الدبلومسيين",
  addressEn: "Mokattam, Diplomats District",

  socials: [
    { label: "فيسبوك", href: "https://facebook.com" },
    { label: "إنستجرام", href: "https://instagram.com" },
    { label: "يوتيوب", href: "https://youtube.com" },
    { label: "تويتر", href: "https://x.com" },
  ],
} as const;

export type SiteSocial = (typeof SITE.socials)[number];
