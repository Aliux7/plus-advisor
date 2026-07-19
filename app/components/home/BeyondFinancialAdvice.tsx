import Image from "next/image";
import type { BeyondFinancialAdviceDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";
import Parallax from "../Parallax";

type Props = { dict: BeyondFinancialAdviceDict };

export default function BeyondFinancialAdvice({ dict }: Props) {
  return (
    <section data-scroll-section className="mt-40 relative min-h-screen text-white">
      <Parallax speed={0.08} data-scroll className="absolute inset-0">
        <Image
          src="/home/beach-family-sunset.webp"
          alt="Family playing at the beach during sunset"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>

      <div className="relative flex flex-col justify-between items-start h-full z-10 gap-20 md:gap-32 lg:gap-40 xl:gap-52.5 pt-20 md:pt-24 lg:pt-28 xl:pt-31">
        <div className="w-full sm:w-fit relative flex flex-col pb-6 px-5 sm:px-10 xl:px-20 items-start justify-start gap-6 sm:gap-10 lg:gap-14 sm:flex-row sm:items-end">
          <div>
            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={0}
              duration={1800}
              className="font-catalog font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] leading-[1.4] tracking-[0.15em]"
            >
              {dict.eyebrow}
            </ScrollReveal>
            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={200}
              duration={1800}
              className="font-catalog font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] leading-[1.4] tracking-[0.15em] pl-0 lg:pl-20 xl:pl-24"
            >
              {dict.title}
            </ScrollReveal>
          </div>
          <ScrollReveal
            variant="fade-up"
            delay={400}
            duration={1400}
            className="mb-2 lg:mb-2.5 w-fit"
          >
            <a
              href="#services"
              className="flex items-center justify-center rounded-2xl border border-[#88643B] h-9 md:h-9.5 w-40 md:w-49.5 font-saira font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-none tracking-normal text-center text-[#88643B] transition-colors duration-300 ease-in-out hover:bg-gold hover:text-white"
            >
              {dict.cta}
            </a>
          </ScrollReveal>
          <SlidingDivider
            className="absolute bottom-0 left-0 w-full"
            barClassName="bg-white"
            delay={600}
            duration={1400}
          />
        </div>

        <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 grid-rows-[auto_auto_auto_auto] gap-x-4 md:gap-x-6 gap-y-0 space-y-10 pt-8 md:pt-12 pb-8 md:pb-12 px-5 sm:px-10 xl:px-20 sm:grid-cols-2 lg:grid-cols-5 bg-[#88643B]/50 backdrop-blur-xs">
          {dict.pillars.map((pillar, index) => (
            <ScrollReveal
              key={pillar.number}
              variant="fade-up"
              delay={index * 120}
              duration={1600}
              className="grid grid-rows-subgrid row-span-4"
            >
              <p className="mb-2 md:mb-3 font-catalog font-normal italic text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.15em] text-white">
                {pillar.number}
              </p>
              <h3 className="font-catalog font-black text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-[1.4] tracking-[0.15em] text-white">
                {pillar.title}
              </h3>
              <p className="mt-4 md:mt-6 font-raleway font-bold text-[11px] md:text-[12px] leading-[1.4] tracking-[0.15em] text-white">
                {pillar.lead}
              </p>
              <p className="mt-3 md:mt-4 font-raleway font-bold text-[11px] md:text-[12px] leading-[1.4] tracking-[0.15em] text-white">
                {pillar.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
