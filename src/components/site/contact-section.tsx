"use client";

import { useState } from "react";
import { Clock, Facebook, Instagram, LoaderCircle, Mail, MapPin, Phone, Send, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FadeUp } from "./fade-up";
import { SectionHeading } from "./section-heading";

const SOCIALS = [
  { icon: Facebook, label: "فيسبوك", href: "https://facebook.com" },
  { icon: Instagram, label: "إنستجرام", href: "https://instagram.com" },
  { icon: Youtube, label: "يوتيوب", href: "https://youtube.com" },
  { icon: Twitter, label: "تويتر", href: "https://x.com" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  content?: string;
}

export function ContactSection() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "الاسم مطلوب";
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!content.trim()) next.content = "الرسالة مطلوبة";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, content }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 201) {
        toast({
          title: "تم إرسال رسالتك بنجاح",
          description: "سنرد عليك في أقرب وقت ممكن",
        });
        setName("");
        setEmail("");
        setSubject("");
        setContent("");
      } else {
        toast({
          title: "تعذر إرسال الرسالة",
          description: data.error ?? "حدث خطأ غير متوقع، حاول مرة أخرى",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "تعذر إرسال الرسالة",
        description: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

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
          subtitle="لديك سؤال عن الباقات أو الحصص؟ راسلنا أو زرنا في التجمع الخامس — فريقنا جاهز لمساعدتك."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Info cards + socials */}
          <FadeUp className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="flex items-center gap-3">
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

          {/* Message form */}
          <FadeUp delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="glass space-y-4 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-extrabold">أرسل لنا رسالة</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">الاسم</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-11"
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className="h-11"
                  />
                  {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject">الموضوع</Label>
                <Input
                  id="contact-subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="موضوع الرسالة (اختياري)"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-content">الرسالة</Label>
                <Textarea
                  id="contact-content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                  aria-invalid={Boolean(errors.content)}
                />
                {errors.content ? <p className="text-xs text-destructive">{errors.content}</p> : null}
              </div>

              <Button type="submit" disabled={loading} className="h-12 w-full text-base font-bold">
                {loading ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="size-5" aria-hidden="true" />
                    إرسال الرسالة
                  </>
                )}
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
