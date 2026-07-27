import { notFound } from "next/navigation";
import MarketUpdate from "../../components/market/MarketUpdate";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function Market({
  params,
}: PageProps<"/[lang]/market">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { market } = await getDictionary(lang);

  return <MarketUpdate dict={market} />;
}
