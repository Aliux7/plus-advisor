import Image from "next/image";
import type { JournalsHeroDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: JournalsHeroDict };

export default function Hero({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative h-screen overflow-hidden bg-white pt-0 flex flex-col-reverse lg:flex-row justify-center items-center px-5 sm:px-10 xl:px-20"
    >
      <div className="relative z-10 flex flex-col max-w-xl">
        <ScrollReveal
          as="h1"
          variant="fade-up"
          delay={300}
          duration={1800}
          className="font-catalog font-normal text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] xl:text-[48px] leading-normal tracking-widest text-gold"
        >
          {dict.title}
        </ScrollReveal>

        <ScrollReveal
          as="p"
          variant="fade-up"
          delay={600}
          duration={1600}
          className="mt-4 md:mt-5 lg:mt-6 max-w-lg font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-normal tracking-widest text-navy"
        >
          {dict.body}
        </ScrollReveal>
      </div>

      <div className="relative aspect-square h-64 sm:h-80 md:h-96 lg:h-[calc(100%-200px)] max-h-[85vw] lg:max-h-none mx-auto lg:mx-0 shrink-0 z-10">
        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1800}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Parallax speed={0.06} data-scroll className="relative w-full h-full">
            <Image
              src="/journals/lily.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 500px, 90vw"
              className="object-contain opacity-50 scale-150"
            />
          </Parallax>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-in"
          delay={200}
          duration={1800}
          className="block absolute top-[20%] left-[6%] w-1/5 aspect-square pointer-events-none z-10"
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
          variant="fade-right"
          delay={0}
          duration={1600}
          distance={60}
          className="bg-white absolute top-[10%] right-[10%] w-1/4 aspect-square rounded-full overflow-hidden"
        >
          <Parallax speed={0.05} data-scroll className="relative w-full h-full">
            <Image
              src="/shared/quote-ellipse-large.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 220px, 160px"
              className="object-cover -rotate-60"
            />
          </Parallax>
        </ScrollReveal>

        <ScrollReveal
          variant="zoom-in"
          delay={400}
          duration={1600}
          className="absolute bottom-[10%] left-[17%] w-1/5 aspect-square"
        >
          <Parallax
            speed={-0.05}
            data-scroll
            className="relative w-full h-full bg-white rounded-full overflow-hidden"
          >
            <Image
              src="/shared/family-legacy-ellipse.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 128px, 96px"
              className="object-cover opacity-70"
            />
          </Parallax>
        </ScrollReveal>
      </div>

      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="absolute bottom-0 overflow-hidden w-full h-40 md:h-60 lg:h-70 xl:h-80 -mt-20 md:-mt-28 lg:-mt-30 pointer-events-none"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="relative w-full h-full -bottom-8"
        >
          <Image
            src="/journals/blue-wave-sand.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover object-top"
          />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white to-transparent" />
      </ScrollReveal>

      <ScrollReveal
        variant="zoom-in"
        delay={1100}
        duration={1400}
        className="cursor-pointer absolute right-5 sm:right-10 xl:right-20 bottom-6 sm:bottom-8 md:bottom-10 xl:bottom-14 size-18 sm:size-20 md:size-22 xl:size-25 z-30"
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
            {dict.whistleLine1}
          </p>
          <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
            {dict.whistleLine2}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
