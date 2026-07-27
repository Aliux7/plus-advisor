import Image from "next/image";
import Link from "next/link";
import type { FeaturedJournalsDict, Locale } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

const JOURNAL_IMAGES = [
  "/home/journals/journal-01.webp",
  "/home/journals/journal-02.webp",
  "/home/journals/journal-03.webp",
  "/home/journals/journal-04.webp",
];

type Props = { dict: FeaturedJournalsDict; lang: Locale };

export default function FeaturedJournals({ dict, lang }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden bg-white mt-20 sm:mt-0 pt-20 sm:pt-28 md:pt-36 lg:pt-44 xl:pt-50"
    >
      <ScrollReveal
        variant="fade-left"
        delay={100}
        duration={1600}
        className="pointer-events-none  absolute -right-10 lg:-right-20 top-0 h-60 md:h-72 lg:h-96 xl:h-111 w-80 md:w-md lg:w-xl xl:w-167 z-0"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="opacity-30 sm:opacity-100 relative w-full h-full"
        >
          <Image
            src="/home/journals-mountains.webp"
            alt=""
            fill
            className="object-contain"
          />
        </Parallax>
      </ScrollReveal>

      <div className="mx-auto grid grid-cols-1 gap-10 md:gap-12 lg:gap-16 px-5 sm:px-10 lg:grid-cols-[minmax(0,300px)_1fr] xl:grid-cols-[minmax(0,370px)_1fr] xl:px-20">
        <div className="relative">
          <ScrollReveal
            as="h2"
            variant="fade-up"
            delay={0}
            duration={1800}
            className="font-catalog font-black text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.2] tracking-widest text-gold"
          >
            {dict.titlePrefix}
            <br />
            <span className="text-gold pl-14 sm:pl-20 md:pl-24 lg:pl-28 xl:pl-30">
              {dict.titleAccent}
            </span>
          </ScrollReveal>
          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={200}
            duration={1600}
            className="mt-4 md:mt-6 max-w-xs font-raleway font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-normal tracking-widest text-navy"
          >
            {dict.body}
          </ScrollReveal>
          <ScrollReveal
            variant="fade-up"
            delay={400}
            duration={1400}
            className="mb-10 sm:mb-0 mt-6 md:mt-8 lg:mt-9.5 w-fit relative z-20"
          >
            <Link
              href={`/${lang}/journals`}
              className="inline-flex justify-center items-center rounded-[15px] border border-gold h-9.5 w-28 md:w-32.5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal text-center text-gold transition-colors duration-300 ease-in-out bg-transparent hover:bg-gold hover:text-white"
            >
              {dict.cta}
            </Link>
          </ScrollReveal>

          <div className="absolute opacity-50 lg:opacity-100 lg:relative pointer-events-none z-0">
            <ScrollReveal
              variant="fade-in"
              delay={200}
              duration={1800}
              className="relative -mt-4 sm:-mt-6 md:-mt-8 -left-40 sm:-left-64 md:-left-96 lg:-left-160 h-40 sm:h-64 md:h-96 lg:h-160 w-64 sm:w-96 md:w-xl lg:w-255 pointer-events-none"
            >
              <Parallax
                speed={0.08}
                data-scroll
                className="relative w-full h-full"
              >
                <Image
                  src="/home/journals-ellipse.webp"
                  alt=""
                  fill
                  className="rounded-full object-cover opacity-60"
                />
              </Parallax>
            </ScrollReveal>
            <ScrollReveal
              variant="fade-up"
              delay={400}
              duration={1600}
              className="absolute -bottom-20 sm:-bottom-32 md:-bottom-40 lg:-bottom-50 left-0 lg:right-14 w-28 sm:w-40 md:w-56 lg:w-auto"
            >
              <Parallax speed={-0.08} data-scroll className="relative">
                <Image
                  src="/home/journals-flower.webp"
                  alt=""
                  width={515}
                  height={593}
                  className="w-full h-auto"
                />
              </Parallax>
            </ScrollReveal>
          </div>
        </div>

        <div className="-mt-10 lg:mt-0 grid grid-cols-1 gap-x-6 md:gap-x-10 gap-y-8 md:gap-y-14 sm:grid-cols-2">
          {dict.items.map((journal, index) => (
            <ScrollReveal
              key={index}
              as="article"
              variant="fade-up"
              delay={index * 150}
              duration={1600}
              className={index % 2 === 0 ? "sm:mt-20 md:mt-28 lg:mt-33" : ""}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl md:rounded-2xl">
                <Image
                  src={JOURNAL_IMAGES[index] ?? JOURNAL_IMAGES[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 md:mt-4 font-catalog font-normal text-[14px] sm:text-[16px] md:text-[17px] lg:text-[19px] leading-normal tracking-widest text-navy">
                {journal.date}
              </p>
              <h3 className="mt-2 max-w-xs font-catalog font-black text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] leading-normal tracking-widest text-navy">
                {journal.title}
              </h3>
              <Link
                href={`/${lang}/news/${index + 1}`}
                className="mt-3 md:mt-4 inline-flex items-center justify-center rounded-[15px] border border-navy h-9.5 w-28 md:w-32.5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal text-center text-navy transition-colors duration-300 ease-in-out hover:bg-navy hover:text-white"
              >
                {dict.readMore}
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="relative overflow-hidden w-full h-40 md:h-64 lg:h-80 xl:h-100 -mt-6 md:-mt-8 lg:-mt-10 pointer-events-none"
      >
        <Parallax speed={0.05} data-scroll className="relative w-full h-full -bottom-8">
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
