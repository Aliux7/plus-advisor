import Image from "next/image";
import Link from "next/link";
import type { LatestFeaturedDict, Locale } from "../../[lang]/dictionaries";
import { formatPublishedDate, getHeroPost } from "../../lib/posts";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";

type Props = { dict: LatestFeaturedDict; lang: Locale };

export default async function LatestFeatured({ dict, lang }: Props) {
  const latest = await getHeroPost();
  if (!latest) return null;

  return (
    <section
      data-scroll-section
      className="relative bg-navy py-8 md:py-9 lg:py-10 xl:py-11 pb-16 sm:pb-20 md:pb-22 lg:pb-24 xl:pb-26"
    >
      <div className="px-5 sm:px-10 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 xl:gap-24 items-start">
          <div className="flex flex-col w-fit">
            <ScrollReveal
              as="h2"
              variant="fade-up"
              delay={0}
              duration={1800}
              className="pr-10 font-catalog font-bold text-[20px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] leading-[1.4] tracking-[0.15em] text-white"
            >
              {dict.title}
            </ScrollReveal>
            <SlidingDivider
              className="mt-3 md:mt-4 opacity-40 -ml-20"
              barClassName="bg-white"
              delay={300}
              duration={1400}
            />
          </div>

          <ScrollReveal
            as="p"
            variant="fade-up"
            delay={150}
            duration={1800}
            className="md:mt-2 lg:mt-4 font-raleway font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-widest text-white/90"
          >
            {dict.description}
          </ScrollReveal>
        </div>

        <div className="mt-10 md:mt-14 lg:mt-16 xl:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          <ScrollReveal
            variant="fade-up"
            delay={200}
            duration={1800}
            className="relative w-full md:max-w-131.5 aspect-526/476 rounded-xl overflow-hidden"
          >
            <Image
              src={latest.featured_image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </ScrollReveal>

          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
            <ScrollReveal
              as="p"
              variant="fade-up"
              delay={300}
              duration={1600}
              className="font-catalog font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-[19px] leading-normal tracking-widest text-white"
            >
              {formatPublishedDate(latest.date_published, lang)}
            </ScrollReveal>

            <ScrollReveal
              as="h3"
              variant="fade-up"
              delay={400}
              duration={1800}
              className="font-catalog font-normal text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[34px] leading-normal tracking-widest text-white"
            >
              {latest.title}
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={600}
              duration={1600}
              className="mt-2 md:mt-3 w-fit"
            >
              <Link
                href={`/${lang}/journals/${latest.id}`}
                className="inline-flex justify-center items-center rounded-[15px] border border-white h-9.5 w-32.5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal text-center text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-navy"
              >
                {dict.readMore}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
