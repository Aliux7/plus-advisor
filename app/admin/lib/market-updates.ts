import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const MARKET_UPDATE_COLLECTION = "market-updates";
export const MARKET_SETTINGS_DOC = "settings/market";
export const MARKET_PDF_FOLDER = "market-updates/pdfs";

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

export const CATEGORY_KEYS: CategoryKey[] = [
  ...PERIOD_CATEGORY_KEYS,
  ...INSIGHT_CATEGORY_KEYS,
];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  semester: "Semester",
  yearly: "Yearly",
  mutualFunds: "Mutual Funds Insight",
  fixedIncome: "Fixed Income Insight",
  equity: "Equity Insight",
  macroPulse: "Macro Pulse",
};

export function isPeriodCategory(key: CategoryKey): key is PeriodCategoryKey {
  return (PERIOD_CATEGORY_KEYS as readonly string[]).includes(key);
}

export type MarketUpdateLocale = "en" | "id" | "zh";
export const MARKET_UPDATE_LOCALES: MarketUpdateLocale[] = ["en", "id", "zh"];

export type MarketUpdateTranslations = Partial<
  Record<Exclude<MarketUpdateLocale, "en">, { label: string }>
>;

export type MarketUpdateEntry = {
  id: string;
  categoryKey: CategoryKey;
  label: string;
  translations: MarketUpdateTranslations;
  pdfUrl: string;
  pdfPath: string;
  order: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type MarketUpdateDraft = Omit<
  MarketUpdateEntry,
  "id" | "createdAt" | "updatedAt"
>;

export const EMPTY_MARKET_UPDATE: MarketUpdateDraft = {
  categoryKey: "monthly",
  label: "",
  translations: {},
  pdfUrl: "",
  pdfPath: "",
  order: 0,
};

export function getMarketLabelFor(
  draft: Pick<MarketUpdateDraft, "label" | "translations">,
  locale: MarketUpdateLocale,
): string {
  if (locale === "en") return draft.label;
  return draft.translations[locale]?.label ?? "";
}

export function setMarketLabelFor(
  draft: MarketUpdateDraft,
  locale: MarketUpdateLocale,
  label: string,
): MarketUpdateDraft {
  if (locale === "en") return { ...draft, label };
  return {
    ...draft,
    translations: { ...draft.translations, [locale]: { label } },
  };
}

function normalizeTranslations(input: unknown): MarketUpdateTranslations {
  if (!input || typeof input !== "object") return {};
  const out: MarketUpdateTranslations = {};
  for (const key of ["id", "zh"] as const) {
    const raw = (input as Record<string, unknown>)[key];
    if (!raw || typeof raw !== "object") continue;
    const label = (raw as Record<string, unknown>).label;
    if (typeof label === "string") out[key] = { label };
  }
  return out;
}

function mapDoc(id: string, data: Record<string, unknown>): MarketUpdateEntry {
  return {
    id,
    categoryKey: (data.categoryKey as CategoryKey) ?? "monthly",
    label: (data.label as string) ?? "",
    translations: normalizeTranslations(data.translations),
    pdfUrl: (data.pdfUrl as string) ?? "",
    pdfPath: (data.pdfPath as string) ?? "",
    order: typeof data.order === "number" ? (data.order as number) : 0,
    createdAt: (data.createdAt as Timestamp) ?? null,
    updatedAt: (data.updatedAt as Timestamp) ?? null,
  };
}

export async function getMarketEntry(
  id: string,
): Promise<MarketUpdateEntry | null> {
  const snap = await getDoc(doc(getFirebaseDb(), MARKET_UPDATE_COLLECTION, id));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}

export async function createMarketEntry(
  draft: MarketUpdateDraft,
): Promise<string> {
  const ref = await addDoc(
    collection(getFirebaseDb(), MARKET_UPDATE_COLLECTION),
    {
      ...draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
  return ref.id;
}

export async function updateMarketEntry(
  id: string,
  patch: Partial<MarketUpdateDraft>,
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), MARKET_UPDATE_COLLECTION, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMarketEntry(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), MARKET_UPDATE_COLLECTION, id));
}

export async function reorderMarketEntries(
  updates: { id: string; order: number }[],
): Promise<void> {
  if (updates.length === 0) return;
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  for (const u of updates) {
    batch.update(doc(db, MARKET_UPDATE_COLLECTION, u.id), {
      order: u.order,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export function subscribeToMarketEntries(
  onChange: (entries: MarketUpdateEntry[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), MARKET_UPDATE_COLLECTION),
    orderBy("order", "asc"),
  );
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError,
  );
}

export type MarketSettings = {
  reportYear: string;
};

export const DEFAULT_MARKET_SETTINGS: MarketSettings = {
  reportYear: String(new Date().getFullYear()),
};

const [settingsCol, settingsId] = MARKET_SETTINGS_DOC.split("/");

export async function getMarketSettings(): Promise<MarketSettings> {
  const snap = await getDoc(doc(getFirebaseDb(), settingsCol, settingsId));
  if (!snap.exists()) return DEFAULT_MARKET_SETTINGS;
  const data = snap.data();
  return {
    reportYear:
      typeof data.reportYear === "string" && data.reportYear
        ? data.reportYear
        : DEFAULT_MARKET_SETTINGS.reportYear,
  };
}

export async function saveMarketSettings(
  patch: Partial<MarketSettings>,
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), settingsCol, settingsId),
    { ...patch, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
