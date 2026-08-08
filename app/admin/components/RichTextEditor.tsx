"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { uploadImage } from "../lib/storage";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function countStats(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const characters = text.length;
  const words = text ? text.split(" ").length : 0;
  const readMinutes = Math.max(1, Math.round(words / 200));
  return { characters, words, readMinutes };
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap min-h-[320px] px-4 py-3 focus:outline-none text-sm",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const stats = useMemo(() => countStats(value), [value]);

  const importRawHtml = useCallback(() => {
    const html = window.prompt("Paste raw HTML to import:", "");
    if (html == null) return;
    editor?.commands.setContent(html, { emitUpdate: true });
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-md border border-neutral-200 bg-white">
      <Toolbar editor={editor} onImportHtml={importRawHtml} />
      <div className="max-h-[540px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between border-t border-neutral-200 px-3 py-2 text-xs text-neutral-500">
        <div>
          {stats.characters.toLocaleString()} characters ·{" "}
          {stats.words.toLocaleString()} words · ~{stats.readMinutes} min read
        </div>
      </div>
    </div>
  );
}

function ImageUploadButton({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "journal/inline");
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title="Upload image"
        className="rounded px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
      >
        {uploading ? "⏳" : "⬆"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}

function Toolbar({
  editor,
  onImportHtml,
}: {
  editor: Editor;
  onImportHtml: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-2 py-2">
      <Select
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(v) => {
          if (v === "p") editor.chain().focus().setParagraph().run();
          else
            editor
              .chain()
              .focus()
              .toggleHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 })
              .run();
        }}
        options={[
          { value: "p", label: "P" },
          { value: "h1", label: "H1" },
          { value: "h2", label: "H2" },
          { value: "h3", label: "H3" },
        ]}
      />
      <Divider />
      <TBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="B"
        title="Bold"
        className="font-bold"
      />
      <TBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="I"
        title="Italic"
        className="italic"
      />
      <TBtn
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        label="U"
        title="Underline"
        className="underline"
      />
      <TBtn
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="S"
        title="Strikethrough"
        className="line-through"
      />
      <TBtn
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        label="</>"
        title="Inline code"
      />
      <ColorPicker editor={editor} />
      <Divider />
      <TBtn
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        label="⇤"
        title="Align left"
      />
      <TBtn
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        label="↔"
        title="Align center"
      />
      <TBtn
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        label="⇥"
        title="Align right"
      />
      <Divider />
      <TBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="•"
        title="Bullet list"
      />
      <TBtn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="1."
        title="Ordered list"
      />
      <TBtn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="❝"
        title="Blockquote"
      />
      <TBtn
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        label="{ }"
        title="Code block"
      />
      <Divider />
      <TBtn
        onClick={() => {
          const url = window.prompt("URL:", "https://");
          if (url == null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
        label="🔗"
        title="Insert link"
      />
      <TBtn
        onClick={() => {
          const src = window.prompt("Image URL:", "https://");
          if (!src) return;
          editor.chain().focus().setImage({ src }).run();
        }}
        label="🖼"
        title="Insert image by URL"
      />
      <ImageUploadButton editor={editor} />
      <TBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        label="―"
        title="Horizontal rule"
      />
      <div className="ml-auto">
        <button
          type="button"
          onClick={onImportHtml}
          className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
        >
          Import from Raw HTML
        </button>
      </div>
    </div>
  );
}

function TBtn({
  onClick,
  active,
  label,
  title,
  className,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm transition-colors ${
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-700 hover:bg-neutral-100"
      } ${className ?? ""}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-neutral-200" />;
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-neutral-200 bg-white px-1.5 py-1 text-xs text-neutral-700"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ColorPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const colors = [
    "#111827",
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#16a34a",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
    "#db2777",
  ];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Text color"
        className="rounded px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
      >
        A
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute left-0 top-full z-10 mt-1 flex gap-1 rounded-md border border-neutral-200 bg-white p-2 shadow-lg"
        >
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                editor.chain().focus().setColor(c).run();
                setOpen(false);
              }}
              className="h-5 w-5 rounded-full border border-neutral-300"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setOpen(false);
            }}
            className="h-5 w-5 rounded-full border border-neutral-300 bg-white text-[10px] text-neutral-500"
            title="Clear color"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
