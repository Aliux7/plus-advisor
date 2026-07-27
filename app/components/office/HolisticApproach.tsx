"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HolisticApproachDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";
import SlidingDivider from "../SlidingDivider";

type Props = { dict: HolisticApproachDict };

const PHASE_COLORS = ["#88643B", "#002846", "#765C4B", "#095E71"];

export default function HolisticApproach({ dict }: Props) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [titleHeight, setTitleHeight] = useState(0);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const update = () => setTitleHeight(el.offsetHeight + 14);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      data-scroll-section
      className="relative overflow-hidden pb-16 md:pb-20 lg:pb-24 xl:pb-28"
    >
      <div className="relative">
        <ScrollReveal
          variant="fade-in"
          delay={0}
          duration={1800}
          className="relative w-full aspect-12/10 sm:aspect-13/10 md:aspect-16/10 lg:aspect-20/10 xl:aspect-24/14 overflow-hidden"
        >
          <Parallax speed={0.04} data-scroll className="absolute inset-0">
            <Image
              src="/office/holistic-approach.webp"
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </Parallax>

          <div className="w-9/10 relative flex flex-col pb-6 justify-end gap-6 sm:gap-10 lg:gap-14 sm:flex-row items-end mt-21">
            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={200}
              duration={1800}
              className="text-white font-catalog font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] leading-[1.4] tracking-[0.15em] pl-0 lg:pl-20 xl:pl-24"
            >
              {dict.title}
            </ScrollReveal>

            <SlidingDivider
              className="absolute bottom-0 left-0 w-full"
              barClassName="bg-white"
              delay={600}
              duration={1400}
            />
          </div>
        </ScrollReveal>

        <div
          className="relative z-10 px-5 sm:px-10 xl:px-20 mt-10 xl:mt-(--dynamic-mt)"
          style={{ "--dynamic-mt": `-${titleHeight}px` } as React.CSSProperties}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:grid-rows-[auto_1fr] gap-3 md:gap-4 xl:gap-5">
            {dict.phases.map((phase, i) => {
              const color = PHASE_COLORS[i % PHASE_COLORS.length];
              return (
                <div
                  key={phase.number}
                  className="backdrop-blur-sm rounded-xl flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-2"
                  style={{ backgroundColor: `${color}80` }}
                >
                  <div ref={i === 0 ? titleRef : undefined}>
                    <ScrollReveal
                      variant="fade-up"
                      delay={i * 120}
                      duration={1800}
                      className="px-5 sm:px-6 md:px-7 pt-6 sm:pt-7 md:pt-8 pb-6 flex flex-col"
                    >
                      <p className="font-catalog font-normal italic text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[22px] leading-[1.4] tracking-[0.15em] text-white">
                        {phase.number}
                      </p>
                      <h3 className="font-catalog font-black text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[30px] leading-[1.4] tracking-[0.15em] text-white">
                        {phase.title}
                      </h3>
                      <p className=" mt-2 md:mt-3 font-catalog font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-[0.25em] text-white">
                        {phase.subtitle}
                      </p>
                    </ScrollReveal>
                  </div>

                  <div
                    className="flex-1 rounded-xl shadow-[0px_4px_4px_0px_#00000040] text-white px-5 sm:px-6 md:px-7 py-6 sm:py-7 md:py-8"
                    style={{ backgroundColor: color }}
                  >
                    <ScrollReveal
                      as="p"
                      variant="fade-up"
                      delay={i * 120 + 200}
                      duration={1600}
                      className="font-raleway font-bold text-[11px] sm:text-[12px] md:text-[12px] lg:text-[13px] xl:text-[14px] leading-[1.4] tracking-widest text-white/90"
                    >
                      {phase.body}
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
