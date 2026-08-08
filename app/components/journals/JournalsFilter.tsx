"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "../../[lang]/dictionaries";
import { DEFAULT_SORT, type SortKey } from "./journalSort";

const OPTION_LABELS: Record<SortKey, Record<Locale, string>> = {
  latest: { en: "Latest Journal", id: "Jurnal Terbaru", zh: "最新期刊" },
  oldest: { en: "Oldest Journal", id: "Jurnal Terlama", zh: "最早期刊" },
  az: { en: "Title A → Z", id: "Judul A → Z", zh: "标题 A → Z" },
  za: { en: "Title Z → A", id: "Judul Z → A", zh: "标题 Z → A" },
};

type Props = {
  lang: Locale;
  currentSort: SortKey;
  line1: string;
  line2: string;
};

export default function JournalsFilter({ lang, currentSort, line1, line2 }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectSort(sort: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === DEFAULT_SORT) params.delete("sort");
    else params.set("sort", sort);
    params.delete("page");
    const qs = params.toString();
    router.push(`/${lang}/journals${qs ? `?${qs}` : ""}`, { scroll: false });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-fit">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 cursor-pointer transition-opacity duration-300 hover:opacity-80"
      >
        <div className="size-14 md:size-16 lg:size-18 rounded-full bg-gold flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 overflow-visible"
          >
            <line x1="0" y1="4" x2="24" y2="4" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="8" y1="20" x2="16" y2="20" />
          </svg>
        </div>
        <p className="text-left font-catalog font-black text-[16px] sm:text-[17px] md:text-[19px] lg:text-[20px] xl:text-[22px] leading-[1.4] tracking-[0.15em] text-gold">
          {line1}
          <br />
          {line2}
        </p>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-30 left-0 top-full mt-3 min-w-64 rounded-xl bg-white shadow-[0px_8px_24px_0px_#00000026] border border-gold/20 py-2"
        >
          {(Object.keys(OPTION_LABELS) as SortKey[]).map((key) => {
            const isActive = currentSort === key;
            return (
              <button
                key={key}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => selectSort(key)}
                className={`w-full text-left px-5 py-2.5 font-catalog text-[14px] md:text-[15px] tracking-widest transition-colors cursor-pointer ${
                  isActive
                    ? "text-gold bg-gold/10 font-black"
                    : "text-navy hover:bg-gold/5 hover:text-gold"
                }`}
              >
                {OPTION_LABELS[key][lang]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
