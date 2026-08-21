import Image from "next/image";
import type { LeadershipDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: LeadershipDict };

export default function Leadership({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-16 md:pt-24 lg:pt-32 xl:pt-40 pb-14 lg:pb-20 xl:pb-44"
    >
      <ScrollReveal
        variant="fade-in"
        delay={0}
        duration={1600}
        className="absolute z-20 -top-2 sm:-top-3 md:-top-4 xl:-top-5 right-0 w-48 sm:w-64 md:w-80 lg:w-96 xl:w-120 aspect-square pointer-events-none"
      >
        <Parallax speed={0.08} data-scroll className="relative w-full h-full">
          <Image
            src="/about/marble-ellipse.svg"
            alt=""
            fill
            className="object-contain"
          />
        </Parallax>
      </ScrollReveal>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-24 px-5 sm:px-10 xl:px-20">
        <div className="flex flex-col xl:max-w-2xl">
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={0}
            duration={1400}
            className="font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.4] tracking-[0.4em] text-gold"
          >
            {dict.eyebrow}
          </ScrollReveal>

          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={100}
            duration={1800}
            className="mt-1.5 font-catalog font-bold text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
          >
            {dict.name}
          </ScrollReveal>

          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={250}
            duration={1600}
            className="mt-6 md:mt-8 xl:mt-10.5 pr-10 sm:pr-20 md:pr-32 lg:pr-44 xl:pr-0 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[18px] xl:text-[20px] leading-[1.4] tracking-[0.03em] text-gold"
          >
            {dict.featuredQuote}
          </ScrollReveal>

          <div className="mt-6 md:mt-8 xl:mt-8.5 flex flex-col gap-4 md:gap-5 relative pl-16 md:pl-20 xl:pl-24">
            <ScrollReveal
              variant="fade-right"
              delay={200}
              duration={1600}
              className="absolute -left-6 sm:-left-10 md:-left-14 xl:-left-16 top-0 pointer-events-none z-0"
            >
              <Parallax speed={-0.06} data-scroll className="relative w-full">
                <Image
                  src="/about/koi.svg"
                  alt=""
                  width={154}
                  height={308}
                  className="w-20 sm:w-24 md:w-32 xl:w-38.5 aspect-1/2 opacity-90"
                />
              </Parallax>
            </ScrollReveal>
            {dict.paragraphs.slice(0, 2).map((paragraph, i) => (
              <ScrollReveal
                key={i}
                as="p"
                variant="fade-up"
                delay={400 + i * 150}
                duration={1600}
                className="font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.04em] text-navy"
              >
                {paragraph}
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-5 relative">
            {(() => {
              const paragraph = dict.paragraphs[2] ?? "";
              const highlight = `"${dict.recognitionHighlight}"`;
              return paragraph.split("\n").map((part, partIdx) => {
                const trimmed = part.trim();
                const idx = trimmed.indexOf(highlight);
                const before = idx === -1 ? trimmed : trimmed.slice(0, idx);
                const after =
                  idx === -1 ? "" : trimmed.slice(idx + highlight.length);
                return (
                  <ScrollReveal
                    key={partIdx}
                    as="p"
                    variant="fade-up"
                    delay={400 + partIdx * 150}
                    duration={1600}
                    className="font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.04em] text-navy"
                  >
                    {before}
                    {idx !== -1 && (
                      <strong className="font-bold">{highlight}</strong>
                    )}
                    {after}
                  </ScrollReveal>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <ScrollReveal
            variant="fade-left"
            delay={150}
            duration={1800}
            distance={60}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto aspect-4/5 lg:mt-16 xl:mt-24"
          >
            <div className="relative w-full h-full overflow-hidden rounded-md shadow-xl">
              <Image
                src={dict.portrait || "/about/priskilla-portrait.webp"}
                alt={dict.portraitAlt}
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 90vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal
            variant="fade-up"
            delay={900}
            duration={1600}
            className="mt-4 md:mt-6 flex flex-col items-center gap-4 sm:gap-6"
          >
            <span className="font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.4] tracking-[0.04em] text-navy/70">
              {dict.memberOfLabel}
            </span>
            <div className="flex flex-wrap justify-center items-stretch gap-5 md:gap-6 lg:gap-8">
              <div className="flex flex-col items-center justify-start gap-1 h-14 sm:h-12 md:h-14 lg:h-16 xl:h-18">
                <div className="relative flex-1 aspect-4/2 overflow-hidden">
                  <Image
                    src="/about/ojk.svg"
                    alt="OJK — Otoritas Jasa Keuangan"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <span
                  style={{ fontFamily: "var(--font-gotham-condensed)" }}
                  className="font-medium text-[10px] leading-[1.2] tracking-widest uppercase text-navy whitespace-nowrap"
                >
                  Penasihat Investasi Perseorangan
                </span>
              </div>
              <div className="relative h-14 sm:h-12 md:h-14 lg:h-16 xl:h-18 aspect-video overflow-hidden">
                <Image
                  src="/about/cfp.svg"
                  alt="Certified Financial Planner (CFP)"
                  fill
                  className="object-cover w-full h-full object-center"
                />
              </div>

              <div className="relative h-14 sm:h-12 md:h-14 lg:h-16 xl:h-18 aspect-3/1 overflow-hidden">
                <Image
                  src="/about/fpb.svg"
                  alt="FPSB Indonesia"
                  fill
                  className="scale-120 object-cover w-full h-full object-center"
                />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal
            variant="fade-in"
            delay={0}
            duration={1600}
            className="hidden md:block absolute z-20 -bottom-6 md:-bottom-8 lg:-bottom-10 -right-8 sm:-right-16 md:-right-20 xl:-right-24 w-64 sm:w-80 md:w-100 xl:w-135 h-48 sm:h-60 md:h-75 xl:h-101 pointer-events-none"
          >
            <Parallax
              speed={0.08}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/about/mountain.svg"
                alt=""
                fill
                className="object-contain"
              />
            </Parallax>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
