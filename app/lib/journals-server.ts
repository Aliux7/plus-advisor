import "server-only";
import { cache } from "react";
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

export type FirestoreJournal = {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  updatedAt: Date | null;
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
    publishedAt:
      data.publishedAt instanceof Timestamp
        ? (data.publishedAt as Timestamp).toDate()
        : null,
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? (data.updatedAt as Timestamp).toDate()
        : null,
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

export const getPublishedJournals = cache(async (): Promise<FirestoreJournal[]> => {
  const q = query(
    collection(getDb(), "journals"),
    where("status", "==", "published"),
  );
  const snap = await getDocs(q);
  const journals = snap.docs.map((d) => mapDoc(d.id, d.data()));
  // Sort in-memory to avoid needing a composite Firestore index.
  journals.sort((a, b) => {
    const bT = b.publishedAt?.getTime() ?? 0;
    const aT = a.publishedAt?.getTime() ?? 0;
    return bT - aT;
  });
  return journals;
});

export const getPublishedJournalById = cache(
  async (id: string): Promise<FirestoreJournal | null> => {
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
);
