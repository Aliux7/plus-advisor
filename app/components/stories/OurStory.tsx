import Image from "next/image";
import type { OurStoryDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";
import Parallax from "../Parallax";

type Props = { dict: OurStoryDict };

const CARD_VISUALS = [
  { icon: "/stories/tones.svg", scale: "scale-130 md:scale-100 lg:scale-130" },
  { icon: "/stories/gold.svg", scale: "scale-130 md:scale-100 lg:scale-130" },
  { icon: "/stories/mountain.svg", scale: "scale-130 md:scale-120 lg:scale-160" },
];

export default function OurStory({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative pt-16 sm:pt-19 md:pt-20 lg:pt-24 xl:pt-28"
    >
      <div className="relative">
        <ScrollReveal
          variant="fade-right"
          delay={300}
          duration={3000}
          className="pointer-events-none absolute bottom-0 -left-4 sm:-left-6 md:-left-8 lg:-left-10 xl:-left-12 w-28 sm:w-30 md:w-36 lg:w-48 xl:w-60 aspect-square opacity-70"
        >
          <Parallax
            speed={-0.05}
            data-scroll
            className="relative w-full h-full"
          >
            <Image
              src="/home/line-ball.svg"
              alt=""
              fill
              sizes="(min-width: 1280px) 240px, (min-width: 1024px) 192px, (min-width: 768px) 144px, (min-width: 640px) 112px, 80px"
              className="object-contain"
            />
          </Parallax>
        </ScrollReveal>

        <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-10 md:gap-16 lg:gap-20 xl:gap-31 px-5 sm:px-10 xl:px-20">
          <div className="shrink-0 flex flex-col items-center justify-center gap-6 md:gap-8">
            <ScrollReveal
              variant="fade-up"
              delay={0}
              duration={1800}
              className="relative w-24 sm:w-32 md:w-40 lg:w-44 xl:w-48 aspect-square"
            >
              <Image
                src="/logo.svg"
                alt=""
                fill
                priority
                sizes="(min-width: 1280px) 192px, (min-width: 768px) 160px, 96px"
                className="object-contain"
              />
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="relative w-32 sm:w-40 md:w-48 lg:w-56 xl:w-60 h-4 sm:h-5 md:h-5.5 lg:h-6 xl:h-7"
            >
              <Image
                src="/logo_name.svg"
                alt="PLUS ADVISOR"
                fill
                priority
                sizes="(min-width: 1280px) 240px, (min-width: 768px) 192px, 128px"
                className="object-contain"
              />
            </ScrollReveal>
          </div>

          <div className="relative w-full flex flex-col gap-4 md:gap-5 xl:gap-6 max-w-3xl pb-32 md:pb-50 lg:pb-28 xl:pb-36.5">
            {dict.paragraphs.map((paragraph, i) => (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={i * 120}
                duration={1600}
                className="font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-[#424242]"
              >
                {paragraph}
              </ScrollReveal>
            ))}
            <SlidingDivider
              className="ml-auto w-full sm:w-3/4 lg:w-auto pointer-events-none absolute bottom-0 left-0 -right-40"
              barClassName="bg-gold/40"
              delay={300}
              duration={1400}
              from="right"
            />
          </div>
        </div>
      </div>

      <div className="relative pt-24 sm:pt-32 md:pt-40 lg:pt-48 xl:pt-55 pb-10">
        <ScrollReveal
          variant="fade-left"
          delay={300}
          duration={3000}
          className="pointer-events-none absolute -translate-y-1/2 top-0 right-0 w-36 sm:w-40 md:w-48 lg:w-64 xl:w-80 aspect-square "
        >
          <Parallax
            speed={-0.05}
            data-scroll
            className="relative w-full h-full"
          >
            <Image
              src="/stories/branch.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 256px, (min-width: 768px) 192px, (min-width: 640px) 144px, 104px "
              className="object-contain opacity-70"
            />
          </Parallax>
        </ScrollReveal>

        <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 justify-items-center gap-12 md:gap-8 lg:gap-12 xl:gap-16 px-5 sm:px-10 xl:px-20">
          {dict.cards.map((card, i) => {
            const visual = CARD_VISUALS[i];
            return (
              <ScrollReveal
                key={card.title}
                variant="fade-up"
                delay={i * 150}
                duration={1600}
                className="w-full md:w-auto flex flex-col items-start"
              >
                <div className="relative w-36 sm:w-40 md:w-48 lg:w-52 xl:w-60 aspect-square self-center md:self-start md:ml-2 lg:ml-4">
                  <Image
                    src={visual.icon}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, (min-width: 1024px) 208px, (min-width: 768px) 192px, (min-width: 640px) 160px, 144px"
                    className={`pointer-events-none object-contain ${visual.scale}`}
                  />
                </div>
                <h3 className="mt-1 font-catalog font-bold text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] xl:text-[32px] leading-[1.4] tracking-[0.15em] text-gold">
                  {card.title}
                </h3>
                <p className="mt-10 md:mt-16 lg:mt-24 font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-navy md:max-w-xs">
                  {card.body}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="relative overflow-hidden w-full h-40 md:h-64 lg:h-70 -mt-20 md:-mt-28 lg:-mt-30 pointer-events-none"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="relative w-full h-full -bottom-8"
        >
          <Image
            src="/stories/blue-sand-mountain-2.png"
            alt=""
            width={3038}
            height={1342}
            className="w-full h-auto object-cover object-top pointer-events-none"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white via-transparent to-transparent" />
        </Parallax>
      </ScrollReveal>

      <ScrollReveal
        variant="fade-left"
        delay={0}
        duration={3000}
        className="pointer-events-none absolute bottom-18 -right-3 sm:-right-4 md:-right-6 lg:-right-7 xl:-right-9 w-15 sm:w-21 md:w-27 lg:w-36 xl:w-45 aspect-square opacity-70"
      >
        <Parallax speed={-0.05} data-scroll className="relative w-full h-full">
          <Image
            src="/home/line-ball.svg"
            alt=""
            fill
            sizes="(min-width: 1280px) 180px, (min-width: 1024px) 144px, (min-width: 768px) 108px, (min-width: 640px) 84px, 60px"
            className="object-contain"
          />
        </Parallax>
      </ScrollReveal>
    </section>
  );
}
