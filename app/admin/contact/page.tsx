"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deleteContactSubmission,
  subscribeToContactSubmissions,
  type ContactSubmission,
} from "../lib/contact";

function formatDate(row: ContactSubmission): string {
  if (!row.submittedAt) return "—";
  const d = row.submittedAt.toDate();
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(rows: ContactSubmission[]) {
  const header = [
    "Submitted",
    "First Name",
    "Last Name",
    "Full Name",
    "Email",
    "Country Code",
    "Phone Number",
    "Phone (Formatted)",
    "Preferred Contact Method",
    "Residences",
    "Assets Range",
    "Message",
    "Ready for Advisor",
    "Prefer Conversation",
    "Locale",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.submittedAt ? row.submittedAt.toDate().toISOString() : "",
        row.firstName,
        row.lastName,
        row.name,
        row.email,
        row.phoneCountryCode,
        row.phoneNumber,
        row.phone,
        row.contactMethod,
        row.residences,
        row.assets,
        row.message,
        row.readyForAdvisor ? "yes" : "no",
        row.preferConversation ? "yes" : "no",
        row.locale,
      ]
        .map((v) => csvEscape(String(v ?? "")))
        .join(","),
    );
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `contact-submissions-${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContactSubmissionsPage() {
  const [rows, setRows] = useState<ContactSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = subscribeToContactSubmissions(
      (next) => {
        setRows(next);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [
        row.firstName,
        row.lastName,
        row.name,
        row.email,
        row.phoneCountryCode,
        row.phoneNumber,
        row.phone,
        row.contactMethod,
        row.residences,
        row.assets,
        row.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const handleRemove = async (row: ContactSubmission) => {
    const ok = window.confirm(
      `Delete submission from ${row.name || row.email || "this contact"}?`,
    );
    if (!ok) return;
    setRemovingId(row.id);
    try {
      await deleteContactSubmission(row.id);
      if (selected?.id === row.id) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">
            Contact Us
          </h1>
          <p className="mt-1 text-sm text-navy/60">
            Submissions from the public Contact Us form, most recent first.
          </p>
        </div>
        {rows && (
          <span className="text-sm text-neutral-500">
            {rows.length} {rows.length === 1 ? "submission" : "submissions"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone, message…"
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => rows && downloadCsv(filtered ?? rows)}
          disabled={!rows || rows.length === 0}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-navy hover:bg-neutral-100 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Preferred</th>
              <th className="px-4 py-3 font-medium">Residences</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows === null && !error && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {rows && filtered && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-neutral-500">
                  {rows.length === 0
                    ? "No submissions yet."
                    : "No submissions match this search."}
                </td>
              </tr>
            )}
            {filtered?.map((row) => {
              const isRemoving = removingId === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className="cursor-pointer hover:bg-neutral-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {formatDate(row)}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">
                    {row.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-navy/80">
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-gold hover:underline"
                      >
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-navy/80">
                    {row.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-navy/80">
                    {row.contactMethod || "—"}
                  </td>
                  <td className="px-4 py-3 text-navy/80">
                    {row.residences || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.readyForAdvisor && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                          Ready
                        </span>
                      )}
                      {row.preferConversation && (
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-navy">
                          Talk
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleRemove(row);
                      }}
                      disabled={isRemoving}
                      className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isRemoving ? "Removing…" : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <SubmissionModal
          submission={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-start gap-4 py-2">
      <div className="text-xs font-medium uppercase tracking-wide text-navy/50">
        {label}
      </div>
      <div className="whitespace-pre-wrap text-sm text-navy">
        {value || "—"}
      </div>
    </div>
  );
}

function SubmissionModal({
  submission,
  onClose,
}: {
  submission: ContactSubmission;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-navy">
              {submission.name || "Untitled submission"}
            </h2>
            <p className="text-xs text-navy/50">{formatDate(submission)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-navy hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
        <div className="divide-y divide-neutral-100 px-6 py-2">
          <Row label="First name" value={submission.firstName} />
          <Row label="Last name" value={submission.lastName} />
          <Row label="Email" value={submission.email} />
          <Row label="Country code" value={submission.phoneCountryCode} />
          <Row label="Phone number" value={submission.phoneNumber} />
          <Row label="Phone (formatted)" value={submission.phone} />
          <Row
            label="Preferred contact"
            value={submission.contactMethod}
          />
          <Row label="Residences" value={submission.residences} />
          <Row label="Assets range" value={submission.assets} />
          <Row label="Message" value={submission.message} />
          <Row
            label="Ready for advisor"
            value={submission.readyForAdvisor ? "Yes" : "No"}
          />
          <Row
            label="Prefer conversation"
            value={submission.preferConversation ? "Yes" : "No"}
          />
          <Row label="Locale" value={submission.locale} />
        </div>
      </div>
    </div>
  );
}
