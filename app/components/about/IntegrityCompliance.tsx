import Image from "next/image";
import type { IntegrityComplianceDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: IntegrityComplianceDict };

export default function IntegrityCompliance({ dict }: Props) {
  return (
    <section data-scroll-section className="relative overflow-hidden bg-white pt-14 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 px-5 sm:px-10 xl:px-20">
        <div className="h-fit relative w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none">
          <ScrollReveal
            variant="fade-in"
            delay={0}
            duration={1800}
            className="absolute top-0 left-0 -translate-x-1/2 -translate-1/3 size-48 sm:size-56 md:size-64 lg:size-72 xl:size-88 pointer-events-none z-10"
          >
            <Parallax
              speed={-0.05}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/home/family-legacy-ellipse.webp"
                alt=""
                fill
                sizes="352px"
                className="object-contain opacity-70"
              />
            </Parallax>
          </ScrollReveal>

          <ScrollReveal
            variant="fade-up"
            delay={100}
            duration={1800}
            className="relative w-full aspect-6/7 md:aspect-6/7 lg:aspect-6/7 rounded-2xl overflow-hidden"
          >
            <Parallax
              speed={0.04}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/about/family-sunset.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </Parallax>
          </ScrollReveal> 

          <ScrollReveal
            variant="fade-in"
            delay={400}
            duration={1800}
            className="absolute bottom-0 right-0 translate-y-1/2 translate-1/3 size-21 sm:size-24 md:size-30 lg:size-36 xl:size-42 pointer-events-none z-10"
          >
            <Parallax
              speed={0.05}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/home/line-ball.svg"
                alt=""
                fill
                sizes="168px"
                className="object-contain"
              />
            </Parallax>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 lg:max-w-lg">
          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="font-catalog font-black text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[32px] leading-[1.4] tracking-normal text-gold"
          >
            {dict.title}
          </ScrollReveal>

          {dict.paragraphs.map((paragraph, index) => (
            <ScrollReveal
              key={index}
              as="p"
              variant="fade-up"
              delay={index * 120}
              duration={1600}
              className="font-raleway font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] leading-[1.4] tracking-normal text-navy"
            >
              {paragraph}
            </ScrollReveal>
          ))}
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
            src="/home/blue-mountain-sand.webp"
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
