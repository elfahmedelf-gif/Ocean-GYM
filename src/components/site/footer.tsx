import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, KeyRound, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { NAV_LINKS } from "./nav-links";

const SOCIALS = [
  { icon: Facebook, label: "فيسبوك", href: "https://facebook.com" },
  { icon: Instagram, label: "إنستجرام", href: "https://instagram.com" },
  { icon: Youtube, label: "يوتيوب", href: "https://youtube.com" },
  { icon: Twitter, label: "تويتر", href: "https://x.com" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="شعار Ocean GYM"
                width={48}
                height={48}
                className="ocean-ring h-12 w-12 rounded-xl"
              />
              <span className="text-lg font-extrabold tracking-wide" dir="ltr">
                OCEAN <span className="text-gradient-ocean">GYM</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              أقوى جيم في القاهرة الجديدة — أحدث الأجهزة الأمريكية، مدربون معتمدون دوليًا، وأجواء
              تدفعك كل يوم لتكون نسخة أقوى من نفسك.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="روابط سريعة">
            <h3 className="mb-4 font-extrabold">روابط سريعة</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/portal/login"
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <KeyRound className="size-3.5 text-primary" aria-hidden="true" />
                  بوابة الأعضاء
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-extrabold">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="tel:+201001234567" dir="ltr" className="transition-colors hover:text-primary">
                  0100 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="mailto:info@oceangym.com" dir="ltr" className="transition-colors hover:text-primary">
                  info@oceangym.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                التجمع الخامس، القاهرة الجديدة
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-6">
          <p>© 2025 Ocean GYM — جميع الحقوق محفوظة</p>
          <Link href="/admin" className="transition-colors hover:text-primary">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}
