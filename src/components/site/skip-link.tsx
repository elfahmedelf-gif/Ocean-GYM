"use client";

import { useLang } from "./language";

/**
 * Skip-to-content — the first focusable element on the page, hidden until
 * keyboard focus. Bilingual: follows the active site language.
 */
export function SkipLink() {
  const { t } = useLang();

  return (
    <a
      href="#main"
      className="pointer-events-none fixed top-2 start-2 z-[60] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground opacity-0 transition-opacity focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      {t.a11y.skip}
    </a>
  );
}
