"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { HeaderDict, Locale } from "../[lang]/dictionaries";
import LanguageToggle from "./LanguageToggle";

type Props = {
  dict: HeaderDict;
  lang: Locale;
};

export default function Header({ dict, lang }: Props) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.stories, href: `/${lang}/stories` },
    { label: dict.nav.familyOffice, href: `/${lang}/office` },
    { label: dict.nav.journals, href: `/${lang}/journals` },
    { label: dict.nav.marketUpdate, href: `/${lang}/market` },
  ];

  return (
    <header
      data-scroll-section
      className="fixed top-0 z-50 w-full font-catalog font-black text-sm leading-normal tracking-widest"
    >
      <div
        className={`flex items-center justify-between gap-6 h-20 xl:h-24 px-5 sm:px-10 xl:px-20 transition-[background-color,backdrop-filter] duration-300 ease-in-out ${
          open ? "bg-white/90 backdrop-blur-lg" : "bg-white"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={140}
            height={120}
            priority
            className="h-8 sm:h-10 xl:h-14.5 w-auto"
          />
          <Image
            src="/logo_name.svg"
            alt="PLUS Advisor"
            width={126}
            height={14}
            priority
            className="h-2.75 sm:h-3 xl:h-3.5 w-auto"
          />
        </Link>

        <div className="hidden xl:flex items-center gap-5.5">
          <nav className="flex items-center gap-7.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-navy transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-13">
            <button aria-label={dict.searchLabel} className="text-gold">
              <Search className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
            <LanguageToggle currentLang={lang} />
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-6 xl:hidden">
          <button aria-label={dict.searchLabel} className="text-gold">
            <Search className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
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
