import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

type Props = { eyebrow: string; title: string; image: string };

export default function Hero({ eyebrow, title, image }: Props) {
  return (
    <section data-scroll-section className="relative pt-0">
      <div className="relative h-screen w-full">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="absolute flex flex-col items-start justify-end top-0 h-screen z-10 w-full px-5 sm:px-10 xl:px-20 pb-8 md:pb-10 xl:pb-14">
        <ScrollReveal
          as="p"
          variant="fade-up"
          delay={300}
          duration={1600}
          className="mb-2 md:mb-3.5 font-raleway text-[14px] sm:text-[16px] md:text-[18px] xl:text-[24px] font-light leading-normal tracking-widest text-white capitalize"
        >
          {eyebrow}
        </ScrollReveal>

        <ScrollReveal
          as="h1"
          variant="fade-up"
          delay={700}
          duration={1800}
          className="max-w-5xl font-catalog text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold leading-normal tracking-widest text-white"
        >
          {title}
        </ScrollReveal>
      </div>
    </section>
  );
}
