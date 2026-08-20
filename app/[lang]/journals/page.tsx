import { notFound } from "next/navigation";
import Hero from "../../components/journals/Hero";
import LatestFeatured from "../../components/journals/LatestFeatured";
import JournalsGrid from "../../components/journals/JournalsGrid";
import { DEFAULT_SORT, isSortKey } from "../../components/journals/journalSort";
import WhistleBlower from "../../components/WhistleBlower";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function Journals({
  params,
  searchParams,
}: PageProps<"/[lang]/journals">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { journals, whistleBlower } = await getDictionary(lang);

  const { page, sort } = await searchParams;
  const rawPage = Array.isArray(page) ? page[0] : page;
  const pageNumber = Number.parseInt(rawPage ?? "1", 10);
  const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const rawSort = Array.isArray(sort) ? sort[0] : sort;
  const currentSort = isSortKey(rawSort) ? rawSort : DEFAULT_SORT;

  return (
    <>
      <Hero dict={journals.hero} />
      <LatestFeatured dict={journals.latestFeatured} lang={lang} />
      <JournalsGrid
        dict={journals.grid}
        lang={lang}
        page={currentPage}
        sort={currentSort}
      />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
