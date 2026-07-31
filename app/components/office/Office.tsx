import Image from "next/image";
import type { FamilyOfficeDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";
import Parallax from "../Parallax";

type Props = { dict: FamilyOfficeDict };

export default function FamilyOffice({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-20 md:pt-24 lg:pt-28 xl:pt-31 pb-20 md:pb-24 lg:pb-28 xl:pb-32"
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
            className="mt-3 md:mt-3.25 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.4] tracking-[0.4em] text-gold"
          >
            {dict.subtitle}
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row items-center lg:gap-16 xl:gap-24">
          <div className="flex flex-col gap-5 md:gap-6 xl:gap-7 max-w-2xl lg:flex-1">
            <div className="flex flex-col gap-1">
              <ScrollReveal
                as="p"
                variant="fade-up"
                delay={0}
                duration={1600}
                className="font-catalog font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[26px] leading-[1.4] tracking-widest text-gold"
              >
                {dict.eyebrow}
              </ScrollReveal>
              <ScrollReveal
                as="h2"
                variant="fade-up"
                delay={120}
                duration={1600}
                className="font-catalog font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[26px] leading-[1.4] tracking-widest text-gold"
              >
                {dict.heading}
              </ScrollReveal>
            </div>

            {dict.paragraphs.map((paragraph, i) => (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={i * 150}
                duration={1600}
                className="pl-5 sm:pl-10 xl:pl-20 font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.03em] text-navy"
              >
                {paragraph}
              </ScrollReveal>
            ))}
          </div>

          <div className="relative aspect-square h-70 sm:h-90 md:h-110 xl:h-130 mx-auto lg:mx-0 shrink-0">
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
                  src="/office/leaf.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 500px, 90vw"
                  className="object-contain opacity-60"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="block absolute top-[17%] right-[17%] w-1/5 aspect-square pointer-events-none z-10"
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
              className="absolute bottom-[10%] right-[17%] w-[30%] aspect-square"
            >
              <Parallax
                speed={-0.05}
                data-scroll
                className="relative w-full h-full bg-white rounded-full overflow-hidden"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 xl:gap-16">
          {dict.advisoryParagraphs.map((paragraph, i) => (
            <ScrollReveal
              key={i}
              as="p"
              variant="fade-up"
              delay={i * 150}
              duration={1600}
              className="font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-[0.02em] text-navy"
            >
              {paragraph}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
