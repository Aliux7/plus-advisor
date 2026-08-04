import "server-only";
import raw from "../data/blog-posts.json";
import type { Locale } from "../[lang]/dictionaries";

export type BlogPost = {
  id: number;
  url: string;
  slug: string;
  title: string;
  date_published: string;
  date_modified: string;
  author: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  featured_image: string;
  word_count: number;
  content_html: string;
  content_text: string;
};

type RawFeed = { posts: BlogPost[] };

const posts = (raw as RawFeed).posts;

const byIdIndex = new Map<string, BlogPost>();
for (const post of posts) {
  byIdIndex.set(String(post.id), post);
  byIdIndex.set(post.slug, post);
}

export function getAllPosts(): BlogPost[] {
  return posts;
}

export type SearchablePost = Pick<BlogPost, "id" | "slug" | "title" | "featured_image">;

export function getSearchIndex(): SearchablePost[] {
  return posts.map(({ id, slug, title, featured_image }) => ({
    id,
    slug,
    title,
    featured_image,
  }));
}

export function getPostById(id: string): BlogPost | undefined {
  return byIdIndex.get(id);
}

const AUTHOR_LABELS: Record<string, string> = {
  plusadvisor: "Plus Advisor",
  admin: "Plus Advisor",
};

export function authorLabel(author: string): string {
  return AUTHOR_LABELS[author] ?? author;
}

const DATE_LOCALES: Record<Locale, string> = { en: "en-GB", id: "id-ID", zh: "zh-CN" };

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
  return Math.max(1, Math.round(post.word_count / WORDS_PER_MINUTE));
}

const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/i;

export function firstContentImage(post: BlogPost): string {
  const match = post.content_html.match(IMG_SRC_RE);
  return match?.[1] ?? post.featured_image;
}
