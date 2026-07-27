import Image from "next/image";
import type { MountainQuoteDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: MountainQuoteDict };

export default function MountainQuote({ dict }: Props) {
  return (
    <section data-scroll-section className="relative z-10 bg-white">
      <div className="relative w-full aspect-video">
        <Parallax speed={0.04} data-scroll className="absolute inset-0">
          <Image
            src="/about/MistyMountains.webp"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </Parallax>

        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1800}
          className="absolute left-0 flex flex-col bg-gold/50 max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl backdrop-blur-sm -bottom-10 sm:-bottom-14 md:-bottom-20 lg:-bottom-26 xl:-bottom-30 gap-6 sm:gap-10 md:gap-14 lg:gap-20 xl:gap-26 pt-10 sm:pt-14 md:pt-20 lg:pt-26 xl:pt-31 px-6 sm:px-10 md:px-16 lg:px-22 xl:px-27 pb-4 sm:pb-6 md:pb-7 lg:pb-8 xl:pb-10"
        >
          <blockquote
            className="font-raleway font-normal text-balance text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[36px] leading-[1.69] tracking-[0.1em] text-white"
          >
            {dict.text}
            <Image
              src="/icons/quote.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={17}
              className="ml-1 inline-block h-auto select-none w-3 -translate-y-0.5 sm:w-3.5 sm:-translate-y-1 md:w-4 md:-translate-y-1.5 xl:w-5 xl:-translate-y-2"
            />
          </blockquote>
          <p className="text-right font-catalog font-bold text-[13px] sm:text-[15px] md:text-[17px] lg:text-[21px] xl:text-[25px] leading-[1.5] tracking-[0.2em] text-white">
            - {dict.author}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
