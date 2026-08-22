import "server-only";
import { cache } from "react";
import type { Locale } from "../[lang]/dictionaries";
import {
  getPublishedJournalById,
  getPublishedJournals,
  type FirestoreJournal,
  type FirestoreJournalLocale,
} from "./journals-server";

export type BlogPost = {
  id: string;
  url: string;
  slug: string;
  title: string;
  date_published: string;
  date_modified: string;
  author: string;
  excerpt: string;
  featured_image: string;
  word_count: number;
  content_html: string;
  content_text: string;
  featured: boolean;
  reading_minutes: number;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function pickLocale(
  journal: FirestoreJournal,
  lang: Locale,
): FirestoreJournalLocale {
  const en: FirestoreJournalLocale = {
    title: journal.title,
    content: journal.content,
    seo: journal.seo,
  };
  if (lang === "en") return en;
  const translation = journal.translations[lang];
  // Fall back to EN when the locale has no title AND no content.
  if (!translation) return en;
  const hasTitle = translation.title.trim();
  const hasContent = translation.content.trim();
  if (!hasTitle && !hasContent) return en;
  return {
    title: hasTitle ? translation.title : journal.title,
    content: hasContent ? translation.content : journal.content,
    seo: {
      title: translation.seo.title || journal.seo.title,
      description: translation.seo.description || journal.seo.description,
      keywords:
        translation.seo.keywords.length > 0
          ? translation.seo.keywords
          : journal.seo.keywords,
    },
  };
}

function toBlogPost(journal: FirestoreJournal, lang: Locale): BlogPost {
  const localized = pickLocale(journal, lang);
  const text = stripHtml(localized.content);
  const words = text ? text.split(" ").length : 0;
  const excerpt = localized.seo.description || text.slice(0, 200);
  const readingMinutes =
    journal.readingTimeMinutes ?? Math.max(1, Math.round(words / 200));
  const nowIso = new Date().toISOString();
  const dateIso = journal.publishedAt ?? journal.updatedAt ?? nowIso;
  return {
    id: journal.id,
    url: `/journals/${journal.slug || journal.id}`,
    slug: journal.slug || journal.id,
    title: localized.title,
    date_published: dateIso,
    date_modified: journal.updatedAt ?? journal.publishedAt ?? nowIso,
    author: journal.author,
    excerpt,
    featured_image: journal.coverImage,
    word_count: words,
    content_html: localized.content,
    content_text: text,
    featured: journal.featured,
    reading_minutes: readingMinutes,
  };
}

export const getAllPosts = cache(async (lang: Locale): Promise<BlogPost[]> => {
  const journals = await getPublishedJournals();
  return journals.map((j) => toBlogPost(j, lang));
});

// Hero post = latest featured post; if none are featured, the latest post overall.
// getAllPosts is already sorted publishedAt desc, so .find() returns the latest featured.
export const getHeroPost = cache(
  async (lang: Locale): Promise<BlogPost | undefined> => {
    const posts = await getAllPosts(lang);
    return posts.find((p) => p.featured) ?? posts[0];
  },
);

export type SearchablePost = Pick<
  BlogPost,
  "id" | "slug" | "title" | "featured_image"
>;

export const getSearchIndex = cache(
  async (lang: Locale): Promise<SearchablePost[]> => {
    const posts = await getAllPosts(lang);
    return posts.map(({ id, slug, title, featured_image }) => ({
      id,
      slug,
      title,
      featured_image,
    }));
  },
);

export async function getPostById(
  id: string,
  lang: Locale,
): Promise<BlogPost | undefined> {
  const journal = await getPublishedJournalById(id);
  return journal ? toBlogPost(journal, lang) : undefined;
}

const AUTHOR_LABELS: Record<string, string> = {
  plusadvisor: "Plus Advisor",
  admin: "Plus Advisor",
};

export function authorLabel(author: string): string {
  return AUTHOR_LABELS[author] ?? author;
}

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  id: "id-ID",
  zh: "zh-CN",
};

export function formatPublishedDate(iso: string, lang: Locale): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat(DATE_LOCALES[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

const WORDS_PER_MINUTE = 200;

export function readTime(post: BlogPost): number {
  return post.reading_minutes || Math.max(1, Math.round(post.word_count / WORDS_PER_MINUTE));
}

const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/i;

export function firstContentImage(post: BlogPost): string {
  const match = post.content_html.match(IMG_SRC_RE);
  return match?.[1] ?? post.featured_image;
}
