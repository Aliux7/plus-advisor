import { notFound } from "next/navigation";
import MarketUpdate from "../../components/market/MarketUpdate";
import {
  getMarketEntries,
  getMarketReportYear,
} from "../../lib/market-updates-server";
import { getDictionary, hasLocale } from "../dictionaries";

export const dynamic = "force-dynamic";

export default async function Market({
  params,
}: PageProps<"/[lang]/market">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ market }, entries, reportYear] = await Promise.all([
    getDictionary(lang),
    getMarketEntries(),
    getMarketReportYear(),
  ]);

  return (
    <MarketUpdate dict={market} entries={entries} reportYear={reportYear} />
  );
}
