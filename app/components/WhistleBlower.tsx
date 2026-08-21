import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { WhistleBlowerDict } from "../[lang]/dictionaries";

type Props = {
  dict: WhistleBlowerDict;
};

export default function WhistleBlower({ dict }: Props) {
  if (!dict.visible) return null;

  const href = dict.url || "#";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <ScrollReveal
      variant="zoom-in"
      delay={1100}
      duration={1400}
      className={`cursor-pointer fixed right-5 sm:right-10 xl:right-20 bottom-6 sm:bottom-8 md:bottom-10 xl:bottom-14 size-18 sm:size-20 md:size-22 xl:size-25 z-[100]`}
    >
      <a
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="w-full h-full flex flex-col justify-center items-center backdrop-blur-md bg-white/75 hover:bg-white rounded-full font-catalog font-bold transition-colors ease-in-out duration-500"
      >
        <Image
          src="/home/whistle-icon.webp"
          alt=""
          width={110}
          height={110}
          className="w-10 sm:w-12 md:w-13 xl:w-15 h-auto -mt-1 xl:-mt-2 -mb-2 xl:-mb-3"
        />
        <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
          {dict.line1}
        </p>
        <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
          {dict.line2}
        </p>
      </a>
    </ScrollReveal>
  );
}
