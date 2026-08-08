"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  EMPTY_MARKET_UPDATE,
  MARKET_PDF_FOLDER,
  isPeriodCategory,
  type CategoryKey,
  type MarketUpdateDraft,
  type MarketUpdateEntry,
} from "../lib/market-updates";
import { deleteStorageObject, uploadPdf } from "../lib/storage";

type Props = {
  mode: "create" | "edit";
  initial?: MarketUpdateEntry;
  onSubmit: (draft: MarketUpdateDraft) => Promise<void>;
};

function toDraft(initial?: MarketUpdateEntry): MarketUpdateDraft {
  if (!initial) return { ...EMPTY_MARKET_UPDATE };
  return {
    categoryKey: initial.categoryKey,
    label: initial.label,
    pdfUrl: initial.pdfUrl,
    pdfPath: initial.pdfPath,
    order: initial.order,
  };
}

export default function MarketUpdateForm({ mode, initial, onSubmit }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<MarketUpdateDraft>(() => toDraft(initial));
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isPeriod = isPeriodCategory(draft.categoryKey);

  const update = <K extends keyof MarketUpdateDraft>(
    key: K,
    value: MarketUpdateDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const previousPath = draft.pdfPath;
      const { url, path } = await uploadPdf(file, MARKET_PDF_FOLDER);
      setDraft((d) => ({ ...d, pdfUrl: url, pdfPath: path }));
      if (previousPath) {
        deleteStorageObject(previousPath).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isPeriod && !draft.label.trim()) {
      setError("Label is required for period categories.");
      return;
    }
    if (!draft.pdfUrl) {
      setError("PDF file is required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        ...draft,
        label: draft.label.trim(),
      });
      router.push("/admin/market-update");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/market-update"
          className="text-neutral-500 hover:text-neutral-800"
          aria-label="Back"
        >
          ←
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "create" ? "New Market Update" : "Edit Market Update"}
        </h1>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Category *">
        <select
          value={draft.categoryKey}
          onChange={(e) => update("categoryKey", e.target.value as CategoryKey)}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        >
          <optgroup label="Period">
            {CATEGORY_KEYS.filter(isPeriodCategory).map((k) => (
              <option key={k} value={k}>
                {CATEGORY_LABELS[k]}
              </option>
            ))}
          </optgroup>
          <optgroup label="Insight">
            {CATEGORY_KEYS.filter((k) => !isPeriodCategory(k)).map((k) => (
              <option key={k} value={k}>
                {CATEGORY_LABELS[k]}
              </option>
            ))}
          </optgroup>
        </select>
      </Field>

      {isPeriod && (
        <Field label="Label *">
          <Input
            value={draft.label}
            onChange={(v) => update("label", v)}
            placeholder={placeholderForCategory(draft.categoryKey)}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Shown as a chip on the client under {CATEGORY_LABELS[draft.categoryKey]}.
          </p>
        </Field>
      )}

      <Field label="PDF *">
        <div className="flex gap-2">
          <Input
            value={draft.pdfUrl}
            onChange={(v) => update("pdfUrl", v)}
            placeholder="https://… or upload a file"
            type="url"
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
        {draft.pdfUrl && (
          <a
            href={draft.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-neutral-600 underline hover:text-neutral-900"
          >
            Open current PDF
          </a>
        )}
      </Field>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/market-update"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-md bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Create Entry"
              : "Update Entry"}
        </button>
      </div>
    </form>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
    />
  );
}
