import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const CONTENT_COLLECTION = "site-content";
export const LOCALES = ["en", "id", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  zh: "中文",
};

export type ContentTree = Record<string, unknown>;
export type ContentByLocale = Record<Locale, ContentTree>;

export async function loadContent(
  locale: Locale,
): Promise<ContentTree | null> {
  const snap = await getDoc(doc(getFirebaseDb(), CONTENT_COLLECTION, locale));
  return snap.exists() ? (snap.data() as ContentTree) : null;
}

export async function saveContent(
  locale: Locale,
  tree: ContentTree,
): Promise<void> {
  await setDoc(doc(getFirebaseDb(), CONTENT_COLLECTION, locale), tree);
}

export function subscribeContent(
  locale: Locale,
  onChange: (tree: ContentTree | null) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), CONTENT_COLLECTION, locale),
    (snap) =>
      onChange(snap.exists() ? (snap.data() as ContentTree) : null),
    onError,
  );
}

/** Walk `obj` and return the value at `path` (dot / bracket notation). */
export function getAtPath(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[key as string];
  }
  return cur;
}

/**
 * Return a new object with `value` set at `path`. Arrays are copied as
 * arrays; objects as plain objects. Does not mutate the input.
 */
export function setAtPath<T>(
  obj: T,
  path: (string | number)[],
  value: unknown,
): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;

  const isArrayHead = typeof head === "number";
  if (isArrayHead) {
    const arr = Array.isArray(obj) ? [...(obj as unknown[])] : [];
    arr[head] = setAtPath(arr[head], rest, value);
    return arr as unknown as T;
  }

  const base =
    obj && typeof obj === "object" && !Array.isArray(obj)
      ? { ...(obj as Record<string, unknown>) }
      : {};
  base[head as string] = setAtPath(base[head as string], rest, value);
  return base as unknown as T;
}

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Deep-merge `override` onto `base`. `base` acts as the schema
 * (bundled JSON), `override` is the Firestore doc. The merge is
 * **schema-strict**: only keys present in the base survive, so
 * removing a field from the JSON also hides it from the editor and
 * drops it on the next save. Missing keys in the override fall back to
 * the base default.
 *
 * Arrays: if the override provides an array, use it (per-item merged
 * against the first base template so newly-added fields on each item
 * are also filled in). Otherwise use base.
 */
export function mergeWithSchema<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return cloneDeep(base);

  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return cloneDeep(base);
    const template = base[0];
    return override.map((item) =>
      template !== undefined ? mergeWithSchema(template, item) : item,
    ) as unknown as T;
  }

  if (base && typeof base === "object") {
    if (typeof override !== "object" || Array.isArray(override)) {
      return cloneDeep(base);
    }
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
