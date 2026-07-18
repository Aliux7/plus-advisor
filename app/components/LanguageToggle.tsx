"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type Locale = "en" | "id";

const LABELS: Record<Locale, string> = {
  en: "ENGLISH",
  id: "INDONESIA",
};

const NEXT_LOCALE: Record<Locale, Locale> = {
  en: "id",
  id: "en",
};

function persistLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function LanguageToggle({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = NEXT_LOCALE[currentLang];
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "id") {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const href = segments.join("/") || `/${next}`;
    persistLocaleCookie(next);
    startTransition(() => router.push(href));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-busy={pending || undefined}
      aria-label={`Switch language to ${LABELS[NEXT_LOCALE[currentLang]]}`}
      className="cursor-pointer flex items-center gap-1.5 text-sm tracking-wide text-navy transition-colors hover:text-gold"
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
  );
}
