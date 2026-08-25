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

export const CONTACT_SUBMISSIONS_COLLECTION = "contact-submissions";
export const CONTACT_SETTINGS_DOC = "settings/contact";

export type ContactSettings = {
  notifyTo: string;
};

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  notifyTo: "info@yasserrizky.com",
};

const [settingsCol, settingsId] = CONTACT_SETTINGS_DOC.split("/");

export async function getContactSettings(): Promise<ContactSettings> {
  const snap = await getDoc(doc(getFirebaseDb(), settingsCol, settingsId));
  if (!snap.exists()) return DEFAULT_CONTACT_SETTINGS;
  const data = snap.data();
  return {
    notifyTo:
      typeof data.notifyTo === "string" && data.notifyTo
        ? data.notifyTo
        : DEFAULT_CONTACT_SETTINGS.notifyTo,
  };
}

export async function saveContactSettings(
  patch: Partial<ContactSettings>,
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), settingsCol, settingsId),
    { ...patch, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export type ContactSubmissionInput = {
  firstName: string;
  lastName: string;
  /** Convenience: `${firstName} ${lastName}` — kept for display and CSV export. */
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  /** Convenience: `${countryCode} ${number}` — kept for display and CSV export. */
  phone: string;
  contactMethod: string;
  residences: string;
  assets: string;
  message: string;
  readyForAdvisor: boolean;
  preferConversation: boolean;
  locale: string;
};

export type ContactSubmission = ContactSubmissionInput & {
  id: string;
  submittedAt: Timestamp | null;
};

export async function submitContactForm(
  input: ContactSubmissionInput,
): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to submit form");
  }
}

export function subscribeToContactSubmissions(
  onChange: (rows: ContactSubmission[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), CONTACT_SUBMISSIONS_COLLECTION),
    orderBy("submittedAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data() as Partial<ContactSubmission>;
        return {
          id: d.id,
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          name: data.name ?? "",
          email: data.email ?? "",
          phoneCountryCode: data.phoneCountryCode ?? "",
          phoneNumber: data.phoneNumber ?? "",
          phone: data.phone ?? "",
          contactMethod: data.contactMethod ?? "",
          residences: data.residences ?? "",
          assets: data.assets ?? "",
          message: data.message ?? "",
          readyForAdvisor: Boolean(data.readyForAdvisor),
          preferConversation: Boolean(data.preferConversation),
          locale: data.locale ?? "",
          submittedAt: (data.submittedAt as Timestamp | undefined) ?? null,
        } satisfies ContactSubmission;
      });
      onChange(rows);
    },
    onError,
  );
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), CONTACT_SUBMISSIONS_COLLECTION, id));
}
