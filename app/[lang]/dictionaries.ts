import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  id: () => import("./dictionaries/id.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const LOCALES = Object.keys(dictionaries) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

/** Shared page-section dictionaries — home and about use the same shape. */
export type PageDictionary = Dictionary["home"];
export type HeroDict = PageDictionary["hero"];
export type FamilyLegacyDict = PageDictionary["familyLegacy"];
export type WealthPlanningDict = PageDictionary["wealthPlanning"];
export type BeyondFinancialAdviceDict = PageDictionary["beyondFinancialAdvice"];
export type QuoteDict = PageDictionary["quote"];
export type FeaturedJournalsDict = PageDictionary["featuredJournals"];

export type HeaderDict = Dictionary["header"];
export type FooterDict = Dictionary["footer"];

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
export type ServicePillarsDict = Dictionary["office"]["servicePillars"];
export type AscentDict = Dictionary["office"]["ascent"];
export type HolisticApproachDict = Dictionary["office"]["holisticApproach"];
export type QuietMindDict = Dictionary["office"]["quietMind"];

/** Journals-page section shapes. */
export type JournalsHeroDict = Dictionary["journals"]["hero"];
export type LatestFeaturedDict = Dictionary["journals"]["latestFeatured"];
export type JournalsGridDict = Dictionary["journals"]["grid"];

/** Market-page section shape. */
export type MarketUpdateDict = Dictionary["market"];
