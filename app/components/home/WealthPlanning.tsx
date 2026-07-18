"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "../../[lang]/dictionaries";

type Props = { dict: Dictionary["wealthPlanning"] };

export default function WealthPlanning({ dict }: Props) {
  const { slides } = dict;
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const total = slides.length;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <section data-scroll-section className="relative pb-16 lg:pb-24">
      <div className="xl:h-130 relative flex flex-col-reverse xl:flex-row justify-center items-start gap-10 lg:gap-6.5 px-5 sm:px-10 xl:px-20">
        <div className="absolute left-0 -bottom-10 xl:bottom-0 w-50 h-68 opacity-50 xl:opacity-100">
          <Image
            src="/home/bird-alt.webp"
            alt=""
            fill
            sizes="256px"
            className="object-contain"
          />
        </div>

        <div className="-mt-10 xl:mt-0 flex flex-col w-full xl:w-auto min-h-96 xl:min-h-105">
          <p className="mb-2 font-catalog font-black text-[14px] sm:text-[16px] md:text-[18px] xl:text-[20px] leading-[1.2] tracking-widest text-gold">
            {slide.number}
          </p>
          <h2 className="font-catalog font-black text-[22px] sm:text-[26px] md:text-[28px] xl:text-[32px] leading-[1.2] tracking-widest text-gold w-full lg:w-5/6">
            {slide.title}
          </h2>
          <p className="mt-1 font-catalog font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[1.7] tracking-normal text-gold">
            {slide.subtitle}
          </p>
          <p className="my-4 md:my-6 xl:max-w-md font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[1.4] tracking-widest text-navy">
            {slide.body}
          </p>
          <a
            href="#services"
            className="mt-2 lg:mt-auto flex justify-center items-center rounded-2xl border border-[#88643B] h-9 md:h-9.5 w-40 md:w-49 font-saira font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-none tracking-normal text-center text-[#88643B] transition-colors hover:bg-[#88643B] hover:text-white"
          >
            {dict.cta}
          </a>
        </div>

        <div className="relative flex flex-col w-full xl:w-auto">
          <div className="relative w-full max-w-2xl xl:max-w-none mx-auto xl:mx-0 aspect-3/2 md:h-80 lg:h-105">
            <div className="absolute -translate-x-1/3 -translate-y-1/3 md:-translate-x-1/2 md:-translate-y-1/2 top-0 left-0 z-10 size-16 sm:size-20 md:size-24 lg:size-28 xl:size-35 bg-white rounded-full">
              <Image
                src="/home/circle-decoration.webp"
                alt=""
                fill
                sizes="(min-width: 1280px) 140px, (min-width: 768px) 96px, 80px"
                className="object-contain opacity-70 -rotate-60"
              />
            </div>
            <div className="absolute translate-x-1/3 -translate-y-1/3 lg:translate-x-1/2 lg:-translate-y-1/2 top-0 right-0 z-10 size-40 md:size-48 lg:size-60 xl:size-76 rounded-full">
              <Image
                src="/home/line-ball.svg"
                alt=""
                fill
                sizes="(min-width: 1280px) 304px, (min-width: 1024px) 240px, 192px"
                className="object-contain"
              />
            </div>
            <div className="relative w-full h-full rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="self-end w-fit mt-6 lg:mt-10 flex items-center gap-4 lg:gap-6 text-[#88643B]">
            <button
              type="button"
              onClick={goPrev}
              aria-label={dict.prev}
              className="flex items-center justify-center transition-opacity hover:opacity-70"
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
              aria-label={dict.next}
              className="flex items-center justify-center transition-opacity hover:opacity-70"
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
        </div>
      </div>
    </section>
  );
}
