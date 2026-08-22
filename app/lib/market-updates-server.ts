import "server-only";
import { unstable_cache } from "next/cache";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import type { Locale } from "../[lang]/dictionaries";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "./cache-tags";

export const PERIOD_CATEGORY_KEYS = [
  "daily",
  "weekly",
  "monthly",
  "semester",
  "yearly",
] as const;
export type PeriodCategoryKey = (typeof PERIOD_CATEGORY_KEYS)[number];

export const INSIGHT_CATEGORY_KEYS = [
  "mutualFunds",
  "fixedIncome",
  "equity",
  "macroPulse",
] as const;
export type InsightCategoryKey = (typeof INSIGHT_CATEGORY_KEYS)[number];

export type CategoryKey = PeriodCategoryKey | InsightCategoryKey;

export const isPeriodCategory = (key: CategoryKey): key is PeriodCategoryKey =>
  (PERIOD_CATEGORY_KEYS as readonly string[]).includes(key);

export type MarketEntryTranslations = {
  id?: { label: string };
  zh?: { label: string };
};

export type MarketEntry = {
  id: string;
  categoryKey: CategoryKey;
  label: string;
  translations: MarketEntryTranslations;
  pdfUrl: string;
  order: number;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

function getDb(): Firestore {
  return getFirestore(getApp());
}

function normalizeTranslations(input: unknown): MarketEntryTranslations {
  if (!input || typeof input !== "object") return {};
  const out: MarketEntryTranslations = {};
  for (const key of ["id", "zh"] as const) {
    const raw = (input as Record<string, unknown>)[key];
    if (!raw || typeof raw !== "object") continue;
    const label = (raw as Record<string, unknown>).label;
    if (typeof label === "string") out[key] = { label };
  }
  return out;
}

function mapDoc(id: string, data: Record<string, unknown>): MarketEntry {
  return {
    id,
    categoryKey: (data.categoryKey as CategoryKey) ?? "monthly",
    label: (data.label as string) ?? "",
    translations: normalizeTranslations(data.translations),
    pdfUrl: (data.pdfUrl as string) ?? "",
    order: typeof data.order === "number" ? (data.order as number) : 0,
  };
}

function pickLabel(entry: MarketEntry, lang: Locale): string {
  if (lang === "en") return entry.label;
  const translated = entry.translations[lang]?.label?.trim();
  return translated || entry.label;
}

export const getMarketEntries = unstable_cache(
  async (lang: Locale): Promise<Record<CategoryKey, MarketEntry[]>> => {
    console.log("[cache-miss] getMarketEntries", lang);
    const snap = await getDocs(collection(getDb(), "market-updates"));
    const grouped: Record<string, MarketEntry[]> = {};
    for (const d of snap.docs) {
      const entry = mapDoc(d.id, d.data());
      if (!entry.pdfUrl) continue;
      const localized: MarketEntry = { ...entry, label: pickLabel(entry, lang) };
      (grouped[entry.categoryKey] ||= []).push(localized);
    }
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => a.order - b.order);
    }
    // Ensure all keys are present (empty arrays for missing ones)
    const result: Record<CategoryKey, MarketEntry[]> = {} as Record<
      CategoryKey,
      MarketEntry[]
    >;
    for (const k of [...PERIOD_CATEGORY_KEYS, ...INSIGHT_CATEGORY_KEYS]) {
      result[k] = grouped[k] ?? [];
    }
    return result;
  },
  ["market-entries"],
  { tags: [CACHE_TAGS.marketUpdates], revalidate: CACHE_TTL_SECONDS },
);

export const getMarketReportYear = unstable_cache(
  async (): Promise<string> => {
    console.log("[cache-miss] getMarketReportYear");
    const snap = await getDoc(doc(getDb(), "settings", "market"));
    if (!snap.exists()) return String(new Date().getFullYear());
    const data = snap.data();
    const year =
      typeof data.reportYear === "string" && data.reportYear
        ? data.reportYear
        : String(new Date().getFullYear());
    return year;
  },
  ["market-report-year"],
  { tags: [CACHE_TAGS.marketUpdates], revalidate: CACHE_TTL_SECONDS },
);
