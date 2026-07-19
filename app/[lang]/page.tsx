import { notFound } from "next/navigation";
import Hero from "../components/home/Hero";
import FamilyLegacy from "../components/home/FamilyLegacy";
import WealthPlanning from "../components/home/WealthPlanning";
import BeyondFinancialAdvice from "../components/home/BeyondFinancialAdvice";
import Quote from "../components/home/Quote";
import FeaturedJournals from "../components/home/FeaturedJournals";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { home } = await getDictionary(lang);

  return (
    <>
      <Hero dict={home.hero} />
      <FamilyLegacy dict={home.familyLegacy} />
      <WealthPlanning dict={home.wealthPlanning} />
      <BeyondFinancialAdvice dict={home.beyondFinancialAdvice} />
      <Quote dict={home.quote} />
      <FeaturedJournals dict={home.featuredJournals} />
    </>
  );
}
