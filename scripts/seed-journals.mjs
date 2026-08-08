// Seed Firestore `journals` collection from app/data/blog-posts.json.
// Run with: npm run seed:journals
// Doc IDs are auto-generated (via addDoc), matching how the admin form creates entries.
// By default, wipes existing docs first so re-runs stay clean.
// Pass --no-wipe to append instead.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "..", "app", "data", "blog-posts.json");

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

const AUTHOR_NAME_MAP = {
  plusadvisor: "Plus Advisor",
  admin: "Plus Advisor",
};

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "for",
  "with", "as", "by", "at", "from", "that", "this", "is", "are", "was", "were",
  "be", "been", "being", "it", "its", "into", "than", "then", "so", "how",
  "what", "when", "where", "why", "who", "which", "yang", "dan", "atau",
  "di", "ke", "dari", "untuk", "pada", "dengan", "adalah", "itu", "ini",
  "sebagai", "bagi", "agar", "supaya", "juga", "namun", "tetapi", "tapi",
]);

function truncate(str, max) {
  if (!str) return "";
  const clean = str.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trim() + "…";
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveKeywords(title) {
  return Array.from(
    new Set(
      (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
    ),
  ).slice(0, 10);
}

function readingMinutesFromWordCount(wordCount) {
  const n = typeof wordCount === "number" ? wordCount : 0;
  return Math.max(1, Math.round(n / 200));
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return null;
  return Timestamp.fromDate(d);
}

function mapAuthor(raw) {
  if (!raw) return "Plus Advisor";
  const key = raw.toLowerCase().trim();
  return AUTHOR_NAME_MAP[key] ?? raw;
}

function toJournalDoc(post) {
  const publishedAt = parseDate(post.date_published);
  const updatedAt = parseDate(post.date_modified) ?? publishedAt;
  const description =
    truncate(post.excerpt, SEO_DESC_MAX) ||
    truncate(stripHtml(post.content_html), SEO_DESC_MAX);

  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    author: mapAuthor(post.author),
    status: "published",
    publishedAt,
    featured: false,
    coverImage: post.featured_image ?? "",
    readingTimeMinutes: readingMinutesFromWordCount(post.word_count),
    content: post.content_html ?? "",
    seo: {
      title: truncate(post.title ?? "", SEO_TITLE_MAX),
      description,
      keywords: deriveKeywords(post.title ?? ""),
    },
    views: 0,
    createdAt: publishedAt ?? serverTimestamp(),
    updatedAt: updatedAt ?? serverTimestamp(),
  };
}

const app = initializeApp(config);
const db = getFirestore(app);
const journalsCol = collection(db, "journals");

const wipeFirst = !process.argv.includes("--no-wipe");

if (wipeFirst) {
  console.log("Wiping existing /journals docs…");
  const snap = await getDocs(journalsCol);
  let removed = 0;
  for (const d of snap.docs) {
    try {
      await deleteDoc(doc(db, "journals", d.id));
      removed++;
    } catch (err) {
      console.error(`  ✗ Failed to delete ${d.id}: ${err.message ?? err}`);
    }
  }
  console.log(`  Removed ${removed}/${snap.size} docs.`);
}

const raw = await readFile(jsonPath, "utf8");
const { posts } = JSON.parse(raw);

if (!Array.isArray(posts) || posts.length === 0) {
  console.error("No posts found in blog-posts.json");
  process.exit(1);
}

console.log(`Seeding ${posts.length} journal posts…`);

let created = 0;
let failed = 0;

for (const post of posts) {
  const slug = (post.slug ?? "").trim();
  if (!slug) {
    console.warn(`  ✗ Skipping post without slug: id=${post.id}`);
    failed++;
    continue;
  }

  try {
    const ref = await addDoc(journalsCol, toJournalDoc(post));
    console.log(`  ✓ ${ref.id}  ${slug}`);
    created++;
  } catch (err) {
    console.error(`  ✗ Failed: ${slug}`);
    console.error(`    ${err.message ?? err}`);
    failed++;
  }
}

console.log(
  `\nDone. created=${created} failed=${failed} total=${posts.length}`,
);

if (failed > 0) {
  console.error(
    "\nIf failures are Firestore permission errors, either:\n" +
      "  1. Temporarily relax rules to allow writes to /journals/*, or\n" +
      "  2. Run this while signed in with an account that has write access.",
  );
  process.exit(1);
}

process.exit(0);
