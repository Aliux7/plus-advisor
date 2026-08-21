"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LOCALES,
  LOCALE_LABEL,
  cloneDeep,
  loadContent,
  mergeWithSchema,
  saveContent,
  setAtPath,
  type ContentByLocale,
  type ContentTree,
  type Locale,
} from "../lib/content";
import { uploadMedia } from "../lib/storage";
import enFallback from "../../[lang]/dictionaries/en.json";
import idFallback from "../../[lang]/dictionaries/id.json";
import zhFallback from "../../[lang]/dictionaries/zh.json";

const FALLBACK: Record<Locale, ContentTree> = {
  en: enFallback as unknown as ContentTree,
  id: idFallback as unknown as ContentTree,
  zh: zhFallback as unknown as ContentTree,
};

/**
 * Field names whose value is identical across all languages (e.g. image
 * paths, media URLs). Rendered as a single input; edits fan out to all
 * three locales on save.
 */
/**
 * Media-style shared fields — one input across languages plus an
 * upload button and inline preview.
 */
const MEDIA_KEYS = new Set([
  "image",
  "background",
  "heroImage",
  "portrait",
  "illustration",
]);

/**
 * Shared plain-text fields (URLs, toggles) — one input across
 * languages, no upload UI.
 */
const SHARED_TEXT_KEYS = new Set(["url", "visible"]);

const SHARED_KEYS = new Set([...MEDIA_KEYS, ...SHARED_TEXT_KEYS]);

const isMediaPath = (path: (string | number)[]) => {
  const last = path[path.length - 1];
  return typeof last === "string" && MEDIA_KEYS.has(last);
};

const isSharedPath = (path: (string | number)[]) => {
  const last = path[path.length - 1];
  return typeof last === "string" && SHARED_KEYS.has(last);
};

/** Human-readable labels for known section keys. Falls back to camel→Title. */
const KEY_LABELS: Record<string, string> = {
  meta: "Meta / SEO",
  header: "Header",
  footer: "Footer",
  home: "Home",
  about: "About",
  stories: "Stories",
  office: "Family Office",
  journals: "Journals",
  market: "Market Update",
  contact: "Contact Us",
  news: "News",
  hero: "Hero",
  nav: "Navigation",
  familyLegacy: "Family Legacy",
  ourServicePillars: "Our Service Pillars",
  slides: "Pillar slides",
  image: "Image (shared across languages)",
  background: "Background (video or image, shared across languages)",
  portrait: "Portrait image (shared across languages)",
  whistleBlower: "Whistle Blowing Button",
  visible: "Show on the site",
  url: "Link (URL) — opens when clicked",
  line1: "Button text — line 1",
  line2: "Button text — line 2",
  description: "Description (one per category — daily, weekly, monthly, …)",
  beyondFinancialAdvice: "Beyond Financial Advice",
  quote: "Quote",
  featuredJournals: "Featured Journals",
  aboutPlusAdvisor: "About Plus Advisor",
  leadership: "Leadership",
  aboutHer: "About Her",
  mountainQuote: "Mountain Quote",
  mindsetPlanning: "Mindset Planning",
  starValue: "Star Value",
  integrityCompliance: "Integrity & Compliance",
  ourStory: "Our Story",
  visionMission: "Vision & Mission",
  ourValues: "Our Values",
  familyOffice: "Family Office",
  ascent: "Ascent",
  holisticApproach: "Holistic Approach",
  quietMind: "Quiet Mind",
  latestFeatured: "Latest & Featured",
  grid: "Grid / List",
  eyebrow: "Eyebrow (small label above the title)",
  title: "Title",
  illustration: "Illustration (shared across languages)",
  illustrationAlt: "Illustration alt text (for accessibility)",
  watermark: "Watermark text",
  form: "Form field labels",
  name: "Name field label",
  email: "Email field label",
  phone: "Phone number field label",
  contactMethod: "Preferred contact method field label",
  residences: "Residences field label",
  assets: "Assets question label",
  readyAdvisor: "\"Ready for advisor\" checkbox label",
  preferConversation: "\"Prefer conversation\" checkbox label",
  message: "Message field label",
  submit: "Submit button text",
};

function humanize(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

type Props = {
  section: string;
};

export default function ContentEditor({ section }: Props) {
  const [initial, setInitial] = useState<ContentByLocale | null>(null);
  const [state, setState] = useState<ContentByLocale | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const results = await Promise.all(
        LOCALES.map(async (loc) => {
          const remote = await loadContent(loc).catch(() => null);
          // Bundled JSON is the schema; Firestore overlays it. Any
          // schema field that Firestore is missing (e.g. hero.background
          // added after the initial seed) still shows up in the editor.
          const merged = mergeWithSchema(FALLBACK[loc], remote);
          return [loc, merged as ContentTree] as const;
        }),
      );
      if (cancelled) return;
      const next = Object.fromEntries(results) as ContentByLocale;
      setInitial(cloneDeep(next));
      setState(next);
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(() => {
    if (!initial || !state) return false;
    return JSON.stringify(initial) !== JSON.stringify(state);
  }, [initial, state]);

  const sectionValue = useMemo(() => {
    if (!state) return null;
    const en = (state.en?.[section] as unknown) ?? FALLBACK.en[section];
    return en;
  }, [state, section]);

  if (!state || !initial || sectionValue === undefined) {
    return (
      <div className="rounded-lg border border-navy/10 bg-white p-8 text-center text-sm text-navy/60">
        Loading content…
      </div>
    );
  }

  function updateField(locale: Locale, path: (string | number)[], val: unknown) {
    setState((prev) => {
      if (!prev) return prev;
      // Shared (non-translated) fields fan out to all locales so image
      // paths, video URLs, etc. stay identical across languages.
      if (isSharedPath(path)) {
        const next: ContentByLocale = { ...prev };
        for (const loc of LOCALES) {
          next[loc] = setAtPath(next[loc], path, val);
        }
        return next;
      }
      const nextLocale = setAtPath(prev[locale], path, val);
      return { ...prev, [locale]: nextLocale };
    });
    setMessage(null);
  }

  function addArrayItem(path: (string | number)[]) {
    setState((prev) => {
      if (!prev) return prev;
      const next: ContentByLocale = { ...prev };
      for (const loc of LOCALES) {
        const cur = getAtPath(next[loc], path);
        const arr = Array.isArray(cur) ? [...cur] : [];
        const template =
          arr.length > 0 ? emptyLike(arr[0]) : emptyLike(getAtPath(FALLBACK[loc], path));
        arr.push(template);
        next[loc] = setAtPath(next[loc], path, arr);
      }
      return next;
    });
    setMessage(null);
  }

  function removeArrayItem(path: (string | number)[], index: number) {
    setState((prev) => {
      if (!prev) return prev;
      const next: ContentByLocale = { ...prev };
      for (const loc of LOCALES) {
        const cur = getAtPath(next[loc], path);
        const arr = Array.isArray(cur) ? [...cur] : [];
        arr.splice(index, 1);
        next[loc] = setAtPath(next[loc], path, arr);
      }
      return next;
    });
    setMessage(null);
  }

  async function handleSave() {
    if (!state) return;
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all(
        LOCALES.map((loc) => saveContent(loc, state[loc])),
      );
      setInitial(cloneDeep(state));
      setMessage("Saved. Public site will reflect changes on next page load.");
    } catch (err) {
      setMessage(
        err instanceof Error ? `Save failed: ${err.message}` : "Save failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    if (!initial) return;
    setState(cloneDeep(initial));
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-8 flex items-center justify-between border-b border-navy/10 bg-neutral-50/95 px-8 py-3 backdrop-blur">
        <div className="text-sm text-navy/60">
          {dirty ? (
            <span className="text-amber-700">Unsaved changes</span>
          ) : (
            <span>All changes saved</span>
          )}
          {message ? (
            <span className="ml-3 text-navy/80">{message}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!dirty || saving}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-navy hover:bg-neutral-100 disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!dirty || saving}
            className="rounded-md bg-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <FieldNode
        value={sectionValue}
        path={[section]}
        label={humanize(section)}
        state={state}
        onChange={updateField}
        onAddArrayItem={addArrayItem}
        onRemoveArrayItem={removeArrayItem}
      />
    </div>
  );
}

function getAtPath(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[key as string];
  }
  return cur;
}

function emptyLike(sample: unknown): unknown {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) {
    return sample.length > 0 ? [emptyLike(sample[0])] : [];
  }
  if (sample && typeof sample === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(sample as Record<string, unknown>)) {
      out[k] = emptyLike(v);
    }
    return out;
  }
  return "";
}

type NodeProps = {
  value: unknown;
  path: (string | number)[];
  label: string;
  state: ContentByLocale;
  onChange: (locale: Locale, path: (string | number)[], val: unknown) => void;
  onAddArrayItem: (path: (string | number)[]) => void;
  onRemoveArrayItem: (path: (string | number)[], index: number) => void;
  depth?: number;
};

function FieldNode({
  value,
  path,
  label,
  state,
  onChange,
  onAddArrayItem,
  onRemoveArrayItem,
  depth = 0,
}: NodeProps) {
  if (typeof value === "string") {
    return (
      <StringField
        label={label}
        path={path}
        state={state}
        onChange={onChange}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <NumberField
        label={label}
        path={path}
        state={state}
        onChange={onChange}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <BooleanField
        label={label}
        path={path}
        state={state}
        onChange={onChange}
      />
    );
  }

  if (Array.isArray(value)) {
    // Array of primitives (strings) → compact list.
    const isPrimitiveArr = value.every(
      (item) => typeof item === "string" || typeof item === "number",
    );
    if (isPrimitiveArr) {
      return (
        <PrimitiveArrayField
          label={label}
          path={path}
          state={state}
          onChange={onChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      );
    }
    return (
      <Group label={label} depth={depth} count={value.length}>
        {value.map((item, i) => (
          <div
            key={i}
            className="relative rounded-md border border-navy/10 bg-white/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-gold">
                Item {i + 1}
              </div>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(path, i)}
                className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <FieldNode
              value={item}
              path={[...path, i]}
              label=""
              state={state}
              onChange={onChange}
              onAddArrayItem={onAddArrayItem}
              onRemoveArrayItem={onRemoveArrayItem}
              depth={depth + 1}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem(path)}
          className="w-full rounded-md border border-dashed border-navy/20 py-2 text-sm text-navy/70 hover:border-gold hover:text-navy"
        >
          + Add item
        </button>
      </Group>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    // At the top level, entries are page subsections (e.g. Hero, Family Legacy).
    // Add generous gaps + a divider so each subsection reads as its own block.
    const childGap =
      depth === 0 ? "space-y-10 divide-y-2 divide-navy/10" : "space-y-4";
    const childItemClass = depth === 0 ? "pt-8 first:pt-0" : "";
    return (
      <Group label={label} depth={depth}>
        <div className={childGap}>
          {entries.map(([k, v]) => (
            <div key={k} className={childItemClass}>
              <FieldNode
                value={v}
                path={[...path, k]}
                label={humanize(k)}
                state={state}
                onChange={onChange}
                onAddArrayItem={onAddArrayItem}
                onRemoveArrayItem={onRemoveArrayItem}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      </Group>
    );
  }

  return null;
}

function Group({
  label,
  count,
  depth,
  children,
}: {
  label: string;
  count?: number;
  depth: number;
  children: React.ReactNode;
}) {
  const isTop = depth === 0;
  const isMid = depth === 1;

  if (!label) return <div className="space-y-4">{children}</div>;

  return (
    <section
      className={
        isTop
          ? "rounded-lg border border-navy/10 bg-white p-6"
          : isMid
            ? "rounded-md border border-navy/15 border-l-4 border-l-navy bg-neutral-50/60 p-5 shadow-sm"
            : "rounded-md border border-navy/5 bg-white p-3"
      }
    >
      <header
        className={
          isTop
            ? "mb-5 flex items-baseline justify-between border-b border-navy/10 pb-3"
            : isMid
              ? "mb-4 flex items-baseline justify-between border-b border-navy/10 pb-2"
              : "mb-4 flex items-baseline justify-between"
        }
      >
        <h3
          className={
            isTop
              ? "font-catalog text-2xl font-semibold text-navy"
              : isMid
                ? "font-catalog text-xl font-semibold text-navy"
                : "text-base font-semibold text-navy/80"
          }
        >
          {label}
        </h3>
        {typeof count === "number" ? (
          <span className="text-xs text-navy/50">{count} items</span>
        ) : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function StringField({
  label,
  path,
  state,
  onChange,
}: Pick<NodeProps, "label" | "path" | "state" | "onChange">) {
  const enValue = (getAtPath(state.en, path) as string) ?? "";
  const isLong = enValue.length > 90 || enValue.includes("\n");
  const shared = isSharedPath(path);

  // Shared fields (image / video / background) render a single input and
  // fan the edit out to all locales via updateField's shared branch.
  if (shared) {
    if (isMediaPath(path)) {
      return (
        <MediaField
          label={label}
          value={enValue}
          path={path}
          onChange={(v) => onChange("en", path, v)}
        />
      );
    }
    // Non-media shared strings (e.g. URLs) — one input, fanned out.
    return (
      <div className="space-y-2">
        {label ? (
          <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
            {label}
          </label>
        ) : null}
        <input
          type="text"
          value={enValue}
          onChange={(e) => onChange("en", path, e.target.value)}
          className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
          {label}
        </label>
      ) : null}
      <div className="grid gap-3 md:grid-cols-3">
        {LOCALES.map((loc) => {
          const raw = getAtPath(state[loc], path);
          const val = typeof raw === "string" ? raw : "";
          return (
            <div key={loc}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {LOCALE_LABEL[loc]}
              </div>
              {isLong ? (
                <textarea
                  value={val}
                  onChange={(e) => onChange(loc, path, e.target.value)}
                  rows={Math.min(8, Math.max(3, val.split("\n").length + 1))}
                  className="w-full resize-y rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              ) : (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => onChange(loc, path, e.target.value)}
                  className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NumberField({
  label,
  path,
  state,
  onChange,
}: Pick<NodeProps, "label" | "path" | "state" | "onChange">) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
          {label}
        </label>
      ) : null}
      <div className="grid gap-3 md:grid-cols-3">
        {LOCALES.map((loc) => {
          const raw = getAtPath(state[loc], path);
          const val = typeof raw === "number" ? raw : 0;
          return (
            <div key={loc}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {LOCALE_LABEL[loc]}
              </div>
              <input
                type="number"
                value={val}
                onChange={(e) => onChange(loc, path, Number(e.target.value))}
                className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BooleanField({
  label,
  path,
  state,
  onChange,
}: Pick<NodeProps, "label" | "path" | "state" | "onChange">) {
  const shared = isSharedPath(path);

  // Shared booleans (e.g. `visible` toggles) show as a single switch —
  // updateField already fans the value out to every locale.
  if (shared) {
    const val = Boolean(getAtPath(state.en, path));
    return (
      <label className="flex items-center gap-3 rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy">
        <input
          type="checkbox"
          checked={val}
          onChange={(e) => onChange("en", path, e.target.checked)}
          className="h-4 w-4 accent-navy"
        />
        <span>{label || "Enabled"}</span>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-navy/50">
          {val ? "Shown" : "Hidden"}
        </span>
      </label>
    );
  }

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
          {label}
        </label>
      ) : null}
      <div className="grid gap-3 md:grid-cols-3">
        {LOCALES.map((loc) => {
          const val = Boolean(getAtPath(state[loc], path));
          return (
            <label
              key={loc}
              className="flex items-center gap-2 rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy"
            >
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => onChange(loc, path, e.target.checked)}
                className="h-4 w-4 accent-navy"
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                {LOCALE_LABEL[loc]}
              </span>
              <span className="ml-auto text-navy/70">
                {val ? "true" : "false"}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function PrimitiveArrayField({
  label,
  path,
  state,
  onChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: Pick<
  NodeProps,
  "label" | "path" | "state" | "onChange" | "onAddArrayItem" | "onRemoveArrayItem"
>) {
  const arr = (getAtPath(state.en, path) as unknown[]) ?? [];

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
          {label}
        </label>
      ) : null}
      <div className="space-y-3">
        {arr.map((_, i) => (
          <div key={i} className="rounded-md border border-navy/10 bg-white/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                #{i + 1}
              </div>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(path, i)}
                className="rounded border border-red-200 bg-white px-2 py-0.5 text-[11px] text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {LOCALES.map((loc) => {
                const cur = getAtPath(state[loc], [...path, i]);
                const val =
                  typeof cur === "string" || typeof cur === "number"
                    ? String(cur)
                    : "";
                return (
                  <div key={loc}>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                      {LOCALE_LABEL[loc]}
                    </div>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => onChange(loc, [...path, i], e.target.value)}
                      className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAddArrayItem(path)}
        className="w-full rounded-md border border-dashed border-navy/20 py-2 text-sm text-navy/70 hover:border-gold hover:text-navy"
      >
        + Add item
      </button>
    </div>
  );
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i;

function detectMediaKind(src: string): "video" | "image" | "unknown" {
  if (!src) return "unknown";
  if (VIDEO_EXT.test(src)) return "video";
  if (IMAGE_EXT.test(src)) return "image";
  return "unknown";
}

function MediaBadge({ value }: { value: string }) {
  const kind = detectMediaKind(value);
  if (kind === "unknown") return null;
  const cls =
    kind === "video"
      ? "bg-navy/10 text-navy"
      : "bg-gold/15 text-gold";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {kind}
    </span>
  );
}

function MediaPreview({ src }: { src: string }) {
  const kind = detectMediaKind(src);
  if (!src || kind === "unknown") return null;

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-navy/10 bg-neutral-100">
      {kind === "video" ? (
        <video
          key={src}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          className="h-40 w-full object-cover"
        />
      ) : (
        // Preview is a plain <img> — Next/Image would require adding every
        // possible remote host to next.config, which fights the "paste any
        // URL" UX we want in the admin.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="preview" className="h-40 w-full object-cover" />
      )}
    </div>
  );
}

/**
 * Derive a Firebase Storage folder from the field path so uploaded
 * assets are grouped sensibly (e.g. site-content/home/hero,
 * site-content/ourServicePillars/slides/image).
 */
function folderFromPath(path: (string | number)[]): string {
  const segments = path
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.replace(/[^a-z0-9-]/gi, "-").toLowerCase());
  return `site-content/${segments.join("/")}`;
}

type MediaFieldProps = {
  label: string;
  value: string;
  path: (string | number)[];
  onChange: (value: string) => void;
};

function MediaField({ label, value, path, onChange }: MediaFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadMedia(file, folderFromPath(path));
      onChange(url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please retry.",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    onChange("");
    setUploadError(null);
  }

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-navy/60">
          {label}
        </label>
      ) : null}
      <div className="rounded-md border border-navy/15 bg-white p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gold">
          <span>Shared across all languages</span>
          <MediaBadge value={value} />
        </div>

        <MediaPreview src={value} />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-navy/90 disabled:opacity-40"
          >
            {uploading
              ? "Uploading…"
              : value
                ? "Replace file"
                : "Upload image or video"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={uploading}
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-navy hover:bg-neutral-100 disabled:opacity-40"
            >
              Clear
            </button>
          ) : null}
          <span className="text-[10px] text-navy/50">
            Image → auto-converted to WebP · Video uploaded as-is
          </span>
        </div>

        {uploadError ? (
          <div className="mt-2 text-[11px] text-red-700">{uploadError}</div>
        ) : null}

        <details className="mt-3">
          <summary className="cursor-pointer text-[10px] uppercase tracking-wider text-navy/50 hover:text-navy">
            Or paste a URL / path
          </summary>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/home/hero-video.mp4 or https://…"
            className="mt-2 w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </details>
      </div>
    </div>
  );
}
