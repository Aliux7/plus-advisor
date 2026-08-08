import { notFound } from "next/navigation";
import NewsDetail from "../../../components/news/NewsDetail";
import ViewIncrementer from "../../../components/news/ViewIncrementer";
import { getPostById } from "../../../lib/posts";
import { getDictionary, hasLocale } from "../../dictionaries";

export default async function JournalArticle({
  params,
}: PageProps<"/[lang]/journals/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const post = await getPostById(id);
  if (!post) notFound();

  const { news } = await getDictionary(lang);
  return (
    <>
      <ViewIncrementer id={post.id} />
      <NewsDetail dict={news} lang={lang} post={post} />
    </>
  );
}
