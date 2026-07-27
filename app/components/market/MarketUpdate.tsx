"use client";

import Image from "next/image";
import { useState } from "react";
import type { MarketUpdateDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: MarketUpdateDict };

const CATEGORY_KEYS = [
  "daily",
  "weekly",
  "monthly",
  "scenario",
  "yearly",
] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const INSIGHT_KEYS = [
  "mutualFunds",
  "fixedIncome",
  "equity",
  "macroPulse",
] as const;
type InsightKey = (typeof INSIGHT_KEYS)[number];

export default function MarketUpdate({ dict }: Props) {
  const [category, setCategory] = useState<CategoryKey>("monthly");
  const [insight, setInsight] = useState<InsightKey | null>(null);
  const [monthIndex, setMonthIndex] = useState(0);

  return (
    <section
      data-scroll-section
      className="relative bg-white pt-40 md:pt-48 xl:pt-55 pb-40 md:pb-44 xl:pb-50 overflow-hidden"
    >
      <ScrollReveal
        variant="fade-in"
        duration={1600}
        className="absolute -top-6 md:-top-12 xl:-top-16 w-full mt-20"
      >
        <Parallax speed={0.08} data-scroll className="w-full">
          <Image
            src="/home/family-legacy-mountain-sand.svg"
            alt=""
            width={2880}
            height={1534}
            priority
            sizes="100vw"
            className="w-full object-cover"
          />
        </Parallax>
      </ScrollReveal>

      <div className="relative z-10 px-5 sm:px-10 xl:px-20 flex">
        <div className="flex flex-col w-full">
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={0}
            duration={1600}
            className="font-raleway font-light text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.5] tracking-[0.1em] text-navy"
          >
            {dict.eyebrow}
          </ScrollReveal>

          <ScrollReveal
            as="h1"
            variant="fade-up"
            delay={150}
            duration={1800}
            className="mt-6 md:mt-8 font-catalog font-normal text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[48px] leading-[1.5] tracking-[0.1em] text-navy"
          >
            {dict.titleLine1}
            <br />
            <span className="sm:pl-[7%] xl:pl-[17%]">{dict.titleLine2}</span>
          </ScrollReveal>
        </div>

        <ScrollReveal
          variant="fade-in"
          delay={100}
          duration={1800}
          className="pointer-events-none absolute top-0 -translate-1/10 right-0 w-52 sm:w-64 md:w-80 lg:w-96 xl:w-[420px] aspect-square"
        >
          <Parallax speed={0.05} data-scroll className="relative w-full h-full">
            <Image
              src="/market/sunflowers.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 420px, (min-width: 1024px) 384px, (min-width: 768px) 320px, 256px"
              className="object-contain opacity-40 lg:opacity-50"
            />
          </Parallax>
        </ScrollReveal>
      </div>

      <div className="relative z-10 px-5 sm:px-10 xl:px-20 mt-14 md:mt-20 xl:mt-24">
        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1600}
          className="flex flex-col gap-4"
        >
          <p className="font-catalog font-normal text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] leading-[1.5] tracking-[0.1em] text-gold">
            {dict.marketLabel}
          </p>
          <div className="w-full flex flex-col lg:flex-row justify-start items-center lg:items-start gap-8 lg:gap-6">
            <div className="shrink-0 lg:border-r lg:border-navy lg:pr-6">
              <div className="overflow-hidden relative rounded-[10px] w-75.5 h-fit bg-white px-6 py-6 md:px-7 md:py-7 flex flex-col gap-36 shadow-[0px_4px_6.3px_0px_rgba(0,0,0,0.25)]">
                <div className="shrink-0 flex flex-col items-center justify-center gap-3 md:gap-3.5 w-fit">
                  <ScrollReveal
                    variant="fade-up"
                    delay={0}
                    duration={1800}
                    className="relative w-[70px] aspect-square"
                  >
                    <Image
                      src="/logo.svg"
                      alt=""
                      fill
                      priority
                      sizes="70px"
                      className="object-contain"
                    />
                  </ScrollReveal>

                  <ScrollReveal
                    variant="fade-up"
                    delay={200}
                    duration={1800}
                    className="relative w-[110px] h-4"
                  >
                    <Image
                      src="/logo_name.svg"
                      alt="PLUS ADVISOR"
                      fill
                      priority
                      sizes="110px"
                      className="object-contain"
                    />
                  </ScrollReveal>
                </div>
                <div className="flex-1">
                  <p className="font-catalog font-black text-[20px] sm:text-[22px] md:text-[24px] xl:text-[26px] leading-[1.5] tracking-[0.1em] text-navy">
                    {dict.reportTitle}
                  </p>
                  <div className="mt-1 relative w-full h-6 md:h-7">
                    <Image
                      src="/market/monthly-market.svg"
                      alt={dict.reportSubtitle}
                      fill
                      priority
                      sizes="220px"
                      className="object-contain object-left"
                    />
                  </div>
                  <p className="mt-4 font-catalog font-normal italic text-[20px] sm:text-[22px] md:text-[24px] xl:text-[26px] leading-[1.5] tracking-[0.1em] text-gold">
                    {dict.reportYear}
                  </p>
                </div>

                <ScrollReveal
                  variant="fade-in"
                  delay={200}
                  duration={1800}
                  className="absolute top-0 right-0 translate-1/2 w-1/2 aspect-square pointer-events-none z-10"
                >
                  <Parallax
                    speed={-0.06}
                    data-scroll
                    className="relative w-full h-full"
                  >
                    <Image
                      src="/home/line-ball.svg"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 100px, 80px"
                      className="object-contain"
                    />
                  </Parallax>
                </ScrollReveal>
              </div>
            </div>

            <ScrollReveal
              variant="fade-up"
              delay={300}
              duration={1600}
              className="flex flex-col w-full lg:min-h-[437.5px]"
            >
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                {CATEGORY_KEYS.map((key) => {
                  const isActive = key === category;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`cursor-pointer text-center rounded-[15px] h-[38px] px-4 sm:px-5 md:px-5 lg:px-6 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal transition-colors duration-300 ease-in-out ${
                        isActive
                          ? "bg-navy text-white border border-navy"
                          : "text-navy/75 border border-navy/75 hover:border-navy hover:text-navy"
                      }`}
                    >
                      {dict.categories[key]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3.5 lg:mt-4 flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                {INSIGHT_KEYS.map((key) => {
                  const isActive = key === insight;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setInsight((prev) => (prev === key ? null : key))
                      }
                      className={`cursor-pointer text-center rounded-[15px] h-[38px] px-3 sm:px-4 md:px-4 lg:px-5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal transition-colors duration-300 ease-in-out ${
                        isActive
                          ? "bg-navy text-white border border-navy"
                          : "text-navy/75 border border-navy/75 hover:border-navy hover:text-navy"
                      }`}
                    >
                      {dict.insights[key]}
                    </button>
                  );
                })}
              </div>

              <p className="mt-7.5 lg:mt-8 max-w-2xl font-raleway font-semibold text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[1.4] tracking-[0.03em] text-navy/80">
                {dict.description}
              </p>

              <div className="mt-11 lg:mt-11.5 border-t border-navy" />

              <div className="mt-4.5 lg:mt-5 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                {dict.months.map((label, i) => {
                  const isActive = i === monthIndex;
                  return (
                    <button
                      key={`${label}-${i}`}
                      type="button"
                      onClick={() => setMonthIndex(i)}
                      className={`cursor-pointer rounded-[15px] h-[35px] px-2.5 sm:px-3 md:px-3.5 lg:px-4 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.5] tracking-[0.1em] transition-colors duration-300 ease-in-out ${
                        isActive
                          ? "bg-navy text-white border border-navy"
                          : "text-navy border border-navy/75 hover:border-navy hover:text-navy"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 lg:mt-auto lg:pt-6">
                <a
                  href="#"
                  className="inline-flex justify-center items-center text-center rounded-[15px] w-[164px] h-[38px] font-saira font-normal text-[16px] md:text-[18px] leading-none tracking-normal text-navy border border-navy hover:bg-navy hover:text-white transition-colors duration-300 ease-in-out"
                >
                  {dict.downloadPdf}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>

        <ScrollReveal
          variant="fade-in"
          delay={100}
          duration={1800}
          className="pointer-events-none absolute bottom-10 right-10 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 aspect-square"
        >
          <Parallax speed={0.05} data-scroll className="relative w-full h-full">
            <Image
              src="/market/birds.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 256px, (min-width: 1024px) 224px, (min-width: 768px) 192px, 128px"
              className="object-contain opacity-50"
            />
          </Parallax>
        </ScrollReveal>
    </section>
  );
}
