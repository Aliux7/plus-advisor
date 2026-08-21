import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export const CONTACT_SUBMISSIONS_COLLECTION = "contact-submissions";

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
  await addDoc(
    collection(getFirebaseDb(), CONTACT_SUBMISSIONS_COLLECTION),
    {
      ...input,
      submittedAt: serverTimestamp(),
    },
  );
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
