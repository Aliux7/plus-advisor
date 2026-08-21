import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "../../components/office/Hero";
import { getDictionary, hasLocale } from "../dictionaries";
import FamilyOffice from "@/app/components/office/Office";
import ServicePillars from "@/app/components/office/ServicePillars";
import Ascent from "@/app/components/office/Ascent";
import HolisticApproach from "@/app/components/office/HolisticApproach";
import QuietMind from "@/app/components/office/QuietMind";
import WhistleBlower from "@/app/components/WhistleBlower";
import { buildPageMetadata } from "@/app/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/office">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { office } = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    path: "/office",
    title: office.meta.title,
    description: office.meta.description,
    keywords: office.meta.keywords,
    ogImage: office.meta.ogImage,
  });
}

export default async function Office({ params }: PageProps<"/[lang]/office">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { office, ourServicePillars, whistleBlower } = await getDictionary(lang);

  return (
    <>
      <Hero dict={office.hero} />
      <FamilyOffice dict={office.familyOffice} />
      <ServicePillars dict={ourServicePillars} />
      <Ascent dict={office.ascent} />
      <HolisticApproach dict={office.holisticApproach} />
      <QuietMind dict={office.quietMind} />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
