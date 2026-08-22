export const CACHE_TAGS = {
  siteContent: "site-content",
  journals: "journals",
  marketUpdates: "market-updates",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const KNOWN_TAGS: ReadonlySet<string> = new Set(
  Object.values(CACHE_TAGS),
);

export const CACHE_TTL_SECONDS = 86400;
