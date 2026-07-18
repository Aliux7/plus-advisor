import Image from "next/image";
import type { Dictionary } from "../../[lang]/dictionaries";

type Props = { dict: Dictionary["quote"] };

export default function Quote({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative min-h-96 md:min-h-120 lg:min-h-152.5 bg-white"
    >
      <div className="relative pt-16 sm:pt-20 md:pt-28 lg:pt-40 xl:pt-47.5 px-5 sm:px-8 lg:px-20">
        <div className="pointer-events-none absolute aspect-square opacity-80 sm:opacity-100 size-20 sm:size-32 md:size-40 lg:size-45 xl:size-51 -left-4 sm:left-8 md:left-10 lg:left-14 top-44 sm:top-20 md:top-24 lg:top-28 xl:top-32.5 bg-white z-10 rounded-full">
          <Image
            src="/home/quote-ellipse-large.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="relative ml-[20%] sm:ml-[30%] md:ml-[38%] lg:ml-[45%] text-center">
          <blockquote className="font-catalog font-normal text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] xl:text-[43px] leading-[1.69] tracking-widest max-w-3xl text-balance text-navy text-start">
            <span className="text-navy -ml-2 md:-ml-4">&ldquo;</span>
            {dict.text}
            <span className="text-navy">&rdquo;</span>
          </blockquote>
        </div>

        <p className="ml-auto mt-8 md:mt-10 lg:mt-14 mr-5 sm:mr-8 md:mr-12 lg:mr-20 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[25px] leading-normal tracking-[0.2em] text-right text-gold">
          - {dict.author}
        </p>

        <div className="pointer-events-none absolute -left-2 top-60 lg:top-68 xl:top-73 h-40 md:h-56 lg:h-72 xl:h-91 w-full lg:w-full xl:w-257 z-10">
          <Image
            src="/home/quote-mountains.webp"
            alt=""
            fill
            className="object-contain object-left"
          />
        </div>

        <div className="pointer-events-none aspect-square absolute left-[45%] lg:left-96 xl:left-121 top-96 lg:top-110 xl:top-134 size-16 lg:size-20 xl:size-27 z-10">
          <Image
            src="/home/quote-ellipse-small.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
