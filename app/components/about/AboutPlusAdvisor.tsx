import Image from "next/image";
import type { AboutPlusAdvisorDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";
import Parallax from "../Parallax";

type Props = { dict: AboutPlusAdvisorDict };

export default function AboutPlusAdvisor({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-20 md:pt-24 lg:pt-28 xl:pt-31"
    >
      <ScrollReveal
        variant="fade-in"
        duration={1600}
        className="absolute -top-6 md:-top-12 xl:-top-16 w-full"
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

      <div className="relative z-10 flex flex-col gap-10 md:gap-14 lg:gap-16 px-5 sm:px-10 xl:px-20">
        <div className="flex flex-col w-fit">
          <div className="flex flex-col w-fit">
            <ScrollReveal
              as="h1"
              variant="fade-up"
              delay={0}
              duration={1800}
              className="pr-10 font-catalog font-black text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
            >
              {dict.title}
            </ScrollReveal>
            <SlidingDivider
              className="-ml-10 sm:-ml-20 xl:-ml-40"
              barClassName="bg-gold/40"
              delay={300}
              duration={1400}
            />
          </div>
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={200}
            duration={1600}
            className="mt-3 md:mt-3.25 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.4] tracking-[0.4em] text-[#88643B]"
          >
            {dict.subtitle}
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row justify-start items-center lg:gap-16 xl:gap-22 -mt-10 lg:mt-0 xl:mt-10">
          <div className="relative aspect-square h-60 sm:h-80 md:h-100 xl:h-120">
            <ScrollReveal
              variant="fade-right"
              delay={0}
              duration={1600}
              distance={60}
              className="absolute top-[7%] left-[1%] w-2/5 aspect-square rounded-full overflow-hidden"
            >
              <Parallax
                speed={0.05}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/home/circle-decoration.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 220px, 160px"
                  className="object-cover opacity-70 -rotate-60"
                />
              </Parallax>
            </ScrollReveal>
            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Parallax
                speed={0.06}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/about/illustration.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 486px, 90vw"
                  className="object-contain scale-120"
                />
              </Parallax>
            </ScrollReveal>
            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="block absolute top-[10%] right-[10%] w-1/5 aspect-square pointer-events-none z-10"
            >
              <Parallax speed={-0.06} data-scroll className="relative w-full">
                <Image
                  src="/home/line-ball.svg"
                  alt=""
                  width={420}
                  height={420}
                  className="w-full h-auto"
                />
              </Parallax>
            </ScrollReveal>
            <ScrollReveal
              variant="zoom-in"
              delay={400}
              duration={1600}
              className="absolute bottom-[10%] right-[17%] w-[30%] aspect-square"
            >
              <Parallax
                speed={-0.05}
                data-scroll
                className="relative w-full h-full bg-white rounded-full"
              >
                <Image
                  src="/shared/quote-ellipse-large.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 128px, 96px"
                  className="object-cover"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 xl:gap-6 max-w-2xl">
            {dict.paragraphs.map((paragraph, i) => (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={i * 150}
                duration={1600}
                className="font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.03em] text-navy"
              >
                {paragraph}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
