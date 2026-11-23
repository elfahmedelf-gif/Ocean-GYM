"use client";

import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { FadeUp } from "./fade-up";
import { useLang } from "./language";
import { SectionHeading } from "./section-heading";
import { SOCIALS } from "./socials";
import { spotlightProps } from "./spotlight";
import { WaveDivider } from "./wave-divider";

/** Google Maps embed (no API key needed) centered on the club location. */
const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(SITE.address) +
  "&z=13&hl=ar&output=embed";
const MAP_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(SITE.address);

export function ContactSection() {
  const { t, lang } = useLang();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the deep join band above */}
      <WaveDivider variant={3} className="text-[#081228]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker={t.contact.kicker}
          headingId="contact-title"
          ghostNumber="08"
          title={
            <>
              {t.contact.titlePre}
              <span className="text-gradient-ocean">{t.contact.titleGradient}</span>
              {t.contact.titlePost}
            </>
          }
          subtitle={t.contact.subtitle}
        />

        <FadeUp className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="card-sheen card-spotlight lux-card group flex items-start gap-3.5 rounded-3xl border border-primary/15 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_48px_-16px_rgba(56,199,232,0.3)]"
              {...spotlightProps}
            >
              <span className="icon-tile size-11">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{t.contact.phone}</div>
                <a
                  href={SITE.phoneHref}
                  dir="ltr"
                  className="mt-1 block font-bold transition-colors hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <div
              className="card-sheen card-spotlight lux-card group flex items-start gap-3.5 rounded-3xl border border-primary/15 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_48px_-16px_rgba(56,199,232,0.3)]"
              {...spotlightProps}
            >
              <span className="icon-tile size-11">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{t.contact.address}</div>
                <div className="mt-1 font-bold">{SITE.address}</div>
              </div>
            </div>

            <div
              className="card-sheen card-spotlight lux-card group flex items-start gap-3.5 rounded-3xl border border-primary/15 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_48px_-16px_rgba(56,199,232,0.3)]"
              {...spotlightProps}
            >
              <span className="icon-tile size-11">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{t.contact.hours}</div>
                <div className="mt-1 text-sm font-bold leading-relaxed">
                  {t.contact.satThu} <span dir="ltr">{lang === "ar" ? "8ص - 12م" : "8AM - 12PM"}</span>
                  <br />
                  {t.contact.fri} <span dir="ltr">{lang === "ar" ? "10ص - 10م" : "10AM - 10PM"}</span>
                </div>
              </div>
            </div>

            <div
              className="card-sheen card-spotlight lux-card group flex items-start gap-3.5 rounded-3xl border border-primary/15 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_48px_-16px_rgba(56,199,232,0.3)]"
              {...spotlightProps}
            >
              <span className="icon-tile size-11">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{t.contact.email}</div>
                <a
                  href={SITE.emailHref}
                  dir="ltr"
                  className="mt-1 block font-bold transition-colors hover:text-primary"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          {/* Location map — full-width below the cards */}
          <div className="lux-frame overflow-hidden rounded-3xl bg-card">
            <span
              aria-hidden="true"
              className="block h-[3px] w-full bg-gradient-to-l from-primary via-[#1e6fe8] to-[#7dd8f0]"
            />
            <div className="relative h-72 w-full md:h-96">
              <iframe
                src={MAP_EMBED_SRC}
                title={t.contact.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="flex flex-col items-start justify-between gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="font-bold">{SITE.address}</span>
              </div>
              <a
                href={MAP_DIRECTIONS_HREF}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t.contact.directions}
                <Navigation
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
              >
                <social.icon className="size-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
