import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";
import { SOCIALS } from "./socials";
import { WaveDivider } from "./wave-divider";

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
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      {/* Shoreline from the deep join band above */}
      <WaveDivider variant={3} className="text-[#081228]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
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
            <div className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-primary group-hover:to-[#1e6fe8] group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
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

            <div className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-primary group-hover:to-[#1e6fe8] group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">العنوان</div>
                <div className="mt-1 font-bold">{SITE.address}</div>
              </div>
            </div>

            <div className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-primary group-hover:to-[#1e6fe8] group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
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

            <div className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/25 transition-all duration-300 group-hover:from-primary group-hover:to-[#1e6fe8] group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
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
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex size-11 items-center justify-center rounded-full border border-primary/25 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
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
