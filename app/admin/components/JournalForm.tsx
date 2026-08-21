"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import {
  EMPTY_JOURNAL,
  EMPTY_LOCALE_FIELDS,
  JOURNAL_LOCALES,
  estimateReadingMinutes,
  fromDateInputValue,
  getLocaleFields,
  setLocaleFields,
  slugify,
  toDateInputValue,
  type JournalDraft,
  type JournalLocale,
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

const LOCALE_LABELS: Record<JournalLocale, string> = {
  en: "English",
  id: "Indonesian",
  zh: "中文",
};

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
  if (!initial) return { ...EMPTY_JOURNAL, translations: {} };
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
    translations: {
      ...(initial.translations.id
        ? { id: { ...initial.translations.id, seo: { ...initial.translations.id.seo } } }
        : {}),
      ...(initial.translations.zh
        ? { zh: { ...initial.translations.zh, seo: { ...initial.translations.zh.seo } } }
        : {}),
    },
  };
}

type LocaleFlags = Record<JournalLocale, boolean>;
const flagsFromInitial = (
  draft: JournalDraft,
  key: "title" | "description" | "keywords",
): LocaleFlags => ({
  en:
    key === "keywords"
      ? draft.seo.keywords.length > 0
      : Boolean(draft.seo[key]),
  id:
    key === "keywords"
      ? Boolean(draft.translations.id?.seo.keywords.length)
      : Boolean(draft.translations.id?.seo[key]),
  zh:
    key === "keywords"
      ? Boolean(draft.translations.zh?.seo.keywords.length)
      : Boolean(draft.translations.zh?.seo[key]),
});

const keywordsInputFromDraft = (draft: JournalDraft): Record<JournalLocale, string> => ({
  en: (draft.seo.keywords ?? []).join(", "),
  id: (draft.translations.id?.seo.keywords ?? []).join(", "),
  zh: (draft.translations.zh?.seo.keywords ?? []).join(", "),
});

export default function JournalForm({ mode, initial, onSubmit }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<JournalDraft>(() => toDraft(initial));
  const [activeLocale, setActiveLocale] = useState<JournalLocale>("en");
  const [keywordsInput, setKeywordsInput] = useState<Record<JournalLocale, string>>(
    () => keywordsInputFromDraft(toDraft(initial)),
  );
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [seoTitleTouched, setSeoTitleTouched] = useState<LocaleFlags>(() =>
    flagsFromInitial(toDraft(initial), "title"),
  );
  const [seoDescTouched, setSeoDescTouched] = useState<LocaleFlags>(() =>
    flagsFromInitial(toDraft(initial), "description"),
  );
  const [seoKeywordsTouched, setSeoKeywordsTouched] = useState<LocaleFlags>(() =>
    flagsFromInitial(toDraft(initial), "keywords"),
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  const current = useMemo(
    () => getLocaleFields(draft, activeLocale),
    [draft, activeLocale],
  );

  useEffect(() => {
    if (seoTitleTouched[activeLocale]) return;
    const next = deriveSeoTitle(current.title);
    if (current.seo.title === next) return;
    setDraft((d) =>
      setLocaleFields(d, activeLocale, {
        ...getLocaleFields(d, activeLocale),
        seo: { ...getLocaleFields(d, activeLocale).seo, title: next },
      }),
    );
  }, [current.title, current.seo.title, seoTitleTouched, activeLocale]);

  useEffect(() => {
    if (seoDescTouched[activeLocale]) return;
    const next = deriveSeoDescription(current.content);
    if (current.seo.description === next) return;
    setDraft((d) =>
      setLocaleFields(d, activeLocale, {
        ...getLocaleFields(d, activeLocale),
        seo: {
          ...getLocaleFields(d, activeLocale).seo,
          description: next,
        },
      }),
    );
  }, [current.content, current.seo.description, seoDescTouched, activeLocale]);

  useEffect(() => {
    if (seoKeywordsTouched[activeLocale]) return;
    const next = deriveSeoKeywords(current.title).join(", ");
    setKeywordsInput((prev) =>
      prev[activeLocale] === next ? prev : { ...prev, [activeLocale]: next },
    );
  }, [current.title, seoKeywordsTouched, activeLocale]);

  const estimatedRead = useMemo(
    () => estimateReadingMinutes(draft.content),
    [draft.content],
  );

  const updateShared = <K extends keyof JournalDraft>(
    key: K,
    value: JournalDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const updateLocaleField = (patch: Partial<typeof current>) => {
    setDraft((d) => {
      const cur = getLocaleFields(d, activeLocale);
      return setLocaleFields(d, activeLocale, { ...cur, ...patch });
    });
  };

  const handleTitleChange = (title: string) => {
    if (activeLocale === "en") {
      setDraft((d) => ({
        ...d,
        title,
        slug: slugTouched ? d.slug : slugify(title),
      }));
    } else {
      updateLocaleField({ title });
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, "journal/covers");
      updateShared("coverImage", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const translateText = async (
    text: string,
    target: JournalLocale,
    format: "plain" | "html",
  ): Promise<string> => {
    if (!text.trim()) return "";
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target, source: "en", format }),
    });
    const data = (await res.json()) as { translated?: string; error?: string };
    if (!res.ok || typeof data.translated !== "string") {
      throw new Error(data.error || `Translate failed (${res.status})`);
    }
    return data.translated;
  };

  const handleTranslateFromEn = async () => {
    if (activeLocale === "en") return;
    setError(null);
    setTranslating(true);
    try {
      const enFields = getLocaleFields(draft, "en");
      const [title, content, seoTitle, seoDesc] = await Promise.all([
        translateText(enFields.title, activeLocale, "plain"),
        translateText(enFields.content, activeLocale, "html"),
        translateText(enFields.seo.title, activeLocale, "plain"),
        translateText(enFields.seo.description, activeLocale, "plain"),
      ]);
      const translatedKeywords = await Promise.all(
        enFields.seo.keywords.map((k) => translateText(k, activeLocale, "plain")),
      );
      setDraft((d) =>
        setLocaleFields(d, activeLocale, {
          title,
          content,
          seo: {
            title: seoTitle,
            description: seoDesc,
            keywords: translatedKeywords.filter(Boolean),
          },
        }),
      );
      setKeywordsInput((prev) => ({
        ...prev,
        [activeLocale]: translatedKeywords.filter(Boolean).join(", "),
      }));
      // Mark as touched so auto-derive doesn't overwrite the translation.
      setSeoTitleTouched((f) => ({ ...f, [activeLocale]: true }));
      setSeoDescTouched((f) => ({ ...f, [activeLocale]: true }));
      setSeoKeywordsTouched((f) => ({ ...f, [activeLocale]: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!draft.title.trim()) {
      setError("English title is required.");
      setActiveLocale("en");
      return;
    }
    setSubmitting(true);
    try {
      // Fold keywordsInput back into each locale's SEO.
      const withKeywords = JOURNAL_LOCALES.reduce<JournalDraft>((acc, loc) => {
        const fields = getLocaleFields(acc, loc);
        const kws = keywordsInput[loc]
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        // Skip writing empty non-EN locales so we don't create noise in Firestore.
        if (
          loc !== "en" &&
          !fields.title.trim() &&
          !fields.content.trim() &&
          !fields.seo.title.trim() &&
          !fields.seo.description.trim() &&
          kws.length === 0
        ) {
          return {
            ...acc,
            translations: { ...acc.translations, [loc]: undefined },
          };
        }
        return setLocaleFields(acc, loc, {
          ...fields,
          seo: { ...fields.seo, keywords: kws },
        });
      }, draft);

      // Strip any undefined translation slots so Firestore stays clean.
      const cleanTranslations = Object.fromEntries(
        Object.entries(withKeywords.translations).filter(
          ([, v]) => v !== undefined,
        ),
      ) as JournalDraft["translations"];

      await onSubmit({
        ...withKeywords,
        translations: cleanTranslations,
        slug: withKeywords.slug || slugify(withKeywords.title),
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

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
          <div role="tablist" aria-label="Language" className="flex gap-1">
            {JOURNAL_LOCALES.map((loc) => {
              const isActive = loc === activeLocale;
              const hasContent =
                loc === "en"
                  ? Boolean(draft.title.trim() || draft.content.trim())
                  : Boolean(
                      draft.translations[loc]?.title.trim() ||
                        draft.translations[loc]?.content.trim(),
                    );
              return (
                <button
                  key={loc}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveLocale(loc)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-navy text-white"
                      : "bg-white text-navy hover:bg-neutral-100"
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                  {!hasContent && loc !== "en" && (
                    <span className="ml-1.5 text-[10px] uppercase opacity-60">
                      empty
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {activeLocale !== "en" && (
            <button
              type="button"
              onClick={() => void handleTranslateFromEn()}
              disabled={translating || !draft.title.trim()}
              className="rounded-md border border-navy/30 bg-white px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy/5 disabled:opacity-40"
              title={
                draft.title.trim()
                  ? `Auto-fill this tab from English`
                  : "Fill in the English tab first"
              }
            >
              {translating ? "Translating…" : "Translate from English"}
            </button>
          )}
        </div>

        <div className="space-y-6 p-4">
          <Field
            label={
              activeLocale === "en" ? "Title *" : `Title (${LOCALE_LABELS[activeLocale]})`
            }
          >
            <Input
              value={current.title}
              onChange={handleTitleChange}
              placeholder="Journal title"
            />
          </Field>

          <Field label="Content">
            <RichTextEditor
              key={activeLocale}
              value={current.content}
              onChange={(v) => updateLocaleField({ content: v })}
            />
          </Field>

          <div className="rounded-lg border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setSeoOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
            >
              <span>SEO Fields ({LOCALE_LABELS[activeLocale]})</span>
              <span className="text-neutral-500">{seoOpen ? "▲" : "▼"}</span>
            </button>
            {seoOpen && (
              <div className="space-y-4 border-t border-neutral-200 p-4">
                <Field label="SEO Title">
                  <Input
                    value={current.seo.title}
                    onChange={(v) => {
                      setSeoTitleTouched((f) => ({ ...f, [activeLocale]: true }));
                      updateLocaleField({
                        seo: { ...current.seo, title: v },
                      });
                    }}
                  />
                  <AutoHint
                    touched={seoTitleTouched[activeLocale]}
                    onReset={() =>
                      setSeoTitleTouched((f) => ({ ...f, [activeLocale]: false }))
                    }
                    autoText={`Auto from Title (max ${SEO_TITLE_MAX} chars)`}
                  />
                </Field>
                <Field label="SEO Description">
                  <textarea
                    value={current.seo.description}
                    onChange={(e) => {
                      setSeoDescTouched((f) => ({ ...f, [activeLocale]: true }));
                      updateLocaleField({
                        seo: { ...current.seo, description: e.target.value },
                      });
                    }}
                    rows={3}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                  <AutoHint
                    touched={seoDescTouched[activeLocale]}
                    onReset={() =>
                      setSeoDescTouched((f) => ({ ...f, [activeLocale]: false }))
                    }
                    autoText={`Auto from Content (max ${SEO_DESC_MAX} chars)`}
                  />
                </Field>
                <Field label="SEO Keywords (comma separated)">
                  <Input
                    value={keywordsInput[activeLocale]}
                    onChange={(v) => {
                      setSeoKeywordsTouched((f) => ({ ...f, [activeLocale]: true }));
                      setKeywordsInput((prev) => ({ ...prev, [activeLocale]: v }));
                    }}
                  />
                  <AutoHint
                    touched={seoKeywordsTouched[activeLocale]}
                    onReset={() =>
                      setSeoKeywordsTouched((f) => ({
                        ...f,
                        [activeLocale]: false,
                      }))
                    }
                    autoText="Auto from Title (significant words)"
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      </div>

      <Field label="Slug">
        <Input
          value={draft.slug}
          onChange={(v) => {
            setSlugTouched(true);
            updateShared("slug", v);
          }}
          placeholder="journal-slug"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Author">
          <Input
            value={draft.author}
            onChange={(v) => updateShared("author", v)}
            placeholder="Author name"
          />
        </Field>
        <Field label="Status">
          <select
            value={draft.status}
            onChange={(e) =>
              updateShared("status", e.target.value as JournalStatus)
            }
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
              updateShared("publishedAt", fromDateInputValue(e.target.value))
            }
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
        </Field>
        <Field label="Featured">
          <label className="flex items-center gap-3 text-sm text-neutral-700">
            <button
              type="button"
              onClick={() => updateShared("featured", !draft.featured)}
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
            onChange={(v) => updateShared("coverImage", v)}
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
            updateShared("readingTimeMinutes", v === "" ? null : Number(v))
          }
          placeholder={String(estimatedRead)}
        />
        <p className="mt-1 text-xs text-neutral-500">
          Override: {estimatedRead} min (auto-estimated from English content)
        </p>
      </Field>

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
