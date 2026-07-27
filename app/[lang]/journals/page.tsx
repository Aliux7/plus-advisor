import { notFound } from "next/navigation";
import Hero from "../../components/journals/Hero";
import LatestFeatured from "../../components/journals/LatestFeatured";
import JournalsGrid from "../../components/journals/JournalsGrid";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function Journals({
  params,
}: PageProps<"/[lang]/journals">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { journals } = await getDictionary(lang);

  return (
    <>
      <Hero dict={journals.hero} />
      <LatestFeatured dict={journals.latestFeatured} />
      <JournalsGrid dict={journals.grid} />
    </>
  );
}
