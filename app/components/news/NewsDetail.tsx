import Image from "next/image";
import Link from "next/link";
import type { NewsDetailDict, Locale } from "../../[lang]/dictionaries";
import {
  authorLabel,
  formatPublishedDate,
  getAllPosts,
  type BlogPost,
} from "../../lib/posts";
import Hero from "./Hero";
import { Mail, Share, User } from "lucide-react";

type Props = { dict: NewsDetailDict; lang: Locale; post: BlogPost };

const LOCAL_LABELS: Record<
  Locale,
  { latest: string; eyebrow: string; by: string; emailLabel: string }
> = {
  en: {
    latest: "Latest Journals",
    eyebrow: "Journals",
    by: "by",
    emailLabel: "Email",
  },
  id: {
    latest: "Jurnal Terbaru",
    eyebrow: "Jurnal",
    by: "oleh",
    emailLabel: "Email",
  },
};

const SIDEBAR_LIMIT = 5;

const TABLE_OPEN_RE = /<table\b/gi;
const TABLE_CLOSE_RE = /<\/table>/gi;

function wrapTables(html: string): string {
  return html
    .replace(TABLE_OPEN_RE, '<div class="table-scroll"><table')
    .replace(TABLE_CLOSE_RE, "</table></div>");
}

export default function NewsDetail({ dict, lang, post }: Props) {
  const labels = LOCAL_LABELS[lang];
  const recent = getAllPosts()
    .filter((p) => p.id !== post.id)
    .slice(0, SIDEBAR_LIMIT);

  return (
    <>
      <Hero
        eyebrow={labels.eyebrow}
        title={post.title}
        image={post.featured_image}
      />

      <section className="bg-[#F5F5F5]">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16">
          <article className="order-2 lg:order-1 flex-1 min-w-0 px-5 sm:px-10 xl:px-20 py-10 sm:py-14 lg:py-20">
            <div
              className="article-content font-raleway text-navy"
              dangerouslySetInnerHTML={{ __html: wrapTables(post.content_html) }}
            />
          </article>

          <aside className="order-1 lg:order-2 bg-white lg:shadow-[0px_4px_4px_0px_#00000040] w-full lg:w-96 xl:w-110 2xl:w-120 shrink-0">
            <div className="lg:sticky lg:top-10 px-5 sm:px-10 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-16 xl:py-20">
              <h2 className="font-catalog font-black text-navy text-[20px] md:text-[24px] xl:text-[28px] leading-[1.35] tracking-widest">
                {post.title}
              </h2>
              <div className="mt-4 flex justify-end items-center gap-5 text-gold">
                <button
                  type="button"
                  aria-label={dict.sidebar.shareLabel}
                  className="cursor-pointer transition-opacity duration-300 hover:opacity-70"
                >
                  <Share className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={labels.emailLabel}
                  className="cursor-pointer transition-opacity duration-300 hover:opacity-70"
                >
                  <Mail className="size-5" aria-hidden />
                </button>
              </div>
              <p className="mt-8 font-catalog font-normal italic text-gold text-[14px] md:text-[16px] leading-snug tracking-widest">
                {formatPublishedDate(post.date_published, lang)}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <User
                  aria-hidden
                  className="size-7 md:size-8 xl:size-9 shrink-0 text-gold"
                  strokeWidth={1.5}
                />
                <span className="font-catalog font-normal text-gold text-[14px] md:text-[16px] leading-snug tracking-widest">
                  {labels.by} {authorLabel(post.author)}
                </span>
              </div>

              {/* <h3 className="mt-10 font-catalog font-black text-[18px] md:text-[20px] tracking-widest text-navy uppercase">
                {labels.latest}
              </h3>
              <div className="mt-6 flex flex-col gap-6">
                {recent.map((r) => (
                  <Link
                    key={r.id}
                    href={`/${lang}/journals/${r.id}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={r.featured_image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-raleway text-[11px] md:text-[12px] tracking-widest text-navy/60">
                        {formatPublishedDate(r.date_published, lang)}
                      </p>
                      <h4 className="mt-1 font-catalog font-black text-[14px] md:text-[15px] leading-snug text-navy line-clamp-3 group-hover:text-gold transition-colors">
                        {r.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div> */}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
