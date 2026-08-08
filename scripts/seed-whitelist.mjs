// Seed a single email into the Firestore `whitelist` collection.
// Run with: node --env-file=.env.local scripts/seed-whitelist.mjs <email>
// If no email argument is passed, defaults to kelsonsusilo@gmail.com.

import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const email = (process.argv[2] ?? "kelsonsusilo@gmail.com").trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error(`Invalid email: "${email}"`);
  process.exit(1);
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(config)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(
    `Missing Firebase env vars: ${missing.join(", ")}. Pass .env.local via --env-file.`,
  );
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);

try {
  await setDoc(doc(db, "whitelist", email), {
    email,
    addedAt: serverTimestamp(),
  });
  console.log(`Whitelisted: ${email}`);
  process.exit(0);
} catch (err) {
  console.error("Failed to write whitelist entry:");
  console.error(err);
  console.error(
    "\nIf this is a Firestore permission error, either:\n" +
      "  1. Add the doc manually in Firebase Console → Firestore → whitelist/<email>, or\n" +
      "  2. Temporarily relax Firestore rules to allow writes to /whitelist/*.",
  );
  process.exit(1);
}
