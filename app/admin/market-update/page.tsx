"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  DEFAULT_MARKET_SETTINGS,
  MARKET_PDF_FOLDER,
  createMarketEntry,
  deleteMarketEntry,
  getMarketSettings,
  isPeriodCategory,
  reorderMarketEntries,
  saveMarketSettings,
  subscribeToMarketEntries,
  type CategoryKey,
  type MarketUpdateEntry,
} from "../lib/market-updates";
import { deleteStorageObject, uploadPdf } from "../lib/storage";

export default function MarketUpdateListPage() {
  const [entries, setEntries] = useState<MarketUpdateEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reportYear, setReportYear] = useState<string>(
    DEFAULT_MARKET_SETTINGS.reportYear,
  );
  const [reportYearSaving, setReportYearSaving] = useState(false);
  const [reportYearSaved, setReportYearSaved] = useState(false);
  const [openAdd, setOpenAdd] = useState<CategoryKey | null>(null);

  useEffect(() => {
    const unsub = subscribeToMarketEntries(
      (rows) => {
        setEntries(rows);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return unsub;
  }, []);

  useEffect(() => {
    getMarketSettings()
      .then((s) => setReportYear(s.reportYear))
      .catch(() => {});
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<CategoryKey, MarketUpdateEntry[]>();
    for (const k of CATEGORY_KEYS) map.set(k, []);
    for (const entry of entries ?? []) {
      map.get(entry.categoryKey)?.push(entry);
    }
    return map;
  }, [entries]);

  const handleDelete = async (entry: MarketUpdateEntry) => {
    const name =
      entry.label || CATEGORY_LABELS[entry.categoryKey] || "this entry";
    const ok = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(entry.id);
    try {
      await deleteMarketEntry(entry.id);
      if (entry.pdfPath) {
        deleteStorageObject(entry.pdfPath).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveReportYear = async () => {
    setReportYearSaving(true);
    setReportYearSaved(false);
    try {
      await saveMarketSettings({ reportYear: reportYear.trim() });
      setReportYearSaved(true);
      window.setTimeout(() => setReportYearSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setReportYearSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          Market Update
        </h1>
        {entries && (
          <p className="mt-1 text-sm text-navy/60">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} total
          </p>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Report Year (shown on the client card)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={reportYear}
            onChange={(e) => setReportYear(e.target.value)}
            placeholder="e.g. 2026"
            className="w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
          <button
            type="button"
            onClick={handleSaveReportYear}
            disabled={reportYearSaving}
            className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50"
          >
            {reportYearSaving ? "Saving…" : "Save"}
          </button>
          {reportYearSaved && (
            <span className="text-xs text-green-700">Saved.</span>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {entries === null && !error && (
        <div className="text-sm text-neutral-500">Loading…</div>
      )}

      {entries && (
        <div className="space-y-6">
          {CATEGORY_KEYS.map((key) => {
            const rows = grouped.get(key) ?? [];
            const isPeriod = isPeriodCategory(key);
            const canAdd = isPeriod || rows.length === 0;
            const isOpen = openAdd === key;
            return (
              <section
                key={key}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
              >
                <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900">
                      {CATEGORY_LABELS[key]}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {isPeriod
                        ? "Period category — each entry is a child period."
                        : "Insight category — single PDF."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500">
                      {rows.length} {rows.length === 1 ? "entry" : "entries"}
                    </span>
                    {canAdd && (
                      <button
                        type="button"
                        onClick={() => setOpenAdd(isOpen ? null : key)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isOpen
                            ? "border border-navy/20 bg-white text-navy hover:bg-gold/5"
                            : "bg-navy text-white hover:bg-navy/90"
                        }`}
                      >
                        {isOpen ? "Cancel" : "+ Add"}
                      </button>
                    )}
                  </div>
                </header>

                {isOpen && (
                  <InlineAddEntry
                    categoryKey={key}
                    nextOrder={rows.length}
                    onCancel={() => setOpenAdd(null)}
                    onCreated={() => setOpenAdd(null)}
                    onError={setError}
                  />
                )}

                {rows.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-neutral-500">
                    No entries yet.
                  </div>
                ) : (
                  <EntriesList
                    rows={rows}
                    isPeriod={isPeriod}
                    deletingId={deletingId}
                    onDelete={handleDelete}
                    onError={setError}
                  />
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InlineAddEntry({
  categoryKey,
  nextOrder,
  onCancel,
  onCreated,
  onError,
}: {
  categoryKey: CategoryKey;
  nextOrder: number;
  onCancel: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
}) {
  const isPeriod = isPeriodCategory(categoryKey);
  const [label, setLabel] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfPath, setPdfPath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLocalError(null);
    setUploading(true);
    try {
      const previousPath = pdfPath;
      const { url, path } = await uploadPdf(file, MARKET_PDF_FOLDER);
      setPdfUrl(url);
      setPdfPath(path);
      if (previousPath) {
        deleteStorageObject(previousPath).catch(() => {});
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLocalError(null);
    if (isPeriod && !label.trim()) {
      setLocalError("Label is required.");
      return;
    }
    if (!pdfUrl) {
      setLocalError("PDF file is required.");
      return;
    }
    setSaving(true);
    try {
      await createMarketEntry({
        categoryKey,
        label: label.trim(),
        translations: {},
        pdfUrl,
        pdfPath,
        order: nextOrder,
      });
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setLocalError(msg);
      onError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 border-b border-neutral-200 bg-neutral-50 px-4 py-4">
      {localError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {localError}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {isPeriod && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-700">
              Label *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={placeholderForCategory(categoryKey)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-neutral-700">
            PDF *
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://… or upload a file"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload PDF"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-neutral-600 underline hover:text-neutral-900"
            >
              Open current PDF
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || uploading}
          className="rounded-md bg-navy px-4 py-1.5 text-xs font-medium text-white hover:bg-navy/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Entry"}
        </button>
      </div>
    </div>
  );
}

function placeholderForCategory(key: CategoryKey): string {
  switch (key) {
    case "daily":
      return "e.g. Monday";
    case "weekly":
      return "e.g. Week 32, 2026";
    case "monthly":
      return "e.g. August 2026";
    case "semester":
      return "e.g. Jul–Dec 2026";
    case "yearly":
      return "e.g. 2026";
    default:
      return "";
  }
}

function EntriesList({
  rows,
  isPeriod,
  deletingId,
  onDelete,
  onError,
}: {
  rows: MarketUpdateEntry[];
  isPeriod: boolean;
  deletingId: string | null;
  onDelete: (entry: MarketUpdateEntry) => void | Promise<void>;
  onError: (msg: string) => void;
}) {
  const [localRows, setLocalRows] = useState(rows);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const canDrag = isPeriod && localRows.length > 1;

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    if (!canDrag) return;
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (id: string) => (e: React.DragEvent) => {
    if (!canDrag || !dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overId !== id) setOverId(id);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setOverId(null);
  };

  const handleDrop = (targetId: string) => async (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = dragId;
    setDragId(null);
    setOverId(null);
    if (!sourceId || sourceId === targetId) return;

    const from = localRows.findIndex((r) => r.id === sourceId);
    const to = localRows.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;

    const reordered = [...localRows];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setLocalRows(reordered);

    const updates = reordered
      .map((r, i) => ({ id: r.id, order: i }))
      .filter((u, i) => localRows[i]?.id !== u.id || localRows[i]?.order !== u.order);

    try {
      await reorderMarketEntries(updates);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Reorder failed.");
      setLocalRows(rows);
    }
  };

  return (
    <table className="w-full text-sm">
      <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
        <tr>
          {canDrag && <th className="w-8 px-2 py-2" aria-hidden />}
          <th className="px-4 py-2 font-medium">{isPeriod ? "Label" : "—"}</th>
          <th className="px-4 py-2 font-medium">PDF</th>
          <th className="w-32 px-4 py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {localRows.map((entry) => {
          const isDragging = dragId === entry.id;
          const isOver = overId === entry.id && dragId && dragId !== entry.id;
          return (
            <tr
              key={entry.id}
              draggable={canDrag}
              onDragStart={handleDragStart(entry.id)}
              onDragOver={handleDragOver(entry.id)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop(entry.id)}
              className={`align-top hover:bg-gold/5 ${
                isDragging ? "opacity-40" : ""
              } ${isOver ? "border-t-2 border-gold" : ""}`}
            >
              {canDrag && (
                <td
                  className="cursor-grab select-none px-2 py-2 text-center text-neutral-400 active:cursor-grabbing"
                  aria-label="Drag to reorder"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </td>
              )}
              <td className="px-4 py-2 text-neutral-800">
                {entry.label || "—"}
              </td>
              <td className="px-4 py-2">
                {entry.pdfUrl ? (
                  <a
                    href={entry.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-neutral-700 underline hover:text-neutral-900"
                  >
                    Open PDF
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/market-update/${entry.id}`}
                    className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onDelete(entry)}
                    disabled={deletingId === entry.id}
                    className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-red-700 hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                  >
                    {deletingId === entry.id ? "…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
