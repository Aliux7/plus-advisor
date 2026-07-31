import Image from "next/image";
import type { FooterDict, Locale } from "../[lang]/dictionaries";
import ScrollReveal from "./ScrollReveal";

const SOCIAL_ICONS = [
  {
    label: "Instagram",
    src: "/social/instagram.svg",
    link: "https://www.instagram.com/plusadvisor/",
  },
  {
    label: "LinkedIn",
    src: "/social/linkedin.svg",
    link: "https://www.linkedin.com/company/plusadvisor/",
  },
  {
    label: "YouTube",
    src: "/social/youtube.svg",
    link: "https://www.youtube.com/@plusadvisor",
  },
];

const COMPANY_LINK_PATHS = [
  "/about",
  "/stories",
  "/office",
  "/journals",
  "/market",
];

type Props = { dict: FooterDict; lang: Locale };

export default function Footer({ dict, lang }: Props) {
  return (
    <footer
      data-scroll-section
      className="relative overflow-hidden bg-navy text-white"
    >
      <div className="relative z-10 px-5 sm:px-10 xl:px-20 pt-12 md:pt-16 lg:pt-20 gap-10 md:gap-16 xl:gap-30 flex flex-col lg:flex-row justify-start items-start">
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
              className="mt-4 md:mt-6 lg:mt-8 inline-block font-catalog font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[1.89] tracking-widest text-white underline"
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

        <div className="flex gap-8 sm:gap-10 lg:gap-0 w-full lg:w-auto lg:ml-auto">
          <div className="flex flex-col w-full lg:w-51">
            <ScrollReveal
              as="h4"
              variant="fade-up"
              delay={100}
              duration={1400}
              className="font-catalog font-black text-[12px] md:text-[14px] leading-normal tracking-widest text-white"
            >
              {dict.companyHeading}
            </ScrollReveal>
            <ul className="mt-4 md:mt-7 flex flex-col gap-2">
              {dict.companyLinks.map((label, i) => {
                const path = COMPANY_LINK_PATHS[i];
                if (!path) return null;
                return (
                  <ScrollReveal
                    key={label}
                    as="li"
                    variant="fade-up"
                    delay={200 + i * 60}
                    duration={1200}
                  >
                    <a
                      href={`/${lang}${path}`}
                      className="font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white underline decoration-1 underline-offset-1 hover:text-white/70 transition-colors duration-300 ease-in-out"
                    >
                      {label}
                    </a>
                  </ScrollReveal>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col w-full lg:w-auto lg:max-w-56.25">
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
                className="text-nowrap font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white"
              >
                +62 21 5087 2450
              </ScrollReveal>
              <ScrollReveal
                as="a"
                href="https://wa.me/6281112531101"
                target="_blank"
                rel="noopener noreferrer"
                variant="fade-up"
                delay={310}
                duration={1200}
                className="text-nowrap font-catalog font-normal text-[14px] md:text-[16px] leading-none tracking-widest text-white hover:text-white/70 transition-colors duration-300 ease-in-out"
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
            <div className="mt-3.5 flex items-center gap-5 md:gap-6.5">
              {SOCIAL_ICONS.map(({ label, src, link }, i) => (
                <ScrollReveal
                  key={label}
                  variant="zoom-in"
                  delay={550 + i * 80}
                  duration={1200}
                >
                  <a
                    href={link}
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
                className="mt-5 md:mt-6.5 w-36 h-auto"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="mt-10 xl:mt-5 md:ml-auto flex flex-col md:flex-row justify-start md:justify-end md:items-end px-5 sm:px-10 xl:px-20 pb-12 md:pb-16 lg:pb-20 gap-5 md:gap-10">
        <ScrollReveal
          as="p"
          variant="fade-right"
          delay={900}
          duration={3000}
          rootMargin="0px"
          className="font-raleway font-normal text-[11px] leading-[1.49] tracking-[0.03em] text-white max-w-xl"
        >
          {dict.disclaimer}
        </ScrollReveal>
        <ScrollReveal
          as="p"
          variant="fade-right"
          delay={300}
          duration={3000}
          rootMargin="0px"
          className="font-raleway font-normal text-[11px] leading-[1.49] tracking-[0.03em] text-white text-nowrap"
        >
          &copy;2026 Plus Advisor. All Right Reserved
        </ScrollReveal>
      </div>
    </footer>
  );
}
