"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Dumbbell,
  Home,
  Images,
  Info,
  Mail,
  Menu,
  Sparkles,
  Star,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";

/** Sections observed for scroll-spy (desktop nav only). */
const SPY_IDS = NAV_LINKS.map((l) => l.href.slice(1));

/** Icon per section — gives the mobile drawer a professional, scannable look. */
const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home,
  about: Info,
  classes: Dumbbell,
  schedule: CalendarDays,
  trainers: Users,
  pricing: Wallet,
  gallery: Images,
  testimonials: Star,
  contact: Mail,
};

/** Shared keyboard-focus styling for nav links. */
const NAV_FOCUS =
  "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // A slim horizontal band around the upper third of the viewport.
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-primary/15 bg-background/85 shadow-2xl shadow-black/50 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      {/* Gradient hairline that fades in with the scrolled glass bar */}
      {scrolled ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent"
        />
      ) : null}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6">
        <a
          href="#home"
          className={cn(
            "group flex items-center gap-3 rounded-lg",
            NAV_FOCUS
          )}
          aria-label="Ocean GYM — الرئيسية"
        >
          <Image
            src="/images/logo.png"
            alt="شعار Ocean GYM"
            width={48}
            height={48}
            priority
            className="ocean-ring h-12 w-12 rounded-xl transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
          />
          <span className="text-lg font-extrabold tracking-wide transition-colors duration-300 group-hover:text-primary" dir="ltr">
            OCEAN <span className="text-gradient-ocean">GYM</span>
          </span>
        </a>

        {/* All links visible from lg up — tighter sizing at lg, roomier from xl. */}
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-1.5 py-2 text-xs font-semibold transition-colors xl:px-3 xl:text-sm",
                  isActive
                    ? "text-primary"
                    : "text-foreground/85 hover:bg-primary/10 hover:text-primary",
                  NAV_FOCUS
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-lg border border-primary/25 bg-primary/10 shadow-[0_0_16px_rgba(56,199,232,0.18)]"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="btn-gradient shimmer hidden h-11 px-6 font-bold shadow-lg shadow-primary/25 sm:inline-flex"
          >
            <a href="#join">انضم الآن</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-11 border-primary/30 lg:hidden"
                aria-label="فتح قائمة التنقل"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-primary/20 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-primary/10 pe-14">
                <SheetTitle className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt="شعار Ocean GYM"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg"
                  />
                  <span className="font-extrabold" dir="ltr">
                    OCEAN <span className="text-gradient-ocean">GYM</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="قائمة التنقل"
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
              >
                {NAV_LINKS.map((link) => {
                  const id = link.href.slice(1);
                  const isActive = activeId === id;
                  const Icon = NAV_ICONS[id] ?? Sparkles;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
                        isActive
                          ? "border border-primary/25 bg-primary/10 text-primary shadow-[inset_0_0_18px_rgba(56,199,232,0.08)]"
                          : "text-foreground/90 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-br from-primary to-[#1e6fe8] text-primary-foreground shadow-md shadow-primary/30"
                            : "bg-primary/10 text-primary/80 group-hover:bg-primary/20 group-hover:text-primary"
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      {link.label}
                    </a>
                  );
                })}
              </nav>
              <div className="border-t border-primary/10 p-4">
                <Button asChild className="btn-gradient shimmer h-11 w-full font-bold">
                  <a href="#join" onClick={() => setOpen(false)}>
                    انضم الآن
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
