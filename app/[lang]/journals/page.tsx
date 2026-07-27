import { notFound } from "next/navigation";
import Hero from "../../components/journals/Hero";
import LatestFeatured from "../../components/journals/LatestFeatured";
import JournalsGrid from "../../components/journals/JournalsGrid";
import { hasLocale } from "../dictionaries";

export default async function Journals({
  params,
}: PageProps<"/[lang]/journals">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <Hero />
      <LatestFeatured />
      <JournalsGrid />
    </>
  );
}
