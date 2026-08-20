// Seed Firestore `site-content` collection from the bundled dictionary JSONs.
// Run with: npm run seed:content
// Creates / overwrites docs at site-content/{en,id,zh}.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dictDir = resolve(__dirname, "..", "app", "[lang]", "dictionaries");

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

const LOCALES = ["en", "id", "zh"];
const app = initializeApp(config);
const db = getFirestore(app);

let ok = 0;
let failed = 0;

for (const loc of LOCALES) {
  const jsonPath = resolve(dictDir, `${loc}.json`);
  try {
    const raw = await readFile(jsonPath, "utf8");
    const data = JSON.parse(raw);
    await setDoc(doc(db, "site-content", loc), data);
    console.log(`  ✓ site-content/${loc}  (${raw.length} bytes)`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${loc}: ${err.message ?? err}`);
    failed++;
  }
}

console.log(`\nDone. ok=${ok} failed=${failed}`);
if (failed > 0) {
  console.error(
    "\nIf failures are Firestore permission errors, either:\n" +
      "  1. Temporarily relax rules to allow writes to /site-content/*, or\n" +
      "  2. Sign in first with an account that has write access.",
  );
  process.exit(1);
}
process.exit(0);
