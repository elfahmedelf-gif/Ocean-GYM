import { Clock, Facebook, Instagram, Mail, MapPin, Navigation, Phone, Twitter, Youtube } from "lucide-react";
import { SITE } from "@/lib/site";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";

const SOCIALS = [
  { icon: Facebook, href: SITE.socials[0].href, label: SITE.socials[0].label },
  { icon: Instagram, href: SITE.socials[1].href, label: SITE.socials[1].label },
  { icon: Youtube, href: SITE.socials[2].href, label: SITE.socials[2].label },
  { icon: Twitter, href: SITE.socials[3].href, label: SITE.socials[3].label },
] as const;

/** Google Maps embed (no API key needed) centered on the club location. */
const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(SITE.address) +
  "&z=13&hl=ar&output=embed";
const MAP_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(SITE.address);

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 bg-secondary/25 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          kicker="تواصل معنا"
          headingId="contact-title"
          title={
            <>
              نحن <span className="text-gradient-ocean">هنا</span> من أجلك
            </>
          }
          subtitle="لديك سؤال عن الباقات أو الحصص؟ زرنا في التجمع الخامس أو تواصل معنا مباشرة — فريقنا جاهز لمساعدتك."
        />

        <FadeUp className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">الهاتف</div>
                <a
                  href={SITE.phoneHref}
                  dir="ltr"
                  className="mt-1 block font-bold transition-colors hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">العنوان</div>
                <div className="mt-1 font-bold">{SITE.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">مواعيد العمل</div>
                <div className="mt-1 text-sm font-bold leading-relaxed">
                  السبت — الخميس: <span dir="ltr">8ص - 12م</span>
                  <br />
                  الجمعة: <span dir="ltr">10ص - 10م</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
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
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-lg shadow-black/25">
            <div className="relative h-72 w-full md:h-96">
              <iframe
                src={MAP_EMBED_SRC}
                title="موقع Ocean GYM على الخريطة — التجمع الخامس، القاهرة الجديدة"
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
                احصل على الاتجاهات
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
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary"
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
