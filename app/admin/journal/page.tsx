"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  deleteJournal,
  subscribeToJournals,
  type JournalPost,
  type JournalStatus,
} from "../lib/journals";
import { revalidateJournals } from "../../lib/revalidate";

const STATUS_FILTERS: { value: "all" | JournalStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function formatDate(ts: JournalPost["publishedAt"]): string {
  if (!ts) return "—";
  const d = ts.toDate();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function JournalListPage() {
  const [posts, setPosts] = useState<JournalPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToJournals(
      (rows) => {
        setPosts(rows);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return null;
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (featuredOnly && !p.featured) return false;
      if (q) {
        const hay = `${p.title} ${p.author} ${p.slug}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [posts, search, statusFilter, featuredOnly]);

  const handleDelete = async (post: JournalPost) => {
    const ok = window.confirm(`Delete "${post.title}"? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(post.id);
    try {
      await deleteJournal(post.id);
      await revalidateJournals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">
            Journal
          </h1>
          {posts && (
            <p className="mt-1 text-sm text-navy/60">
              {posts.length} {posts.length === 1 ? "entry" : "entries"} total
            </p>
          )}
        </div>
        <Link
          href="/admin/journal/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          + New Entry
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author…"
          className="w-full max-w-sm rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as (typeof STATUS_FILTERS)[number]["value"],
            )
          }
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setFeaturedOnly((v) => !v)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            featuredOnly
              ? "border-navy bg-navy text-white"
              : "border-navy/20 bg-white text-navy hover:bg-gold/5"
          }`}
        >
          <span className={featuredOnly ? "text-white" : "text-gold"}>★</span>{" "}
          Featured
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="w-24 px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered === null && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-neutral-500">
                  No posts match your filters.
                </td>
              </tr>
            )}
            {filtered?.map((post) => (
              <tr key={post.id} className="align-top hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900">
                    {post.title || "(untitled)"}
                  </div>
                  {post.slug && (
                    <div className="mt-0.5 font-mono text-xs text-neutral-500">
                      /{post.slug}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {post.author || "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatDate(post.publishedAt)}
                </td>
                <td className="px-4 py-3 text-neutral-600">{post.views}</td>
                <td className="px-4 py-3">
                  {post.featured ? (
                    <span className="text-gold">★</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/journal/${post.id}`}
                      className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
                      title="Edit"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post)}
                      disabled={deletingId === post.id}
                      className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-red-700 hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                      title="Delete"
                    >
                      {deletingId === post.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: JournalStatus }) {
  const styles: Record<JournalStatus, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-neutral-100 text-neutral-700",
    archived: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
