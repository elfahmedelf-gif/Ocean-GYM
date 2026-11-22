import Image from "next/image";
import Link from "next/link";
import { KeyRound, Mail, MapPin, Phone, Waves } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";
import { SOCIALS } from "./socials";
import { WaveDivider } from "./wave-divider";

/** Consistent keyboard focus styling for every footer link. */
const LINK_FOCUS =
  "rounded-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep relative">
      {/* Shoreline from the plain contact section above — replaces a flat border */}
      <WaveDivider variant={2} className="text-background" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 md:px-6 md:pb-16 md:pt-24">
        {/* Ambient glow behind the brand column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 start-[5%] size-72 rounded-full bg-primary/[0.07] blur-3xl"
        />
        <div className="relative grid gap-10 md:grid-cols-3">
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
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <Waves className="size-3.5 text-primary/70" aria-hidden="true" />
              مدربون معتمدون دوليًا — تجربة تمرين آمنة وممتعة
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="روابط سريعة">
            <h3 className="mb-4 font-extrabold">روابط سريعة</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(LINK_FOCUS, "text-muted-foreground transition-colors hover:text-primary")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/portal/login"
                  className={cn(LINK_FOCUS, "flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary")}
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
                <a
                  href={SITE.phoneHref}
                  dir="ltr"
                  className={cn(LINK_FOCUS, "transition-colors hover:text-primary")}
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={SITE.emailHref}
                  dir="ltr"
                  className={cn(LINK_FOCUS, "transition-colors hover:text-primary")}
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {SITE.address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-6">
          <p>© {year} Ocean GYM — جميع الحقوق محفوظة</p>
          <Link href="/admin" className={cn(LINK_FOCUS, "transition-colors hover:text-primary")}>
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}
