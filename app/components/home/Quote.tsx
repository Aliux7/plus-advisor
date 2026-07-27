import Image from "next/image";
import type { QuoteDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: QuoteDict };

export default function Quote({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative min-h-96 md:min-h-120 lg:min-h-152.5 bg-white"
    >
      <div className="relative pt-16 sm:pt-20 md:pt-28 lg:pt-40 xl:pt-47.5 px-5 sm:px-8 lg:px-20">
        <ScrollReveal
          variant="fade-up"
          delay={100}
          duration={2000}
          className="pointer-events-none absolute aspect-square opacity-80 sm:opacity-100 size-20 sm:size-32 md:size-40 lg:size-45 xl:size-51 -left-4 sm:left-8 md:left-10 lg:left-14 top-44 sm:top-20 md:top-24 lg:top-28 xl:top-32.5 bg-white z-10 rounded-full"
        >
          <Parallax speed={0.05} data-scroll className="relative w-full h-full">
            <Image
              src="/shared/quote-ellipse-large.webp"
              alt=""
              fill
              className="object-contain"
            />
          </Parallax>
        </ScrollReveal>

        <div className="relative ml-[20%] sm:ml-[30%] md:ml-[38%] lg:ml-[45%] text-center">
          <ScrollReveal
            as="blockquote"
            variant="fade-left"
            delay={300}
            duration={2000}
            className="relative font-catalog font-normal text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] xl:text-[43px] leading-[1.69] tracking-widest max-w-3xl text-balance text-navy text-start"
          >
            <span className="absolute -translate-x-full scale-150">“</span>
            {dict.text}
            <span className="inline-block scale-150">”</span>
          </ScrollReveal>
        </div>

        <ScrollReveal
          as="p"
          variant="fade-right"
          delay={1200}
          duration={1600}
          className="ml-auto mt-8 md:mt-10 lg:mt-14 mr-5 sm:mr-8 md:mr-12 lg:mr-0 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[25px] leading-normal tracking-[0.2em] text-right text-gold w-fit"
        >
          - {dict.author}
        </ScrollReveal>

        <ScrollReveal
          variant="fade-right"
          delay={300}
          duration={1800}
          className="pointer-events-none absolute -left-2 top-60 lg:top-68 xl:top-73 h-40 md:h-56 lg:h-72 xl:h-91 w-full lg:w-full xl:w-257 z-10"
        >
          <Parallax
            speed={-0.05}
            data-scroll
            className="relative w-full h-full"
          >
            <Image
              src="/home/quote-mountains.webp"
              alt=""
              fill
              className="object-contain object-left"
            />
          </Parallax>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={500}
          duration={1600}
          className="pointer-events-none aspect-square absolute left-[45%] lg:left-96 xl:left-121 top-84 sm:top-96 lg:top-110 xl:top-134 size-16 lg:size-20 xl:size-27 z-10"
        >
          <Parallax
            speed={-0.12}
            data-scroll
            className="relative w-full h-full"
          >
            <Image
              src="/shared/quote-ellipse-small.svg"
              alt=""
              fill
              className="object-contain"
            />
          </Parallax>
        </ScrollReveal>
      </div>
    </section>
  );
}
