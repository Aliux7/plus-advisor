import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
  const dict = await getDictionary(lang);

  return (
    <div id="top" className="flex flex-1 flex-col overflow-x-hidden">
      <Header dict={dict.header} lang={lang} />
      <main className="flex flex-1 flex-col">
        <Hero dict={dict.hero} />
        <FamilyLegacy dict={dict.familyLegacy} />
        <WealthPlanning dict={dict.wealthPlanning} />
        <BeyondFinancialAdvice dict={dict.beyondFinancialAdvice} />
        <Quote dict={dict.quote} />
        <FeaturedJournals dict={dict.featuredJournals} />
      </main>
      <Footer dict={dict.footer} />
    </div>
  );
}
