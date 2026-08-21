import Image from "next/image";
import type { StarValueDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import SlidingDivider from "../SlidingDivider";

type Props = { dict: StarValueDict };

const ICONS = [
  { name: "shell", scale: "scale-140" },
  { name: "butterfly", scale: "scale-175" },
  { name: "mawar", scale: "scale-115" },
  { name: "rocks", scale: "scale-210" },
] as const;

export default function StarValue({ dict }: Props) {
  return (
    <section
      data-scroll-section
      className="relative overflow-hidden px-5 sm:px-10 xl:px-20 pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-16 md:pb-20 lg:pb-24 xl:pb-28"
    >
      <div className="flex flex-col w-fit">
        <ScrollReveal
          as="h2"
          variant="fade-up"
          delay={0}
          duration={1800}
          className="mb-2 font-catalog font-bold text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] leading-[1.4] tracking-[0.15em] text-gold"
        >
          {dict.titlePrefix}{" "}
          <span className="">{dict.titleAccent}</span>
        </ScrollReveal>
        <SlidingDivider
          className="w-full -ml-10 sm:-ml-20 xl:-ml-40"
          barClassName="bg-gold/40"
          delay={300}
          duration={1400}
        />
        <ScrollReveal
          as="p"
          variant="fade-up"
          delay={200}
          duration={1600}
          className="mt-3 md:mt-4 font-catalog font-bold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[1.4] tracking-[0.4em] text-navy"
        >
          {dict.subtitle.split(/(\s+)/).map((token, i) => {
            const first = token.charAt(0);
            const isCapitalized = first && first !== first.toLowerCase();
            if (!isCapitalized) return <span key={i}>{token}</span>;
            return (
              <span key={i}>
                <span className="text-gold">{first}</span>
                {token.slice(1)}
              </span>
            );
          })}
        </ScrollReveal>
      </div>

      <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-5">
        {dict.items.map((item, index) => (
          <ScrollReveal
            key={index}
            variant="fade-up"
            delay={index * 150}
            duration={1600}
            className="flex flex-col"
          >
            <div className="relative w-24 md:w-28 lg:w-32 xl:w-36 aspect-square">
              <Image
                src={`/about/${ICONS[index].name}.svg`}
                alt=""
                fill
                className={`object-contain ${ICONS[index].scale}`}
              />
            </div>
            <h3 className="mt-6 md:mt-7 font-raleway font-semibold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.4] tracking-normal text-gold">
              {item.title}
            </h3>
            <div className="mt-3 h-px w-full bg-gold/40" />
            <p className="mt-4 font-raleway font-normal text-[11px] sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] leading-[1.4] tracking-[0.06em] text-navy">
              {item.body}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
