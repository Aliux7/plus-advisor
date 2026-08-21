import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetail from "../../../components/news/NewsDetail";
import ViewIncrementer from "../../../components/news/ViewIncrementer";
import JsonLd from "../../../components/JsonLd";
import { authorLabel, getPostById } from "../../../lib/posts";
import { getDictionary, hasLocale } from "../../dictionaries";
import {
  buildArticleLd,
  buildBreadcrumbLd,
  buildLocaleAlternates,
  buildOpenGraph,
  buildTwitter,
} from "../../../lib/seo";

const FALLBACK_OG = "/shared/blue-mountain-sand.webp";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/journals/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const post = await getPostById(id, lang);
  if (!post) return {};

  const title = post.title;
  const description = post.excerpt;
  const image = post.featured_image || FALLBACK_OG;
  const path = `/journals/${post.slug}`;
  const authors = [authorLabel(post.author)];

  return {
    title: { absolute: title },
    description,
    authors: authors.map((name) => ({ name })),
    alternates: buildLocaleAlternates(path, lang),
    openGraph: buildOpenGraph({
      title,
      description,
      image,
      path,
      locale: lang,
      type: "article",
      publishedTime: post.date_published,
      modifiedTime: post.date_modified,
      authors,
    }),
    twitter: buildTwitter({ title, description, image }),
  };
}

export default async function JournalArticle({
  params,
}: PageProps<"/[lang]/journals/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const post = await getPostById(id, lang);
  if (!post) notFound();

  const { news, journals } = await getDictionary(lang);
  const image = post.featured_image || FALLBACK_OG;
  const url = `/${lang}/journals/${post.slug}`;
  const articleLd = buildArticleLd({
    title: post.title,
    description: post.excerpt,
    image,
    url,
    datePublished: post.date_published,
    dateModified: post.date_modified,
    author: authorLabel(post.author),
    locale: lang,
  });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: `/${lang}` },
    { name: journals.meta.title, url: `/${lang}/journals` },
    { name: post.title, url },
  ]);

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <ViewIncrementer id={post.id} />
      <NewsDetail dict={news} lang={lang} post={post} />
    </>
  );
}
