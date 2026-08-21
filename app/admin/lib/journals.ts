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
  Timestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const JOURNAL_COLLECTION = "journals";

export type JournalStatus = "draft" | "published" | "archived";

export type JournalLocale = "en" | "id" | "zh";
export const JOURNAL_LOCALES: JournalLocale[] = ["en", "id", "zh"];

export type JournalSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type JournalLocaleFields = {
  title: string;
  content: string;
  seo: JournalSeo;
};

export type JournalTranslations = Partial<
  Record<Exclude<JournalLocale, "en">, JournalLocaleFields>
>;

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: JournalStatus;
  publishedAt: Timestamp | null;
  featured: boolean;
  coverImage: string;
  readingTimeMinutes: number | null;
  content: string;
  seo: JournalSeo;
  translations: JournalTranslations;
  views: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type JournalDraft = Omit<
  JournalPost,
  "id" | "createdAt" | "updatedAt" | "views"
>;

export const EMPTY_JOURNAL: JournalDraft = {
  title: "",
  slug: "",
  author: "",
  status: "draft",
  publishedAt: null,
  featured: false,
  coverImage: "",
  readingTimeMinutes: null,
  content: "",
  seo: { title: "", description: "", keywords: [] },
  translations: {},
};

export const EMPTY_LOCALE_FIELDS: JournalLocaleFields = {
  title: "",
  content: "",
  seo: { title: "", description: "", keywords: [] },
};

export function getLocaleFields(
  draft: Pick<JournalDraft, "title" | "content" | "seo" | "translations">,
  locale: JournalLocale,
): JournalLocaleFields {
  if (locale === "en") {
    return { title: draft.title, content: draft.content, seo: draft.seo };
  }
  return draft.translations[locale] ?? { ...EMPTY_LOCALE_FIELDS };
}

export function setLocaleFields(
  draft: JournalDraft,
  locale: JournalLocale,
  fields: JournalLocaleFields,
): JournalDraft {
  if (locale === "en") {
    return {
      ...draft,
      title: fields.title,
      content: fields.content,
      seo: fields.seo,
    };
  }
  return {
    ...draft,
    translations: { ...draft.translations, [locale]: fields },
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function estimateReadingMinutes(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

function normalizeSeo(input: unknown): JournalSeo {
  const seo = (input as Partial<JournalSeo> | undefined) ?? {};
  return {
    title: seo.title ?? "",
    description: seo.description ?? "",
    keywords: Array.isArray(seo.keywords) ? seo.keywords : [],
  };
}

function normalizeTranslations(input: unknown): JournalTranslations {
  if (!input || typeof input !== "object") return {};
  const out: JournalTranslations = {};
  for (const key of ["id", "zh"] as const) {
    const raw = (input as Record<string, unknown>)[key];
    if (!raw || typeof raw !== "object") continue;
    const t = raw as Record<string, unknown>;
    out[key] = {
      title: (t.title as string) ?? "",
      content: (t.content as string) ?? "",
      seo: normalizeSeo(t.seo),
    };
  }
  return out;
}

function mapDoc(id: string, data: Record<string, unknown>): JournalPost {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    author: (data.author as string) ?? "",
    status: ((data.status as JournalStatus) ?? "draft") as JournalStatus,
    publishedAt: (data.publishedAt as Timestamp) ?? null,
    featured: Boolean(data.featured),
    coverImage: (data.coverImage as string) ?? "",
    readingTimeMinutes:
      typeof data.readingTimeMinutes === "number"
        ? (data.readingTimeMinutes as number)
        : null,
    content: (data.content as string) ?? "",
    seo: normalizeSeo(data.seo),
    translations: normalizeTranslations(data.translations),
    views: typeof data.views === "number" ? (data.views as number) : 0,
    createdAt: (data.createdAt as Timestamp) ?? null,
    updatedAt: (data.updatedAt as Timestamp) ?? null,
  };
}

export async function getJournal(id: string): Promise<JournalPost | null> {
  const snap = await getDoc(doc(getFirebaseDb(), JOURNAL_COLLECTION, id));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}

export async function createJournal(draft: JournalDraft): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), JOURNAL_COLLECTION), {
    ...draft,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateJournal(
  id: string,
  patch: Partial<JournalDraft>,
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), JOURNAL_COLLECTION, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteJournal(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), JOURNAL_COLLECTION, id));
}

export function subscribeToJournals(
  onChange: (posts: JournalPost[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), JOURNAL_COLLECTION),
    orderBy("updatedAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError,
  );
}

export function toDateInputValue(ts: Timestamp | null): string {
  if (!ts) return "";
  const d = ts.toDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function fromDateInputValue(value: string): Timestamp | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return Timestamp.fromDate(new Date(y, m - 1, d));
}
