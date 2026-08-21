"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { HeaderDict, Locale } from "../[lang]/dictionaries";
import type { SearchablePost } from "../lib/posts";
import LanguageToggle from "./LanguageToggle";

type Props = {
  dict: HeaderDict;
  lang: Locale;
  searchIndex: SearchablePost[];
  marketVisible: boolean;
};

const MAX_RESULTS = 6;

export default function Header({
  dict,
  lang,
  searchIndex,
  marketVisible,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inlineInputXlRef = useRef<HTMLInputElement | null>(null);
  const inlineInputMobileRef = useRef<HTMLInputElement | null>(null);
  const overlayInputRef = useRef<HTMLInputElement | null>(null);

  const navLinks = [
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.stories, href: `/${lang}/stories` },
    { label: dict.nav.familyOffice, href: `/${lang}/office` },
    { label: dict.nav.journals, href: `/${lang}/journals` },
    ...(marketVisible
      ? [{ label: dict.nav.marketUpdate, href: `/${lang}/market` }]
      : []),
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as SearchablePost[];
    return searchIndex
      .filter((post) => post.title.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [query, searchIndex]);

  const openSearch = () => {
    setOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => {
      const isXl = window.matchMedia("(min-width: 1280px)").matches;
      const isSm = window.matchMedia("(min-width: 640px)").matches;
      if (isXl) inlineInputXlRef.current?.focus();
      else if (isSm) inlineInputMobileRef.current?.focus();
      else overlayInputRef.current?.focus();
    }, 260);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-search-region]")) return;
      closeSearch();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchOpen]);

  const inlineInput = (inputRef: React.RefObject<HTMLInputElement | null>) => (
    <div
      className={`hidden md:block relative overflow-visible transition-[width,opacity] duration-300 ease-in-out ${
        searchOpen ? "w-64 md:w-72 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-2xl bg-white border border-gold/50 h-9 px-3">
        <Search className="h-3.5 w-3.5 text-gold shrink-0" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.searchPlaceholder}
          className="flex-1 min-w-0 bg-transparent outline-none font-catalog font-normal text-[12px] tracking-widest text-navy placeholder:text-navy/40"
          aria-hidden={!searchOpen}
          tabIndex={searchOpen ? 0 : -1}
        />
      </div>
      {searchOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-navy/10 overflow-hidden max-h-80 overflow-y-auto">
          <ResultsList
            results={results}
            emptyLabel={dict.searchEmpty}
            lang={lang}
            onSelect={closeSearch}
          />
        </div>
      )}
    </div>
  );

  const searchToggle = (
    <button
      type="button"
      aria-label={dict.searchLabel}
      aria-expanded={searchOpen}
      onClick={searchOpen ? closeSearch : openSearch}
      className="text-gold transition-colors cursor-pointer"
    >
      {searchOpen ? (
        <X className="h-4.5 w-4.5" strokeWidth={2} />
      ) : (
        <Search className="h-4.5 w-4.5" strokeWidth={2} />
      )}
    </button>
  );

  return (
    <header
      data-scroll-section
      className="fixed top-0 z-50 w-full font-catalog font-bold text-sm leading-normal tracking-widest"
    >
      <div
        className={`flex items-center justify-between gap-6 h-20 xl:h-24 px-5 sm:px-10 xl:px-20 transition-[background-color,backdrop-filter] duration-300 ease-in-out ${
          open || searchOpen ? "bg-white/90 backdrop-blur-lg" : "bg-white"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={140}
            height={120}
            priority
            className="h-6 sm:h-8 xl:h-11 w-auto"
          />
          <Image
            src="/logo_name.svg"
            alt="PLUS Advisor"
            width={126}
            height={14}
            priority
            className="h-2 sm:h-2.5 xl:h-3 w-auto"
          />
        </Link>

        <div className="hidden xl:flex items-center gap-5.5 min-w-0">
          <nav
            className={`flex items-center gap-7.5 transition-all duration-300 ease-in-out overflow-hidden ${
              searchOpen ? "opacity-100 pointer-events-none justify-end" : "opacity-100"
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-navy transition-colors hover:text-gold whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="flex items-center gap-6"
            data-search-region
          >
            {inlineInput(inlineInputXlRef)}
            {searchToggle}
            <LanguageToggle currentLang={lang} />
          </div>
        </div>

        <div
          className="flex items-center gap-5 sm:gap-6 xl:hidden"
          data-search-region
        >
          {inlineInput(inlineInputMobileRef)}
          {searchToggle}
          <LanguageToggle currentLang={lang} />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative h-4 w-6 mb-0.5 text-navy hover:text-gold transition-colors flex flex-col justify-between items-end"
          >
            <span
              className={`h-0.5 w-6 rounded-full origin-center transition-transform duration-300 ease-in-out ${
                open ? "translate-y-1.75  rotate-45 bg-navy" : "bg-navy"
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100 bg-gold"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full origin-center transition-transform duration-300 ease-in-out ${
                open ? "-translate-y-1.75 -rotate-45 bg-gold w-6" : "bg-navy"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed left-5 right-5 top-22 z-40 transition-all duration-300 ease-in-out origin-top ${
          searchOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        data-search-region
      >
        <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-navy/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-11">
            <Search className="h-4 w-4 text-gold shrink-0" strokeWidth={2} />
            <input
              ref={overlayInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent outline-none font-catalog font-normal text-[13px] tracking-widest text-navy placeholder:text-navy/40"
              aria-hidden={!searchOpen}
              tabIndex={searchOpen ? 0 : -1}
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className="text-navy/60 hover:text-navy transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          {query.trim() && (
            <div className="border-t border-navy/10 max-h-80 overflow-y-auto">
              <ResultsList
                results={results}
                emptyLabel={dict.searchEmpty}
                lang={lang}
                onSelect={closeSearch}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`xl:hidden fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-linear-to-b from-white/90 via-white/90 to-gold/90 transition-opacity duration-300 ease-in-out ${
          open
            ? "opacity-100 backdrop-blur-lg pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 sm:px-8 md:px-10 py-4">
          {navLinks.map((link, i) => (
            <div
              key={link.label}
              style={{
                opacity: open ? 1 : 0,
                transform: open
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(-30px, 0, 0)",
                transition: open
                  ? `opacity 600ms ease-out ${200 + i * 100}ms, transform 600ms ease-out ${200 + i * 100}ms`
                  : `opacity 250ms ease-in, transform 250ms ease-in`,
                willChange: "opacity, transform",
              }}
              className="border-b border-gold/50"
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-4 px-3 text-base text-navy transition-colors duration-300 ease-in-out hover:text-gold"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ResultsList({
  results,
  emptyLabel,
  lang,
  onSelect,
}: {
  results: SearchablePost[];
  emptyLabel: string;
  lang: Locale;
  onSelect: () => void;
}) {
  if (results.length === 0) {
    return (
      <p className="px-4 py-3 font-catalog font-normal text-[12px] tracking-widest text-navy/60">
        {emptyLabel}
      </p>
    );
  }
  return (
    <ul>
      {results.map((post) => (
        <li key={post.id}>
          <a
            href={`/${lang}/journals/${post.id}`}
            onClick={onSelect}
            className="flex items-center gap-3 px-3 py-2 hover:bg-navy/5 transition-colors"
          >
            <span className="relative shrink-0 h-10 w-14 overflow-hidden rounded-md bg-navy/5">
              {post.featured_image && (
                <Image
                  src={post.featured_image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </span>
            <span className="flex-1 min-w-0 font-catalog font-normal text-[12px] leading-snug tracking-widest text-navy line-clamp-2">
              {post.title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
