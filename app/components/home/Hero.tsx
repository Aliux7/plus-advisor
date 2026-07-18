import Image from "next/image";
import type { Dictionary } from "../../[lang]/dictionaries";

type Props = { dict: Dictionary["hero"] };

export default function Hero({ dict }: Props) {
  return (
    <section data-scroll-section className="relative pt-0">
      <video
        src="/home/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Jakarta city skyline"
        className="block h-screen w-full object-cover"
      />

      <div className="absolute flex flex-col items-start justify-end top-0 h-screen z-10 w-full px-5 sm:px-10 xl:px-20 pb-8 md:pb-10 xl:pb-14">
        <p className="mb-2 md:mb-3.5 font-raleway text-[14px] sm:text-[16px] md:text-[18px] xl:text-[24px] font-light leading-normal tracking-widest text-white">
          {dict.eyebrow}
        </p>
        <h1 className="lg:text-nowrap font-catalog text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-normal leading-normal tracking-widest text-white">
          {dict.titleLine1}
          <br />
          <span className="italic pr-10 sm:pr-20 lg:pr-0 pl-0 lg:pl-[20%] xl:pl-[37%]">
            {dict.titleLine2}
          </span>
        </h1>
        <Image
          src="/home/mouse-scroll.svg"
          alt=""
          width={35}
          height={35}
          className="w-4 md:w-5 xl:w-5.5 h-auto mt-4 md:mt-6"
        />
        <div className="absolute right-5 sm:right-10 xl:right-20 bottom-6 sm:bottom-8 md:bottom-10 xl:bottom-16 flex flex-col justify-center items-center size-18 sm:size-20 md:size-22 xl:size-25 backdrop-blur-md bg-white/75 rounded-full font-catalog font-black">
          <Image
            src="/home/whistle-icon.webp"
            alt=""
            width={110}
            height={110}
            className="w-10 sm:w-12 md:w-13 xl:w-15 h-auto -mt-1 xl:-mt-2 -mb-2 xl:-mb-3"
          />
          <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
            WHISTLE
          </p>
          <p className="text-center text-[8px] md:text-[9px] xl:text-[10px] leading-[1.4] tracking-[0.25em] text-[#88643B]">
            BLOWING
          </p>
        </div>
      </div>
    </section>
  );
}
