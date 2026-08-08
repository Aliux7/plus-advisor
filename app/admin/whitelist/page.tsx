"use client";

import { useEffect, useState } from "react";
import {
  addToWhitelist,
  isProtectedWhitelistEmail,
  isValidEmail,
  removeFromWhitelist,
  subscribeToWhitelist,
  type WhitelistEntry,
} from "../lib/whitelist";

function formatDate(entry: WhitelistEntry): string {
  if (!entry.addedAt) return "—";
  const d = entry.addedAt.toDate();
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WhitelistPage() {
  const [entries, setEntries] = useState<WhitelistEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToWhitelist(
      (rows) => {
        setEntries(rows);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return unsub;
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isValidEmail(newEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }
    setAdding(true);
    try {
      await addToWhitelist(newEmail);
      setNewEmail("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (entry: WhitelistEntry) => {
    if (isProtectedWhitelistEmail(entry.email)) return;
    const ok = window.confirm(`Remove ${entry.email} from the whitelist?`);
    if (!ok) return;
    setRemovingId(entry.id);
    try {
      await removeFromWhitelist(entry.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Whitelist</h1>
        {entries && (
          <span className="text-sm text-neutral-500">
            {entries.length} {entries.length === 1 ? "account" : "accounts"}
          </span>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <label htmlFor="new-email" className="sr-only">
            Email
          </label>
          <input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            disabled={adding}
          />
          {formError && (
            <p className="mt-1.5 text-xs text-red-600">{formError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={adding || !newEmail}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add to whitelist"}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {entries === null && !error && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {entries?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-neutral-500">
                  No accounts whitelisted yet.
                </td>
              </tr>
            )}
            {entries?.map((entry) => {
              const protectedRow = isProtectedWhitelistEmail(entry.email);
              const isRemoving = removingId === entry.id;
              return (
                <tr key={entry.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-neutral-800">
                    {entry.email}
                    {protectedRow && (
                      <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                        Owner
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {formatDate(entry)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void handleRemove(entry)}
                      disabled={protectedRow || isRemoving}
                      title={
                        protectedRow
                          ? "This account cannot be removed."
                          : "Remove from whitelist"
                      }
                      className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:bg-transparent disabled:hover:text-neutral-700"
                    >
                      {isRemoving ? "Removing…" : "Remove"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
