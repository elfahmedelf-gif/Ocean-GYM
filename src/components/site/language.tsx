"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations, type Dict, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "ocean-lang";

interface LangContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dict;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "ar",
  dir: "rtl",
  t: translations.ar,
  setLang: () => {},
  toggle: () => {},
});

/**
 * Site language provider — persists the choice, and keeps <html lang/dir>
 * in sync so every Tailwind logical property (ms-/start-/rtl:/ltr:) flips.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Restore the saved choice after mount (server HTML is always ar/rtl first).
  // Mount-time hydration-safe restore: setState here is intentional — reading
  // localStorage during render/lazy init would cause an SSR hydration mismatch.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe restore, see comment above
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — choice simply won't persist */
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((current) => {
      const next = current === "ar" ? "en" : "ar";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: translations[lang],
      setLang,
      toggle,
    }),
    [lang, setLang, toggle]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/**
 * Premium segmented language switcher — glass pill with a spring-sliding
 * highlight, a languages icon, and full keyboard accessibility.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="اللغة / Language"
      className={cn(
        "glass ocean-ring relative flex items-center gap-0.5 rounded-full p-1",
        compact ? "scale-90" : ""
      )}
    >
      <Languages className="pointer-events-none absolute -start-1 -top-1 size-3.5 rounded-full bg-background/90 p-0.5 text-primary shadow-sm" aria-hidden="true" />
      {(
        [
          { value: "ar" as Lang, label: "عربي" },
          { value: "en" as Lang, label: "EN" },
        ]
      ).map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLang(option.value)}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex h-8 min-w-[3.25rem] items-center justify-center rounded-full px-3 text-xs font-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-primary"
            )}
          >
            {active ? (
              <motion.span
                layoutId="lang-switch-pill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-gradient-to-l from-primary to-[#1e6fe8] shadow-md shadow-primary/30"
                aria-hidden="true"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
