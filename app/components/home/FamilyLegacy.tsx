import Image from "next/image";
import type { Dictionary } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: Dictionary["familyLegacy"] };

export default function FamilyLegacy({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white pt-16 md:pt-24 lg:pt-38"
    >
      <ScrollReveal
        variant="fade-in"
        duration={1600}
        className="absolute -top-8 md:-top-16 w-full"
      >
        <Parallax speed={0.15} data-scroll className="w-full">
          <Image
            src="/home/family-legacy-mountain-sand.svg"
            alt=""
            width={2880}
            height={1534}
            priority
            sizes="100vw"
            className="w-full object-cover"
          />
        </Parallax>
      </ScrollReveal>

      <div className="px-5 sm:px-10 xl:px-20">
        <div className="grid items-center gap-10 lg:gap-32 grid-cols-1 lg:grid-cols-2">
          <div className="relative pb-16 sm:pb-24 md:pb-32 xl:pb-44">
            <div className="absolute left-0 -translate-x-1/2 lg:-translate-x-[calc(50%+3rem)] xl:-translate-x-[calc(50%+5rem)] z-20 top-8 sm:top-12 md:top-16 lg:top-20 xl:top-30">
              <ScrollReveal
                variant="fade-right"
                delay={200}
                duration={1600}
                distance={80}
              >
                <Parallax speed={0.2} data-scroll>
                  <div className="bg-white rounded-full">
                    <Image
                      src="/home/family-legacy-ellipse.webp"
                      alt=""
                      width={500}
                      height={500}
                      className="object-cover h-48 sm:h-64 md:h-80 xl:h-118 w-auto opacity-70"
                    />
                  </div>
                </Parallax>
              </ScrollReveal>
            </div>

            <ScrollReveal
              variant="fade-up"
              delay={100}
              duration={1800}
              className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md 2xl:max-w-lg overflow-hidden rounded-lg shadow-xl z-10 mx-auto lg:ml-16 xl:ml-27"
            >
              <Image
                src="/home/mother-and-daughter.webp"
                alt="Mother and daughter overlooking a misty valley"
                fill
                sizes="(min-width: 1536px) 512px, (min-width: 1280px) 448px, (min-width: 1024px) 384px, 90vw"
                className="object-cover"
              />
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={300}
              duration={1600}
              className="absolute bottom-0 left-0 w-28 sm:w-40 md:w-56 xl:w-82 h-20 sm:h-30 md:h-42 xl:h-61"
            >
              <Parallax speed={-0.1} data-scroll className="w-full h-full">
                <Image
                  src="/home/flower.webp"
                  alt=""
                  width={500}
                  height={500}
                  className="w-full h-full rounded-lg object-cover"
                />
              </Parallax>
            </ScrollReveal>
          </div>

          <div className="relative pl-5 sm:pl-10 lg:pl-0">
            <div className="absolute top-0 md:top-1/2 -translate-y-1/2 right-10 lg:-right-10 xl:-right-16">
              <ScrollReveal
                variant="fade-left"
                delay={250}
                duration={1600}
                distance={80}
              >
                <Parallax speed={0.25} data-scroll>
                  <Image
                    src="/home/leaf.webp"
                    alt=""
                    width={200}
                    height={200}
                    className="aspect-square w-18 xl:w-26 rotate-123"
                  />
                </Parallax>
              </ScrollReveal>
            </div>

            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={0}
              duration={1800}
              className="font-catalog font-black text-[22px] sm:text-[26px] md:text-[28px] xl:text-[32px] leading-[1.2] tracking-[0.08em] text-[#88643B]"
            >
              {dict.titlePrefix}
              <br />
              <span className="text-[#88643B] pl-14 sm:pl-20 md:pl-24 xl:pl-32">
                {dict.titleAccent}
              </span>
            </ScrollReveal>
            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={200}
              duration={1600}
              className="mt-4 md:mt-6 max-w-lg font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] text-balance leading-[1.4] tracking-widest text-navy"
            >
              {dict.body}
            </ScrollReveal>
            <ScrollReveal
              variant="fade-up"
              delay={400}
              duration={1400}
              className="mt-8 md:mt-12 -ml-5 sm:-ml-10 lg:ml-0 lg:mt-18 w-fit"
            >
              <a
                href="#about"
                className="flex items-center justify-center rounded-2xl border border-[#88643B] w-28 md:w-32.5 h-9 md:h-9.5 font-saira font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-none tracking-normal text-center text-[#88643B] transition-colors duration-300 ease-in-out hover:bg-[#88643B] hover:text-white"
              >
                {dict.cta}
              </a>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid items-center lg:gap-16 sm:grid-cols-2 mb-40 sm:mb-20 lg:mb-0 mt-10 lg:-mt-60">
          <ScrollReveal
            variant="fade-right"
            delay={150}
            duration={1600}
            className="absolute opacity-50 sm:opacity-100 sm:relative -ml-10 w-full max-w-md md:max-w-lg lg:max-w-none lg:w-155 lg:h-142.5 z-20 lg:ml-15 mx-auto lg:mx-0"
          >
            <Parallax speed={-0.15} data-scroll className="w-full h-full">
              <Image
                src="/home/bird.webp"
                alt=""
                width={1000}
                height={1000}
                className="w-full h-auto"
              />
            </Parallax>
          </ScrollReveal>
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={150}
            duration={1600}
            className="text-center sm:text-start sm:-ml-10 lg:ml-0 mt-4 md:mt-6 max-w-lg xl:max-w-xl font-raleway font-normal text-[14px] sm:text-[16px] md:text-[18px] text-balance leading-[1.4] tracking-widest text-navy"
          >
            {dict.footnote}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
