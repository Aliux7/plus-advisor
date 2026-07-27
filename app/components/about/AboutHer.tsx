"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import type { AboutHerDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";
import Parallax from "../Parallax";

type Props = { dict: AboutHerDict };

const OUT_DURATION = 400;
const IN_DURATION = 700;

export default function AboutHer({ dict }: Props) {
  const { testimonials } = dict;
  const total = testimonials.length;
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const isIn = index === displayIndex;
  const current = testimonials[displayIndex];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    if (index === displayIndex) return;
    const t = setTimeout(() => setDisplayIndex(index), OUT_DURATION);
    return () => clearTimeout(t);
  }, [index, displayIndex]);

  const textStyle = (staggerDelay: number): CSSProperties => ({
    opacity: isIn ? 1 : 0,
    transform: isIn ? "none" : "translate3d(-20px, 0, 0)",
    transition: isIn
      ? `opacity ${IN_DURATION}ms ease-out ${staggerDelay}ms, transform ${IN_DURATION}ms ease-out ${staggerDelay}ms`
      : `opacity ${OUT_DURATION}ms ease-in, transform ${OUT_DURATION}ms ease-in`,
    willChange: "opacity, transform",
  });

  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-20 "
    >
      <ScrollReveal
        variant="fade-left"
        delay={0}
        duration={1600}
        className="absolute -top-6 sm:-top-10 md:-top-14 lg:-top-16 xl:-top-20 -right-5 lg:right-0 w-40 sm:w-60 xl:w-80 pointer-events-none z-0"
      >
        <Parallax speed={-0.05} data-scroll className="relative w-full">
          <Image
            src="/about/bamboo.svg"
            alt=""
            width={360}
            height={720}
            className="w-full h-auto"
          />
        </Parallax>
      </ScrollReveal>

      <ScrollReveal
        variant="fade-in"
        delay={0}
        duration={1600}
        className="absolute -bottom-10 sm:-bottom-14 md:-bottom-20 lg:-bottom-26 xl:-bottom-34 right-0 w-20 sm:w-28 md:w-36 lg:w-48 xl:w-67 pointer-events-none z-0"
      >
        <Parallax speed={0.06} data-scroll className="relative w-full">
          <Image
            src="/about/forest.webp"
            alt=""
            width={537}
            height={759}
            className="w-full h-auto"
          />
        </Parallax>
      </ScrollReveal>

      <div className="relative z-10 flex flex-col gap-10 md:gap-14 lg:gap-16 px-5 sm:px-10 xl:px-20">
        <div className="flex flex-col w-fit">
          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="pl-10 sm:pl-20 md:pl-30 lg:pl-40 pr-10 font-catalog font-black text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
          >
            {dict.title}
          </ScrollReveal>
          <SlidingDivider
            className="-ml-5 sm:-ml-10 xl:-ml-20"
            barClassName="bg-gold/40"
            delay={300}
            duration={1400}
          />
        </div>

        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row items-center lg:gap-24 xl:gap-32">
          <div className="pointer-events-none relative aspect-square h-60 sm:h-80 md:h-100 xl:h-125 mx-auto lg:mx-0 shrink-0">
            <ScrollReveal
              variant="fade-right"
              delay={0}
              duration={1600}
              distance={60}
              className="absolute top-0 left-0 w-2/5 aspect-square rounded-full overflow-hidden"
            >
              <Parallax
                speed={0.05}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/shared/quote-ellipse-large.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 200px, 160px"
                  className="object-cover"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="absolute -translate-y-1/5 translate-x-1/10 inset-0 flex items-center justify-center"
            >
              <Parallax
                speed={0.06}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/about/flower.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 500px, 90vw"
                  className="object-contain scale-130"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="absolute top-5/20 right-1/20 -translate-y-1/2 w-1/5 aspect-square pointer-events-none z-10"
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

            <ScrollReveal
              variant="zoom-in"
              delay={400}
              duration={1600}
              className="absolute bottom-[10%] right-[20%] w-[20%] aspect-square"
            >
              <Parallax
                speed={-0.05}
                data-scroll
                className="relative w-full h-full bg-white rounded-full overflow-hidden"
              >
                <Image
                  src="/shared/quote-ellipse-small.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 100px, 80px"
                  className="object-cover"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <div className="relative min-h-60 sm:min-h-80 md:min-h-100 xl:min-h-125 pb-30 flex justify-start items-center">
            <div className="relative flex flex-col justify-center w-full">
              <ScrollReveal
                variant="fade-up"
                delay={200}
                duration={1600}
                className="relative pl-8 ml-5 lg:ml-0 mr-5 xl:mr-10"
              >
                {testimonials.map((t, i) => {
                  const isCurrent = i === displayIndex;
                  const isSettled = isCurrent && isIn;
                  return (
                    <div
                      key={i}
                      aria-hidden={!isSettled}
                      className="absolute inset-0"
                      style={{
                        opacity: isSettled ? 1 : 0,
                        transform: isSettled
                          ? "none"
                          : "translate3d(20px, 0, 0)",
                        transition: isSettled
                          ? `opacity ${IN_DURATION}ms ease-out, transform ${IN_DURATION}ms ease-out`
                          : `opacity ${OUT_DURATION}ms ease-in, transform ${OUT_DURATION}ms ease-in`,
                        willChange: "opacity, transform",
                        pointerEvents: isSettled ? "auto" : "none",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 sm:-top-3 xl:-top-4 -translate-x-full font-raleway font-normal text-gold text-[32px] sm:text-[36px] md:text-[42px] xl:text-[50px] leading-[1.4] tracking-[0.03em] select-none pointer-events-none"
                      >
                        <span
                          style={textStyle(0)}
                          className="inline-block"
                        >
                          “
                        </span>
                      </span>
                      <p
                        style={textStyle(0)}
                        className="relative whitespace-pre-line font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[1.4] tracking-[0.03em] text-gold"
                      >
                        {t.text}

                        <span className="ml-1 inline-block translate-y-3 sm:translate-y-3.5 md:translate-y-4 xl:translate-y-5 font-raleway font-normal text-gold text-[32px] sm:text-[36px] md:text-[42px] xl:text-[50px] leading-0 tracking-[0.03em] select-none pointer-events-none">
                          ”
                        </span>
                      </p>
                    </div>
                  );
                })}
                <p
                  className="invisible whitespace-pre-line font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[1.4] tracking-[0.03em]"
                  aria-hidden="true"
                >
                  {current.text}
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal
              variant="fade-up"
              delay={400}
              duration={1400}
              className="w-full absolute bottom-0 mt-8 md:mt-10 flex items-start justify-between gap-6 md:gap-10"
            >
              <div className="flex items-center gap-4 text-[#88643B]">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={dict.prev}
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
                  className="relative h-px w-24 md:w-32 lg:w-40 bg-[#88643B]/30"
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
                  aria-label={dict.next}
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
              </div>

              <div className="w-fit flex flex-col items-end pt-1 sm:pt-2">
                <div className="w-[calc(100%+80px)] max-w-sm h-px bg-gold/40 -mr-20" />
                <p
                  style={textStyle(120)}
                  className="mt-2.5 sm:mt-3 md:mt-4 lg:mt-4.5 xl:mt-5 text-right font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-[0.03em] text-navy text-nowrap"
                >
                  <span className="font-semibold">{current.author}</span>{" "}
                  <span className="mx-0.5 sm:mx-1 text-navy/60">|</span>
                  <span className="tracking-[0.15rem] sm:tracking-[0.2rem] md:tracking-[0.25rem] lg:tracking-[0.3rem] xl:tracking-[0.35rem]">
                    {current.role}
                  </span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
