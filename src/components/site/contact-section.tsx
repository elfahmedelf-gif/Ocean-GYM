import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";

const SOCIALS = [
  { icon: Facebook, label: "فيسبوك", href: "https://facebook.com" },
  { icon: Instagram, label: "إنستجرام", href: "https://instagram.com" },
  { icon: Youtube, label: "يوتيوب", href: "https://youtube.com" },
  { icon: Twitter, label: "تويتر", href: "https://x.com" },
] as const;

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
                  href="tel:+201001234567"
                  dir="ltr"
                  className="mt-1 block font-bold transition-colors hover:text-primary"
                >
                  0100 123 4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">العنوان</div>
                <div className="mt-1 font-bold">التجمع الخامس، القاهرة الجديدة</div>
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
                  href="mailto:info@oceangym.com"
                  dir="ltr"
                  className="mt-1 block font-bold transition-colors hover:text-primary"
                >
                  info@oceangym.com
                </a>
              </div>
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
