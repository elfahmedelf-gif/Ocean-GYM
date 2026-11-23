"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  CalendarDays,
  CreditCard,
  Dumbbell,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Star,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apiFetch, jsonPost } from "@/components/admin/api";
import type { AdminPayload, Message } from "@/components/admin/types";

const NAV_ITEMS = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/members", label: "الأعضاء", icon: Users },
  { href: "/admin/schedule", label: "الجدول الأسبوعي", icon: CalendarDays },
  { href: "/admin/classes", label: "الكلاسات", icon: Dumbbell },
  { href: "/admin/trainers", label: "المدربون", icon: UserCheck },
  { href: "/admin/nutrition", label: "خطط التغذية", icon: UtensilsCrossed },
  { href: "/admin/plans", label: "الباقات", icon: CreditCard },
  { href: "/admin/messages", label: "الرسائل", icon: Mail, badgeKey: "unread" as const },
  { href: "/admin/testimonials", label: "آراء العملاء", icon: Star },
  { href: "/admin/gallery", label: "معرض الصور", icon: ImageIcon },
];

function NavLinks({
  activeHref,
  unreadCount,
  onNavigate,
}: {
  activeHref: string;
  unreadCount: number;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="التنقل الرئيسي" className="flex flex-col gap-1 px-3">
      {/* Section caption — quiet editorial label above the nav stack */}
      <p
        className="mb-2 flex items-center gap-2 px-3 text-[10px] font-bold tracking-widest text-muted-foreground/60"
        aria-hidden="true"
      >
        <span className="h-px w-3 bg-gradient-to-l from-primary/50 to-transparent" />
        لوحة الإدارة
      </p>
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? activeHref === "/admin"
            : activeHref.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? "bg-gradient-to-l from-primary/15 via-primary/[0.07] to-transparent font-bold text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            {/* Gradient start-edge indicator for the active page */}
            {active ? (
              <span
                aria-hidden="true"
                className="absolute inset-y-1.5 start-0 w-1 rounded-full bg-gradient-to-b from-primary to-[#1e6fe8] shadow-[0_0_10px_rgba(56,199,232,0.6)]"
              />
            ) : null}
            {/* Icon chip — fills with the ocean gradient on the active page */}
            <span
              aria-hidden="true"
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                active
                  ? "bg-gradient-to-br from-primary to-[#1e6fe8] text-primary-foreground shadow-[0_4px_14px_rgba(56,199,232,0.4)]"
                  : "bg-accent/60 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1">{item.label}</span>
            {item.badgeKey === "unread" && unreadCount > 0 && (
              <Badge className="bg-destructive/90 text-destructive-foreground border-0 px-2 min-w-6 h-5 rounded-full text-xs">
                {unreadCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-4 py-5">
      <Image
        src="/images/logo.png"
        alt="شعار Ocean GYM"
        width={48}
        height={48}
        className="ocean-ring h-12 w-auto rounded-xl object-contain"
        priority
      />
      <div className="leading-tight">
        <p className="text-base font-black text-gradient-ocean">Ocean GYM</p>
        <p className="text-xs text-muted-foreground">لوحة التحكم</p>
      </div>
    </div>
  );
}

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminPayload;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch unread messages count for the sidebar badge
  useEffect(() => {
    let cancelled = false;
    apiFetch<Message[]>("/api/admin/messages")
      .then((messages) => {
        if (!cancelled) {
          setUnread(messages.filter((m) => !m.read).length);
        }
      })
      .catch(() => {
        // silent — badge is non-critical
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await jsonPost("/api/admin/logout", {});
      toast.success("تم تسجيل الخروج بنجاح");
      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تسجيل الخروج");
      setLoggingOut(false);
    }
  }

  const activeHref = pathname ?? "/admin";

  return (
    <div className="relative min-h-screen bg-background">
      <Toaster richColors position="top-center" dir="rtl" />

      {/* Ambient ocean backdrop — blueprint grid + drifting glows behind all content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid-ocean absolute inset-0" />
        <div className="absolute -top-32 start-[14%] size-[380px] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute bottom-[-120px] end-[6%] size-[340px] rounded-full bg-[#1e6fe8]/[0.07] blur-3xl" />
      </div>

      {/* ===== Desktop sidebar (right in RTL) ===== */}
      <aside
        className="sidebar-aurora hidden md:flex fixed inset-y-0 start-0 w-64 flex-col border-e border-sidebar-border bg-gradient-to-b from-[#061024] via-sidebar to-[#04101f] z-40"
        aria-label="الشريط الجانبي"
      >
        <Brand />
        {/* Gold hairline melting the brand block into the nav stack */}
        <span
          aria-hidden="true"
          className="mx-4 h-px bg-gradient-to-l from-transparent via-[#e2bd62]/45 to-transparent"
        />

        <div className="relative flex-1 overflow-y-auto custom-scrollbar py-2">
          <NavLinks activeHref={activeHref} unreadCount={unread} />
        </div>

        <div className="relative border-t border-sidebar-border p-3">
          <div className="glass flex items-center gap-3 rounded-xl p-3">
            <Avatar className="h-9 w-9 border border-primary/40">
              <AvatarFallback className="bg-gradient-to-br from-primary/25 to-primary/10 text-primary text-sm font-bold">
                {admin.name.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{admin.name}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                @{admin.username}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="تسجيل الخروج"
              title="تسجيل الخروج"
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">خروج</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* ===== Mobile topbar ===== */}
      <header className="glass md:hidden sticky top-0 z-40 border-b border-border/60">
        {/* Gradient hairline under the glass bar */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent"
        />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="شعار Ocean GYM"
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="font-bold text-gradient-ocean">Ocean GYM</span>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="فتح القائمة"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sidebar-aurora w-72 border-s border-sidebar-border bg-gradient-to-b from-[#061024] via-sidebar to-[#04101f] p-0 overflow-y-auto custom-scrollbar">
              <SheetHeader className="border-b border-sidebar-border">
                <SheetTitle className="text-start">
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <div className="py-2">
                <NavLinks
                  activeHref={activeHref}
                  unreadCount={unread}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
              <div className="border-t border-sidebar-border p-3 mt-4">
                <div className="glass flex items-center gap-3 rounded-xl p-3">
                  <Avatar className="h-9 w-9 border border-primary/40">
                    <AvatarFallback className="bg-gradient-to-br from-primary/25 to-primary/10 text-primary text-sm font-bold">
                      {admin.name.charAt(0) || "م"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{admin.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      @{admin.username}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-2 w-full justify-start text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  تسجيل الخروج
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="relative md:ms-64 min-h-screen p-4 md:p-6">{children}</main>
    </div>
  );
}
