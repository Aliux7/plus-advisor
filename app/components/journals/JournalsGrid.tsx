import Image from "next/image";
import Link from "next/link";
import type { JournalsGridDict, Locale } from "../../[lang]/dictionaries";
import {
  getAllPosts,
  getHeroPost,
  formatPublishedDate,
  type BlogPost,
} from "../../lib/posts";
import ScrollReveal from "../ScrollReveal";
import Parallax from "../Parallax";
import JournalsFilter from "./JournalsFilter";
import { DEFAULT_SORT, type SortKey } from "./journalSort";

const POSTS_PER_PAGE = 9;

type Props = {
  dict: JournalsGridDict;
  lang: Locale;
  page?: number;
  sort?: SortKey;
};

function sortPosts(posts: BlogPost[], sort: SortKey): BlogPost[] {
  const copy = [...posts];
  switch (sort) {
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "za":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "oldest":
      return copy.sort(
        (a, b) => new Date(a.date_published).getTime() - new Date(b.date_published).getTime(),
      );
    case "latest":
    default:
      return copy.sort(
        (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime(),
      );
  }
}

export default async function JournalsGrid({
  dict,
  lang,
  page = 1,
  sort = DEFAULT_SORT,
}: Props) {
  const [everyPost, hero] = await Promise.all([getAllPosts(), getHeroPost()]);
  const withoutHero = hero ? everyPost.filter((p) => p.id !== hero.id) : everyPost;
  const allPosts = sortPosts(withoutHero, sort);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (sort !== DEFAULT_SORT) params.set("sort", sort);
    if (n !== 1) params.set("page", String(n));
    const qs = params.toString();
    return `/${lang}/journals${qs ? `?${qs}` : ""}`;
  };

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
            <div className="mb-6 md:mb-8">
              <JournalsFilter
                lang={lang}
                currentSort={sort}
                line1={dict.filterLine1}
                line2={dict.filterLine2}
              />
            </div>

            {posts[0] && (
              <JournalCard
                post={posts[0]}
                readMoreLabel={dict.readMore}
                lang={lang}
                className="mt-0 md:mt-4 lg:mt-8 xl:mt-13"
              />
            )}
          </ScrollReveal>

          {posts.slice(1).map((post, i) => {
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
                key={post.id}
                variant="fade-up"
                delay={((i + 1) / 3) * 120}
                duration={1600}
                className={`flex flex-col ${offsetClass}`}
              >
                <JournalCard
                  post={post}
                  readMoreLabel={dict.readMore}
                  lang={lang}
                />
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
          <PagerArrow
            label="First page"
            href={pageHref(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </PagerArrow>
          <PagerArrow
            label="Previous page"
            href={pageHref(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </PagerArrow>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const isActive = n === currentPage;
            return (
              <Link
                key={n}
                href={pageHref(n)}
                aria-label={`Page ${n}`}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={`cursor-pointer font-catalog text-[17px] sm:text-[17px] md:text-[18px] lg:text-[18px] xl:text-[19px] leading-none transition-opacity duration-300 hover:opacity-70 ${
                  isActive
                    ? "size-10 sm:size-10 md:size-11 lg:size-11 xl:size-12 rounded-full bg-gold text-white flex items-center justify-center"
                    : "text-gold"
                }`}
              >
                {n}
              </Link>
            );
          })}

          <PagerArrow
            label="Next page"
            href={pageHref(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </PagerArrow>
          <PagerArrow
            label="Last page"
            href={pageHref(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </PagerArrow>
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

function PagerArrow({
  label,
  href,
  disabled,
  children,
}: {
  label: string;
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className =
    "text-gold text-[24px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none transition-opacity duration-300";
  if (disabled) {
    return (
      <span
        aria-label={label}
        aria-disabled
        className={`${className} opacity-30 cursor-not-allowed`}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      aria-label={label}
      href={href}
      scroll={false}
      className={`${className} cursor-pointer hover:opacity-70`}
    >
      {children}
    </Link>
  );
}

function JournalCard({
  post,
  readMoreLabel,
  lang,
  className = "",
}: {
  post: BlogPost;
  readMoreLabel: string;
  lang: Locale;
  className?: string;
}) {
  return (
    <article className={`flex flex-col ${className}`}>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          src={post.featured_image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <p className="mt-4 md:mt-5 font-catalog font-normal text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-[19px] leading-normal tracking-widest text-navy">
        {formatPublishedDate(post.date_published, lang)}
      </p>

      <h3 className="mt-2 md:mt-3 max-w-sm font-catalog font-bold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] leading-normal tracking-widest text-navy">
        {post.title}
      </h3>

      <Link
        href={`/${lang}/journals/${post.id}`}
        className="mt-4 md:mt-5 inline-flex justify-center items-center rounded-[15px] border border-navy h-9.5 w-32.5 font-saira font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-none tracking-normal text-center text-navy transition-colors duration-300 ease-in-out hover:bg-navy hover:text-white"
      >
        {readMoreLabel}
      </Link>
    </article>
  );
}
