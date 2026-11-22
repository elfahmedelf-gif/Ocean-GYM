"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
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
  { href: "/admin/classes", label: "الكلاسات", icon: Dumbbell },
  { href: "/admin/trainers", label: "المدربون", icon: UserCheck },
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
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
        className="h-12 w-auto object-contain"
        priority
      />
      <div className="leading-tight">
        <p className="text-base font-bold text-gradient-ocean">Ocean GYM</p>
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
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" dir="rtl" />

      {/* ===== Desktop sidebar (right in RTL) ===== */}
      <aside
        className="hidden md:flex fixed inset-y-0 right-0 w-64 flex-col border-l border-sidebar-border bg-sidebar z-40"
        aria-label="الشريط الجانبي"
      >
        <Brand />

        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          <NavLinks activeHref={activeHref} unreadCount={unread} />
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
            <Avatar className="h-9 w-9 border border-primary/40">
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
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
              size="icon"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="تسجيل الخروج"
              title="تسجيل الخروج"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ===== Mobile topbar ===== */}
      <header className="md:hidden sticky top-0 z-40 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
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
            <SheetContent side="right" className="bg-sidebar w-72 p-0 overflow-y-auto custom-scrollbar">
              <SheetHeader className="border-b border-sidebar-border">
                <SheetTitle className="text-right">
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
                <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
                  <Avatar className="h-9 w-9 border border-primary/40">
                    <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
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
      <main className="md:mr-64 min-h-screen p-4 md:p-6">{children}</main>
    </div>
  );
}
