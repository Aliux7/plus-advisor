import type { MetadataRoute } from "next";
import { LOCALES, type Locale } from "./[lang]/dictionaries";
import { getPublishedJournals } from "./lib/journals-server";
import { absoluteUrl, getSiteUrl } from "./lib/seo";

// Static top-level routes. Journal detail routes are appended dynamically.
const STATIC_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "about", changeFrequency: "monthly", priority: 0.8 },
  { path: "stories", changeFrequency: "monthly", priority: 0.7 },
  { path: "office", changeFrequency: "monthly", priority: 0.8 },
  { path: "journals", changeFrequency: "daily", priority: 0.9 },
  { path: "market", changeFrequency: "weekly", priority: 0.7 },
  { path: "contact", changeFrequency: "yearly", priority: 0.6 },
];

// Regenerate at most once per day; journal writes call revalidateTag('journals')
// so crawlers pick up new articles between scheduled revalidations.
export const revalidate = 86400;

function localeUrls(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of LOCALES) {
    out[loc] = absoluteUrl(`/${loc}${path ? `/${path}` : ""}`);
  }
  out["x-default"] = absoluteUrl(`/en${path ? `/${path}` : ""}`);
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((entry) =>
    LOCALES.map((loc: Locale) => ({
      url: `${site}/${loc}${entry.path ? `/${entry.path}` : ""}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages: localeUrls(entry.path) },
    })),
  );

  let journalEntries: MetadataRoute.Sitemap = [];
  try {
    const journals = await getPublishedJournals();
    journalEntries = journals.flatMap((j) => {
      const lastModified = j.updatedAt ?? j.publishedAt ?? now;
      return LOCALES.map((loc: Locale) => ({
        url: `${site}/${loc}/journals/${j.slug || j.id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: localeUrls(`journals/${j.slug || j.id}`),
        },
      }));
    });
  } catch {
    // If Firestore is unreachable, still return the static sitemap so
    // crawlers get something useful.
  }

  return [...staticEntries, ...journalEntries];
}
