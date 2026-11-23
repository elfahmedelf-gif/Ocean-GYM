"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, Waves } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLang } from "./language";
import { SOCIALS } from "./socials";
import { WaveDivider } from "./wave-divider";

/** Consistent keyboard focus styling for every footer link. */
const LINK_FOCUS =
  "rounded-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none";

export function SiteFooter() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  // Address follows the active language — Arabic script in AR, Latin in EN.
  const address = lang === "ar" ? SITE.address : SITE.addressEn;

  return (
    <footer className="bg-deep relative">
      {/* Shoreline from the plain contact section above — replaces a flat border */}
      <WaveDivider variant={2} className="text-background" />

      {/* Living aurora across the whole footer */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0" />

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
                alt={t.footer.logoAlt}
                width={48}
                height={48}
                className="ocean-ring h-12 w-12 rounded-xl"
              />
              <span className="text-lg font-black tracking-wide" dir="ltr">
                OCEAN <span className="text-gradient-ocean">GYM</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/15 hover:text-primary hover:shadow-[0_10px_26px_-8px_rgba(56,199,232,0.5)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <Waves className="size-3.5 text-primary/70" aria-hidden="true" />
              {t.footer.certified}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label={t.footer.quickLinks}>
            <h3 className="font-black">{t.footer.quickLinks}</h3>
            <span
              aria-hidden="true"
              className="mb-5 mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-l from-primary to-[#1e6fe8]/40"
            />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {t.nav.items.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      LINK_FOCUS,
                      "group inline-flex items-center gap-1.5 text-muted-foreground transition-all duration-200 hover:text-primary"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-2.5"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-black">{t.footer.contactUs}</h3>
            <span
              aria-hidden="true"
              className="mb-5 mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-l from-primary to-[#1e6fe8]/40"
            />
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
                {address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant fading brand watermark that sinks behind the bottom bar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden">
        <p className="watermark -mb-[0.32em] text-center" dir="ltr">
          OCEAN GYM
        </p>
      </div>

      <div className="relative z-10 border-t border-primary/10 bg-[#081228]/70">
        {/* Gradient hairline melting the bottom bar into the footer */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent"
        />
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground backdrop-blur-sm sm:flex-row md:px-6">
          <p className="flex items-center gap-2">
            <Waves className="size-3.5 text-primary/70" aria-hidden="true" />
            © {year} Ocean GYM — {t.footer.rights}
          </p>
          <p className="flex items-center gap-2" dir="ltr">
            <span aria-hidden="true" className="size-1.5 rotate-45 rounded-[1px] bg-gradient-to-br from-[#f3ddab] to-[#c9962e] shadow-[0_0_6px_rgba(226,189,98,0.5)]" />
            <span className="font-semibold tracking-widest text-foreground/70">OCEAN GYM</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
