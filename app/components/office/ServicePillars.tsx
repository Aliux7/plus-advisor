"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import type { OurServicePillarsDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = {
  dict: OurServicePillarsDict;
};

const OUT_DURATION = 400;
const IN_DURATION = 700;
const SLIDE_DURATION = 700;

export default function ServicePillars({ dict }: Props) {
  const { slides, prev, next, office } = dict;
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const slide = slides[displayIndex];
  const isIn = index === displayIndex;

  const goPrev = () => {
    setDirection("prev");
    setIndex((i) => (i - 1 + total) % total);
  };
  const goNext = () => {
    setDirection("next");
    setIndex((i) => (i + 1) % total);
  };

  useEffect(() => {
    if (index === displayIndex) return;
    const t = setTimeout(() => {
      setDisplayIndex(index);
    }, OUT_DURATION);
    return () => clearTimeout(t);
  }, [index, displayIndex]);

  const textStyle = (staggerDelay: number): CSSProperties => {
    const offset = direction === "next" ? -30 : 30;
    return {
      opacity: isIn ? 1 : 0,
      transform: isIn ? "none" : `translate3d(${offset}px, 0, 0)`,
      transition: isIn
        ? `opacity ${IN_DURATION}ms ease-out ${staggerDelay}ms, transform ${IN_DURATION}ms ease-out ${staggerDelay}ms`
        : `opacity ${OUT_DURATION}ms ease-in, transform ${OUT_DURATION}ms ease-in`,
      willChange: "opacity, transform",
    };
  };

  const offsetOf = (i: number) => {
    let o = i - index;
    if (o > total / 2) o -= total;
    if (o < -total / 2) o += total;
    return o;
  };

  return (
    <section
      data-scroll-section
      className="relative bg-white pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-40 md:pb-24 lg:pb-28 xl:pb-32"
    >
      <div className="px-5 sm:px-10 xl:px-20">
        <div className="mb-10 md:mb-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 xl:gap-24 items-start">
          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="flex sm:block font-catalog font-black text-[24px] sm:text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
          >
            {office.titleLine1}
            <span className="block pl-2 sm:pl-16 md:pl-20 lg:pl-28 xl:pl-36">
              {office.titleLine2}
            </span>
          </ScrollReveal>

          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={150}
            duration={1800}
            className="font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-navy mt-4"
          >
            {office.intro}
          </ScrollReveal>
        </div>

        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1800}
          className="mt-4 md:mt-6 xl:mt-8 -mx-5 sm:-mx-10 xl:-mx-20"
        >
          <div className="relative w-full overflow-hidden h-[42vw] [--slide-step:70vw]">
            {slides.map((s, i) => {
              const offset = offsetOf(i);
              const abs = Math.abs(offset);
              if (abs > 2) return null;

              const isActive = offset === 0;
              const opacity = abs > 1 ? 0 : 1;

              return (
                <div
                  key={i}
                  aria-hidden={!isActive}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-xl md:rounded-2xl overflow-hidden aspect-video ${
                    isActive ? "h-full" : "h-3/4"
                  }`}
                  style={{
                    left: `calc(50% + ${offset} * var(--slide-step))`,
                    transform: "translateX(-50%)",
                    opacity,
                    zIndex: 10 - abs,
                    transition: `left ${SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), height ${SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${SLIDE_DURATION}ms ease-in-out`,
                    willChange: "left, height, opacity",
                  }}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 900px, (min-width: 640px) 60vw, 60vw"
                    priority={isActive}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-10 lg:gap-16 xl:gap-24 mt-8 md:mt-10 lg:mt-12">
          <div className="flex flex-col">
            <ScrollReveal
              variant="fade-up"
              delay={0}
              duration={1600}
              className="mb-2"
            >
              <p
                style={textStyle(0)}
                className="font-catalog font-black text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-normal tracking-widest text-gold"
              >
                {slide.number}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={100} duration={1800}>
              <h3
                style={textStyle(120)}
                className="font-catalog font-black text-[20px] sm:text-[22px] md:text-[26px] lg:text-[29px] xl:text-[32px] leading-normal tracking-widest text-gold"
              >
                {slide.title}
              </h3>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1600}
              className="mt-2"
            >
              <p
                style={textStyle(240)}
                className="font-catalog font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-normal tracking-widest text-gold italic"
              >
                {slide.subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={300}
              duration={1600}
              className="mt-5 md:mt-6"
            >
              <p
                style={textStyle(360)}
                className="font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-navy"
              >
                {slide.body}
              </p>
            </ScrollReveal>
          </div>

          <div className="relative flex flex-row-reverse items-start md:flex-col gap-10">
            <ScrollReveal
              variant="fade-left"
              delay={0}
              duration={1600}
              className="ml-auto realtive top-0 right-0 z-20 flex items-center gap-4 lg:gap-6 text-[#88643B] w-fit"
            >
              <button
                type="button"
                onClick={goPrev}
                aria-label={prev}
                className="cursor-pointer flex items-center justify-center transition-opacity duration-300 ease-in-out hover:opacity-70"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <div
                role="progressbar"
                aria-valuenow={index + 1}
                aria-valuemin={1}
                aria-valuemax={total}
                className="relative h-px w-32 md:w-40 lg:w-50 bg-[#88643B]/30"
              >
                <span
                  style={{
                    width: `${100 / total}%`,
                    transform: `translate(${index * 100}%, -50%)`,
                  }}
                  className="absolute left-0 top-1/2 h-0.5 bg-[#88643B] transition-transform duration-300 ease-in-out"
                />
              </div>
              <button
                type="button"
                onClick={goNext}
                aria-label={next}
                className="cursor-pointer flex items-center justify-center transition-opacity duration-300 ease-in-out hover:opacity-70"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </ScrollReveal>

            <div className="relative aspect-square h-40 sm:h-50 md:h-72 lg:h-80 xl:h-87.5 sm:ml-auto sm:mr-10 xl:mr-0 shrink-0">
              <ScrollReveal
                variant="fade-in"
                delay={200}
                duration={1800}
                className="pointer-events-none absolute top-[5%] left-[20%] w-[18%] aspect-square z-10"
              >
                <Parallax
                  speed={-0.05}
                  data-scroll
                  className="relative w-full h-full"
                >
                  <Image
                    src="/shared/quote-ellipse-large.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 65px, 45px"
                    className="object-contain opacity-90"
                  />
                </Parallax>
              </ScrollReveal>

              <ScrollReveal
                variant="fade-up"
                delay={300}
                duration={1800}
                className="pointer-events-none absolute bottom-[10%] right-[8%] w-[60%] aspect-square z-0"
              >
                <Parallax
                  speed={0.05}
                  data-scroll
                  className="relative w-full h-full"
                >
                  <Image
                    src="/office/cloud.svg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 210px, 160px"
                    className="object-contain scale-160"
                  />
                </Parallax>
              </ScrollReveal>

              <ScrollReveal
                variant="fade-up"
                delay={400}
                duration={1800}
                className="pointer-events-none absolute top-[5%] left-1/2 -translate-x-1/2 w-[35%] h-[85%] z-10"
              >
                <Parallax
                  speed={0.05}
                  data-scroll
                  className="relative w-full h-full"
                >
                  <Image
                    src="/office/leaf.svg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 125px, 90px"
                    className="object-contain scale-200"
                  />
                </Parallax>
              </ScrollReveal>

              <ScrollReveal
                variant="zoom-in"
                delay={500}
                duration={1800}
                className="pointer-events-none absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square z-10"
              >
                <Parallax
                  speed={-0.05}
                  data-scroll
                  className="relative w-full h-full"
                >
                  <Image
                    src="/home/journals-ellipse.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 125px, 90px"
                    className="object-contain opacity-60"
                  />
                </Parallax>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
