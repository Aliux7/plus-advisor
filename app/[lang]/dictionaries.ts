import "server-only";
import type enDict from "./dictionaries/en.json";

const bundled = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  id: () => import("./dictionaries/id.json").then((m) => m.default),
  zh: () => import("./dictionaries/zh.json").then((m) => m.default),
};

export type Locale = keyof typeof bundled;

export const LOCALES = Object.keys(bundled) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in bundled;

export type Dictionary = typeof enDict;

/** Reads the bundled JSON dictionary (used as fallback + admin seed). */
export const getBundledDictionary = async (
  locale: Locale,
): Promise<Dictionary> => (await bundled[locale]()) as Dictionary;

/**
 * Reads the dictionary for a locale — Firestore first, bundled JSON as
 * fallback. Delegated to a lazy import to avoid a circular type dep.
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const { getContentForLocale } = await import("../lib/content-server");
  return getContentForLocale(locale);
};

/** Shared page-section dictionaries — home and about use the same shape. */
export type PageDictionary = Dictionary["home"];
export type HeroDict = PageDictionary["hero"];
export type FamilyLegacyDict = PageDictionary["familyLegacy"];
export type BeyondFinancialAdviceDict = PageDictionary["beyondFinancialAdvice"];
export type QuoteDict = PageDictionary["quote"];
export type FeaturedJournalsDict = PageDictionary["featuredJournals"];

/** Shared slider used by both Home and Office pages. */
export type OurServicePillarsDict = Dictionary["ourServicePillars"];

export type HeaderDict = Dictionary["header"];
export type FooterDict = Dictionary["footer"];
export type WhistleBlowerDict = Dictionary["whistleBlower"];

/** About-page section shapes (only where they diverge from the home shape). */
export type AboutPlusAdvisorDict = Dictionary["about"]["aboutPlusAdvisor"];
export type LeadershipDict = Dictionary["about"]["leadership"];
export type AboutHerDict = Dictionary["about"]["aboutHer"];
export type MountainQuoteDict = Dictionary["about"]["mountainQuote"];
export type MindsetPlanningDict = Dictionary["about"]["mindsetPlanning"];
export type StarValueDict = Dictionary["about"]["starValue"];
export type IntegrityComplianceDict = Dictionary["about"]["integrityCompliance"];

/** Stories-page section shapes. */
export type StoriesHeroDict = Dictionary["stories"]["hero"];
export type OurStoryDict = Dictionary["stories"]["ourStory"];
export type VisionMissionDict = Dictionary["stories"]["visionMission"];
export type OurValuesDict = Dictionary["stories"]["ourValues"];

/** Office-page section shapes. */
export type OfficeHeroDict = Dictionary["office"]["hero"];
export type FamilyOfficeDict = Dictionary["office"]["familyOffice"];
export type AscentDict = Dictionary["office"]["ascent"];
export type HolisticApproachDict = Dictionary["office"]["holisticApproach"];
export type QuietMindDict = Dictionary["office"]["quietMind"];

/** Journals-page section shapes. */
export type JournalsHeroDict = Dictionary["journals"]["hero"];
export type LatestFeaturedDict = Dictionary["journals"]["latestFeatured"];
export type JournalsGridDict = Dictionary["journals"]["grid"];

/** Market-page section shape. */
export type MarketUpdateDict = Dictionary["market"];

/** News-detail page shape. */
export type NewsDetailDict = Dictionary["news"];

/** Contact-page section shape. */
export type ContactDict = Dictionary["contact"];
