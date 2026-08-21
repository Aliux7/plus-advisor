import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "../components/home/Hero";
import FamilyLegacy from "../components/home/FamilyLegacy";
import WealthPlanning from "../components/home/WealthPlanning";
import BeyondFinancialAdvice from "../components/home/BeyondFinancialAdvice";
import Quote from "../components/home/Quote";
import FeaturedJournals from "../components/home/FeaturedJournals";
import WhistleBlower from "../components/WhistleBlower";
import { getDictionary, hasLocale } from "./dictionaries";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { home } = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    path: "",
    title: home.meta.title,
    description: home.meta.description,
    keywords: home.meta.keywords,
    ogImage: home.meta.ogImage,
  });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { home, ourServicePillars, whistleBlower } = await getDictionary(lang);

  return (
    <>
      <Hero dict={home.hero} />
      <FamilyLegacy dict={home.familyLegacy} lang={lang} />
      <WealthPlanning dict={ourServicePillars} lang={lang} />
      <BeyondFinancialAdvice dict={home.beyondFinancialAdvice} lang={lang} />
      <Quote dict={home.quote} />
      <FeaturedJournals dict={home.featuredJournals} lang={lang} />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
