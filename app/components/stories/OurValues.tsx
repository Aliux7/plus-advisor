import Image from "next/image";
import type { OurValuesDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: OurValuesDict };

const VALUE_VISUALS = [
  { icon: "/stories/integrity.svg", scale: "scale-140" },
  { icon: "/stories/legacy.svg", scale: "scale-210 translate-x-1/3 pb-5" },
  { icon: "/stories/personalization.svg", scale: "scale-170" },
  { icon: "/stories/expertise.svg", scale: "scale-180 translate-x-1/5" },
  { icon: "/stories/holistic-care.svg", scale: "scale-105" },
  { icon: "/stories/innovation.svg", scale: "scale-180" },
];

export default function OurValues({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative pt-10 sm:pt-12 lg:pt-14 xl:pt-16"
    >
      <div className="px-5 sm:px-10 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-10 lg:gap-16 xl:gap-24 items-baseline">
          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="font-catalog font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
          >
            {dict.title}
          </ScrollReveal>

          <div className="relative pb-6.5">
            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={150}
              duration={1800}
              className="font-raleway font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.4] tracking-widest text-[#424242] max-w-4xl"
            >
              {dict.intro}
            </ScrollReveal>
            <div className="pointer-events-none absolute bottom-0 left-0 -right-5 sm:-right-10 xl:-right-20 h-px bg-gold opacity-40" />
          </div>
        </div>

        <div className="mt-10 md:mt-14 lg:mt-16 xl:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 md:gap-y-16 lg:gap-y-20">
          {dict.values.map((value, index) => {
            const visual = VALUE_VISUALS[index];
            return (
              <ScrollReveal
                key={value.title}
                variant="fade-up"
                delay={(index % 3) * 150}
                duration={1600}
                className="flex flex-col"
              >
                <div className="pointer-events-none relative w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 aspect-square">
                  <Image
                    src={visual.icon}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 176px, (min-width: 1024px) 160px, (min-width: 768px) 144px, (min-width: 640px) 128px, 112px"
                    className={`object-contain ${visual.scale}`}
                  />
                </div>

                <h3 className="mt-2 font-catalog font-bold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] leading-[1.4] tracking-[0.15em] text-gold">
                  {value.title}
                </h3>

                <div className="mt-2 md:mt-4 h-px bg-gold opacity-40" />

                <p className="mt-6 md:mt-5 font-raleway font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] leading-[1.4] tracking-widest text-[#424242]">
                  {value.body}
                </p>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="relative flex justify-end items-center -mx-5 sm:-mx-10 xl:-mx-20 mb-10">
          <ScrollReveal
            variant="fade-in"
            delay={0}
            duration={1600}
            className="pointer-events-none absolute left-5 sm:left-10 xl:left-20 w-19.25 sm:w-26 md:w-35.5 lg:w-45.5 xl:w-58.25 aspect-square z-10"
          >
            <Parallax
              speed={-0.05}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/shared/family-legacy-ellipse.webp"
                alt=""
                fill
                sizes="(min-width: 1280px) 288px, (min-width: 1024px) 224px, (min-width: 768px) 176px, (min-width: 640px) 128px, 96px"
                className="object-contain opacity-70 rotate-180"
              />
            </Parallax>
          </ScrollReveal>

          <ScrollReveal
            variant="fade-up"
            delay={200}
            duration={1800}
            className="relative w-4/5 lg:w-3/4 pointer-events-none"
          >
            <Parallax speed={0.05} data-scroll className="relative w-full">
              <Image
                src="/stories/cloud-mountain.webp"
                alt=""
                width={4096}
                height={1448}
                className="w-full h-auto object-cover opacity-70"
              />
            </Parallax>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="relative overflow-hidden w-full h-40 md:h-64 lg:h-80 xl:h-100 -mt-20 md:-mt-28 lg:-mt-30 pointer-events-none"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="relative w-full h-full -bottom-8"
        >
          <Image
            src="/shared/blue-mountain-sand.webp"
            alt=""
            width={2400}
            height={800}
            className="max-w-none w-full h-full pointer-events-none"
          />
        </Parallax>
      </ScrollReveal>
    </section>
  );
}
