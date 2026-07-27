import Image from "next/image";
import type { StoriesHeroDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";

type Props = { dict: StoriesHeroDict };

export default function Hero({ dict }: Props) {
  return (
    <section data-scroll-section className="relative pt-0">
      <video
        src="/stories/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Jakarta city skyline"
        className="block h-screen w-full object-cover"
      />

      <div className="absolute flex flex-col items-start justify-end top-0 h-screen z-10 w-full px-5 sm:px-10 xl:px-20 pb-8 md:pb-10 xl:pb-14">
        <ScrollReveal
          as="p"
          variant="fade-up"
          delay={300}
          duration={1600}
          className="mb-2 md:mb-3.5 font-raleway text-[14px] sm:text-[16px] md:text-[18px] xl:text-[24px] font-light leading-normal tracking-widest text-white"
        >
          {dict.eyebrow}
        </ScrollReveal>

        <ScrollReveal
          as="h1"
          variant="fade-up"
          delay={700}
          duration={1800}
          className="lg:text-nowrap font-catalog text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-normal leading-normal tracking-widest text-white"
        >
          {dict.titleLine1}
          <br />
          <span className="italic pr-10 sm:pr-20 lg:pr-0 pl-0 lg:pl-[20%] xl:pl-[37%]">
            {dict.titleLine2}
          </span>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-in"
          delay={1500}
          duration={1400}
          className="mt-4 md:mt-6 xl:mt-16"
        >
          <Image
            src="/home/mouse-scroll.svg"
            alt=""
            width={35}
            height={35}
            className="w-4 md:w-5 xl:w-5.5 h-auto"
          />
        </ScrollReveal>

        <ScrollReveal
          variant="zoom-in"
          delay={1100}
          duration={1400}
          className="cursor-pointer absolute right-5 sm:right-10 xl:right-20 bottom-6 sm:bottom-8 md:bottom-10 xl:bottom-14 size-18 sm:size-20 md:size-22 xl:size-25"
        >
          <div className="w-full h-full flex flex-col justify-center items-center backdrop-blur-md bg-white/75 hover:bg-white rounded-full font-catalog font-black transition-colors ease-in-out duration-500">
            <Image
              src="/home/whistle-icon.webp"
              alt=""
              width={110}
              height={110}
              className="w-10 sm:w-12 md:w-13 xl:w-15 h-auto -mt-1 xl:-mt-2 -mb-2 xl:-mb-3"
            />
            <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
              WHISTLE
            </p>
            <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
              BLOWING
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
