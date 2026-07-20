import { notFound } from "next/navigation";
import Hero from "../../components/about/Hero";
import AboutPlusAdvisor from "../../components/about/AboutPlusAdvisor";
import Leadership from "../../components/about/Leadership";
import AboutHer from "../../components/about/AboutHer";
import MountainQuote from "../../components/about/MountainQuote";
import BeyondFinancialAdvice from "../../components/about/BeyondFinancialAdvice";
import Quote from "../../components/about/Quote";
import FeaturedJournals from "../../components/about/FeaturedJournals";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { about } = await getDictionary(lang);

  return (
    <>
      <Hero dict={about.hero} />
      <AboutPlusAdvisor dict={about.aboutPlusAdvisor} />
      <Leadership dict={about.leadership} />
      <AboutHer dict={about.aboutHer} />
      <MountainQuote dict={about.mountainQuote} />

      {/* <BeyondFinancialAdvice dict={about.beyondFinancialAdvice} />
      <Quote dict={about.quote} />
      <FeaturedJournals dict={about.featuredJournals} /> */}
    </>
  );
}
