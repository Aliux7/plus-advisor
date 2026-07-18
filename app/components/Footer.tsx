import Image from "next/image";
import type { Dictionary } from "../[lang]/dictionaries";
import ScrollReveal from "./ScrollReveal";

const SOCIAL_ICONS = [
  { label: "Instagram", src: "/social/instagram.svg" },
  { label: "LinkedIn", src: "/social/linkedin.svg" },
  { label: "YouTube", src: "/social/youtube.svg" },
];

type Props = { dict: Dictionary["footer"] };

export default function Footer({ dict }: Props) {
  return (
    <footer
      data-scroll-section
      className="relative overflow-hidden bg-navy text-white"
    >
      <div className="relative z-10 px-5 sm:px-10 xl:px-20 py-12 md:py-16 lg:py-20 gap-10 md:gap-16 xl:gap-30 flex flex-col lg:flex-row justify-start items-start">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full lg:w-auto">
          <ScrollReveal
            variant="fade-right"
            delay={0}
            duration={1400}
            className="flex flex-col items-start"
          >
            <Image
              src="/white-logo.svg"
              alt=""
              width={73}
              height={80}
              className="w-14 md:w-16 lg:w-18.25 h-auto"
            />
          </ScrollReveal>

          <div>
            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={150}
              duration={1600}
              className="max-w-2xl font-catalog font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-normal tracking-widest text-white"
            >
              {dict.description}
            </ScrollReveal>

            <ScrollReveal
              as="h4"
              variant="fade-up"
              delay={300}
              duration={1400}
              className="mt-6 md:mt-8 lg:mt-10 inline-block font-catalog font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.89] tracking-widest text-white underline"
            >
              {dict.whistleTitle}
            </ScrollReveal>
            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={400}
              duration={1600}
              className="max-w-sm font-catalog font-black text-[10px] leading-[1.89] tracking-widest text-white"
            >
              {dict.whistleBody}
            </ScrollReveal>

            <ScrollReveal
              variant="zoom-in"
              delay={600}
              duration={1600}
              className="mt-6 md:mt-8 lg:mt-9 w-fit"
            >
              <Image
                src="/badge-25-years.svg"
                alt=""
                width={260}
                height={60}
                className="w-40 md:w-48 lg:w-65 h-auto"
              />
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 lg:gap-0 w-full lg:w-auto lg:ml-auto">
          <div className="flex flex-col lg:max-w-51">
            <ScrollReveal
              as="h4"
              variant="fade-up"
              delay={100}
              duration={1400}
              className="font-catalog font-black text-[12px] md:text-[14px] leading-normal tracking-widest text-white"
            >
              {dict.companyHeading}
            </ScrollReveal>
            <ul className="mt-4 md:mt-7 flex flex-col gap-2 md:gap-3">
              {dict.companyLinks.map((label, i) => (
                <ScrollReveal
                  key={label}
                  as="li"
                  variant="fade-up"
                  delay={200 + i * 60}
                  duration={1200}
                >
                  <a
                    href="#"
                    className="font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white underline decoration-1 underline-offset-1 hover:text-white/70 transition-colors duration-300 ease-in-out"
                  >
                    {label}
                  </a>
                </ScrollReveal>
              ))}
            </ul>
          </div>

          <div className="flex flex-col lg:max-w-56.25">
            <ScrollReveal
              as="h4"
              variant="fade-up"
              delay={150}
              duration={1400}
              className="font-catalog font-black text-[12px] md:text-[14px] leading-normal tracking-widest text-white"
            >
              {dict.contactHeading}
            </ScrollReveal>
            <div className="mt-4 md:mt-7 flex flex-col gap-3 md:gap-4">
              <ScrollReveal
                as="p"
                variant="fade-up"
                delay={250}
                duration={1200}
                className="font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white"
              >
                +62 21 5087 2450
              </ScrollReveal>
              <ScrollReveal
                as="p"
                variant="fade-up"
                delay={310}
                duration={1200}
                className="font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white"
              >
                +62 811-1253-1101
              </ScrollReveal>
            </div>

            <ScrollReveal
              as="h4"
              variant="fade-up"
              delay={450}
              duration={1400}
              className="mt-8 md:mt-11.5 font-catalog font-black text-[12px] md:text-[14px] leading-normal tracking-widest text-white"
            >
              {dict.socialHeading}
            </ScrollReveal>
            <div className="mt-2.5 flex items-center gap-5 md:gap-6.5">
              {SOCIAL_ICONS.map(({ label, src }, i) => (
                <ScrollReveal
                  key={label}
                  variant="zoom-in"
                  delay={550 + i * 80}
                  duration={1200}
                >
                  <a
                    href="#"
                    aria-label={label}
                    className="flex size-7.5 items-center justify-center transition-opacity duration-300 ease-in-out hover:opacity-80"
                  >
                    <Image
                      src={src}
                      alt=""
                      width={30}
                      height={30}
                      className="h-full w-full"
                    />
                  </a>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal
              variant="fade-right"
              delay={800}
              duration={1400}
              className="w-fit"
            >
              <Image
                src="/flags.svg"
                alt=""
                width={143}
                height={19}
                className="mt-4 md:mt-5.5 w-36 h-auto"
              />
            </ScrollReveal>

            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={900}
              duration={1200}
              className="mt-4 md:mt-6 font-raleway font-normal text-[10px] leading-[1.49] tracking-[0.03em] text-white"
            >
              &copy;2026 Plus Advisor. All Right Reserved
            </ScrollReveal>
          </div>
        </div>
      </div>
    </footer>
  );
}
