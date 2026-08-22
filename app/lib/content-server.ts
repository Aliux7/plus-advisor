import "server-only";
import { unstable_cache } from "next/cache";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  doc,
  getDoc,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import type { Dictionary, Locale } from "../[lang]/dictionaries";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "./cache-tags";

export const CONTENT_COLLECTION = "site-content";

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

async function loadFallback(locale: Locale): Promise<Dictionary> {
  const mod = await import(`../[lang]/dictionaries/${locale}.json`);
  return mod.default as Dictionary;
}

/**
 * Deep-merge the Firestore doc onto the bundled JSON. Schema-strict:
 * only keys present in the bundled JSON survive so removing a field
 * from the schema hides it on the site. Missing keys in the override
 * fall back to the bundled default.
 */
function mergeWithSchema<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    const template = base[0];
    return override.map((item) =>
      template !== undefined ? mergeWithSchema(template, item) : item,
    ) as unknown as T;
  }

  if (base && typeof base === "object") {
    if (typeof override !== "object" || Array.isArray(override)) return base;
    const out: Record<string, unknown> = {};
    const baseObj = base as Record<string, unknown>;
    const overrideObj = override as Record<string, unknown>;
    for (const k of Object.keys(baseObj)) {
      out[k] = mergeWithSchema(baseObj[k], overrideObj[k]);
    }
    return out as T;
  }

  return override as T;
}

export const getContentForLocale = unstable_cache(
  async (locale: Locale): Promise<Dictionary> => {
    console.log("[cache-miss] getContentForLocale", locale);
    const fallback = await loadFallback(locale);
    try {
      const snap = await getDoc(doc(getDb(), CONTENT_COLLECTION, locale));
      if (snap.exists()) {
        return mergeWithSchema(fallback, snap.data());
      }
    } catch (err) {
      console.warn(
        `[content] Firestore read failed for ${locale}; falling back to bundled JSON.`,
        err,
      );
    }
    return fallback;
  },
  ["site-content-by-locale"],
  { tags: [CACHE_TAGS.siteContent], revalidate: CACHE_TTL_SECONDS },
);
