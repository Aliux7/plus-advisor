import { notFound } from "next/navigation";
import NewsDetail from "../../../components/news/NewsDetail";
import { getDictionary, hasLocale } from "../../dictionaries";

export default async function NewsArticle({
  params,
}: PageProps<"/[lang]/news/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const { news } = await getDictionary(lang);

  return <NewsDetail dict={news} lang={lang} id={id} />;
}
