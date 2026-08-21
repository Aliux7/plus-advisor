import { notFound } from "next/navigation";
import ConnectWithAdvisor from "../../components/contact/ConnectWithAdvisor";
import WhistleBlower from "../../components/WhistleBlower";
import { getDictionary, hasLocale } from "../dictionaries";

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
