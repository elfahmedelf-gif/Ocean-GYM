import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Shared social links used by both the footer and the contact section
 * (single source of truth — icon + href pairs on top of SITE.socials).
 */
export interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const SOCIALS: SocialLink[] = [
  { name: SITE.socials[0].label, href: SITE.socials[0].href, icon: Facebook },
  { name: SITE.socials[1].label, href: SITE.socials[1].href, icon: Instagram },
  { name: SITE.socials[2].label, href: SITE.socials[2].href, icon: Youtube },
  { name: SITE.socials[3].label, href: SITE.socials[3].href, icon: Twitter },
];
