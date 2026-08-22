import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, KNOWN_TAGS, type CacheTag } from "../../lib/cache-tags";

// Route handlers execute per-request; opting out of static generation makes
// the intent explicit and avoids any accidental caching of the webhook itself.
export const dynamic = "force-dynamic";

const PROFILE = "max" as const;

function unauthorized(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "unauthorized" },
    { status: 401 },
  );
}

function extractSecret(req: NextRequest, url: URL): string | null {
  return (
    req.headers.get("x-revalidate-secret") ??
    url.searchParams.get("secret") ??
    null
  );
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const configured = process.env.REVALIDATE_SECRET;
  if (!configured) {
    console.warn("[revalidate] REVALIDATE_SECRET is not set; refusing request.");
    return unauthorized();
  }

  const url = new URL(req.url);
  const secret = extractSecret(req, url);
  if (secret !== configured) return unauthorized();

  const requested = url.searchParams.getAll("tag");
  const tags = requested.length > 0 ? requested : Object.values(CACHE_TAGS);

  const invalid = tags.filter((t) => !KNOWN_TAGS.has(t));
  if (invalid.length > 0) {
    return NextResponse.json(
      { ok: false, error: `unknown tag(s): ${invalid.join(", ")}` },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag as CacheTag, PROFILE);
  }

  return NextResponse.json({
    ok: true,
    revalidated: tags,
    revalidatedAt: Date.now(),
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

// Allow GET as a convenience for manual testing (curl/browser). Auth still
// applies. Prefer POST from automation.
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}
