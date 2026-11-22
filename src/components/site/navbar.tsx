"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-primary/15 bg-background/70 shadow-lg shadow-black/30 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6">
        <a href="#home" className="flex items-center gap-3" aria-label="Ocean GYM — الرئيسية">
          <Image
            src="/images/logo.png"
            alt="شعار Ocean GYM"
            width={48}
            height={48}
            priority
            className="ocean-ring h-12 w-12 rounded-xl"
          />
          <span className="text-lg font-extrabold tracking-wide" dir="ltr">
            OCEAN <span className="text-gradient-ocean">GYM</span>
          </span>
        </a>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-11 px-6 font-bold sm:inline-flex">
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
              side="left"
              className="w-[300px] border-primary/20 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-primary/10 pr-14">
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
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="border-t border-primary/10 p-4">
                <Button asChild className="h-11 w-full font-bold">
                  <a href="#join" onClick={() => setOpen(false)}>
                    انضم الآن
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
