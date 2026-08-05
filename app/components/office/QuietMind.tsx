import Image from "next/image";
import type { QuietMindDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: QuietMindDict };

export default function QuietMind({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative min-h-96 md:min-h-120 lg:min-h-152.5 mt-40"
    >
      <div className="relative flex items-start px-5 sm:px-10 lg:px-20">
        <div className="pointer-events-none relative h-70 sm:h-90 md:h-110 lg:h-120 xl:h-140 aspect-square">
          <ScrollReveal
            variant="fade-right"
            delay={300}
            duration={1800}
            className="pointer-events-none absolute bottom-0 left-0 translate-x-[-55%] translate-y-[20%] w-[250%] lg:w-[260%] xl:w-[280%] aspect-16/7 z-0"
          >
            <Parallax
              speed={-0.05}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/office/mountains.webp"
                alt=""
                fill
                className="object-contain object-left opacity-70 -scale-x-110 scale-110"
              />
            </Parallax>
          </ScrollReveal>

          <ScrollReveal
            variant="fade-in"
            delay={0}
            duration={1600}
            className="pointer-events-none absolute aspect-square w-[27%] left-0 top-[5%] z-10 rounded-full"
          >
            <Parallax speed={-0.05} data-scroll className="relative w-full h-full">
              <Image
                src="/shared/family-legacy-ellipse.webp"
                alt=""
                fill
                className="object-contain opacity-70"
              />
            </Parallax>
          </ScrollReveal>

          <ScrollReveal
            variant="fade-right"
            delay={200}
            duration={1600}
            distance={60}
            className="pointer-events-none absolute top-[0%] -translate-y-1/5 left-[27%] w-[75%] aspect-square z-20"
          >
            <Parallax speed={0.06} data-scroll className="relative w-full h-full">
              <Image
                src="/office/birds.webp"
                alt=""
                fill
                className="object-contain opacity-50 lg:opacity-80 scale-90"
              />
            </Parallax>
          </ScrollReveal>

          <ScrollReveal
            variant="fade-up"
            delay={500}
            duration={1600}
            className="pointer-events-none aspect-square absolute translate-x-full right-[0%] top-[50%] w-[16%] z-10"
          >
            <Parallax
              speed={-0.12}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/home/circle-decoration.webp"
                alt=""
                fill
                className="object-contain opacity-60"
              />
            </Parallax>
          </ScrollReveal>
        </div>

        <div className="absolute -translate-y-full sm:translate-0 right-10 xl:right-20 text-center flex flex-col gap-2 md:gap-3 lg:gap-4 min-w-[45%]">
          {dict.lines.map((line, i) => {
            const isFirst = i === 0;
            const isLast = i === dict.lines.length - 1;
            return (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={300 + i * 150}
                duration={1800}
                className="relative font-catalog font-normal text-[22px] sm:text-[27px] md:text-[31px] lg:text-[37px] xl:text-[43px] leading-[1.4] tracking-widest text-navy text-start"
              >
                {isFirst && (
                  <span className="absolute -translate-x-full scale-150 not-italic">
                    &ldquo;
                  </span>
                )}
                {line}
                {isLast && (
                  <span className="inline-block scale-150 not-italic">
                    &rdquo;
                  </span>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <div className="w-full h-16" />
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
