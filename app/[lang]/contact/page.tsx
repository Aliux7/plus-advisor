import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConnectWithAdvisor from "../../components/contact/ConnectWithAdvisor";
import WhistleBlower from "../../components/WhistleBlower";
import { getDictionary, hasLocale } from "../dictionaries";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { contact } = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    path: "/contact",
    title: contact.meta.title,
    description: contact.meta.description,
    keywords: contact.meta.keywords,
    ogImage: contact.meta.ogImage,
  });
}

export default async function Contact({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { contact, whistleBlower } = await getDictionary(lang);

  return (
    <>
      <ConnectWithAdvisor dict={contact} />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
