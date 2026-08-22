import "server-only";
import { unstable_cache } from "next/cache";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where,
  type Firestore,
} from "firebase/firestore";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "./cache-tags";

export type FirestoreJournalSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type FirestoreJournalLocale = {
  title: string;
  content: string;
  seo: FirestoreJournalSeo;
};

// Dates are serialized as ISO strings — `unstable_cache` JSON-encodes the
// return value, so `Date` instances would be lost across cache hits.
export type FirestoreJournal = {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  updatedAt: string | null;
  featured: boolean;
  coverImage: string;
  readingTimeMinutes: number | null;
  content: string;
  seo: FirestoreJournalSeo;
  translations: {
    id?: FirestoreJournalLocale;
    zh?: FirestoreJournalLocale;
  };
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

function timestampToIso(input: unknown): string | null {
  return input instanceof Timestamp ? input.toDate().toISOString() : null;
}

function normalizeSeo(input: unknown): FirestoreJournalSeo {
  const seo = (input as Partial<FirestoreJournalSeo> | undefined) ?? {};
  return {
    title: seo.title ?? "",
    description: seo.description ?? "",
    keywords: Array.isArray(seo.keywords) ? seo.keywords : [],
  };
}

function normalizeTranslations(
  input: unknown,
): FirestoreJournal["translations"] {
  if (!input || typeof input !== "object") return {};
  const out: FirestoreJournal["translations"] = {};
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

function mapDoc(id: string, data: Record<string, unknown>): FirestoreJournal {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    author: (data.author as string) ?? "",
    status: (data.status as FirestoreJournal["status"]) ?? "draft",
    publishedAt: timestampToIso(data.publishedAt),
    updatedAt: timestampToIso(data.updatedAt),
    featured: Boolean(data.featured),
    coverImage: (data.coverImage as string) ?? "",
    readingTimeMinutes:
      typeof data.readingTimeMinutes === "number"
        ? (data.readingTimeMinutes as number)
        : null,
    content: (data.content as string) ?? "",
    seo: normalizeSeo(data.seo),
    translations: normalizeTranslations(data.translations),
  };
}

export const getPublishedJournals = unstable_cache(
  async (): Promise<FirestoreJournal[]> => {
    console.log("[cache-miss] getPublishedJournals fetching Firestore");
    const q = query(
      collection(getDb(), "journals"),
      where("status", "==", "published"),
    );
    const snap = await getDocs(q);
    const journals = snap.docs.map((d) => mapDoc(d.id, d.data()));
    // Sort in-memory to avoid needing a composite Firestore index.
    journals.sort((a, b) => {
      const bT = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      const aT = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      return bT - aT;
    });
    return journals;
  },
  ["published-journals"],
  { tags: [CACHE_TAGS.journals], revalidate: CACHE_TTL_SECONDS },
);

export const getPublishedJournalById = unstable_cache(
  async (id: string): Promise<FirestoreJournal | null> => {
    console.log("[cache-miss] getPublishedJournalById", id);
    const trySlug = async () => {
      const q = query(
        collection(getDb(), "journals"),
        where("slug", "==", id),
        where("status", "==", "published"),
      );
      const snap = await getDocs(q);
      const first = snap.docs[0];
      return first ? mapDoc(first.id, first.data()) : null;
    };

    const snap = await getDoc(doc(getDb(), "journals", id));
    if (snap.exists()) {
      const mapped = mapDoc(snap.id, snap.data());
      if (mapped.status === "published") return mapped;
    }
    return trySlug();
  },
  ["published-journal-by-id"],
  { tags: [CACHE_TAGS.journals], revalidate: CACHE_TTL_SECONDS },
);
