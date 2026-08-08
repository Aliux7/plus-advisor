import "server-only";
import { cache } from "react";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

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

export type MarketEntry = {
  id: string;
  categoryKey: CategoryKey;
  label: string;
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

function mapDoc(id: string, data: Record<string, unknown>): MarketEntry {
  return {
    id,
    categoryKey: (data.categoryKey as CategoryKey) ?? "monthly",
    label: (data.label as string) ?? "",
    pdfUrl: (data.pdfUrl as string) ?? "",
    order: typeof data.order === "number" ? (data.order as number) : 0,
  };
}

export const getMarketEntries = cache(
  async (): Promise<Record<CategoryKey, MarketEntry[]>> => {
    const snap = await getDocs(collection(getDb(), "market-updates"));
    const grouped: Record<string, MarketEntry[]> = {};
    for (const d of snap.docs) {
      const entry = mapDoc(d.id, d.data());
      if (!entry.pdfUrl) continue;
      (grouped[entry.categoryKey] ||= []).push(entry);
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
);

export const getMarketReportYear = cache(async (): Promise<string> => {
  const snap = await getDoc(doc(getDb(), "settings", "market"));
  if (!snap.exists()) return String(new Date().getFullYear());
  const data = snap.data();
  const year =
    typeof data.reportYear === "string" && data.reportYear
      ? data.reportYear
      : String(new Date().getFullYear());
  return year;
});

