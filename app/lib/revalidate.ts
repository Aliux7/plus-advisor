"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS, KNOWN_TAGS, type CacheTag } from "./cache-tags";

// Next.js 16 requires a cacheLife profile as the second arg. "max" gives the
// longest SWR window, so on-demand invalidation is the driving expiry signal
// (writers call these actions; readers pick up the change on the next request).
const PROFILE = "max" as const;

export async function revalidateSiteContent(): Promise<void> {
  revalidateTag(CACHE_TAGS.siteContent, PROFILE);
}

export async function revalidateJournals(): Promise<void> {
  revalidateTag(CACHE_TAGS.journals, PROFILE);
}

export async function revalidateMarketUpdates(): Promise<void> {
  revalidateTag(CACHE_TAGS.marketUpdates, PROFILE);
}

export async function revalidateCacheTag(tag: string): Promise<void> {
  if (!KNOWN_TAGS.has(tag)) {
    throw new Error(`Unknown cache tag: ${tag}`);
  }
  revalidateTag(tag as CacheTag, PROFILE);
}
