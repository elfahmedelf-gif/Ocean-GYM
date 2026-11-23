"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { KeyRound, Menu } from "lucide-react";
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-primary/15 bg-background/80 shadow-2xl shadow-black/50 backdrop-blur-xl"
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
                    className="absolute inset-0 rounded-lg border border-primary/25 bg-primary/10"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Member portal — quiet ghost link, revealed from md up */}
          <Link
            href="/portal/login"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary md:inline-flex xl:text-sm"
            aria-label="بوابة الأعضاء — تسجيل الدخول"
          >
            <KeyRound className="size-3.5 text-primary/80" aria-hidden="true" />
            بوابة الأعضاء
          </Link>

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
                  const isActive = activeId === link.href.slice(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
                        isActive
                          ? "border border-primary/25 bg-primary/10 text-primary"
                          : "text-foreground/90 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>
              <div className="grid grid-cols-2 gap-2 border-t border-primary/10 p-4">
                <Button asChild className="btn-gradient shimmer h-11 font-bold">
                  <a href="#join" onClick={() => setOpen(false)}>
                    انضم الآن
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-primary/40 bg-primary/5 font-bold text-primary hover:bg-primary/15 hover:text-primary"
                >
                  <Link href="/portal/login" onClick={() => setOpen(false)}>
                    <KeyRound className="size-4" aria-hidden="true" />
                    بوابة الأعضاء
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
