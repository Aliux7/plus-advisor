import Image from "next/image";
import type { MindsetPlanningDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: MindsetPlanningDict };

export default function MindsetPlanning({ dict }: Props) {
  return (
    <section data-scroll-section className="relative overflow-hidden bg-white pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-30">
      <div className="relative">
        <ScrollReveal
          variant="fade-in"
          delay={0}
          duration={1600}
          className="absolute -top-12 sm:-top-16 md:-top-20 lg:-top-24 xl:-top-30 -right-10 sm:-right-14 md:-right-18 lg:-right-22 xl:-right-26 w-48 sm:w-56 md:w-80 lg:w-96 xl:w-xl pointer-events-none z-10"
        >
          <Parallax speed={-0.05} data-scroll className="relative w-full">
            <Image
              src="/about/tree.webp"
              alt=""
              width={640}
              height={640}
              className="w-full h-auto -scale-x-100 opacity-40"
            />
          </Parallax>
        </ScrollReveal>

        <div className="relative px-5 sm:px-10 xl:px-20 pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-12 md:pb-16 lg:pb-20 xl:pb-24">
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="max-w-[320px] sm:max-w-xl lg:max-w-3xl xl:max-w-4xl font-raleway font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] leading-[1.4] tracking-wider text-[#424242]"
          >
            {dict.intro}
          </ScrollReveal>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full aspect-12/8 sm:aspect-14/8 md:aspect-16/8 lg:aspect-20/8 xl:aspect-24/8 overflow-hidden">
          <Parallax speed={0.04} data-scroll className="absolute inset-0">
            <Image
              src="/about/island.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
        </div>

        <div className="relative z-10 px-5 sm:px-10 xl:px-20 -mt-32 sm:-mt-33 md:-mt-36 lg:-mt-41.25 xl:-mt-45">
          <div className="bg-navy/50 backdrop-blur-sm rounded-xl">
            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="px-8 sm:px-12 py-6 pb-10"
            >
              <h2
                style={{ fontFamily: "var(--font-catalog)" }}
                className="font-bold text-white text-[22px] sm:text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px] leading-[1.4] tracking-[0.15em]"
              >
                {dict.title}
                <span className="block pl-10 sm:pl-14 md:pl-20 lg:pl-28 xl:pl-36">
                  {dict.titleSecondLine}
                </span>
              </h2>
            </ScrollReveal>

            <div className="bg-navy rounded-xl shadow-[0px_4px_4px_0px_#00000040] text-white px-8 sm:px-12 py-7 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-24">
                <div className="flex flex-col gap-5 md:gap-6 lg:gap-7">
                  {dict.paragraphs.map((paragraph, index) => (
                    <ScrollReveal
                      key={index}
                      as="p"
                      variant="fade-up"
                      delay={index * 120}
                      duration={1600}
                      className="font-raleway font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] leading-[1.4] tracking-widest text-white"
                    >
                      {paragraph}
                    </ScrollReveal>
                  ))}
                </div>

                <ul className="flex flex-col gap-5 md:gap-6 lg:gap-8">
                  {dict.bullets.map((bullet, index) => (
                    <ScrollReveal
                      key={index}
                      as="li"
                      variant="fade-up"
                      delay={index * 120}
                      duration={1600}
                      className="relative pl-4 md:pl-6 font-catalog font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 md:top-2.5 lg:top-3 size-0.5 lg:size-1 rounded-full bg-white"
                      />
                      {bullet}
                    </ScrollReveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
