import Image from "next/image";
import type { VisionMissionDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: VisionMissionDict };

const PANEL_VISUALS = [
  { tone: "bg-gold/50", background: "bg-gold" },
  { tone: "bg-navy/50", background: "bg-navy" },
];

export default function VisionMission({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative"
    >
      <div className="relative">
        <div
          className="relative w-full aspect-12/9 sm:aspect-14/9 md:aspect-video lg:aspect-20/10 xl:aspect-24/14 overflow-hidden"
        >
          <Parallax speed={0.04} data-scroll className="absolute inset-0">
            <Image
              src="/stories/vision-mission.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
        </div>

        <ScrollReveal
          variant="fade-left"
          delay={0}
          duration={3000}
          className="pointer-events-none absolute top-4 sm:top-6 md:top-8 lg:top-10 xl:top-12 -right-8 sm:-right-10 md:-right-12 lg:-right-16 xl:-right-20 w-32 sm:w-43 md:w-53 lg:w-69 xl:w-85 aspect-square"
        >
          <Parallax
            speed={-0.05}
            data-scroll
            className="relative w-full h-full"
          >
            <Image
              src="/shared/quote-ellipse-small.svg"
              alt=""
              fill
              sizes="(min-width: 1280px) 256px, (min-width: 1024px) 208px, (min-width: 768px) 160px, (min-width: 640px) 128px, 96px"
              className="object-contain"
            />
          </Parallax>
        </ScrollReveal>

        <div className="relative z-10 px-5 sm:px-10 xl:px-20 mt-10 md:-mt-36 lg:-mt-41.25 xl:-mt-42 flex flex-col md:flex-row justify-center gap-4 lg:gap-5">
          {dict.panels.map((panel, panelIndex) => {
            const visual = PANEL_VISUALS[panelIndex];
            return (
              <div
                key={panel.title}
                className={`${visual.tone} backdrop-blur-sm rounded-xl w-full max-w-2xl flex flex-col`}
              >
                <ScrollReveal
                  variant="fade-up"
                  delay={200 + panelIndex * 150}
                  duration={1800}
                  className="p-8 sm:p-9 pb-13.5 md:pb-17"
                >
                  <h2
                    style={{ fontFamily: "var(--font-catalog)" }}
                    className="font-bold text-white text-[24px] sm:text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em]"
                  >
                    {panel.title}
                  </h2>
                </ScrollReveal>

                <div className={`${visual.background} flex-1 rounded-xl shadow-[0px_4px_4px_0px_#00000040] text-white px-8 sm:px-12 py-7 pb-8`}>
                  <div className="flex flex-col gap-5 md:gap-6 lg:gap-7">
                    {panel.paragraphs.map((paragraph, index) => (
                      <ScrollReveal
                        key={index}
                        as="p"
                        variant="fade-up"
                        delay={index * 120}
                        duration={1600}
                        className="font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-white"
                      >
                        {paragraph}
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
