import { notFound } from "next/navigation";
import Hero from "../../components/about/Hero";
import AboutPlusAdvisor from "../../components/about/AboutPlusAdvisor";
import Leadership from "../../components/about/Leadership";
import AboutHer from "../../components/about/AboutHer";
import MountainQuote from "../../components/about/MountainQuote";
import MindsetPlanning from "../../components/about/MindsetPlanning";
import StarValue from "../../components/about/StarValue";
import IntegrityCompliance from "../../components/about/IntegrityCompliance";
import WhistleBlower from "../../components/WhistleBlower";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { about, whistleBlower } = await getDictionary(lang);

  return (
    <>
      <Hero dict={about.hero} />
      <AboutPlusAdvisor dict={about.aboutPlusAdvisor} />
      <Leadership dict={about.leadership} />
      <AboutHer dict={about.aboutHer} />
      <MountainQuote dict={about.mountainQuote} />
      <MindsetPlanning dict={about.mindsetPlanning} />
      <StarValue dict={about.starValue} />
      <IntegrityCompliance dict={about.integrityCompliance} />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
