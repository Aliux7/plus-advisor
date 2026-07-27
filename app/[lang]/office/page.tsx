import { notFound } from "next/navigation";
import Hero from "../../components/office/Hero";
import { getDictionary, hasLocale } from "../dictionaries";
import FamilyOffice from "@/app/components/office/Office";
import ServicePillars from "@/app/components/office/ServicePillars";
import Ascent from "@/app/components/office/Ascent";
import HolisticApproach from "@/app/components/office/HolisticApproach";
import QuietMind from "@/app/components/office/QuietMind";

export default async function Office({ params }: PageProps<"/[lang]/office">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { office, home } = await getDictionary(lang);

  return (
    <>
      <Hero />
      <FamilyOffice dict={office.familyOffice} />
      <ServicePillars
        dict={office.servicePillars}
        slidesDict={home.wealthPlanning}
      />
      <Ascent dict={office.ascent} />
      <HolisticApproach dict={office.holisticApproach} />
      <QuietMind dict={office.quietMind} />
    </>
  );
}
