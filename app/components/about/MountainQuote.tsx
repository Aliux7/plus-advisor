import Image from "next/image";
import type { MountainQuoteDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

type Props = { dict: MountainQuoteDict };

export default function MountainQuote({ dict }: Props) {
  return (
    <section data-scroll-section className="relative bg-white">
      <div className="relative w-full aspect-video overflow-hidden">
        <Parallax speed={-0.05} data-scroll className="absolute inset-0">
          <Image
            src="/about/MistyMountains.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </Parallax>

        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1800}
          className="absolute bottom-0 left-0 w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 bg-[#4a3d2a]/55 backdrop-blur-[2px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 md:py-10 lg:py-12 xl:py-16"
        >
          <blockquote className="font-gotham font-normal text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[36px] leading-[1.69] tracking-widest text-white">
            {dict.text}
            <span className="ml-1 inline-block translate-y-1.5 sm:translate-y-2 md:translate-y-3 lg:translate-y-4 xl:translate-y-5 font-raleway font-normal text-gold text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[48px] leading-none select-none">
              ”
            </span>
          </blockquote>
          <p className="mt-4 md:mt-6 lg:mt-8 xl:mt-10 text-right font-catalog font-bold text-[13px] sm:text-[15px] md:text-[17px] lg:text-[21px] xl:text-[25px] leading-normal tracking-[0.2em] text-white">
            - {dict.author}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
