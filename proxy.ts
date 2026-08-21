import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "id", "zh"] as const;
const DEFAULT_LOCALE = "en";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .find(Boolean);

  if (preferred) {
    if (preferred.startsWith("id")) return "id";
    if (preferred.startsWith("zh")) return "zh";
    if (preferred.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}

function isAdminHost(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return hostname === "admin.localhost" || hostname.startsWith("admin.");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // API routes bypass locale rewriting entirely.
  if (pathname.startsWith("/api/")) return;

  if (isAdminHost(host)) {
    if (pathname.startsWith("/admin")) return;
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
