import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const WHITELIST_COLLECTION = "whitelist";
export const PROTECTED_WHITELIST_EMAIL = "kelsonsusilo@gmail.com";

export type WhitelistEntry = {
  id: string;
  email: string;
  addedAt: Timestamp | null;
};

export function whitelistDocId(email: string): string {
  return email.trim().toLowerCase();
}

export function isProtectedWhitelistEmail(email: string): boolean {
  return whitelistDocId(email) === PROTECTED_WHITELIST_EMAIL;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export async function isEmailWhitelisted(email: string): Promise<boolean> {
  const id = whitelistDocId(email);
  if (!id) return false;
  const snap = await getDoc(doc(getFirebaseDb(), WHITELIST_COLLECTION, id));
  return snap.exists();
}

export async function addToWhitelist(email: string): Promise<void> {
  const id = whitelistDocId(email);
  if (!isValidEmail(id)) throw new Error("Invalid email address.");
  await setDoc(doc(getFirebaseDb(), WHITELIST_COLLECTION, id), {
    email: id,
    addedAt: serverTimestamp(),
  });
}

export async function removeFromWhitelist(email: string): Promise<void> {
  const id = whitelistDocId(email);
  if (isProtectedWhitelistEmail(id)) {
    throw new Error(`${id} is protected and cannot be removed.`);
  }
  await deleteDoc(doc(getFirebaseDb(), WHITELIST_COLLECTION, id));
}

export function subscribeToWhitelist(
  onChange: (entries: WhitelistEntry[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), WHITELIST_COLLECTION),
    orderBy("addedAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      const entries = snap.docs.map((d) => {
        const data = d.data() as { email?: string; addedAt?: Timestamp };
        return {
          id: d.id,
          email: data.email ?? d.id,
          addedAt: data.addedAt ?? null,
        };
      });
      onChange(entries);
    },
    onError,
  );
}
