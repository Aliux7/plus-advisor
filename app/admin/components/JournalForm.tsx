"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import {
  EMPTY_JOURNAL,
  estimateReadingMinutes,
  fromDateInputValue,
  slugify,
  toDateInputValue,
  type JournalDraft,
  type JournalPost,
  type JournalStatus,
} from "../lib/journals";
import { uploadImage } from "../lib/storage";

type Props = {
  mode: "create" | "edit";
  initial?: JournalPost;
  onSubmit: (draft: JournalDraft) => Promise<void>;
};

const STATUS_OPTIONS: { value: JournalStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

const KEYWORD_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "for", "to", "in", "on",
  "at", "by", "with", "as", "is", "are", "was", "were", "be", "been",
  "from", "that", "this", "it", "its",
]);

function deriveSeoTitle(title: string): string {
  return title.trim().slice(0, SEO_TITLE_MAX);
}

function deriveSeoDescription(contentHtml: string): string {
  const text = contentHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, SEO_DESC_MAX);
}

function deriveSeoKeywords(title: string): string[] {
  const seen = new Set<string>();
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !KEYWORD_STOPWORDS.has(w))
    .filter((w) => (seen.has(w) ? false : (seen.add(w), true)));
}

function toDraft(initial?: JournalPost): JournalDraft {
  if (!initial) return { ...EMPTY_JOURNAL };
  return {
    title: initial.title,
    slug: initial.slug,
    author: initial.author,
    status: initial.status,
    publishedAt: initial.publishedAt,
    featured: initial.featured,
    coverImage: initial.coverImage,
    readingTimeMinutes: initial.readingTimeMinutes,
    content: initial.content,
    seo: { ...initial.seo },
  };
}

export default function JournalForm({ mode, initial, onSubmit }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<JournalDraft>(() => toDraft(initial));
  const [keywordsInput, setKeywordsInput] = useState(() =>
    (initial?.seo.keywords ?? []).join(", "),
  );
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [seoTitleTouched, setSeoTitleTouched] = useState(
    !!initial?.seo.title,
  );
  const [seoDescTouched, setSeoDescTouched] = useState(
    !!initial?.seo.description,
  );
  const [seoKeywordsTouched, setSeoKeywordsTouched] = useState(
    !!initial?.seo.keywords?.length,
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (seoTitleTouched) return;
    const next = deriveSeoTitle(draft.title);
    setDraft((d) =>
      d.seo.title === next ? d : { ...d, seo: { ...d.seo, title: next } },
    );
  }, [draft.title, seoTitleTouched]);

  useEffect(() => {
    if (seoDescTouched) return;
    const next = deriveSeoDescription(draft.content);
    setDraft((d) =>
      d.seo.description === next
        ? d
        : { ...d, seo: { ...d.seo, description: next } },
    );
  }, [draft.content, seoDescTouched]);

  useEffect(() => {
    if (seoKeywordsTouched) return;
    const next = deriveSeoKeywords(draft.title).join(", ");
    setKeywordsInput((prev) => (prev === next ? prev : next));
  }, [draft.title, seoKeywordsTouched]);

  const estimatedRead = useMemo(
    () => estimateReadingMinutes(draft.content),
    [draft.content],
  );

  const update = <K extends keyof JournalDraft>(key: K, value: JournalDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleTitleChange = (title: string) => {
    setDraft((d) => ({
      ...d,
      title,
      slug: slugTouched ? d.slug : slugify(title),
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, "journal/covers");
      update("coverImage", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    try {
      const keywords = keywordsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await onSubmit({
        ...draft,
        slug: draft.slug || slugify(draft.title),
        seo: { ...draft.seo, keywords },
      });
      router.push("/admin/journal");
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
          href="/admin/journal"
          className="text-neutral-500 hover:text-neutral-800"
          aria-label="Back"
        >
          ←
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "create" ? "New Journal Entry" : "Edit Journal Entry"}
        </h1>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Title *">
        <Input
          value={draft.title}
          onChange={handleTitleChange}
          placeholder="Journal title"
        />
      </Field>

      <Field label="Slug">
        <Input
          value={draft.slug}
          onChange={(v) => {
            setSlugTouched(true);
            update("slug", v);
          }}
          placeholder="journal-slug"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Author">
          <Input
            value={draft.author}
            onChange={(v) => update("author", v)}
            placeholder="Author name"
          />
        </Field>
        <Field label="Status">
          <select
            value={draft.status}
            onChange={(e) => update("status", e.target.value as JournalStatus)}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Publish Date">
          <input
            type="date"
            value={toDateInputValue(draft.publishedAt)}
            onChange={(e) =>
              update("publishedAt", fromDateInputValue(e.target.value))
            }
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
        </Field>
        <Field label="Featured">
          <label className="flex items-center gap-3 text-sm text-neutral-700">
            <button
              type="button"
              onClick={() => update("featured", !draft.featured)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                draft.featured ? "bg-navy" : "bg-neutral-300"
              }`}
              aria-pressed={draft.featured}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                  draft.featured ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span>
              {draft.featured ? "Featured entry" : "Standard entry"}
            </span>
          </label>
        </Field>
      </div>

      <Field label="Cover Image">
        <div className="flex gap-2">
          <Input
            value={draft.coverImage}
            onChange={(v) => update("coverImage", v)}
            placeholder="https://… or upload a file"
            type="url"
          />
          <button
            type="button"
            onClick={() => coverFileInputRef.current?.click()}
            disabled={uploadingCover}
            className="shrink-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {uploadingCover ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={coverFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>
        {draft.coverImage && (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.coverImage}
              alt="Cover preview"
              className="h-32 w-auto rounded-md border border-neutral-200 object-cover"
            />
          </div>
        )}
      </Field>

      <Field label="Reading Time (minutes)">
        <Input
          type="number"
          value={
            draft.readingTimeMinutes === null
              ? ""
              : String(draft.readingTimeMinutes)
          }
          onChange={(v) =>
            update("readingTimeMinutes", v === "" ? null : Number(v))
          }
          placeholder={String(estimatedRead)}
        />
        <p className="mt-1 text-xs text-neutral-500">
          Override: {estimatedRead} min (auto-estimated from content)
        </p>
      </Field>

      <Field label="Content">
        <RichTextEditor
          value={draft.content}
          onChange={(v) => update("content", v)}
        />
      </Field>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setSeoOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
        >
          <span>SEO Fields</span>
          <span className="text-neutral-500">{seoOpen ? "▲" : "▼"}</span>
        </button>
        {seoOpen && (
          <div className="space-y-4 border-t border-neutral-200 p-4">
            <Field label="SEO Title">
              <Input
                value={draft.seo.title}
                onChange={(v) => {
                  setSeoTitleTouched(true);
                  update("seo", { ...draft.seo, title: v });
                }}
              />
              <AutoHint
                touched={seoTitleTouched}
                onReset={() => setSeoTitleTouched(false)}
                autoText={`Auto from Title (max ${SEO_TITLE_MAX} chars)`}
              />
            </Field>
            <Field label="SEO Description">
              <textarea
                value={draft.seo.description}
                onChange={(e) => {
                  setSeoDescTouched(true);
                  update("seo", { ...draft.seo, description: e.target.value });
                }}
                rows={3}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
              <AutoHint
                touched={seoDescTouched}
                onReset={() => setSeoDescTouched(false)}
                autoText={`Auto from Content (max ${SEO_DESC_MAX} chars)`}
              />
            </Field>
            <Field label="SEO Keywords (comma separated)">
              <Input
                value={keywordsInput}
                onChange={(v) => {
                  setSeoKeywordsTouched(true);
                  setKeywordsInput(v);
                }}
              />
              <AutoHint
                touched={seoKeywordsTouched}
                onReset={() => setSeoKeywordsTouched(false)}
                autoText="Auto from Title (significant words)"
              />
            </Field>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/journal"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
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

function AutoHint({
  touched,
  onReset,
  autoText,
}: {
  touched: boolean;
  onReset: () => void;
  autoText: string;
}) {
  return (
    <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
      <span>
        {touched ? "Custom (won't auto-update)" : autoText}
      </span>
      {touched && (
        <button
          type="button"
          onClick={onReset}
          className="text-neutral-600 underline hover:text-neutral-900"
        >
          Reset to auto
        </button>
      )}
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
