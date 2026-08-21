import Image from "next/image";
import type { AscentDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: AscentDict };

export default function Ascent({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative bg-white pb-20 lg:pb-0"
    >
      <div className="relative px-5 sm:px-10 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 xl:gap-24 items-center">
          <div className="relative w-4/5 sm:w-full aspect-4/5 max-w-md lg:max-w-none mx-auto lg:mx-0">
            <ScrollReveal
              variant="fade-in"
              delay={0}
              duration={1800}
              className="pointer-events-none absolute top-[5%] left-[-10%] w-32 sm:w-40 md:w-52 lg:w-60 xl:w-72 aspect-square z-0"
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
                  sizes="(min-width: 1280px) 288px, (min-width: 1024px) 240px, (min-width: 768px) 208px, (min-width: 640px) 160px, 128px"
                  className="object-contain opacity-70"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={200}
              duration={1800}
              className="relative w-full h-full z-10 -translate-y-1/20"
            >
              <Parallax
                speed={0.05}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/office/flower.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 400px, 90vw"
                  className="object-contain -rotate-22 opacity-60"
                />
              </Parallax>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-in"
              delay={400}
              duration={1800}
              className="pointer-events-none absolute bottom-[15%] right-0 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 aspect-square z-0"
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
                  sizes="(min-width: 1280px) 224px, (min-width: 1024px) 192px, (min-width: 768px) 160px, (min-width: 640px) 128px, 96px"
                  className="object-contain"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={0}
              duration={1800}
              className="font-catalog font-bold text-[20px] sm:text-[22px] md:text-[26px] lg:text-[29px] xl:text-[32px] leading-[1.4] tracking-[0.2em] text-gold"
            >
              {dict.titleLine1}
              <span className="block">{dict.titleLine2}</span>
            </ScrollReveal>

            <ol className="flex flex-col gap-5 md:gap-6 lg:gap-7">
              {dict.principles.map((principle, i) => (
                <ScrollReveal
                  key={principle.number}
                  as="li"
                  variant="fade-up"
                  delay={i * 120}
                  duration={1600}
                  className="flex flex-col gap-1"
                >
                  <p className="font-raleway font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-normal tracking-widest text-navy">
                    {principle.number}
                  </p>
                  <p className="font-raleway font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-normal tracking-widest text-navy">
                    {principle.title}
                  </p>
                  <p className="font-raleway font-normal italic text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-normal tracking-widest text-navy">
                    —{principle.body}
                  </p>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex justify-between items-start gap-8 md:gap-10 lg:gap-16 xl:gap-24 mt-12 md:mt-16 lg:mt-20">
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="font-catalog font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.69] tracking-widest text-navy max-w-2xl"
          >
            {dict.closing}
          </ScrollReveal>

          <ScrollReveal
            variant="fade-in"
            delay={200}
            duration={1800}
            className="pointer-events-none absolute top-1/2 lg:top-auto translate-y-1/2 lg:translate-y-0 right-10 lg:right-auto lg:relative w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 aspect-square ml-auto"
          >
            <Parallax
              speed={0.05}
              data-scroll
              className="relative w-full h-full"
            >
              <Image
                src="/home/bird.webp"
                alt=""
                fill
                sizes="(min-width: 1280px) 256px, (min-width: 1024px) 224px, (min-width: 768px) 192px, (min-width: 640px) 160px, 128px"
                className="object-contain scale-200"
              />
            </Parallax>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
