import Image from "next/image";
import type { JournalsGridDict } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";

const JOURNAL_IMAGES = [
  "/home/journals/journal-01.webp",
  "/home/journals/journal-02.webp",
  "/home/journals/journal-03.webp",
  "/home/journals/journal-04.webp",
  "/home/journals/journal-01.webp",
  "/home/journals/journal-02.webp",
  "/home/journals/journal-03.webp",
  "/home/journals/journal-04.webp",
  "/home/journals/journal-01.webp",
];

const TOTAL_PAGES = 7;
const CURRENT_PAGE = 1;

type Props = { dict: JournalsGridDict };

export default function JournalsGrid({ dict }: Props) {
  const journals = dict.items.map((item, i) => ({
    image: JOURNAL_IMAGES[i] ?? JOURNAL_IMAGES[0],
    date: item.date,
    title: item.title,
  }));

  return (
    <section
      data-scroll-section
      className="relative bg-white pt-16 md:pt-20 lg:pt-24 xl:pt-28"
    >
      <div className="px-5 sm:px-10 xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-10 md:gap-y-14 lg:gap-y-16">
          <ScrollReveal
            variant="fade-up"
            delay={0}
            duration={1600}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="size-14 md:size-16 lg:size-18 rounded-full bg-gold flex items-center justify-center shrink-0">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
              </div>
              <p className="font-catalog font-black text-[16px] sm:text-[17px] md:text-[19px] lg:text-[20px] xl:text-[22px] leading-[1.4] tracking-[0.15em] text-gold">
                {dict.filterLine1}
                <br />
                {dict.filterLine2}
              </p>
            </div>

            <JournalCard
              journal={journals[0]}
              readMoreLabel={dict.readMore}
              className="mt-0 md:mt-4 lg:mt-8 xl:mt-13"
            />
          </ScrollReveal>

          {journals.slice(1).map((journal, i) => {
            // Grid position of this item = i + 2 (item at slice index 0 is grid position 2)
            // 2-col grid (sm/md): col-1 items are at grid positions 3, 5, 7, 9 → i = 1, 3, 5, 7
            // 3-col grid (lg+):   col-1 items are at grid positions 4, 7      → i = 2, 5
            const isSmCol1 = i % 2 === 1;
            const isLgCol1 = (i + 1) % 3 === 0;

            const offsetClass = [
              isSmCol1 ? "sm:pt-20 md:pt-24" : "",
              // Reset the sm/md offset at lg since the grid re-flows to 3 cols
              isSmCol1 ? "lg:pt-0" : "",
              isLgCol1 ? "lg:pt-28 xl:pt-33" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <ScrollReveal
                key={i}
                variant="fade-up"
                delay={((i + 1) / 3) * 120}
                duration={1600}
                className={`flex flex-col ${offsetClass}`}
              >
                <JournalCard journal={journal} readMoreLabel={dict.readMore} />
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal
          variant="fade-up"
          delay={200}
          duration={1600}
          className="mt-14 md:mt-16 lg:mt-20 xl:mt-24 flex flex-wrap justify-center md:justify-end items-center gap-4 lg:gap-5 xl:gap-6"
        >
          <button
            type="button"
            aria-label="First page"
            className="cursor-pointer text-gold text-[24px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none transition-opacity duration-300 hover:opacity-70"
          >
            &laquo;
          </button>
          <button
            type="button"
            aria-label="Previous page"
            className="cursor-pointer text-gold text-[24px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none transition-opacity duration-300 hover:opacity-70"
          >
            &lsaquo;
          </button>

          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => {
            const isActive = page === CURRENT_PAGE;
            return (
              <button
                key={page}
                type="button"
                aria-label={`Page ${page}`}
                aria-current={isActive ? "page" : undefined}
                className={`cursor-pointer font-catalog text-[17px] sm:text-[17px] md:text-[18px] lg:text-[18px] xl:text-[19px] leading-none transition-opacity duration-300 hover:opacity-70 ${
                  isActive
                    ? "size-10 sm:size-10 md:size-11 lg:size-11 xl:size-12 rounded-full bg-gold text-white flex items-center justify-center"
                    : "text-gold"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            aria-label="Next page"
            className="cursor-pointer text-gold text-[24px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none transition-opacity duration-300 hover:opacity-70"
          >
            &rsaquo;
          </button>
          <button
            type="button"
            aria-label="Last page"
            className="cursor-pointer text-gold text-[24px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none transition-opacity duration-300 hover:opacity-70"
          >
            &raquo;
          </button>
        </ScrollReveal>
      </div>
      <ScrollReveal
        variant="fade-up"
        delay={200}
        duration={1800}
        className="relative overflow-hidden w-full h-40 md:h-64 lg:h-80 xl:h-100 -mt-30 md:-mt-38 lg:-mt-40 pointer-events-none"
      >
        <Parallax
          speed={0.05}
          data-scroll
          className="relative w-full h-full -bottom-8"
        >
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

type Journal = { image: string; date: string; title: string };

function JournalCard({
  journal,
  readMoreLabel,
  className = "",
}: {
  journal: Journal;
  readMoreLabel: string;
  className?: string;
}) {
  return (
    <article className={`flex flex-col ${className}`}>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          src={journal.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <p className="mt-4 md:mt-5 font-catalog font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-[19px] leading-normal tracking-widest text-navy">
        {journal.date}
      </p>

      <h3 className="mt-2 md:mt-3 max-w-sm font-catalog font-black text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] leading-normal tracking-widest text-navy">
        {journal.title}
      </h3>

      <a
        href="#"
        className="mt-4 md:mt-5 inline-flex justify-center items-center rounded-[15px] border border-navy h-9.5 w-32.5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal text-center text-navy transition-colors duration-300 ease-in-out hover:bg-navy hover:text-white"
      >
        {readMoreLabel}
      </a>
    </article>
  );
}
