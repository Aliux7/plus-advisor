export type SortKey = "latest" | "oldest" | "az" | "za";

export const DEFAULT_SORT: SortKey = "latest";

export function isSortKey(value: string | undefined): value is SortKey {
  return value === "latest" || value === "oldest" || value === "az" || value === "za";
}
