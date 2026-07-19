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
          <ScrollReveal
            as="h1"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="font-catalog font-black text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
          >
            {dict.title}
          </ScrollReveal>
          <SlidingDivider
            className="w-full -ml-10 sm:-ml-20 xl:-ml-40"
            barClassName="bg-gold/40"
            delay={300}
            duration={1400}
          />
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

        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:gap-7">
          <div className="mx-auto lg:-ml-10 xl:ml-0 origin-top sm:origin-top-left scale-90 sm:scale-100 lg:scale-80 xl:scale-100 -mb-20 sm:mb-0 lg:-mr-24 xl:mr-0 lg:-mb-24 xl:mb-0 relative w-full max-w-md lg:w-121.5 lg:max-w-none lg:shrink-0 pl-10 xl:-translate-y-1/8">
            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="block absolute size-20 sm:size-23.5 aspect-square pointer-events-none z-10 right-10 sm:right-20 top-5 sm:top-20"
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
              variant="fade-right"
              delay={0}
              duration={1600}
              distance={60}
              className="absolute top-10 lg:top-14 left-4 lg:left-12 w-36 sm:w-50 aspect-square rounded-full overflow-hidden"
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
              className="relative w-full"
            >
              <Parallax speed={0.1} data-scroll className="relative w-full">
                <Image
                  src="/Asset 14@2x.svg"
                  alt=""
                  width={486}
                  height={546}
                  className="w-full h-auto"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="zoom-in"
              delay={400}
              duration={1600}
              className="absolute bottom-20 lg:bottom-30 right-20 lg:right-24 size-20 sm:size-32 aspect-square"
            >
              <Parallax
                speed={-0.05}
                data-scroll
                className="relative w-full h-full bg-white rounded-full overflow-hidden"
              >
                <Image
                  src="/home/quote-ellipse-large.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 128px, 96px"
                  className="object-cover"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 xl:gap-6 max-w-2xl xl:mt-10">
            {dict.paragraphs.map((paragraph, i) => (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={i * 150}
                duration={1600}
                className="font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[1.4] tracking-[0.03em] text-navy"
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
