import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarketUpdate from "../../components/market/MarketUpdate";
import {
  getMarketEntries,
  getMarketReportYear,
} from "../../lib/market-updates-server";
import { getDictionary, hasLocale } from "../dictionaries";
import { buildPageMetadata } from "../../lib/seo";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/market">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { market } = await getDictionary(lang);
  const base = buildPageMetadata({
    locale: lang,
    path: "/market",
    title: market.meta.title,
    description: market.meta.description,
    keywords: market.meta.keywords,
    ogImage: market.meta.ogImage,
  });
  // Hidden pages should not be indexed.
  if (!market.visible) return { ...base, robots: { index: false, follow: false } };
  return base;
}

export default async function Market({
  params,
}: PageProps<"/[lang]/market">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ market }, entries, reportYear] = await Promise.all([
    getDictionary(lang),
    getMarketEntries(lang),
    getMarketReportYear(),
  ]);

  if (!market.visible) notFound();

  return (
    <MarketUpdate dict={market} entries={entries} reportYear={reportYear} />
  );
}
