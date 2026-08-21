import { NextResponse } from "next/server";

const GTX_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const CHUNK_LIMIT = 4500;
const CONCURRENCY = 4;

type Body = {
  text: string;
  format?: "plain" | "html";
  target: "id" | "zh";
  source?: string;
};

type Token = { type: "tag" | "text"; value: string };

const TAG_RE = /<[^>]+>/g;
const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function tokenizeHtml(html: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(html)) !== null) {
    if (m.index > last) {
      tokens.push({ type: "text", value: html.slice(last, m.index) });
    }
    tokens.push({ type: "tag", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < html.length) {
    tokens.push({ type: "text", value: html.slice(last) });
  }
  return tokens;
}

function decodeEntities(s: string): string {
  return s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITY_MAP[m] ?? m);
}

function encodeEntities(s: string): string {
  return s.replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;",
  );
}

function splitForLimit(text: string): string[] {
  if (text.length <= CHUNK_LIMIT) return [text];
  const out: string[] = [];
  let remaining = text;
  while (remaining.length > CHUNK_LIMIT) {
    // Prefer to split on sentence/space boundaries near the limit.
    const window = remaining.slice(0, CHUNK_LIMIT);
    const boundary = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf("\n"),
    );
    const cut = boundary > CHUNK_LIMIT * 0.5 ? boundary + 1 : CHUNK_LIMIT;
    out.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut);
  }
  if (remaining) out.push(remaining);
  return out;
}

async function translateChunk(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  const url = new URL(GTX_ENDPOINT);
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", source);
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Translate service returned ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Unexpected translate response shape");
  }
  const segments = data[0] as Array<unknown>;
  return segments
    .map((s) => (Array.isArray(s) && typeof s[0] === "string" ? s[0] : ""))
    .join("");
}

async function translatePlain(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  if (!text.trim()) return text;
  const parts = splitForLimit(text);
  const out: string[] = [];
  for (const p of parts) {
    out.push(await translateChunk(p, source, target));
  }
  return out.join("");
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  limit: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

async function translateHtml(
  html: string,
  source: string,
  target: string,
): Promise<string> {
  const tokens = tokenizeHtml(html);
  const textIndices: number[] = [];
  const prefixes: string[] = [];
  const suffixes: string[] = [];
  const textPayloads: string[] = [];

  const wsSplit = /^(\s*)([\s\S]*?)(\s*)$/;

  tokens.forEach((tok, i) => {
    if (tok.type !== "text") return;
    const decoded = decodeEntities(tok.value);
    if (!decoded.trim()) return;
    const m = decoded.match(wsSplit);
    const prefix = m?.[1] ?? "";
    const core = m?.[2] ?? decoded;
    const suffix = m?.[3] ?? "";
    textIndices.push(i);
    prefixes.push(prefix);
    suffixes.push(suffix);
    textPayloads.push(core);
  });

  const translated = await runWithConcurrency(
    textPayloads,
    (payload) => translatePlain(payload, source, target),
    CONCURRENCY,
  );

  textIndices.forEach((idx, k) => {
    tokens[idx] = {
      type: "text",
      value: prefixes[k] + encodeEntities(translated[k]) + suffixes[k],
    };
  });

  return tokens.map((t) => t.value).join("");
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { text, target } = body;
  const source = body.source ?? "en";
  const format = body.format ?? "plain";

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (target !== "id" && target !== "zh") {
    return NextResponse.json(
      { error: "target must be 'id' or 'zh'" },
      { status: 400 },
    );
  }
  if (!text.trim()) {
    return NextResponse.json({ translated: text });
  }

  try {
    const translated =
      format === "html"
        ? await translateHtml(text, source, target === "zh" ? "zh-CN" : target)
        : await translatePlain(text, source, target === "zh" ? "zh-CN" : target);
    return NextResponse.json({ translated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translate failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
