import type { NewsHeroDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";

type Props = { dict: NewsHeroDict };

export default function Hero({ dict }: Props) {
  return (
    <section data-scroll-section className="relative pt-0">
      <video
        src="/office/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Jakarta city skyline"
        className="block h-screen w-full object-cover"
      />

      <div className="absolute flex flex-col items-start justify-end top-0 h-screen z-10 w-full px-5 sm:px-10 xl:px-20 pb-8 md:pb-10 xl:pb-14">
        <ScrollReveal
          as="p"
          variant="fade-up"
          delay={300}
          duration={1600}
          className="mb-2 md:mb-3.5 font-raleway text-[14px] sm:text-[16px] md:text-[18px] xl:text-[24px] font-light leading-normal tracking-widest text-white"
        >
          {dict.eyebrow}
        </ScrollReveal>

        <ScrollReveal
          as="h1"
          variant="fade-up"
          delay={700}
          duration={1800}
          className="lg:text-nowrap font-catalog text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-black leading-normal tracking-widest text-white"
        >
          {dict.titleLine1}
          <br />
          <span className="pr-10 sm:pr-20 lg:pr-0 pl-0 lg:pl-[20%] xl:pl-[37%]">
            {dict.titleLine2}
          </span>
        </ScrollReveal>  
      </div>
    </section>
  );
}
