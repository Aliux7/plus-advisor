"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type Locale = "en" | "id" | "zh";

const LABELS: Record<Locale, string> = {
  en: "ENGLISH",
  id: "INDONESIA",
  zh: "简体中文",
};

const LOCALES: Locale[] = ["en", "id", "zh"];

function persistLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function LanguageToggle({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const selectLocale = (next: Locale) => {
    if (next === currentLang) return;
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "id" || segments[1] === "zh") {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const href = segments.join("/") || `/${next}`;
    persistLocaleCookie(next);
    startTransition(() => router.push(href));
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-busy={pending || undefined}
        aria-haspopup="listbox"
        aria-label="Select language"
        className="cursor-pointer flex items-center gap-1.5 text-sm tracking-wide text-navy transition-colors hover:text-gold group-hover:text-gold"
      >
        <Image
          src="/icons/globe.svg"
          alt=""
          width={18}
          height={18}
          className="h-4.5 w-4.5"
        />
        <span>{LABELS[currentLang]}</span>
      </button>

      <ul
        role="listbox"
        className="absolute right-0 top-full pt-2 min-w-36 origin-top-right opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto"
      >
        <div className="rounded-md border border-navy/10 bg-white shadow-lg overflow-hidden">
          {LOCALES.map((locale) => {
            const isActive = locale === currentLang;
            return (
              <li key={locale} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => selectLocale(locale)}
                  className={`w-full text-left px-3 py-2 text-sm tracking-wide transition-colors ${
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-navy hover:bg-navy/5 hover:text-gold"
                  }`}
                >
                  {LABELS[locale]}
                </button>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
}
